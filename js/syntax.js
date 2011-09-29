var Syntax = {};

Syntax.LineSplitter = (function() {

	function joinedLength(array, equalTo, startElement, startPosition) {

		startElement = startElement || 0;
		startPosition = startPosition || 0;

		var element,
			firstElement = array[startElement],
			length = (firstElement === null ? 0 : firstElement.length) - startPosition || 0;

		while (length < equalTo) {
			element = array[++startElement]
			length += (element === null ? 0 : element.value.length);
		}

		return {
			index : startElement,
			position : length - equalTo
		}

	}

	function splitText(text, position) {
		return {
			left : text.slice(0, position),
			right : text.slice(position)
		};
	}

	function splitAt(array, i, position) {
		var text  = splitText(array[i].value, position),
			clone = $.clone(array[i]);

		array[i].value = text.left;
		clone.value = text.right;

		array.splice(i, 0, null, clone);
	}

	var Constructor = function(original) {
		this.original = original;
	};

	Constructor.prototype = {
		
		split : function(text, index, lineNumber) {
			var length, position = 0, lineNumber = lineNumber || 0, cutoff;

			for (var i = index || 0, l = text.length; i < l; ++i) {

				cutoff = joinedLength(text, this.original[lineNumber].length, i, position);

				i = cutoff.index;
				position = cutoff.position;
				splitAt(text, cutoff.index, cutoff.position);

				++position;
				++lineNumber;
			}
		}

	};

	return Constructor;

})();

Syntax.Colorizer = (function() {

	var div = document.createElement('div'),
		cache = {},
		callback;

	$('canvas')[0].appendChild(div);


	function getColor(className) {
		if (className in cache) {
			return cache[className];
		} else {
			div.className = className;
			var color = getComputedStyle(div, null).color;

			cache[className] = color;
			return color;
		}
	}

	var Constructor = function(fn) {
		callback = fn;
	};

	Constructor.prototype = {

		colorize : function(token) {
			var color = getColor(token.type);
			callback({
				value : token.value,
				color : (color == 'rgb(0, 0, 0)' ? getColor('text') : color)
			});
		},

		clearCache : function() {
			cache = {};
		}

	};

	return Constructor;

})();

Syntax.Parser = (function() {

	var that, rules, callback;

	var Constructor = function(rule, callbacks) {
		
		that = this;
		rules = rule;
		callback = callbacks;

		this.states = (function() {
			var index = 0;
			
			return {

				push : function(state) {
					this[++index] = state;
				},
				
				length : function() {
					return index + 1;
				},
				
				last : function() {
					return this[index];
				},

				stateOf : function(num) {
					return this[index - num];
				}

			};

		})();
		
	};

	Constructor.prototype.parse = function(token) {

		var type = (token.type in rules ? rules[token.type].call(that) : 'text');

		callback({ 
			type : type || undefined,
			value : token.value
		});

	};

	return Constructor;

})();

Syntax.Tokenizer = (function() {

	var token = '', tokens, text, length, callback, interval, i = 0, stop = true;

	function iterate() {
		while (!stop && i < length) {
			token += text.charAt(i);

			var match = matchesToken(token);
			if (match) {

				// If there is a text preceding the token, send it first
				if (match.remainder.length > 0) {

					callback({ 
						type : 'text',
						value : match.remainder
					});

				}

				// Send the token
				callback({
					type : match.type,
					value : match.value
				});

				token = '';
			}

			i++;
		}
	}

	function matchesToken(token) {
		for (var i in tokens) {

			if (tokens[i].test(token)) {
				var position = token.search(tokens[i]);

				return {
					remainder : token.slice(0, position),
					value : token.slice(position),
					type : i
				}

			}

		}

		return false;
	}

	var Constructor = function(tokens, fn) { 
		this.tokens = tokens;
		callback = fn;
	};

	Constructor.prototype = {

		start : function(source) {
			text = source || text;
			length = text.length;
			tokens = this.tokens;
			stop = false;
			iterate();
		},

		stop : function() {
			stop = true;
		}

	};

	return Constructor;
	
})();

Syntax.Stack = (function() {
	
	var stack = [], i;

	var callback = function(text) {
		stack[++i](text, stack[i + 1]);
	};

	var Constructor = function(iterators, callback) {
		iterators.push(callback);
		stack = iterators;
		this.firstIterator = stack.shift();
		i = 0;
	};

	Constructor.prototype.start = function(text) {
		this.firstIterator(text, stack[i]);
	};

	return Constructor;

})();

Syntax.Highlighter = (function() {

	var output = [];

	function stripEmptyElements(array) {
		var i = array.length,
			element;


		while (i--) {
			element = array[i];
			if (element === null || element.value == '') {
				array.splice(i, 1);
			}
		}
	}

	var Constructor = function(text, language) {

		if (!this instanceof Syntax.Highlighter) {
			return new Syntax.Highlighter(text, language);
		}

		this.textString = text.join('');
		this.textArray = text;

		this.output = output;

		this.callback  = function(token) { output.push(token) };

		this.Colorizer = new Syntax.Colorizer(this.callback);
		this.Splitter  = new Syntax.LineSplitter(text);
		this.Parser    = new Syntax.Parser(Syntax.triggers[language], this.Colorizer.colorize);
		this.Tokenizer = new Syntax.Tokenizer(Syntax.tokens[language], this.Parser.parse);

	};

	Constructor.prototype.highlight = function(text, startLine, stopLine) {
		console.time('Highlighter')

		this.Tokenizer.start(text);

		stripEmptyElements(output);

		this.Splitter.split(output);

		console.timeEnd('Highlighter');
		return output;
	};

	return Constructor;

})();

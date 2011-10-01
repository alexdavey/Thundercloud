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

	function splitAt(array, i, position) {
		var text  = _.splitText(array[i].value, position),
			clone = _.clone(array[i]);
		array[i].value = text.left;
		clone.value = text.right;

		array.splice(i, 0, null, clone);
	}

	var Constructor = function() { };

	Constructor.prototype = {
		
		split : function(original, text, index, lineNumber) {
			var length = text.length + 2 * (original.length - 4),
				position = 0, lineNumber = lineNumber || 0, cutoff;

			for (var i = index || 0; i < length; ++i) {

				cutoff = joinedLength(text, original[lineNumber].length, i, position);

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

	var callback;

	var Constructor = function(fn) {
		callback = fn;
	};

	Constructor.prototype.colorize = function(token) {
			var color = _.computedCSS(token.type);
			callback({
				value : token.value,
				color : (color == 'rgb(0, 0, 0)' ? _.computedCSS('text') : color)
			});
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

	var token = '', tokens, text, length, callback, interval;

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

	var Constructor = function(tokensObj, fn) { 
		tokens = tokensObj;
		callback = fn;
	};

	Constructor.prototype.start = function(text) {

		var i = 0, match, length = text.length, token = '';

		while (i < length) {
			token += text.charAt(i);

			match = matchesToken(token);
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

	function extractLines(array, start, stop) {
		var extract = [];
		start = start || 0;
		stop  = stop  || array.length;

		while (--stop >= start) {
			extract.unshift(array[stop]);
		}

		return extract;
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
		this.Splitter  = new Syntax.LineSplitter();
		this.Parser    = new Syntax.Parser(Syntax.triggers[language], this.Colorizer.colorize);
		this.Tokenizer = new Syntax.Tokenizer(Syntax.tokens[language], this.Parser.parse);

	};

	Constructor.prototype.highlight = function(originalText, startLine, stopLine) {

		var text = _.clone(originalText);
		extractLines(text, startLine, stopLine);

		output = [];
		this.Tokenizer.start(text.join(''));

		stripEmptyElements(output);

		this.Splitter.split(text, output);

		return output;
	};

	return Constructor;

})();

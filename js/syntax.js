var Syntax = {};

Syntax.Colorizer = (function() {

	var callback;

	var Constructor = function(fn) { };

	Constructor.prototype.colorize = function(token) {
		if (token === null) return null;
		var color = _.computedCSS(token.type);
		return {
			value : token.value,
			color : (color == 'rgb(0, 0, 0)' ? _.computedCSS('text') : color)
		};
	};

	return Constructor;

})();

Syntax.Parser = (function() {

	var rules, states = [];

	var Constructor = function(rule, callbacks) {
		rules = rule;
	};

	Constructor.prototype.clearStates = function() {
		states = [];
	};

	Constructor.prototype.parse = function(token) {
		if (token === null) return null;
		var type = (token.type in rules ? rules[token.type](states) : 'text');

		return { 
			type : type || undefined,
			value : token.value
		};

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

		var match, token = '';
		for (var j = 0, l = text.length; j < l; ++j) {

			line = text[j];

			for (var i = 0, m = line.length; i < m; ++i) {

				token += line.charAt(i);

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
			}

			callback(null);
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

		this.callback  = function(token) { if (token === null) console.log('A null!'); output.push(token) };
		this.Colorizer = new Syntax.Colorizer();
		this.Parser    = new Syntax.Parser(Syntax.triggers[language]);

		this.stack = _.compose(this.callback, this.Colorizer.colorize, this.Parser.parse);

		this.Tokenizer = new Syntax.Tokenizer(Syntax.tokens[language], this.stack);


	};

	Constructor.prototype.highlight = function(originalText, startLine, stopLine) {

		var text = _.clone(originalText);

		// extractLines(text, startLine, stopLine);

		output = [];
		this.Parser.clearStates();
		this.Tokenizer.start(text);

		return output;
	};

	return Constructor;

})();

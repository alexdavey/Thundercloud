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

		var match, token = '', overflow = false;
		for (var j = 0, l = text.length; j < l; ++j) {

			line = text[j];

			for (var i = 0, m = line.length; i < m; ++i) {

				token += line.charAt(i);

				match = matchesToken(token);
				if (match) {


					if (overflow) {
						callback({
							type : match.type,
							value : _.splitText(match.value, match.value.length - i).left
						});
						match.value = _.splitText(match.value, match.value.length - i).right;

						// Send a null token to signify end-of-line
						callback(null);

						// If there is a text preceding the token, send it first
					} else if (match.remainder.length > 0) {
						callback({ 
							type : 'text',
							value : match.remainder,
							overflow : overflow
						});

					}

					// Send the token
					callback({
						type : match.type,
						value : match.value,
						overflow : overflow
					});

					token = '';
					overflow = false;
				}
			}
			if (token.length > 0) overflow = true;
			callback(null);

		}

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

		this.callback  = function(token) { output.push(token) };
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

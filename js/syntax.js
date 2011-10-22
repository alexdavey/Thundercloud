"use strict";

var Syntax = {};

Syntax.Colorizer = (function() {

	var callback;

	var Constructor = function(fn) { };

	Constructor.prototype.colorize = function(input) {
		var token, color, output = [];
		for (var i = 0, l = input.length; i < l; ++i) {

			token = input[i];

			if (token === null) {
				output.push(null);
				continue;
			}

			color = _.computedCSS(token.type);
			
			output.push({
				value : token.value,
				color : (color == 'rgb(0, 0, 0)' ? _.computedCSS('text') : color)
			});
		}
		return output;
	};

	return Constructor;

})();

Syntax.Parser = (function() {

	var rules, states = [], output = [];

	var Constructor = function(rule, callbacks) {
		rules = rule;
	};

	Constructor.prototype.parse = function(input) {
		var token, type;

		// Clear states and output arrays
		states = [];
		output = [];

		for (var i = 0, l = input.length; i < l; ++i) {

			token = input[i];

			if (token === null) {
				output.push(null);
				continue;
			}

			type = (token.type in rules ? rules[token.type](states) : 'text');

			output.push({ 
				type : type || undefined,
				value : token.value
			});

		}
		return output;
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

	var Tokenizer = function(tokensObj) { 
		tokens = tokensObj;
	};

	Tokenizer.prototype.start = function(text) {

		var match,
			token = '',
			output = [],
			line;

		for (var j = 0, l = text.length; j < l; ++j) {

			line = text[j];

			for (var i = 0, m = line.length; i < m; ++i) {

				token += line.charAt(i);

				match = matchesToken(token);
				if (match) {
					
					// If there is a text preceding the token, send it first
					if (match.remainder.length > 0) {
						output.push({ 
							type : 'text',
							value : match.remainder,
						});
					}
					
					// Send the token
					output.push({
						type : match.type,
						value : match.value,
					});

					token = '';
				}
			}

			if (token != '') {
				output.push({ 
					type : 'text',
					value : token,
				});
			}

			token = '';

			output.push(null);

		}
		return output;

	};

	return Tokenizer;
	
})();

Syntax.Highlighter = (function() {

	function extractLines(array, start, stop) {
		var extract = [];
		start = start || 0;
		stop  = stop  || array.length;

		while (--stop >= start) {
			extract.unshift(array[stop]);
		}

		return extract;
	}

	var Highlighter = function(language) {

		this.Colorizer = new Syntax.Colorizer();
		this.Parser    = new Syntax.Parser(Syntax.triggers[language]);
		this.Tokenizer = new Syntax.Tokenizer(Syntax.tokens[language]);

		this.stack = _.compose(this.Colorizer.colorize, this.Parser.parse, this.Tokenizer.start);
	};

	Highlighter.prototype.highlight = function(originalText, startLine, stopLine) {
		return this.stack(_.clone(originalText));
	};

	return Highlighter;

})();

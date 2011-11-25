define(function() {

	"use strict";

	var Syntax = {};

	Syntax.Colorizer = (function() {

		var callback;

		var Constructor = function(fn) { };

		// Given an array of tokens with type and value, returns
		// an array with value and the CSS color for that type 
		// of token
		Constructor.prototype.colorize = function(input) {
			var token, color, output = [];

			for (var i = 0, l = input.length; i < l; ++i) {

				token = input[i];

				// Pass on null characters (represent newlines)
				if (token === null) {
					output.push(null);
					continue;
				}

				color = _.computedCSS(token.type);
				
				output.push({
					value : token.value,
					// If no matching CSS style is found, use the default style
					color : (color == 'rgb(0, 0, 0)' ? _.computedCSS('text') : color)
				});
			}
			return output;
		};

		return Constructor;

	})();

	Syntax.Parser = (function() {

		// Declare private variables
		var rules, states = [], output = [], precedence;

		function preceding(type) {
			// var last = _.last(states),
			// 	rule;

			// if (type == last) return;

			// for (var i = 0, l = precedence.length; i < l; ++i) {
			// 	rule = precedence[i];
			// 	if (rule == type) return;
			// 	if (rule == last) return last;
			// }

			var last     = _.last(states),
				elevated = _.include(precedence, type),
				override = _.include(precedence, last);

			if (type == last) {
				return;
			}

			if (override) {
				return last;
			}

		}

		var Parser = function(rule, precedenceObj) {
			rules = rule;
			precedence = precedenceObj;
		};

		Parser.prototype.parse = function(input) {
			var token, type, handler, rule;

			// Clear states and output arrays
			states = [];
			output = [];

			for (var i = 0, l = input.length; i < l; ++i) {

				token = input[i];

				// Pass on null characters (represent newlines)
				if (token === null) {
					output.push(null);
					continue;
				}

				type = token.type;

				// First check to see if the last token has a higher precedence,
				// then check to see if there is a rule or else default to 'text'
				type = preceding(type) || (type in rules && rules[type](states)) || 'text';

				output.push({ 
					type : type,
					value : token.value
				});

			}

			return output;
		};

		return Parser;

	})();

	Syntax.Tokenizer = (function() {

		// Save list of tokens in a private variable
		var tokens, output;

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

		function pushTextToken(value) {
			output.push({
				type : 'text',
				value : value
			});
		}

		function pushToken(match) {
			output.push({
				type : match.type,
				value : match.value
			});
		}

		var Tokenizer = function(tokensObj) { 
			tokens = tokensObj;
		};

		// Splits an array of text into individual tokens with
		// a type and value
		Tokenizer.prototype.start = function(text) {

			var token = '',
				match,
				line;

			output = [];

			// Loop over every line
			for (var j = 0, l = text.length; j < l; ++j) {

				line = text[j];

				// Loop over every character in the line
				for (var i = 0, m = line.length; i < m; ++i) {

					token += line.charAt(i);

					match = matchesToken(token);
					if (match) {
						
						// If there is a text preceding the token, send it first
						if (match.remainder.length > 0) {
							pushTextToken(match.remainder);
						}
						
						// Send the token
						pushToken(match);

						token = '';
					}
				}

				// Send anything that has overflowed to
				// the next line
				if (token != '') {
					pushTextToken(token);
				}

				// Reset the token
				token = '';

				// Nulls represent EOL
				output.push(null);

			}

			// Remove the last token (a null token)
			output.pop();
			
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

		var Highlighter = function(tokens, triggers, precedence) {

			this.Colorizer = new Syntax.Colorizer();
			this.Parser    = new Syntax.Parser(triggers, precedence);
			this.Tokenizer = new Syntax.Tokenizer(tokens);

			this.stack = _.compose(this.Colorizer.colorize, this.Parser.parse, this.Tokenizer.start);
		};

		// Returns an array of tokens with color and value given an array of text
		Highlighter.prototype.highlight = function(originalText, startLine, stopLine) {
			return this.stack(_.clone(originalText));
		};

		return Highlighter;

	})();

	return Syntax;

});


$.rightPartial = function(fn, context) {
	var outer = [].slice.call(arguments, 2);

	return function() {
		var args = [].slice.call(arguments);
		[].push.apply(args, outer);
		return fn.apply(context, args);
	};
};


var Syntak = {};

// (function() {
// 
// 	var stop = true, iteratorArray, i = 0, length;
// 
// 	function callback(token) {
// 		console.log('Callback!')
// 		iteratorArray[++i](token, callback);
// 	}
// 	
// 	Syntak.Stack = function(iterators, fn) {
// 		iterators.push(fn);
// 
// 		this.firstIterator = iterators[i];
// 		iteratorArray = iterators;
// 	}
// 
// 	Syntak.Stack.prototype = {
// 
// 		start : function(text, index) {
// 			this.firstIterator(index ? text.slice(index) : text, callback);
// 		}
// 		
// 	};
// 
// })();


Syntak.tokens = {

	html : {

		openTag : /\</,
		closeTag : /\>/,
		closingTag : /\/\>/,

		singleQuote : /\'/,
		doubleQuote : /\"/,

		commentEnd : /\-\-\>/,
		commentStart : /\<\!\-\-/

	}
};

Syntak.triggers = {
	
	openTag : function() {
		if (this.states.last == 'singleQuote' || this.states.last == 'doubleQuote') {
			return 'string';
		}
		this.states.push('tagBody');
		return 'openTag';
	},

	closeTag : function() {
		if (this.states.last == 'singleQuote' || this.states.last == 'doubleQuote') {
			return 'string';
		}
		this.states.push('text');
		return 'closeTag';
	},

	commentStart : function() {
		if (this.states.last == 'singleQuote' || this.states.last == 'doubleQuote') {
			return 'string';
		}
		this.states.push('comment');
		return 'comment';
	},

	commentEnd : function() {
		if (this.states.last == 'singleQuote' || this.states.last == 'doubleQuote') {
			return 'string';
		}
		if (this.states.last == 'comment') {
			this.states.push('text');
			return 'comment';
		}
	},

	singleQuote : function() {
		if (this.states.last == 'singleQuote') {
			this.states.push('text');
		} else {
			this.states.push('singleQuote');
		}
	},

	doubleQuote : function() {
		if (this.states.last == 'doubleQuote') {
			this.states.push('text');
			return 'doubleQuotedString';
		} else if (this.states.stateOf(1) == 'backslash') {
			this.states.push('doubleQuoteString');
			return 'doubleQuote';
		}
	}


};

(function() {

	function joinedLength(array, equalTo, startElement, startPosition) {
		startElement = startElement || 0;
		startPosition = startPosition || 0;

		length = array[startElement].length - startPosition || 0;

		while (length < equalTo) {
			length += array[++startElement];
		}

		return {
			index : startElement,
			position : (length - equalTo) - 1
		}

	}

	function splitText(text, position) {
		return {
			left : text.slice(0, position),
			right : text.slice(position)
		};
	}

	function splitAt(array, i, position) {
		var text = splitText(array[i], position),
			clone = $.clone(array[i]);

		array[i].value = text.left;
		clone.value = text.right;

		array.splice(i, 0, null, clone);
	}

	Syntak.LineSplitter = function(original, callback) {
		this.original = original;
		this.callback = callback;
	};

	Syntak.LineSplitter.prototype = {
		
/////////////// UNFINISHED! /////////////////
		split : function(text, index, callback) {
			var length, position = 0;
			for (var i = index || 0, l = text.length; i < l; ++i) {
				cutoff = joinedLength(text, this.original[i], i, position);
				position = cutoff.index;
				splitAt(text, cutoff.index, cutoff.position);
			}
		}

	};

})();

(function() {

	var getColor = (function() {
		var div = document.createElement('div');
		$('canvas')[0].appendChild(div);

		return function(className) {
			div.className = className;
			return getComputedStyle(div, null).color;
		};
		
	})();

	Syntak.Colorizer = function(callback) {
		this.callback = callback;
	};

	Syntak.Colorizer.prototype = {

		colorize : function(token, callback) {
			this.callback({
				value : token.value,
				color : getColor(token.type) || 'text'
			});
		}

	};

})();

(function() {


	Syntak.Parser = function(rules, callback) {
		
		this.rules = rules;
		this.callback = callback;

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

	Syntak.Parser.prototype = {
		
		parse : function(token) {

			var type = (token.type in this.rules ? this.rules[token.type].call(this) : 'text');

			this.callback({ 
				type : type || undefined,
				value : token.value
			});

		}

	};


})();

(function() {

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

	Syntak.Tokenizer = function(tokens, fn) { 
		this.tokens = tokens;
		callback = fn;
	};

	Syntak.Tokenizer.prototype = {

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
	
})();



var callback = function (token) { console.log(token) },
	// LineSplitter = new Syntak.LineSplitter(callback),
	// Colorizer = new Syntak.Colorizer($.bind(LineSplitter.split, LineSplitter)),
	Colorizer = new Syntak.Colorizer(callback),
	HTML = new Syntak.Parser(Syntak.triggers, $.bind(Colorizer.colorize, Colorizer)),
	Tokenizer = new Syntak.Tokenizer(Syntak.tokens.html, $.bind(HTML.parse, HTML));

// var iterators = [Tokenizer.start, HTML.parse, Colorizer.colorize, LineSplitter.split];
// 
// var Stack = new Syntak.Stack(iterators, function(token) {
// 	console.log(token);
// });

// Stack.start(
// 

Tokenizer.start(

'<!DOCTYPE html>'+
'<html class="no-js">'+
'    <head>'+
'        <meta charset="utf-8"/>'+
'        <title>New Document</title>'+
'        <meta name="description" content=""/>'+
'        <link rel="shortcut icon" href="images/favicon.png" type="image/png"/>'+
'        <link rel="stylesheet" href="styles/reset.css" media="all"/>'+
'        <link rel="stylesheet" href="styles/all.css" media="all"/>'+
'        <link rel="stylesheet" href="styles/print.css" media="print"/>'+
'        <script src="scripts/modernizr-1.7.min.js"></script>'+
'        <!--link rel="stylesheet" href="styles/ie8.css" media="all"-->'+
'        <!--link rel="stylesheet" href="styles/ie7.css" media="all"-->'+
'        <!--link rel="stylesheet" href="styles/ie6.css" media="all"-->'+
'    </head>'+
'    <body>'+
'        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>'+
'        <script src="scripts/setup.js"></script>'+
'    </body>'+
'</html>'

);
// 
// );

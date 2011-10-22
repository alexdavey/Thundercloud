"use strict";

var source = 

'<!DOCTYPE html>\n'+
'<html class="no-js">\n'+
'    <head>\n'+
'        <meta charset="utf-8"/>\n'+
'        <title>New Document</title>\n'+
'        <meta name="description" content=""/>\n'+
'        <link rel="shortcut icon" href="images/favicon.png" type="image/png"/>\n'+
'        <link rel="stylesheet" href="styles/reset.css" media="all"/>\n'+
'        <link rel="stylesheet" href="styles/all.css" media="all"/>\n'+
'        <link rel="stylesheet" href="styles/print.css" media="print"/>\n'+
'        <script src="scripts/modernizr-1.7.min.js"></script>\n'+
'        <!--link rel="stylesheet" href="styles/ie8.css" media="all"-->\n'+
'        <!--link rel="stylesheet" href="styles/ie7.css" media="all"-->\n'+
'        <!--link rel="stylesheet" href="styles/ie6.css" media="all"-->\n'+
'    </head>\n'+
'    <body>\n'+
'        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>\n'+
'        <script src="scripts/setup.js"></script>\n'+
'    </body>\n'+
'</html>\n';


Syntax.tokens = {

	html : {

		space : /\s+/,

		openTag : /\</,
		closeTag : /\>/,
		closingTag : /\/\>/,

		singleQuote : /\'/,
		doubleQuote : /\"/,

		commentEnd : /\-\-\>/,
		commentStart : /\<\!\-\-/

	}
};

Syntax.triggers = {

	html : {
		
		openTag : function(states) {
			var last = _.last(states);
			if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			} else if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			}
			states.push('tagBody');
			return 'openTag';
		},

		closeTag : function(states) {
			var last = _.last(states);
			if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			} else if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			}
			states.push('text');
			return 'closeTag';
		},

		text : function(states) {
			var last = _.last(states);
			if (last == 'tagBody') {
				states.push('attribute');
				return 'tagBody';
			} else if (last == 'attribute') {
				return 'attribute';
			} else if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			} else if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			}
		},

		commentStart : function(states) {
			var last = _.last(states);
			if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			} else if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			} else {
				states.push('comment');
				return 'comment';
			}
		},

		commentEnd : function(states) {
			var last = _.last(states);
			if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			} else if (last == 'singleQuotedString') {
				states.push('singleQuotedString');
				return 'singleQuotedString';
			} else if (last == 'comment') {
				states.push('text');
				return 'comment';
			}
		},

		singleQuote : function(states) {
			if (_.last(states) == 'singleQuotedString') {
				states.push(_.atIndex(states, 1));
			} else {
				states.push('singleQuotedString');
				return 'singleQuotedString';
			}
		},

		doubleQuote : function(states) {
			if (_.last(states) == 'doubleQuotedString') {
				states.push(_.atIndex(states, 1));
				return 'doubleQuotedString';
			} else if (_.atIndex(states, 1) == 'backslash') {
				return 'doubleQuotedString';
			}

			states.push('doubleQuotedString');
			return 'doubleQuotedString';
		}
	}

};

var editorEl = _.getId('editor'),
	clipboardEl = _.getId('clipboard');

var Text = new IDE.Text(source),
	Highlighter = new Syntax.Highlighter('html'),
	Cursor = new IDE.Cursor(0, 10),
	Input = new IDE.Input(editorEl, clipboardEl),
	Editor = new IDE.Editor(editorEl),
	Canvas = new IDE.Canvas(editorEl, Text.source, Editor.options);

Canvas.render();

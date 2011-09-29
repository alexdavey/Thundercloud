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
'</html>';

Syntax.tokens = {

	html : {

		space : /\s/,

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
		
		openTag : function() {
			if (this.states.last() == 'singleQuotedString') {
				return 'singleQuotedString';
			} else if (this.states.last() == 'doubleQuotedString') {
				return 'doubleQuotedString';
			}
			this.states.push('tagBody');
			return 'openTag';
		},

		closeTag : function() {
			if (this.states.last() == 'singleQuotedString') {
				return 'singleQuotedString';
			} else if (this.states.last() == 'doubleQuotedString') {
				return 'doubleQuotedString';
			}
			this.states.push('text');
			return 'closeTag';
		},

		text : function() {
			if (this.states.last() == 'tagBody') {
				this.states.push('attribute');
				return 'tagBody';
			} else if (this.states.last() == 'attribute') {
				return 'attribute';
			} else if (this.states.last() == 'doubleQuotedString') {
				return 'doubleQuotedString';
			} else if (this.states.last() == 'singleQuotedString') {
				return 'singleQuotedString';
			}
		},

		commentStart : function() {
			if (this.states.last() == 'singleQuotedString') {
				return 'singleQuotedString';
			} else if (this.states.last() == 'doubleQuotedString') {
				return 'doubleQuotedString';
			} else {
				this.states.push('comment');
				return 'comment';
			}
		},

		commentEnd : function() {
			if (this.states.last() == 'doubleQuotedString') {
				return 'doubleQuotedString';
			} else if (this.states.last() == 'singleQuotedString') {
				this.states.push('singleQuotedString');
				return 'singleQuotedString';
			} else if (this.states.last() == 'comment') {
				this.states.push('text');
				return 'comment';
			}
		},

		singleQuote : function() {
			if (this.states.last == 'singleQuotedString') {
				this.states.push('text');
			} else {
				this.states.push('singleQuotedString');
			}
		},

		doubleQuote : function() {
			if (this.states.last() == 'doubleQuotedString') {
				this.states.push(this.states.stateOf(1));
				return 'doubleQuotedString';
			} else if (this.states.stateOf(1) == 'backslash') {
				return 'doubleQuotedString';
			} else {
				this.states.push('doubleQuotedString');
				return 'doubleQuotedString';
			}
		}
	}

};

editor.init('#editor');
text.parse(source);
var Highlighter = new Syntax.Highlighter(text.source, 'html');
canvas.render(text.source);

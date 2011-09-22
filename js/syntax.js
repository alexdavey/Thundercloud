var Syntak = {};


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

Syntak.lexer = (function() {
	
	

});

Syntak.Tokenizer = (function() {

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
			if (!tokens.hasOwnProperty(i)) return false;
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

	return {

		start : function(source, language, fn) {
			text = source || text;
			length = text.length;
			callback = fn || callback;
			tokens = Syntak.tokens[language] || tokens;
			stop = false;
			iterate();
		},

		stop : function() {
			stop = true;
		}

	}
	
})();



Syntak.Tokenizer.start(

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

, 'html', function(token) {
    console.log(token);
});

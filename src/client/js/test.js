require(['input', 'settings', 'canvas', 'cursor', 'text'],
	function(Input, settings, Canvas, Cursor, Text) {
	
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


	var editorEl = _.getId('editor'),
		clipboardEl = _.getId('clipboard');
	
	Text.source = source.split('\n');

	Input.init(editorEl, clipboardEl);
		// Editor = new Editor(editorEl),
	
	Canvas.init(editorEl);

	Canvas.render();
});

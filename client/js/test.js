require(['input', 'settings', 'canvas', 'cursor', 'text', 'history', 'events', 'overlay', 'debug', 'menu'],
	function(Input, settings, Canvas, Cursor, Text, history, events) {
	
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
	'</html>';


	var editorEl = _.getId('editor'),
		clipboardEl = _.getId('clipboard');

	
	Text.source = source.split('\n');

	Input.init(editorEl, clipboardEl);
	
	Canvas.init(editorEl);
	Canvas.render();
});


require(['history','events', 'text', 'cursor', 'viewport', 'selection'], 
		function(history, events) {

	// Add all of the data representations to the history watch list
	_.each([].slice.call(arguments, 2), history.watch);
	
	// Save the history when the text is changed
	events.subscribe('textModified', history.save);

	history.save();
});

require(['files'], function(files) {
	files.read('index.html', function(res) {
		console.log('RESPONSE:', res);
	});
});

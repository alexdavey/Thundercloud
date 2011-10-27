define(function() {
	
	"use strict";

	var Editor = function(canvasEl, options) {
		_.defaults(options || {}, this.options);
		// Get the size of a single character in the font
		this.options.charWidth = canvasEl.getContext('2d').measureText('m').width;
	};

	// Editor.prototype.options = {
	// 	// Size of the line-number margin
	// 	padding : 35,
	// 	language : 'html',
	// 	width : window.innerWidth,
	// 	height : window.innerHeight,
	// 	font : 'Courier New, monospace',
	// 	highlight : 'rgb(64, 64, 64)',
	// 	cursor : 'rgb(176, 208, 240)',
	// 	scrollbar : '#BBBBBB',
	// 	tabSize : 4,
	// 	fontSize : 14,
	// 	lineHeight : 14,
	// 	mouseSensitivity : 3
	// };

	return Editor;


});

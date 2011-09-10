// $(function() {

"use strict";
	
var source = 'alert(\'hello world\')\n' +
			 'var canvas = document.getElementById(\'editor\'),\n' +
			 '	  ctx = canvas.getContext(\'2d\')';

var editor = {

	init : function(id, options) {
		$.merge(this.options, options);
		canvas.init(id);
	},

	options : {
		width : window.innerWidth,
		height : window.innerHeight,
		font : 'Courier New, monospace',
		fontSize : 14,
		lineHeight : 14
	}

};

var canvas = {

	init : function(canvasId) {

		var options = editor.options;

		this.paper = $(canvasId);
		this.ctx = this.paper.getContext('2d');

		this.paper.width  = options.width;
		this.paper.height = options.height;
		
		this.setFont(options.font, options.fontSize);
	},

	clear : function() {
		this.ctx.clearRect(0, 0, this.paper.width, this.paper.height);
	},

	render : function(lines) {
		var ctx = this.ctx, lineHeight = editor.options.lineHeight;
		this.clear();
		console.log(ctx.font);
		$(lines, function(line, key) {
			console.log(ctx.font);
			ctx.fillText(line, 0, key * lineHeight + 10);
		});
		this.drawCursor();
	},

	setFont : function(font, size) {
		this.ctx.font = size + 'px ' + font;
		console.log(this.ctx.font);
	},

	drawCursor : function(x, y) {
		var cursorPos = cursor.toPixels();
		this.ctx.fillRect(cursorPos.x, cursorPos.y, 2, editor.options.fontSize);
	}

};


function split(text, pos) {
	return {
		left : text.slice(0, pos),
		right : text.slice(pos)
	};
}

var text = {

	parse : function(text) {
		this.source = text.split('\n');
	},

	stringify : function() {
		return this.source.join('\n');
	},
	
	addLine : function(row, col) {
		var currentLine = this.source[row],
			parts = split(currentLine, col);
		this.source.splice(row, 1, parts.left, parts.right);
	},

	removeLine : function(row) {
		this.source.splice(row, 1);
	},

	insert : function(text, row, col) {
		var parts = split(this.source[row], col);
		this.source[row] = parts.left + text + parts.right;
	}

};

var cursor = {
	
	row : 0,
	col : 10,

	toPixels : function() {
		return {
			x : this.col * editor.options.lineHeight,
			y : this.row * editor.options.fontSize
		};
	},

	setPosition : function(x, y) {
		this.col = ~~(x / editor.options.lineHeight);
		this.row = ~~(y / editor.options.fontSize);
	}

};

canvas.init('#editor');
text.parse(source);
canvas.render(text.source);

// });

// $(function() {

"use strict";

var source = 'alert(\'hello world\')\n' +
			 'var canvas = document.getElementById(\'editor\'),\n' +
			 '	  ctx = canvas.getContext(\'2d\')\n' +
			 '123456789';

var editor = {

	init : function(id, options) {
		var canvasEl = $(id);
		$.merge(this.options, options);

		canvas.init(canvasEl);
		input.init('#input');
		this.options.charWidth = canvas.ctx.measureText('m').width;

		$.listen(canvasEl, 'mousedown', this.mouseDown);
	},

	mouseDown : function(e) {
		var mouse = $.mouse(e);
		cursor.setPosition(mouse.x, mouse.y);
		canvas.render(text.source);
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

	init : function(canvas) {

		var options = editor.options;

		this.paper = canvas;
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
		$(lines, function(line, key) {
			ctx.fillText(line, 0, key * lineHeight + 10);
		});
		this.drawCursor();
	},

	setFont : function(font, size) {
		this.ctx.font = size + 'px ' + font;
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

	lineLength : function(row) {
		return this.source[row].length;
	},
	
	addLine : function(row, col) {
		var currentLine = this.source[row],
			parts = split(currentLine, col);
		this.source.splice(row, 1, parts.left, parts.right);
	},

	removeLine : function(row) {
		this.source.splice(row, 1);
	},

	append : function(text, row) {
		this.source[row] += text;
	},

	insert : function(text, row, col) {
		var parts = split(this.source[row], col);
		this.source[row] = parts.left + text + parts.right;
	},

	remove : function(items, row, col) {
		var currentLine = this.source[row],
			parts = split(currentLine, col);

		if (items < 0) {
			this.source[row] = parts.left + parts.right.slice(items * -1);
		} else {
			this.source[row] = parts.left.slice(0, parts.left.length - items) + parts.right;
		}
	}

};

var input = {
	
	init : function(textAreaId) {
		this.textArea = $(textAreaId);
		this.textArea.focus();
		$.listen(this.textArea, 'blur', this.textArea.focus);
		$.listen(this.textArea, 'keyup', this.onKeyPress);
	},

	focus : function() {
		this.focus();
	},

	onKeyPress : function(e) {
		console.log('value: ', this.value);
		if (this.value.length > 0) {
			text.insert(this.value, cursor.row, cursor.col);
			this.value = '';
			cursor.col++;
			canvas.render(text.source);
		} else {
			console.log('Command!');
			input.command(e);
		}
	},

	command : function(e) {
		e = e || window.e;

		if (e.keyCode == 8) {
			
			var col = cursor.col, row = cursor.row;

			if (col <= 0) {
				if (row == 0) return;

				cursor.col = text.lineLength(row - 1);
				cursor.row--;

				text.append(text.source[row], row - 1);
				text.removeLine(row);
			} else {
				cursor.col--;
				
				text.remove(1, row, col);
			}

		}
		canvas.render(text.source);
	}

};

var actions = {
	
	backspace : function() {
		
	},

	del : function() {
		
	},

	enter : function() {
		
	},

	shift : function() {
		
	},

	copy : function() {
		
	},

	paste : function() {
		
	},

	arrow : {
		
		up : function() {
			cursor.row--;
		},

		down : function() {
			cursor.row++;
		},

		left : function() {
			cursor.col--;
		},

		right : function() {
			cursor.col++;
		}

	}

};

var cursor = {
	
	row : 0,
	col : 10,

	toPixels : function() {
		var charWidth = editor.options.charWidth, lineHeight = editor.options.lineHeight;
		return {
			x : this.col * charWidth,
			y : this.row * lineHeight 
		};
	},

	setPosition : function(x, y) {
		this.col = ~~(x / editor.options.charWidth) - 1;
		this.row = ~~(y / editor.options.lineHeight);
	}

};

editor.init('#editor');
text.parse(source);
canvas.render(text.source);

// });

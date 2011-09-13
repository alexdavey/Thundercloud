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
	
	addLine : function(row, text) {
		this.source.splice(row, 0, text || '');
	},

	removeLine : function(row) {
		this.source.splice(row, 1);
	},

	append : function(text, row) {
		this.source[row] += text;
	},

	lineSection : function(row, col1, col2) {
		return this.source[row].slice(col1, col2 || undefined);
	},

	selectLines : function(from, to) {
		to = to || from;
		var selection = '';
		while (from < to) {
			selection += this.source[from++] + '\n';
		} 
		return selection;
	},

	selection : function(row1, col1, row2, col2) {
		var selection = this.lineSelection(row1, col1);
		selection += selectLines(row1 + 1, row2 - 1);
		selection += this.lineSelection(row2, 0, col2);
		return selection;
	},

	insert : function(text, row, col) {
		var parts = split(this.source[row], col);
		this.source[row] = parts.left + text + parts.right;
	},

	remove : function(items, row, col) {
		var parts = split(this.source[row], col);

		if (items < 0) {
			this.source[row] = parts.left + parts.right.slice(items * -1);
		} else {
			this.source[row] = parts.left.slice(0, parts.left.length - items) + parts.right;
		}
	}

};

var input = {
	
	init : function(textAreaId) {
		$.listen('keypress', this.onKeyPress);
	},

	onKeyPress : function(e) {
		var character = String.fromCharCode(e.charCode);
		if (character) {
			console.log('character: ', '\'' + character + '\'');
			e.preventDefault();

			switch (e.keyCode) {
				case 13:
					actions.enter();
					break;
				default:
					text.insert(character, cursor.row, cursor.col);
					cursor.col++;
			}

			canvas.render(text.source);

		} else {
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
		console.log('Entered!');
		var row = cursor.row, col = cursor.col,
			overflow = text.lineSection(row, col);

		text.addLine(row + 1, overflow);
		text.remove(-overflow.length, row, col);

		cursor.row++;
		cursor.col = 0;
	},

	tab : function() {
		
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

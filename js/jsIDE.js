var source = 'alert(\'hello world\')\n' +
			 'var canvas = document.getElementById(\'editor\'),\n' +
			 '	  ctx = canvas.getContext(\'2d\')\n' +
			 '123456789';

var editor = {

	init : function(id, options) {
		var canvasEl = $(id);
		$.merge(this.options, options);

		canvas.init(canvasEl);
		input.init(canvasEl);
		this.options.charWidth = canvas.ctx.measureText('m').width;

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
	},

	shift : function(direction) {
		switch(direction) {
			case 'right':
				if (this.col < text.lineLength(this.row))
					this.col++;
					break;
			case 'left':
				if (this.col > 0)
					this.col--;
				break;
			case 'down':
				if (this.row < text.source.length) {
					var length = text.lineLength(this.row + 1);
					if (this.col > length) this.col = length;
					this.row++;
				}
				break;
			case 'up':
				if (this.row > 0) {
					var length = text.lineLength(this.row - 1);
					if (this.col > length) this.col = length;
					this.row--;
				}
		}
	}

};

editor.init('#editor');
text.parse(source);
canvas.render(text.source);

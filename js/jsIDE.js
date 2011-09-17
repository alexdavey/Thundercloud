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
		padding : 35,
		width : window.innerWidth,
		height : window.innerHeight,
		font : 'Courier New, monospace',
		tabSize : 4,
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
			var y = key * lineHeight + 10;
			ctx.fillText(line, editor.options.padding, y);
		});
		this.drawMargin(lines);
		this.drawCursor();
	},

	drawMargin : function(lines) {
		var ctx = this.ctx;

		var grad = this.ctx.createLinearGradient(0, 0, editor.options.padding, 0);
		grad.addColorStop(0, '#B4B4B4');
		grad.addColorStop(0.4, '#F7F7F7');

		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, editor.options.padding - 7, this.paper.height);
		ctx.fillStyle = '#C3BBB5';

		ctx.fillRect(editor.options.padding - 7, 0, 1, this.paper.height);

		ctx.fillStyle = '#000000';

		$(lines, function(value, key) {
			var y = key * editor.options.lineHeight + 10;
			ctx.fillText(key + 1, editor.options.padding / 3, y);
		});
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
		var options = editor.options;
		return {
			x : this.col * options.charWidth + options.padding,
			y : this.row * options.lineHeight
		};
	},

	setPosition : function(x, y) {
		var options = editor.options;
		this.col = ~~((x - options.padding) / options.charWidth);
		this.row = ~~(y / options.lineHeight);
		console.log(this.col, this.row);
	},

	shift : function(direction, magnitude) {
		magnitude = magnitude || 1;
		switch(direction) {
			case 'right':
				if (this.col < text.lineLength(this.row))
					this.col += magnitude;
					break;
			case 'left':
				if (this.col > 0)
					this.col -= magnitude;
				break;
			case 'down':
				if (this.row < text.source.length) {
					var length = text.lineLength(this.row + 1);
					if (length == -1) return;
					if (this.col > length) this.col = length;
					this.row += magnitude;
				}
				break;
			case 'up':
				if (this.row > 0) {
					var length = text.lineLength(this.row - 1);
					if (this.col > length) this.col = length;
					this.row -= magnitude;
				}
		}
	}

};

editor.init('#editor');
text.parse(source);
canvas.render(text.source);

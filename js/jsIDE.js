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
		// highlight : '#B4D5FE',
		// highlight : '#FEF241',
		highlight : 'rgb(64, 64, 64)',
		scrollbar : '#BBBBBB',
		tabSize : 4,
		fontSize : 14,
		lineHeight : 14
	}

};

function highlightLine(ctx, row) {
	var options = editor.options, lineHeight = options.lineHeight;
	ctx.fillRect(options.padding, row * lineHeight, 
			text.lineLength(row) * options.charWidth, lineHeight);
}

function highlightPart(ctx, row, col1, col2) {
	var options = editor.options,
		charWidth = options.charWidth,
		difference = (col1 - col2) * -1;

	ctx.fillRect(options.padding + charWidth * col1, row * options.lineHeight, 
			difference * charWidth, options.lineHeight);
}

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
		var paper = this.paper;
		this.ctx.fillStyle = 'rgb(21, 21, 21)';
		this.ctx.fillRect(0, 0, paper.width, paper.height);
		// this.ctx.clearRect(0, 0, paper.width, paper.height);
	},

	render : function(source) {
		var text = Highlighter.highlight(source);

		this.clear();
		this.drawSelection();

		var y = this.drawText(text);

		this.drawMargin(y + 1);
		this.drawCursor();
	},

	drawText : function(tokens) {
		var token, i, ctx = this.ctx, y = 0, x = 0, value;

		var options = editor.options,
			lineHeight = options.lineHeight,
			charWidth = options.charWidth,
			padding = options.padding;


		console.dir(tokens);
		for (i = 0, l = tokens.length; i < l; ++i) {

			token = tokens[i];

			// Null tokens represent newlines
			if (token === null) {
				y += 1;
				x = 0;
			} else {

				value = token.value;

				ctx.fillStyle = token.color;
				ctx.fillText(value, x * charWidth + padding, y * lineHeight + 10);

				x += value.length;
			}

		}

		return y;
	},

	drawMargin : function(line) {
		var ctx = this.ctx,
			options = editor.options,
			padding = options.padding,
			lineHeight = options.lineHeight;

		var grad = this.ctx.createLinearGradient(0, 0, padding, 0);
		grad.addColorStop(0, '#B4B4B4');
		grad.addColorStop(0.4, '#F7F7F7');

		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, padding - 7, this.paper.height);
		ctx.fillStyle = '#C3BBB5';

		ctx.fillRect(padding - 7, 0, 1, this.paper.height);

		ctx.fillStyle = '#000000';

		while (line--) {
			var y = line * lineHeight + 10;
			ctx.fillText(line + 1, padding / 3, y);
		}
	},

	drawScrollbar : function() {

	},

	drawSelection : function() {
		if (selection.isEmpty()) return;

		var normal = selection.normalize(), start = normal.start, end = normal.end,
			col2 = (start.row == end.row ? end.col : text.lineLength(start.row));

		this.ctx.fillStyle = editor.options.highlight;
		
		highlightPart(this.ctx, start.row, start.col, col2);

		if (start.row != end.row) {
			var i = start.row;

			while (++i < end.row) {
				highlightLine(this.ctx, i);
			}

			highlightPart(this.ctx, end.row, 0, end.col);
		}

		this.ctx.fillStyle = '#000000';
	},

	setFont : function(font, size) {
		this.ctx.font = size + 'px ' + font;
	},

	drawCursor : function(x, y) {
		var cursorPos = cursor.toPixels();
		this.ctx.fillStyle = 'rgb(176, 208, 240)';
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
		var options = editor.options,
			col = ~~((x - options.padding) / options.charWidth),
			row = ~~(y / options.lineHeight),
			textLength = text.source.length - 1,

		row = (row > textLength ? textLength : row);

		var lineLength = text.lineLength(row);

		col = (col > lineLength ? lineLength : col);

		this.col = col;
		this.row = row;
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


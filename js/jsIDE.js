IDE.Editor = (function() {
	
	var Editor = function(canvasEl, options) {
		_.defaults(options || {}, this.options);
		this.options.charWidth = canvasEl.getContext('2d').measureText('m').width;
	};

	Editor.prototype.options = {
		padding : 35,
		width : window.innerWidth,
		height : window.innerHeight,
		font : 'Courier New, monospace',
		highlight : 'rgb(64, 64, 64)',
		cursor : 'rgb(176, 208, 240)',
		scrollbar : '#BBBBBB',
		tabSize : 4,
		fontSize : 14,
		lineHeight : 14,
		mouseSensitivity : 3
	};

	return Editor;

})();

IDE.Canvas = (function() {

	var options, paper, ctx;

	function highlightLine(ctx, row) {
		var lineHeight = options.lineHeight;
		ctx.fillRect(options.padding, row * lineHeight, 
				Text.lineLength(row) * options.charWidth, lineHeight);
	}

	function highlightPart(ctx, row, col1, col2) {
		var charWidth = options.charWidth,
			difference = (col1 - col2) * -1;

		ctx.fillRect(options.padding + charWidth * col1, row * options.lineHeight, 
				difference * charWidth, options.lineHeight);
	}

	function addPadding(number, charWidth) {
		return (~~(Math.log(number) / Math.LN10) + 2) * charWidth;
	}

	var Canvas = function(canvasEl, source, optionsObj) {

		options = optionsObj;

		paper = this.paper = canvasEl;
		ctx   = this.ctx   = this.paper.getContext('2d');
		this.source = source;

		paper.width  = options.width;
		paper.height = options.height;
		
		this.setFont(options.font, options.fontSize);
	};

	Canvas.prototype = {

		clear : function() {
			this.ctx.fillStyle = 'rgb(21, 21, 21)';
			ctx.fillRect(0, 0, paper.width, paper.height);
			// ctx.clearRect(0, 0, paper.width, paper.height);
		},

		render : function(source) {
			var text = Highlighter.highlight(this.source);

			this.clear();
			this.drawSelection();

			var y = this.drawText(text);

			this.drawMargin(y + 1);
			this.drawCursor();

			this.drawScrollbar(y + 1, viewport.startRow);
		},

		drawText : function(tokens) {
			var token, i, y = -viewport.startRow, x = 0, value;

			var lineHeight = options.lineHeight,
				charWidth = options.charWidth,
				padding = options.padding;

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
			var padding = options.padding,
				lineHeight = options.lineHeight;

			var grad = ctx.createLinearGradient(0, 0, padding, 0);
			grad.addColorStop(0, '#B4B4B4');
			grad.addColorStop(0.4, '#F7F7F7');

			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, padding - 7, paper.height);
			ctx.fillStyle = '#C3BBB5';

			ctx.fillRect(padding - 7, 0, 1, paper.height);

			ctx.fillStyle = '#000000';

			while (line--) {
				var y = line * lineHeight + 10,
					num = line + viewport.startRow + 1,
					x = padding - addPadding(num, options.charWidth);
				ctx.fillText(num, x, y);
			}

		},

		drawScrollbar : function(numLines) {

			if (Text.source.length <= viewport.height + 1) return;

			var oldLineCap = ctx.lineCap,
				canvasHeight = paper.height,
				textLength = Text.source.length,
				height = (viewport.height / textLength) * paper.height - 16,
				y = (paper.height / textLength) * viewport.startRow + 8,
				x = paper.width - 8;
		
			ctx.lineCap = 'round';
			ctx.strokeStyle = 'rgba(181, 181, 181, 0.5)';
			ctx.lineWidth = 8;

			ctx.beginPath();

			ctx.moveTo(x, y);
			ctx.lineTo(x, y + height);

			ctx.stroke();

			ctx.lineCap = oldLineCap;
		},

		drawSelection : function() {
			if (selection.isEmpty()) return;

			var normal = selection.normalize(), start = normal.start, end = normal.end,
				col2 = (start.row == end.row ? end.col : Text.lineLength(start.row));

			ctx.fillStyle = Editor.options.highlight;
			
			highlightPart(ctx, start.row, start.col, col2);

			if (start.row != end.row) {
				var i = start.row;

				while (++i < end.row) {
					highlightLine(ctx, i);
				}

				highlightPart(ctx, end.row, 0, end.col);
			}

			ctx.fillStyle = '#000000';
		},

		setFont : function(font, size) {
			ctx.font = size + 'px ' + font;
		},

		drawCursor : function() {
			var cursorPos = Cursor.toPixels();
			if (cursorPos) {
				ctx.fillStyle = options.cursor;
				ctx.fillRect(cursorPos.x, cursorPos.y, 2, options.fontSize);
			}
		}

	};

	return Canvas;

})();

IDE.Cursor = (function() {
	
	var Constructor = function(row, col) {

		if (!this instanceof IDE.Cursor) {
			return new IDE.Cursor(row, col);
		}

		this.row = row;
		this.col = col;
	};

	Constructor.prototype = {
		
		toPixels : function() {
			var options = Editor.options;
			if (this.row < viewport.startRow || this.row > viewport.endRow) return;
			return {
				x : this.col * options.charWidth + options.padding,
				y : this.row * options.lineHeight
			};
		},

		setPosition : function(x, y) {
			var options = Editor.options,
				col = ~~((x - options.padding) / options.charWidth),
				row = ~~(y / options.lineHeight),
				textLength = Text.source.length - 1,

			row = (row > textLength ? textLength : row);

			var lineLength = Text.lineLength(row);

			col = (col > lineLength ? lineLength : col);

			this.col = col;
			this.row = row;
		},

		shift : function(direction, magnitude) {
			magnitude = magnitude || 1;
			switch(direction) {
				case 'right':
					if (this.col < Text.lineLength(this.row))
						this.col += magnitude;
						break;
				case 'left':
					if (this.col > 0)
						this.col -= magnitude;
					break;
				case 'down':
					if (this.row < Text.source.length) {
						var length = Text.lineLength(this.row + 1);
						if (length == -1) return;
						if (this.col > length) this.col = length;
						this.row += magnitude;
					}
					break;
				case 'up':
					if (this.row > 0) {
						var length = Text.lineLength(this.row - 1);
						if (this.col > length) this.col = length;
						this.row -= magnitude;
					}
			}
		}
	};

	return Constructor;

})();

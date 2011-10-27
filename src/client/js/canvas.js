define(['text', 'syntax/html', 'selection', 'viewport', 'cursor', 'settings'], 
	function(Text, Highlighter, selection, viewport, Cursor, settings) {

	"use strict";
	
	// Cache commonly used variables
	var options, paper, ctx, tokens;

	function highlightLine(ctx, row) {
		var lineHeight = settings.lineHeight;
		ctx.fillRect(settings.padding, row * lineHeight, 
				Text.lineLength(row) * settings.charWidth, lineHeight);
	}

	function highlightPart(ctx, row, col1, col2) {
		var charWidth = settings.charWidth,
			difference = (col1 - col2) * -1;

		ctx.fillRect(settings.padding + charWidth * col1, row * settings.lineHeight, 
				difference * charWidth, settings.lineHeight);
	}

	function addPadding(number, charWidth) {
		return (~~(Math.log(number) / Math.LN10) + 2) * charWidth;
	}

	// var Canvas = function(canvasEl, source, settings) {

	// 	settings = settings;

	// 	paper = this.paper = canvasEl;
	// 	ctx   = this.ctx   = this.paper.getContext('2d');
	// 	this.source = source;

	// 	paper.width  = settings.width;
	// 	paper.height = settings.height;
	// 	
	// 	this.setFont(settings.font, settings.fontSize);
	// };

	var Canvas/* .prototype */ = {

		init : function(canvasEl) {
			paper = this.paper = canvasEl;
			ctx   = this.ctx   = this.paper.getContext('2d');
			this.source = Text.source;

			paper.width  = settings.width;
			paper.height = settings.height;
			
			this.setFont(settings.font, settings.fontSize);
			settings.charWidth = ctx.measureText('m').width;
		},
		
		// Paints a rectangle over the whol canvas
		// in the background color
		clear : function() {
			this.ctx.fillStyle = 'rgb(21, 21, 21)';
			ctx.fillRect(0, 0, paper.width, paper.height);
		},

		// Main render loop
		render : function(source) {
			var text;

			// if (Text.modified == true) {
				text = Highlighter.highlight(this.source);
				// tokens = _.clone(text);
			// } else {
			// 	text = tokens;
			// }

			Text.modified = false;

			this.clear();
			this.drawSelection();

			var y = this.drawText(text);

			this.drawMargin(y + 1);
			this.drawCursor();

			this.drawScrollbar(y + 1, viewport.startRow);
		},

		// Draws the main body of code onto the canvas, given
		// an array of colored tokens. Returns the number of
		// lines drawn
		drawText : function(tokens) {
			var token, y = -viewport.startRow, x = 0, value;

			var lineHeight = settings.lineHeight,
				charWidth = settings.charWidth,
				padding = settings.padding;

			for (var i = 0, l = tokens.length; i < l; ++i) {

				token = tokens[i];

				// Null tokens represent newlines
				if (token === null) {
					y += 1;
					x = 0;
				} else {

					value = token.value;

					ctx.fillStyle = token.color;
					ctx.fillText(value, x * charWidth + padding, y * lineHeight + 10);
					
					// Move the 'brush' by the number of characters in the token
					x += value.length;
				}

			}

			// Return the number of lines drawn
			return y;
		},

		// Draws both the gradient and the line numbers
		// for the margin
		drawMargin : function(line) {
			var padding = settings.padding,
				lineHeight = settings.lineHeight;

			// Draw the gradient
			var grad = ctx.createLinearGradient(0, 0, padding, 0);
			grad.addColorStop(0, '#B4B4B4');
			grad.addColorStop(0.4, '#F7F7F7');

			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, padding - 7, paper.height);
			ctx.fillStyle = '#C3BBB5';

			ctx.fillRect(padding - 7, 0, 1, paper.height);

			ctx.fillStyle = '#000000';

			// The first line number is 1, not 0
			line--;

			// Draw the line numbers
			while (line--) {
				var y = line * lineHeight + 10,
					num = line + viewport.startRow + 1,
					x = padding - addPadding(num, settings.charWidth);
				ctx.fillText(num, x, y);
			}

		},

		// Draws the scrollbar
		drawScrollbar : function() {

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
		
		// Draws the highlighted part of the page
		drawSelection : function() {
			if (selection.isEmpty()) return;

			var normal = selection.normalize(), start = normal.start, end = normal.end,
				col2 = (start.row == end.row ? end.col : Text.lineLength(start.row));

			ctx.fillStyle = settings.highlight;
			
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
		
		// Sets the canvas font
		setFont : function(font, size) {
			ctx.font = size + 'px ' + font;
		},
		
		// Draws the cursor on the canvas
		drawCursor : function() {
			var cursorPos = Cursor.toPixels();
			if (cursorPos) {
				ctx.fillStyle = settings.cursor;
				ctx.fillRect(cursorPos.x, cursorPos.y, 2, settings.fontSize);
			}
		}

	};

	return Canvas;

});

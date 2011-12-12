define(['text', 'syntax/html', 'selection', 'viewport', 'cursor', 'settings', 'history'], 
	function(Text, Highlighter, selection, viewport, Cursor, settings, history) {

	"use strict";
	
	// Cache commonly used variables
	var options, paper, ctx, tokens;

	function highlightLine(ctx, row) {
		highlightPart(ctx, row, 0, Text.lineLength(row));
	}

	function highlightPart(ctx, row, col1, col2) {
		var charWidth = settings.charWidth,
			difference = (col1 - col2) * -1;

		if (difference == 0 && col1 == 0) difference = 0.5;

		ctx.fillRect(settings.padding + charWidth * col1, (row - viewport.startRow) *
				settings.lineHeight, difference * charWidth, settings.lineHeight);
	}

	function addPadding(number, charWidth) {
		return (~~(Math.log(number) / Math.LN10) + 2) * charWidth;
	}

	var Canvas = {

		init : function(canvasEl) {
			paper = this.paper = canvasEl;
			ctx   = this.ctx   = this.paper.getContext('2d');

			paper.width  = settings.width;
			paper.height = settings.height;
			
			this.setFont(settings.font, settings.fontSize);
			settings.charWidth = ctx.measureText('m').width;
		},
		
		// Paints a rectangle over the whole canvas
		// in the background color
		clear : function() {
			this.ctx.fillStyle = settings.background;
			ctx.fillRect(0, 0, paper.width, paper.height);
		},

		// Main render loop
		render : function() {
			var text, y;

			// If the text has not been modified, use the cached version
			if (Text.modified) {
				text = Highlighter.highlight(Text.source);
				tokens = _.clone(text);
			} else {
				text = tokens;
			}

			Text.modified = false;

			this.clear();
			this.drawSelection();

			y = this.drawText(text);

			this.drawMargin(y + 1);
			this.drawCursor();

			this.drawScrollbar(y + 1, viewport.startRow);
		},

		// Draws the main body of code onto the canvas, given
		// an array of colored tokens. Returns the number of
		// lines drawn
		drawText : function(tokens) {
			var token, 
				y = 0,
				x = 0,
				value;

			var lineHeight = settings.lineHeight,
				charWidth = settings.charWidth,
				padding = settings.padding,
				startRow = viewport.startRow;

			for (var i = 0, l = tokens.length; i < l; ++i) {

				token = tokens[i];

				// Null tokens represent newlines
				if (token === null) {
					y += 1;
					x = 0;
				} else if (viewport.isInside(y)){

					value = token.value;


					ctx.fillStyle = token.color;
					ctx.fillText(value, x * charWidth + padding, 
										(y - startRow) * lineHeight + 10);
					
					// Tokens have to be treated specially, 
					// as they take up more than one space
					if (value == '\t') {
						x += settings.tabSize;						
					} else {
						// Move the 'brush' by the number
						// of characters in the token
						x += value.length;
					}
				}

			}

			// Return the number of lines drawn
			return y;
		},

		// Draws both the gradient and the line numbers
		// for the margin
		drawMargin : function(line) {
			var padding = settings.padding,
				lineHeight = settings.lineHeight,
				startRow = viewport.startRow;

			// Draw the gradient
			var grad = ctx.createLinearGradient(0, 0, padding, 0);
			grad.addColorStop(0, '#B4B4B4');
			grad.addColorStop(0.4, '#F7F7F7');

			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, padding - 7, paper.height);
			ctx.fillStyle = '#C3BBB5';

			ctx.fillRect(padding - 7, 0, 1, paper.height);

			ctx.fillStyle = '#000000';

			line -= startRow;

			// Draw the line numbers
			while (line-- > 0) {
				var y = line * lineHeight + 10,
					num = line + startRow + 1,
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

			var normal = selection.normalize(),
				start = normal.start,
				end = normal.end,
				viewStart = viewport.startRow,
				viewEnd = viewport.endRow,
				col2 = (start.row == end.row ? end.col : Text.lineLength(start.row));

			ctx.fillStyle = settings.highlight;
			
			// Highlight the part selected on the current line
			highlightPart(ctx, start.row, start.col, col2);
			
			// I the selection is on a single line
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
			if (!Cursor.blinking && cursorPos) {
				ctx.fillStyle = settings.cursor;
				ctx.fillRect(cursorPos.x, cursorPos.y, 2, settings.fontSize);
			}
		}

	};

	return Canvas;

});

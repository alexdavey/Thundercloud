define(['text', 'settings', 'viewport'], function(Text, settings, viewport) {

	"use strict";

	var cursor = {

		row : 0,
		col : 10,
		

		// Converts the grid co-ordinates of the text 
		// grid (row, col) into pixels
		toPixels : function() {
			var row = this.row,
				col = this.col;

			if (row < viewport.startRow || row > viewport.endRow) return;
			return {
				x : col * settings.charWidth + settings.padding,
				y : (row - viewport.startRow) * settings.lineHeight
			};
		},

		atEndOfLine : function() {
			return this.col == Text.lineLength(this.row) - 1;
		},

		atStartOfLine : function() {
			return this.col == 0;
		},

		onLastLine : function() {
			return this.col == Text.source.length - 1;
		},

		onFirstLine : function() {
			return this.row == 0;
		},
		
		// Changes the cursor position, checking boundaries
		moveTo : function(x, y) {
			var lineHeight = settings.lineHeight,
				col = ~~((x - settings.padding) / settings.charWidth),
				row = ~~(y / lineHeight) - (viewport.startRow * lineHeight),
				textLength = Text.source.length - 1,

			row = (row > textLength ? textLength : row);

			var lineLength = Text.lineLength(row);

			col = (col > lineLength ? lineLength : col);

			this.col = col;
			this.row = row;
		},

		// Shifts the cursor position whilst checking boundaries
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

	return cursor;

});
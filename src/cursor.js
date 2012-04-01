define('cursor', ['events', 'text', 'settings', 'viewport'],
			function(events, Text, settings, viewport) {

	"use strict";

	function shiftViewport() {
		// Ensure that the viewport is not past the end of the text
		if (viewport.endRow > Text.source.length - 1) {
			viewport.shiftTo('end', cursor.row);
		} else if (!viewport.isInside(cursor.row)) {
			// Shift the viewport to the end of the line if the cursor
			// is above the cursor or to the beginning if below.
			viewport.shiftTo(cursor.row < viewport.startRow ? 'start' : 'end', cursor.row);
		}
	}

	var cursor = {

		row : 0,
		col : 10,


		blinking : false,

		// Converts the grid co-ordinates of the text 
		// grid (row, col) into pixels
		toPixels : function() {
			var row = this.row,
				col = this.col;

			if (!viewport.isInside(row)) return;
			return {
				x : col * settings.charWidth + settings.padding,
				y : (row - viewport.startRow) * settings.lineHeight
			};
		},

		atEndOfLine : function() {
			return this.col == Text.lineLength(this.row);
		},

		atStartOfLine : function() {
			return this.col == 0;
		},

		onLastLine : function() {
			return this.row == Text.source.length - 1;
		},

		onFirstLine : function() {
			return this.row == 0;
		},
		
		// Changes the cursor position, checking boundaries
		moveTo : function(x, y) {
			var lineHeight = settings.lineHeight,
				col = ~~((x - settings.padding) / settings.charWidth),
				row = ~~(y / lineHeight) + viewport.startRow,
				textLength = Text.source.length - 1;


			// Is the cursor too far down?
			row = (row > textLength ? textLength : row);

			var lineLength = Text.lineLength(row);

			// Is the cursor too far to the right?
			col = (col > lineLength ? lineLength : col);

			// Is the cursor in the margin?
			col < 0 && (col = 0);

			this.col = col;
			this.row = row;

			shiftViewport();
		},

		// Shifts the cursor position whilst checking boundaries
		shift : function(direction, magnitude) {
			var length, lineLength;

			magnitude || (magnitude = 1);

			switch(direction) {

				case 'right':
					this.col += magnitude;
					length = Text.lineLength(this.row);
					if (this.col > length) this.col = length;
					break;

				case 'left':
					this.col -= magnitude;
					if (this.col < 0) this.col = 0;
					break;

				case 'down':
					this.row += magnitude;

					length = Text.source.length;
					if (this.row > length) this.row = length - 1;

					lineLength = Text.lineLength(this.row);
					if (this.col > lineLength) this.col = lineLength;

					break;

				case 'up':
					this.row -= magnitude;
					if (this.row < 0) this.row = 0;

					lineLength = Text.lineLength(this.row);
					if (this.col > lineLength) this.col = lineLength;

			}

			shiftViewport();

		}
	};

	// events.subscribe('operation', function() {
	// 	cursor.blinking = false;
	// 	setInterval(function() {
	// 		cursor.blinking = !cursor.blinking;
	// 	}, 500);
	// });

	return cursor;

});

define(['text', 'settings'], function(Text, settings) {
	
	"use strict";

	var viewport = {
		
		startRow : 0,
		endRow : 50,

		height : ~~(settings.height / settings.lineHeight),

		isInside : function(row) {
			return row >= this.startRow && row <= this.endRow;
		},
		
		// Shifts the "start row" and "end row".
		// Down is positive
		shift : function(delta) {
			var length = Text.source.length;
			if (length < this.height) return;

			this.startRow += delta;
			this.endRow += delta;

			if (this.startRow < 0) {
				this.startRow = 0;
				this.endRow = this.height;
			} else if (this.endRow > length) {
				this.endRow = length;
				this.startRow = length - this.height;
			}
		},

		shiftTo : function(startOrEnd, row) {
			this.shift(row - (startOrEnd == 'start' ? this.startRow : this.endRow));
		}

	};

	return viewport;

});

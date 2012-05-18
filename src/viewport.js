define('viewport', ['text', 'settings', 'events'], function(Text, settings, events) {
	
	"use strict";

	var viewport = {
		
		height : ~~(settings.height / settings.lineHeight),

		isInside : function(row) {
			return row >= this.startRow && row <= this.endRow;
		},
		
		// Shifts the "start row" and "end row".
		// Down is positive
		shift : function(delta) {
			var length = Text.source.length;
			if (length <= this.height) return;

			this.startRow += delta;
			this.endRow += delta;

			if (this.startRow < 0) {
				this.shiftTo('start', 0);
			} else if (this.endRow > length - 1) {
				this.shiftTo('end', length - 1);
			}
			events.publish('viewport.change');
		},

		shiftTo : function(startOrEnd, row) {
			this.shift(row - (startOrEnd == 'start' ? this.startRow : this.endRow));
			events.publish('viewport.change');
		}

	};

	viewport.startRow = 0;
	viewport.endRow = viewport.height;

	return viewport;

});

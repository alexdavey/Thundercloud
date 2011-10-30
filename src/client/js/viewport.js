define(['text'], function(Text) {
	
	"use strict";

	var viewport = {
		
		startRow : 0,
		endRow : 50,

		height : 50,

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
		}

	};

	return viewport;

});

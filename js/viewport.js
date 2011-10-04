var viewport = {
	
	startRow : 0,
	endRow : 50,

	height : 50,

	shift : function(delta) {

		this.startRow += delta;
		this.endRow += delta;

		if (this.startRow < 0) {
			this.startRow = 0;
			this.endRow = this.height;
		} else if (this.endRow > Text.source.length) {
			this.endRow = Text.source.length;
			this.startRow = Text.source.length - this.height;
		}
		console.log(this.startRow, this.endRow);
	}

};

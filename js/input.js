var input = {
	
	init : function(canvasEl) {
		$.listen('keypress', this.onKeyPress);
		$.listen('keydown', this.onKeyDown);
		$.listen(canvasEl, 'mousedown', this.onMouseDown);
	},

	onMouseDown : function(e) {
		var mouse = $.mouse(e);
		cursor.setPosition(mouse.x, mouse.y);
		canvas.render(text.source);
	},

	onKeyDown : function(e) {
		e = e || window.e;
		var keyCode = e.keyCode;
		if (keyCode in actions) {
			e.preventDefault();
			actions[keyCode]();
			canvas.render(text.source);
		}
	},

	onKeyPress : function(e) {
		e = e || window.e;
		e.preventDefault();
		var character = String.fromCharCode(e.charCode);
		text.insert(character, cursor.row, cursor.col);
		cursor.shift('right');
		canvas.render(text.source);
	}


};

var input = {
	
	init : function(canvasEl) {
		$.listen('keypress', this.onKeyPress);
		$.listen('keydown', this.onKeyDown);
		$.listen(canvasEl, 'mousedown', this.mouseDown);
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
		e.preventDefault();
		e = e || window.e;
		var character = String.fromCharCode(e.charCode);
		text.insert(character, cursor.row, cursor.col);
		cursor.col++;
		canvas.render(text.source);
	}


};

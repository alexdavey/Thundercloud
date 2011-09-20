var ctrlDown = false,
	textArea = $('#clipboard');

var input = {
	
	init : function(canvasEl) {
		$.listen(canvasEl, 'mousedown', this.onMouseDown);
		$.listen('keypress', this.onKeyPress);
		$.listen('keydown', this.onKeyDown);
		$.listen('keyup', this.onKeyDown);
	},

	onMouseDown : function(e) {
		var mouse = $.mouse(e);
		cursor.setPosition(mouse.x, mouse.y);
		canvas.render(text.source);
	},

	onKeyDown : function(e) {
		e = e || window.e;
		var keyCode = e.keyCode,
			passive = actions.passive;

		if (keyCode in actions) {
			e.preventDefault();
			actions[keyCode]();
			canvas.render(text.source);
		} else if (keyCode in passive) {
			passive[keyCode]();
		}
	},

	onKeyUp : function(e) {
		e = e || window.e;
		if (e.keyCode == 17 || e.keyCode == 91) ctrlDown = false;
	},

	onKeyPress : function(e) {
		e = e || window.e;
		var character = String.fromCharCode(e.charCode);
		e.preventDefault();
		text.insert(character, cursor.row, cursor.col);
		cursor.shift('right');
		canvas.render(text.source);
	}

};

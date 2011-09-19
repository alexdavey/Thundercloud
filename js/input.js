var ctrlDown = false,
	textArea = $('#clipboard');

var input = {
	
	init : function(canvasEl) {
		$.listen(canvasEl, 'mousedown', this.onMouseDown);
		$.listen('keypress', this.onKeyPress);
		$.listen('keydown', this.onKeyDown);
		$.listen('keyup', this.onKeyUp);
	},

	onMouseDown : function(e) {
		var mouse = $.mouse(e);
		cursor.setPosition(mouse.x, mouse.y);
		canvas.render(text.source);
	},

	onKeyDown : function(e) {
		console.log(e.keyCode);
		e = e || window.e;
		var keyCode = e.keyCode;
		if (keyCode in actions) {
			e.preventDefault();
			actions[keyCode]();
			canvas.render(text.source);
		}
		// Special case for ctrl / left window
		if (e.keyCode == 17 || e.keyCode == 91) {
			ctrlDown = true;
			textArea.focus();
		} else if (e.keyCode == 86) {
			actions.paste();
		}
	},

	onKeyUp : function(e) {
		e = e || window.e;
		if (e.keyCode == 17 || e.keyCode == 91) {
			ctrlDown = false;
			textArea.focus();
		}
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

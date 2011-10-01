IDE.Input = (function() {

	var ctrlDown = false,
		mouseDown = false,
		textArea;

	var Constructor = function(canvasEl, clipboardEl) {
		textArea = clipboardEl;

		_.listen(canvasEl, 'mousedown', this.onMouseDown);
		_.listen(canvasEl, 'mousemove', this.onMouseMove);
		_.listen(canvasEl, 'mouseup', this.onMouseUp);

		_.listen('keypress', this.onKeyPress);
		_.listen('keydown', this.onKeyDown);
		_.listen('keyup', this.onKeyUp);
	};

	Constructor.prototype = {
		
		onMouseDown : function(e) {
			var mouse = _.mouse(e);
			Cursor.setPosition(mouse.x, mouse.y);
			mouseDown = true;

			selection.setStart();
			selection.setEnd();

			canvas.render(text.source);
		},

		onMouseMove : function(e) {
			if (!mouseDown) return;
			var mouse = _.mouse(e);
			Cursor.setPosition(mouse.x, mouse.y);
			selection.setEnd();
			canvas.render(text.source);
		},

		onMouseUp : function(e) {
			mouseDown = false;
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
			text.insert(character, Cursor.row, Cursor.col);
			Cursor.shift('right');
			canvas.render(text.source);
		}

	};

	return Constructor;


})();

var selection = {
	
	isEmpty : function() {
		var start = this.start, end = this.end;
		return start.col == end.col && start.row == end.row;
	},

	setStart : function() {
		this.start.col = Cursor.col;
		this.start.row = Cursor.row;
	},

	setEnd : function() {
		this.end.col = Cursor.col;
		this.end.row = Cursor.row;
	},

	normalize : function() {
		// If selecting upwards, reverse
		if (this.start.row > this.end.row) {
			return {
				start : this.end,
				end : this.start
			};
		} else {
			return {
				start : this.start,
				end : this.end
			};
		}
	},

	start : {
		col : 0,
		row : 0
	},

	end : {
		col : 0,
		row : 0
	}

};

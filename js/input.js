var ctrlDown = false,
	textArea = $('#clipboard'),
	mouseDown = false;

var input = {
	
	init : function(canvasEl) {
		$.listen(canvasEl, 'mousedown', this.onMouseDown);
		$.listen(canvasEl, 'mousemove', this.onMouseMove);
		$.listen(canvasEl, 'mouseup', this.onMouseUp);

		$.listen('keypress', this.onKeyPress);
		$.listen('keydown', this.onKeyDown);
		$.listen('keyup', this.onKeyUp);
	},

	onMouseDown : function(e) {
		var mouse = $.mouse(e);
		cursor.setPosition(mouse.x, mouse.y);
		mouseDown = true;

		selection.setStart();
		selection.setEnd();

		canvas.render(text.source);
	},

	onMouseMove : function(e) {
		if (!mouseDown) return;
		var mouse = $.mouse(e);
		cursor.setPosition(mouse.x, mouse.y);
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
		text.insert(character, cursor.row, cursor.col);
		cursor.shift('right');
		canvas.render(text.source);
	}

};

var selection = {
	
	isEmpty : function() {
		var start = this.start, end = this.end;
		return start.col == end.col && start.row == end.row;
	},

	setStart : function() {
		this.start.col = cursor.col;
		this.start.row = cursor.row;
	},

	setEnd : function() {
		this.end.col = cursor.col;
		this.end.row = cursor.row;
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

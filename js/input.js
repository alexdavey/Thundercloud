"use strict";

IDE.Input = (function() {

	var ctrlDown = false,
		mouseDown = false,
		textArea;

	var Input = function(canvasEl, clipboardEl) {
		textArea = clipboardEl;

		_.listen(canvasEl, 'mousedown', this.onMouseDown);
		_.listen(canvasEl, 'mousemove', this.onMouseMove);
		_.listen(canvasEl, 'mouseup', this.onMouseUp);

		_.listen('keypress', this.onKeyPress);
		_.listen('keydown', this.onKeyDown);
		_.listen('keyup', this.onKeyUp);

		_.listen('DOMMouseScroll', this.onScrollFF);
		_.listen('mousewheel', this.onScroll);
	};

	Input.prototype = {
		
		onMouseDown : function(e) {
			var mouse = _.mouse(e);
			Cursor.setPosition(mouse.x, mouse.y);
			mouseDown = true;

			selection.setStart();
			selection.setEnd();

			Canvas.render();
		},

		onMouseMove : function(e) {
			if (!mouseDown) return;
			var mouse = _.mouse(e);
			Cursor.setPosition(mouse.x, mouse.y);
			selection.setEnd();
			Canvas.render();
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
				Canvas.render();
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
			Text.insert(character, Cursor.row, Cursor.col);
			Cursor.shift('right');
			Canvas.render();
		},

		onScrollFF : function(e) {
			e.preventDefault();
			viewport.shift(~~(e.detail / Editor.options.mouseSensitivity));
			Canvas.render();
		},

		onScroll : function(e) {
			e = e || window.e;
			e.preventDefault();
			viewport.shift(~~(-e.wheelDelta / Editor.options.mouseSensitivity));
			Canvas.render();
		}

	};

	return Input;


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

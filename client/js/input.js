define(['canvas', 'cursor', 'viewport', 'settings', 'selection', 'actions', 'text'], 
	function(Canvas, Cursor, viewport, settings, selection, actions, Text) {
	
	"use strict";

	var mouseDown = false,
		textArea;

	var Input = {

		init : function(canvasEl, clipboardEl) {
			textArea = clipboardEl;

			_.listen('mousedown', this.onMouseDown);
			_.listen('mousemove', this.onMouseMove);
			_.listen('mouseup', this.onMouseUp);

			_.listen('keypress', this.onKeyPress);
			_.listen('keydown', this.onKeyDown);
			_.listen('keyup', this.onKeyUp);

			_.listen('DOMMouseScroll', this.onScrollFF);
			_.listen('mousewheel', this.onScroll);
		},
		
		onMouseDown : function(e) {
			var mouse = _.mouse(e);
			Cursor.moveTo(mouse.x, mouse.y);
			mouseDown = true;

			selection.setStart();
			selection.setEnd();

			Canvas.render();
		},

		onMouseMove : function(e) {
			if (!mouseDown) return;

			var mouse = _.mouse(e),
				oldCol = Cursor.col,
				oldRow = Cursor.row;

			// Move the cursor and end point of
			// the selection
			Cursor.moveTo(mouse.x, mouse.y);
			selection.setEnd();

			// Only render if the cursor position has changed
			if (Cursor.col != oldCol || Cursor.row != oldRow) {
				Canvas.render();
			}
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
			if (e.keyCode == 17 || e.keyCode == 91) {
				actions.ctrlDown = false;
			}
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
			viewport.shift(~~(e.detail / settings.mouseSensitivity));
			Canvas.render();
		},

		onScroll : function(e) {
			e = e || window.e;

			var viewportStart = viewport.startRow,
				viewportEnd = viewport.endRow;

			e.preventDefault();
			viewport.shift(~~(-e.wheelDelta / settings.mouseSensitivity));

			if (viewport.startRow != viewportStart || viewport.endRow != viewportEnd) {
				Canvas.render();
			}
		}

	};

	return Input;

});


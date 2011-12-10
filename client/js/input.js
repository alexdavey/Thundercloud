define(['events', 'canvas', 'cursor', 'viewport', 'settings', 'selection', 'actions', 'text'], 
	function(events, Canvas, Cursor, viewport, settings, selection, actions, Text) {
	
	"use strict";

	function removeCurrentSelection() {
		var start = selection.start,
			end   = selection.end;

		Text.removeSelection(start.row, start.col, end.row, end.col);
	}

	var mouseDown = false,
		textArea;

	var Input = {

		init : function(clipboardEl) {
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
			var mouse = _.mouse(e),
				offset = _.offset(Canvas.paper);

			Cursor.moveTo(mouse.x - offset.left, mouse.y - offset.top);
			mouseDown = true;

			selection.setStart();
			selection.setEnd();

			events.publish('operation');
		},

		onMouseMove : function(e) {
			if (!mouseDown) return;

			var mouse = _.mouse(e),
				offset = _.offset(Canvas.paper),
				oldCol = Cursor.col,
				oldRow = Cursor.row;

			// Move the cursor and end point of
			// the selection
			Cursor.moveTo(mouse.x - offset.left, mouse.y - offset.top);
			selection.setEnd();

			// Only render if the cursor position has changed
			if (Cursor.col != oldCol || Cursor.row != oldRow) {
				events.publish('operation');
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
				events.publish('operation');
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
			if (character.length < 1) return;
			e.preventDefault();
			Text.insert(character, Cursor.row, Cursor.col);
			// If there is a current selection, delete it using
			// the backspace function
			if (!selection.isEmpty()) actions[8]();
			Cursor.shift('right');
			events.publish('operation');
		},

		onScrollFF : function(e) {
			e.preventDefault();
			viewport.shift(~~(e.detail / settings.mouseSensitivity));
			events.publish('operation');
		},

		onScroll : function(e) {
			e = e || window.e;

			var viewportStart = viewport.startRow,
				viewportEnd = viewport.endRow;

			e.preventDefault();
			viewport.shift(~~(-e.wheelDelta / settings.mouseSensitivity));

			if (viewport.startRow != viewportStart || viewport.endRow != viewportEnd) {
				events.publish('operation');
			}
		}

	};

	return Input;

});


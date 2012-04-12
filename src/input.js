define('input', ['inputII', 'events', 'canvas', 'cursor', 'viewport', 'settings', 'selection', 'actions', 'text'], 
	function(inputII, events, Canvas, Cursor, viewport, settings, selection, actions, Text) {
	
	"use strict";

	function removeCurrentSelection() {
		var normal = selection.normalize(),
			start = selection.start,
			end   = selection.end;

		Text.removeSelection(start.row, start.col, end.row, end.col);
	}

	var drag = inputII.drag(function(e) {
		var mouse = _.mouse(e),
			offset = _.offset(Canvas.paper);

		Cursor.moveTo(mouse.x - offset.left, mouse.y - offset.top);

		selection.setEnd();
		events.publish('operation');
	});

	var mouseDown = inputII.mouseDown(function(e) {
		var mouse = _.mouse(e),
			offset = _.offset(Canvas.paper);

		Cursor.moveTo(mouse.x - offset.left, mouse.y - offset.top);

		// Deselect any existing selections and 
		// start a new one
		if (inputII.is('shift')) {
			selection.setEnd();
		} else {
			selection.clear();
			selection.setStart();
		}

		events.publish('operation');
	});

	var shift = inputII.bind('⇧ + mouseDown', drag);

	inputII.tripleClick(function(e) {
		selection.start.col = 0;
		selection.setEnd(Cursor.row, Text.lineLength());

		events.publish('operation');
	});

	// inputII.scroll();

	// inputII.printable();

	// var mouseDown = false,
	// 	textArea;

	// var Input = {

	// 	init : function(clipboardEl) {
	// 		textArea = clipboardEl;

	// 		// _.listen('mousedown', this.onMouseDown);
	// 		// _.listen('mousemove', this.onMouseMove);
	// 		// _.listen('mouseup', this.onMouseUp);

	// 		// _.listen('keypress', this.onKeyPress);
	// 		// _.listen('keydown', this.onKeyDown);
	// 		// _.listen('keyup', this.onKeyUp);

	// 		// _.listen('DOMMouseScroll', this.onScrollFF);
	// 		// _.listen('mousewheel', this.onScroll);
	// 	},
	// 	
	
	// 	onMouseMove : function(e) {
	// 		if (!mouseDown) return;

	// 		var mouse = _.mouse(e),
	// 			offset = _.offset(Canvas.paper),
	// 			oldCol = Cursor.col,
	// 			oldRow = Cursor.row;

	// 		e.preventDefault();
	// 		e.stopPropagation();

	// 		// Move the cursor and end point of
	// 		// the selection
	// 		Cursor.moveTo(mouse.x - offset.left, mouse.y - offset.top);
	// 		endSelection();

	// 		// Only render if the cursor position has changed
	// 		if (Cursor.col != oldCol || Cursor.row != oldRow) {
	// 			events.publish('operation');
	// 		}
	// 	},

	// 	onMouseUp : function(e) {
	// 		mouseDown = false;
	// 	},

	// 	onKeyDown : function(e) {
	// 		e = e || window.e;
	// 		var keyCode = e.keyCode,
	// 			passive = actions.passive;

	// 		if (keyCode in actions) {
	// 			e.preventDefault();
	// 			actions[keyCode]();
	// 			events.publish('operation');
	// 		} else if (keyCode in passive) {
	// 			passive[keyCode]();
	// 		}
	// 	},

	// 	onKeyUp : function(e) {
	// 		e = e || window.e;

	// 		if (e.keyCode == 17 || e.keyCode == 91) {
	// 			actions.ctrlDown = false;
	// 		} else if (e.keyCode == 16) {
	// 			actions.shiftDown = false;
	// 		}
	// 	},

	var printable = inputII.printable(function(e) {
		var character = e.character;
		if (character.length < 1) return;
		e.preventDefault();

		// If there is a current selection, delete it using
		// the backspace function
		if (!selection.isEmpty()) actions.delete();

		Text.insert(character, Cursor.row, Cursor.col);

		Cursor.shift('right');
		events.publish('operation');
	})
	
	// 	onKeyPress : function(e) {
	// 		e = e || window.e;
	// 		var character = String.fromCharCode(e.charCode);
	// 		if (character.length < 1) return;
	// 		e.preventDefault();

	// 		// If there is a current selection, delete it using
	// 		// the backspace function
	// 		if (!selection.isEmpty()) actions[8]();

	// 		Text.insert(character, Cursor.row, Cursor.col);

	// 		Cursor.shift('right');
	// 		events.publish('operation');
	// 	},

	// 	onScrollFF : function(e) {
	// 		e.preventDefault();
	// 		viewport.shift(~~(e.detail / settings.mouseSensitivity));
	// 		events.publish('operation');
	// 	},

	// 	onScroll : function(e) {
	// 		e = e || window.e;

	// 		var viewportStart = viewport.startRow,
	// 			viewportEnd = viewport.endRow;

	// 		e.preventDefault();
	// 		viewport.shift(~~(-e.wheelDelta / settings.mouseSensitivity));

	// 		if (viewport.startRow != viewportStart || viewport.endRow != viewportEnd) {
	// 			events.publish('operation');
	// 		}
	// 	}

	// };

	// return Input;

});

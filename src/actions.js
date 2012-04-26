define('actions', ['inputII', 'events', 'cursor', 'text', 'selection', 'settings', 'canvas', 'history', 'viewport'], 
	function(input, events, Cursor, Text, selection, settings, Canvas, history, viewport) {

	"use strict";

	var textArea = _.getId('clipboard');

	function deleteSelection() {
		var normal = selection.normalize(),
			start  = normal.start,
			end    = normal.end;

		Text.removeSelection(start.row, start.col, end.row, end.col);

		Cursor.col = start.col;
		Cursor.row = start.row;

		selection.clear();
	}

	var actions = {
		
		// Backspace
		backspace : input.bind('backspace', function() {
			var col = Cursor.col,
				row = Cursor.row,
				length;

			if (selection.isEmpty()) {
				if (col == 0) {
					if (row == 0) return;
					length = Text.lineLength(row - 1);

					Text.append(Text.source[row], row - 1)
						.removeLine(row);

					Cursor.col = length;
					Cursor.shift('up');
				} else {
					Text.remove(1, row, col);
					Cursor.shift('left');
				}
			} else {
				deleteSelection();
			}
			events.publish('operation');
		}),

		// Delete
		delete : input.bind('delete', function() {
			if (!Cursor.atEndOfLine()) {
				Cursor.shift('right');
			} else {
				Cursor.shift('down');
				Cursor.col = 0;
			}

			// Proxy to backspace function
			actions.delete();
			events.publish('operation');
		}),

		// Enter
		enter : input.bind('return', function() {
			var row = Cursor.row,
				col = Cursor.col,
				overflow
			
			if (col == 0) {
				Text.addLine(row);
			} else {
				overflow = Text.lineSection(row, col);

				Text.addLine(row + 1, overflow)
					.removeSection(row, col);
			}

			Cursor.shift('down');
			Cursor.col = 0;
			events.publish('operation');
		}),

		// Tab
		tab : input.bind('tab', function() {
			var tab = new Array(settings.tabSize + 1).join(' ');
			Text.insert(tab/* '\t' */, Cursor.row, Cursor.col);
			Cursor.shift('right', 4);
			events.publish('operation');
		}),

		// Up arrow
		up : input.bind('↑', function() {
			actions.handleSelection();
			Cursor.shift('up');
			events.publish('operation');
		}),

		// Down arrow
		down : input.bind('↓', function() {
			actions.handleSelection();
			Cursor.shift('down');
			events.publish('operation');
		}),

		// Left arrow
		left : input.bind('←', function() {
			actions.handleSelection();
			Cursor.shift('left');
			events.publish('operation');
		}),

		// Right arrow
		right : input.bind('→', function() {
			actions.handleSelection();
			Cursor.shift('right');
			events.publish('operation');
		}),

		// Select all (a)
		selectAll : input.bind('ctrl + a', function() {
			var start = selection.start,
				end = selection.end;
			
			start.row = start.col = 0;
			end.row = Text.source.length - 1;
			end.col = _.last(Text.source).length;
			events.publish('operation');
		}),

		// Undo (z)
		undo : input.bind('ctrl + z', function() {
			history.undo();
			Canvas.render();
		}),

		// Redo (y)
		redo : input.bind('ctrl + y', function() {
			history.redo();
			Canvas.render();
		}),

		// Shift
		16 : function() {
			if (selection.isEmpty()) selection.setStart();
			actions.shiftDown = true;
		},
		
		// Ctrl
		17 : function() {
			actions.ctrlDown = true;
			textArea.focus();
		},

		// Left window
		91 : function() {
			actions.ctrlDown = true;
			textArea.focus();
		},

		// Cut (x)
		88 : function() {
			if (!actions.ctrlDown) return;

			// Proxy to the copy function
			actions.passive[67]();
			// Proxy to the backspace function
			actions[8]();

			events.publish('operation');
		},

		// Paste (v)
		86 : function() {
			if (!actions.ctrlDown) return;

			// If there is a current selection, delete it using
			// the backspace function
			if (!selection.isEmpty()) actions[8]();

			// Wait for the text to be pasted into the textarea
			setTimeout(function() {
				var input = textArea.value.split(/\r\n|\n|\r/),
					overflow = Text.lineSection(Cursor.row, Cursor.col),
					length = input.length,
					lastLineLength = _.last(input).length,
					row = Cursor.row,
					col = Cursor.col;

				// Is the input multi-line?
				if (length > 1) {
					// Remove the text after the cursor temporarily
					Text.remove(-overflow.length, row, col)

					// Append the top line
					Text.insert(input.shift(), row, col)

					// Insert the bottom line and the overflow
					Text.insert(input.pop() + overflow, row + 1, 0)

					// Insert all of the lines in between
					Text.insertLines(input, row + 1);

					Cursor.col = overflow.length + lastLineLength;
					Cursor.shift('down', length - 1);
				} else {
					// If the input is a single line, simply insert it
					Text.insert(textArea.value, row, col);
					Cursor.shift('right', textArea.value.length);
				}

				textArea.value = '';
				events.publish('operation');
			}, 100);
		},

		// Copy (c)
		67 : function() {
			var normal = selection.normalize(), 
				start = normal.start,
				end = normal.end;

			if (!selection.isEmpty()) {
				textArea.value = Text.selection(start.row, start.col, end.row, end.col);
				textArea.select();

				setTimeout(function() {
					textArea.value = '';
				}, 100);
			}
		},
	
		// Utility methods
		// ---------------

		handleSelection : function() {
			if (input.is('shift')) {
				selection.setEnd();
			} else if (!selection.empty) {
				selection.clear();
				selection.setStart();
			}
		}

	};

	return actions;

});

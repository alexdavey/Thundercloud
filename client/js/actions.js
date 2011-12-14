define(['events', 'cursor', 'text', 'selection', 'settings', 'canvas', 'history', 'viewport'], 
	function(events, Cursor, Text, selection, settings, Canvas, history, viewport) {

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
		8 : function() {
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
		},

		// Delete
		46 : function() {
			if (!Cursor.atEndOfLine()) {
				Cursor.shift('right');
			} else {
				Cursor.shift('down');
				Cursor.col = 0;
			}

			// Proxy to backspace function
			actions[8]();
		},

		// Enter
		13 : function() {
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
		},

		// Tab
		9 : function() {
			var tab = new Array(settings.tabSize + 1).join(' ');
			Text.insert(tab/* '\t' */, Cursor.row, Cursor.col);
			Cursor.shift('right', 4);
		},

		// Up arrow
		38 : function() {
			actions.handleSelection();
			Cursor.shift('up');
		},

		// Down arrow
		40 : function() {
			actions.handleSelection();
			Cursor.shift('down');
		},

		// Left arrow
		37 : function() {
			actions.handleSelection();
			Cursor.shift('left');
		},

		// Right arrow
		39 : function() {
			actions.handleSelection();
			Cursor.shift('right');
		},

		passive : {
			// Select all (a)
			65 : function() {
				if (!actions.ctrlDown) return;
				var start = selection.start,
					end = selection.end;
				
				start.row = start.col = 0;
				end.row = Text.source.length - 1;
				end.col = _.last(Text.source).length;
				events.publish('operation');
			},

			// Undo (z)
			90 : function() {
				if (!actions.ctrlDown) return;
				history.undo();
				Canvas.render();
			},

			// Redo (y)
			89 : function() {
				if (!actions.ctrlDown) return;
				history.redo();
				Canvas.render();
			},

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
			}
		},
	
		// Utility methods
		// ---------------

		handleSelection : function() {
			if (actions.shiftDown) {
				selection.setEnd();
			} else if (!selection.empty) {
				selection.clear();
			}
		},

		// Flags
		// -----
		
		shiftDown : false,
		ctrlDown : false

	};

	return actions;

});

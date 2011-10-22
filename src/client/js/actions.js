"use strict";

var textArea = _.getId('clipboard'),
	ctrlDown = false;

var actions = {
	
	// Backspace
	'8' : function() {
		var col = Cursor.col,
			row = Cursor.row,
			start = selection.start,
			end = selection.end;

		if (selection.isEmpty()) {
			if (col == 0) {
				if (row == 0) return;

				Cursor.col = Text.lineLength(row - 1);
				Cursor.shift('up');

				Text.append(Text.source[row], row - 1)
					.removeLine(row);

			} else {
				Text.remove(1, row, col);
				Cursor.shift('left');
			}
		} else {
			Text.removeSelection(start.row, start.col, end.row, end.col);
			selection.setStart();
			selection.setEnd();
		}
	},

	// Delete
	'46' : function() {
		var col = Cursor.col, 
			row = Cursor.row,	
			normal = selection.normalize(),
			start = normal.start,
			end = normal.end;

		if (selection.isEmpty()) {
			if (col >= Text.lineLength(row)) {
				if (row != length - 1) return;
				Cursor.shift('down');
				Cursor.col = 0;
				actions[8]();
			} else {
				Text.remove(-1, row, col);
			}
		} else {
			Text.removeSelection(start.row, start.col, end.row, end.col);

			console.log(selection.start, selection.end);
			Cursor.col = start.col;
			Cursor.row = start.row;

			selection.setStart();
			selection.setEnd();
		}
	},

	// Enter
	'13' : function() {
		var row = Cursor.row, col = Cursor.col,
			overflow = Text.lineSection(row, col);

		Text.addLine(row + 1, overflow)
			.remove(-overflow.length, row, col);

		Cursor.shift('down');
		Cursor.col = 0;
	},

	// Tab
	'9' : function() {
		var tab = new Array(Editor.options.tabSize + 2).join(' ');
		Text.insert(tab, Cursor.row, Cursor.col);
		Cursor.shift('right', 4);
	},

	// Up arrow
	'38' : function() {
		Cursor.shift('up');
	},

	// Down arrow
	'40' : function() {
		Cursor.shift('down');
	},

	// Left arrow
	'37' : function() {
		Cursor.shift('left');
	},

	// Right arrow
	'39' : function() {
		Cursor.shift('right');
	},

	passive : {
		
		// Ctrl
		17 : function() {
			ctrlDown = true;
			textArea.focus();
		},

		// Left window
		91 : function() {
			ctrlDown = true;
			textArea.focus();
		},

		// Select all (a)
		65 : function() {
			var start = selection.start,
				end = selection.end;
			if (!ctrlDown) return;
			
			start.row = start.col = 0;
			end.row = Text.source.length - 1;
			end.col = _.last(Text.source).length - 1;

			Canvas.render();
		},

		// Paste (v)
		86 : function() {
			if (!ctrlDown) return;
			setTimeout(function() {
				var input = textArea.value.split(/\n|\r/),
					overflow = Text.lineSection(Cursor.row, Cursor.col);
					length = input.length,
					lastLineLength = input[length - 1].length,
					row = Cursor.row,
					col = Cursor.col;

				if (length > 1) {
					Text.remove(-overflow.length, row, col)
						.append(input.shift(), row)
						.insert(input.pop() + overflow, row + 1, 0)
						.insertLines(input, row);

					Cursor.col = overflow.length + lastLineLength;
					Cursor.shift('down', length - 2);
				} else {
					Text.insert(textArea.value, row, col);
					Cursor.shift('right', textArea.value.length);
				}

				textArea.value = '';
				Canvas.render();
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
	}


};

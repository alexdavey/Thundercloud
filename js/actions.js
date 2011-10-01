var textArea = _.getId('clipboard');

var actions = {
	
	// Backspace
	'8' : function() {
		var col = Cursor.col, row = Cursor.row;
		if (col == 0) {
			if (row == 0) return;

			Cursor.col = text.lineLength(row - 1);
			Cursor.shift('up');

			text.append(text.source[row], row - 1);
			text.removeLine(row);
		} else {
			text.remove(1, row, col);
			Cursor.shift('left');
		}
	},

	// Delete
	'46' : function() {
		var col = Cursor.col, row = Cursor.row;
		if (col >= text.lineLength(row)) {
			if (row != length - 1) return;
			Cursor.shift('down');
			Cursor.col = 0;
			actions[8]();
		} else {
			text.remove(-1, row, col);
		}
	},

	// Enter
	'13' : function() {
		var row = Cursor.row, col = Cursor.col,
			overflow = text.lineSection(row, col);

		text.addLine(row + 1, overflow);
		text.remove(-overflow.length, row, col);

		Cursor.shift('down');
		Cursor.col = 0;
	},

	// Tab
	'9' : function() {
		var tab = new Array(editor.options.tabSize + 2).join(' ');
		text.insert(tab, Cursor.row, Cursor.col);
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

		// Paste (v)
		86 : function() {
			if (!ctrlDown) return;
			setTimeout(function() {
				var Input = textArea.value.split(/\n|\r/),
					overflow = text.lineSection(Cursor.row, Cursor.col);
					length = Input.length,
					lastLineLength = Input[length - 1].length,
					row = Cursor.row,
					col = Cursor.col;

				if (Input.length > 1) {
					text.remove(-overflow.length, row, col);
					text.append(Input.shift(), row);
					text.insert(Input.pop() + overflow, row + 1, 0);
					text.insertLines(Input, row);

					Cursor.col = overflow.length + lastLineLength;
					Cursor.shift('down', length - 2);
				} else {
					text.insert(textArea.value, row, col);
					Cursor.shift('right', textArea.value.length);
				}

				textArea.value = '';
				canvas.render(text.source);
			}, 100);
		},

		// Copy (c)
		67 : function() {
			var normal = selection.normalize(), 
				end = normal.end, start = normal.start;
			if (!selection.isEmpty()) {
				textArea.value = text.selection(start.row, start.col, end.row, end.col);
				textArea.select();
				setTimeout(function() {
					textArea.value = '';
				}, 100);
			}
		}
	}


};

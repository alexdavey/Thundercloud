var actions = {
	
	// Backspace
	'8' : function() {
		var col = cursor.col, row = cursor.row;
		if (col == 0) {
			if (row == 0) return;

			cursor.col = text.lineLength(row - 1);
			cursor.shift('up');

			text.append(text.source[row], row - 1);
			text.removeLine(row);
		} else {
			text.remove(1, row, col);
			cursor.shift('left');
		}
	},

	// Delete
	'46' : function() {
		var col = cursor.col, row = cursor.row;
		if (col >= text.lineLength(row)) {
			if (text.source.length == 1) return;
			cursor.shift('down');
			cursor.col = 0;
			actions[8]();
		} else {
			text.remove(-1, row, col);
		}
	},

	// Enter
	'13' : function() {
		var row = cursor.row, col = cursor.col,
			overflow = text.lineSection(row, col);

		text.addLine(row + 1, overflow);
		text.remove(-overflow.length, row, col);

		cursor.shift('down');
		cursor.col = 0;
	},

	// Tab
	'9' : function() {
		var tab = new Array(editor.options.tabSize + 1).join(' ');
		text.insert(tab, cursor.row, cursor.col);
		cursor.shift('right', 4);
	},

	// Up arrow
	'38' : function() {
		cursor.shift('up');
	},

	// Down arrow
	'40' : function() {
		cursor.shift('down');
	},

	// Left arrow
	'37' : function() {
		cursor.shift('left');
	},

	// Right arrow
	'39' : function() {
		cursor.shift('right');
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
				var input = textArea.value.split(/\n|\r/),
					overflow = text.lineSection(cursor.row, cursor.col);
					length = input.length,
					lastLineLength = input[length - 1].length,
					row = cursor.row,
					col = cursor.col;

				if (input.length > 1) {
					text.remove(-overflow.length, row, col);
					text.append(input.shift(), row);
					text.insert(input.pop() + overflow, row + 1, 0);
					text.insertLines(input, row);

					cursor.col = overflow.length + lastLineLength;
					cursor.shift('down', length - 2);
				} else {
					text.insert(textArea.value, row, col);
					cursor.shift('right', textArea.value.length);
				}

				textArea.value = '';
				canvas.render(text.source);
			}, 100);
		},

		copy : function() {
			textArea.value = selection;
			textArea.select();
			setTimeout(function() {
				textArea.value = '';
			}, 100);
		}
	}


};

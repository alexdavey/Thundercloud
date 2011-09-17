var actions = {
	
	backspace : function() {
		
	},

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

	shift : function() {
		
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

	copy : function() {
		
	},

	paste : function() {
		
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
	}

};

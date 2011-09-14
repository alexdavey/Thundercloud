var actions = {
	
	backspace : function() {
		
	},

	// Delete
	'8' : function() {
		var col = cursor.col, row = cursor.row;
		if (col <= 0) {
			if (row == 0) return;

			cursor.col = text.lineLength(row - 1);
			cursor.shift('up');

			text.append(text.source[row], row - 1);
			text.removeLine(row);
		} else {
			cursor.shift('left');
			
			text.remove(1, row, col);
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
		text.insert('\t', cursor.row, cursor.col);
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

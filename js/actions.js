var actions = {
	
	backspace : function() {
		
	},

	// Delete
	'8' : function() {
		var col = cursor.col, row = cursor.row;
		if (col <= 0) {
			if (row == 0) return;

			cursor.col = text.lineLength(row - 1);
			cursor.row--;

			text.append(text.source[row], row - 1);
			text.removeLine(row);
		} else {
			cursor.col--;
			
			text.remove(1, row, col);
		}
	},

	// Enter
	'13' : function() {
		var row = cursor.row, col = cursor.col,
			overflow = text.lineSection(row, col);

		text.addLine(row + 1, overflow);
		text.remove(-overflow.length, row, col);

		cursor.row++;
		cursor.col = 0;
	},

	tab : function() {
		
	},

	shift : function() {
		
	},

	copy : function() {
		
	},

	paste : function() {
		
	},

	arrow : {
		
		up : function() {
			cursor.row--;
		},

		down : function() {
			cursor.row++;
		},

		left : function() {
			cursor.col--;
		},

		right : function() {
			cursor.col++;
		}

	}

};

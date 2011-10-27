define(function() {
	
	"use strict";

	// var Text = function(text) {
	// 	// Split source at newlines
	// 	this.source = text.split('\n');
	// 	this.modified = true;
	// };

	/* Text.prototype */var text = {
		
		// // Concatenates source with a newline character
		// stringify : function() {
		// 	return this.source.join('\n');
		// },

		// Returns the length of any line in the source,
		// -1 if invalid row number
		lineLength : function(row) {
			if (typeof this.source[row] == 'undefined') return -1;
			return this.source[row].length;
		},
		
		// Inserts a new line with text or a blank line if
		// second parameter omitted
		addLine : function(row, text) {
			this.source.splice(row, 0, text || '');
			return this;
		},

		// Splices a line
		removeLine : function(row) {
			this.source.splice(row, 1);
			this.modified = true;
			return this;
		},

		// Splices all lines between start and end (inclusive)
		removeLines : function(start, end) {
			this.source.splice(start, (end - start) + 1);
			this.modified = true;
			return this;
		},

		// Removes a part of a line
		removeSection : function(row, col1, col2) {
			var line  = this.source[row],
				temp;

			col2 === undefined && (col2 = line.length);

			// If col1 is larger than col2, swap the positions
			if (col1 > col2) {
				temp = col1;
				col1 = col2;
				col2 = temp;
			}

			var left = line.slice(0, col1),	
				right = line.slice(col2);

			this.source[row] = left + right;

			// If everything on line was removed, delete the line
			if (this.source[row] == '') {
				this.removeLine(row);	
			}

			this.modified = true;
			return this;
		},

		// Removes all text between two points (row, col) 
		removeSelection : function(row1, col1, row2, col2) {
			var diff = row2 - row1,
				row3;

			if (diff == 0) {
				this.removeSection(row1, col1, col2);
			} else {
				// Trim the bottom line
				this.removeSection(row2, 0, col2);

				//  Remove lines in the middle
				this.removeLines(row1 + 1, row2 - 1);

				// Trim the top line
				this.removeSection(row1, col1);

				// Merge the top and bottom lines together
				// provided that the top line was not deleted
				if (col1 != 0) {
					this.merge(row1, row1 + 1);
				}
			}
			this.modified = true;
			return this;
		},

		// Appends text to the end of a string
		append : function(text, row) {
			this.source[row] += text;
			this.modified = true;
			return this;
		},

		// Returns a part of a row
		lineSection : function(row, col1, col2) {
			var temp;

			// If they are the wrong way
			// round, swap them
			if (col2 !== undefined && col1 > col2) {
				temp = col1;
				col1 = col2;
				col2 = temp;
			}
			return this.source[row].slice(col1, col2);
		},

		// Returns all lines between two rows,
		// concatenated with a newline
		selectLines : function(from, to) {
			var selection = '';

			!to && (to = from);

			while (from <= to) {
				selection += this.source[from++] + '\n';
			} 

			return selection;
		},

		// Returns all text between two points
		selection : function(row1, col1, row2, col2) {
			var area = '';
			if (row1 == row2) {
				area = this.lineSection(row1, col1, col2);
			} else {
				// Add the top line
				area += this.lineSection(row1, col1) + '\n';

				// If the lines are not adjacent, add the lines inbetween
				if (Math.abs(row2 - row1) != 1) area += this.selectLines(row1 + 1, row2 - 1);

				// Add the bottom line
				area += this.lineSection(row2, 0, col2);
			}
			return area;
		},

		// Inserts an array of lines at a given row
		insertLines : function(items, row) {
			items = _.compact(items);
			items.unshift(row, 0);
			[].splice.apply(this.source, items);
			this.modified = true;
			return this;
		},

		// Inserts text at a given point (row, col)
		insert : function(text, row, col) {
			if (this.source[row] === undefined) {
				this.addLine(row);
			} else {
				var parts = _.splitText(this.source[row], col);
				this.source[row] = parts.left + text + parts.right;
			}
			this.modified = true;
			return this;
		},

		// Removes n characters before a point, removing 
		// characters after if negative
		remove : function(items, row, col) {
			var string = this.source[row];

			if (items === 0) return this;

			// If negative remove characters after
			if (items <= -1) {
				col *= -1;
				this.source[row] = string.slice(0, col) + string.slice(col + 1);
			} else {
				this.source[row] = string.slice(0, col - 1) + string.slice(col);
			}

			this.modified = true;
			return this;
		},

		merge : function(row1, row2) {
			while (row2 > row1) {
				this.append(this.source[row2], row2 - 1);
				this.removeLine(row2);
				row2--;
			}
		},

		modified : true

	};

	return text;

});

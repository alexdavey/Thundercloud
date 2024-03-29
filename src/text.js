define('text', ['events'], function(events) {
	
	"use strict";


	var text = {
		
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
			this.onChange();
			return this;
		},

		// Splices a line
		removeLine : function(row) {
			this.source.splice(row, 1);
			this.onChange();
			return this;
		},

		// Splices all lines between start and end (inclusive)
		removeLines : function(start, end) {
			this.source.splice(start, (end - start) + 1);
			// An empty array causes errors in other text manipulation
			// functions such as insert
			if (_.isEmpty(this.source)) this.source = [''];
			this.onChange();
			return this;
		},

		// Removes a part of a line
		removeSection : function(row, col1, col2) {
			var line  = this.source[row],
				temp;

			if (col2 === undefined) col2 = line.length;

			// If col1 is larger than col2, swap the positions
			if (col1 > col2) {
				temp = col1;
				col1 = col2;
				col2 = temp;
			}

			var left = line.slice(0, col1),	
				right = line.slice(col2);

			this.source[row] = left + right;

			this.onChange();
			return this;
		},

		// Removes all text between two points (row, col) 
		removeSelection : function(row1, col1, row2, col2) {
			var temp;

			// If the selection is backwards, reverse it
			if (row1 > row2 || col1 > col2) {
				temp = { col : col1, row : row1 };

				row1 = row2;
				col1 = col2;

				row2 = temp.row;
				col2 = temp.col;
			}

			// Proxy to removeSection if the start and end
			// are on the same line
			if (row1 == row2) {
				this.removeSection(row1, col1, col2);
			} else {
				// Trim the bottom line
				this.removeSection(row2, 0, col2);

				//  Remove lines in the middle
				this.removeLines(row1 + 1, row2 - 1);

				// Trim the top line
				this.removeSection(row1, col1);

				// Merge the top and bottom lines together
				this.merge(row1, row1 + 1);

			}
			this.onChange();
			return this;
		},

		// Appends text to the end of a string
		append : function(text, row) {
			this.source[row] += text;
			this.onChange();
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
			items.unshift(row, 0);
			[].splice.apply(this.source, items);
			this.onChange();
			return this;
		},

		// Inserts text at a given point (row, col)
		insert : function(text, row, col) {
			if (this.source[row] === undefined) {
				this.addLine(row, text);
			} else {
				var parts = _.splitText(this.source[row], col);
				this.source[row] = parts.left + text + parts.right;
			}
			this.onChange();
			return this;
		},

		characterBefore : function(row, col) {
			return this.source[row].charAt(col - 1);
		},

		characterAfter : function(row, col) {
			return this.source[row].charAt(col + 1);
		},

		// Removes n characters before a point, removing 
		// characters after if negative
		remove : function(items, row, col) {
			return this.removeSection(row, col, col - items);
		},

		merge : function(row1, row2) {
			while (row2 > row1) {
				this.append(this.source[row2], row2 - 1);
				this.removeLine(row2);
				row2--;
			}
		},

		onChange : function() {
			this.modified = true;
			events.publish('text.change');
		},

		modified : true

	};

	return text;

});

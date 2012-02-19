define('selection', ['cursor'], function(Cursor) {
	
	"use strict";

	var selection = {
		
		isEmpty : function() {
			var start = this.start,
				end = this.end;

			// Check that none of the values are null, and the start position
			// does not equal the end position
			return (start.col === end.col && start.row === end.row) ||
				   (start.col === null    || start.row === null &&
					end.col   === null    || end.row   === null);
		},

		clear : function() {
			this.start = { col : null, row : null };
			this.end   = { col : null, row : null };
		},

		setStart : function(row, col) {
			this.start.col = col || Cursor.col;
			this.start.row = row || Cursor.row;
		},

		setEnd : function(row, col) {
			this.end.col = col || Cursor.col;
			this.end.row = row || Cursor.row;
		},

		normalize : function() {
			var start = this.start,
				end = this.end;

			// If selecting backwards (on the same line), reverse columns
			if (start.row == end.row && start.col > end.col) {
				return {
					start : { row : start.row, col : end.col},
					end   : { row : end.row,   col : start.col }
				};
			}

			// If selecting upwards, reverse rows
			if (start.row > end.row) {
				return {
					start : this.end,
					end : this.start
				};
			}

			// Otherwise return the points unaltered
			return {
				start : this.start,
				end : this.end
			};
		}

	};

	selection.clear();
	
	return selection;

});

define(['cursor'], function(Cursor) {
	
	"use strict";

	var selection = {
		
		isEmpty : function() {
			var start = this.start, end = this.end;
			return start.col == end.col && start.row == end.row;
		},

		clear : function() {
			this.setStart();
			this.setEnd();
		},

		setStart : function() {
			this.start.col = Cursor.col;
			this.start.row = Cursor.row;
		},

		setEnd : function() {
			this.end.col = Cursor.col;
			this.end.row = Cursor.row;
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
		},

		start : {
			col : 0,
			row : 0
		},

		end : {
			col : 0,
			row : 0
		}

	};
	
	return selection;

});

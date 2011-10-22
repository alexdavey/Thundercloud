"use strict";

IDE.Text = (function() {

	var Text = function(text) {
		this.source = text.split('\n');
	};

	Text.prototype = {
		
		stringify : function() {
			return this.source.join('\n');
		},

		lineLength : function(row) {
			if (typeof this.source[row] == 'undefined') return -1;
			return this.source[row].length;
		},
		
		addLine : function(row, text) {
			this.source.splice(row, 0, text || '');
			return this;
		},

		removeLine : function(row) {
			this.source.splice(row, 1);
			return this;
		},

		removeLines : function(start, end) {
			this.source.splice(start, end - start);
			return this;
		},

		removeSection : function(row, col1, col2) {
			var line  = this.source[row],

			col2 = col2 || line.length;

			var left  = _.splitText(line, col1).left,
				right = _.splitText(line, col2).right;

			this.source[row] = left + right;
			return this;
		},

		removeSelection : function(row1, col1, row2, col2) {
			if (row1 == row2) {
				this.removeSection(row1, col1, col2);
			} else {
				this.removeLines(row1 + 1, row2 - 1)
					.removeSection(row1, col1)
					.removeSection(row2, 0, col2);
			}
			return this;
		},

		append : function(text, row) {
			this.source[row] += text;
			return this;
		},

		lineSection : function(row, col1, col2) {
			return this.source[row].slice(col1, col2 || undefined);
		},

		selectLines : function(from, to) {
			to = to || from;
			var selection = '';

			while (from <= to) {
				selection += this.source[from++] + '\n';
			} 

			return selection;
		},

		selection : function(row1, col1, row2, col2) {
			var area = '';
			if (row1 == row2) {
				area = this.lineSection(row1, col1, col2);
			} else {
				area += this.lineSection(row1, col1);
				area += this.selectLines(row1 + 1, row2 - 1);
				area += this.lineSection(row2, 0, col2);
			}
			return area;
		},

		insertLines : function(items, row) {
			items.unshift(row, 0);
			[].splice.apply(this.source, items);
			return this;
		},

		insert : function(text, row, col) {
			if (this.source[row] === undefined) {
				this.addLine(row);
			} else {
				var parts = _.splitText(this.source[row], col);
				this.source[row] = parts.left + text + parts.right;
			}
			return this;
		},

		remove : function(items, row, col) {
			var parts = _.splitText(this.source[row], col);

			if (items < 0) {
				this.source[row] = parts.left + parts.right.slice(items * -1);
			} else {
				this.source[row] = 
					parts.left.slice(0, parts.left.length - items) + parts.right;
			}
			return this;
		}
	};

	return Text;

})();
function split(text, pos) {
	return {
		left : text.slice(0, pos),
		right : text.slice(pos)
	};
}

var text = {

	parse : function(text) {
		this.source = text.split('\n');
	},

	stringify : function() {
		return this.source.join('\n');
	},

	lineLength : function(row) {
		return this.source[row].length;
	},
	
	addLine : function(row, text) {
		this.source.splice(row, 0, text || '');
	},

	removeLine : function(row) {
		this.source.splice(row, 1);
	},

	append : function(text, row) {
		this.source[row] += text;
	},

	lineSection : function(row, col1, col2) {
		return this.source[row].slice(col1, col2 || undefined);
	},

	selectLines : function(from, to) {
		to = to || from;
		var selection = '';
		while (from < to) {
			selection += this.source[from++] + '\n';
		} 
		return selection;
	},

	selection : function(row1, col1, row2, col2) {
		var selection = this.lineSelection(row1, col1);
		selection += selectLines(row1 + 1, row2 - 1);
		selection += this.lineSelection(row2, 0, col2);
		return selection;
	},

	insert : function(text, row, col) {
		var parts = split(this.source[row], col);
		this.source[row] = parts.left + text + parts.right;
	},

	remove : function(items, row, col) {
		var parts = split(this.source[row], col);

		if (items < 0) {
			this.source[row] = parts.left + parts.right.slice(items * -1);
		} else {
			this.source[row] = parts.left.slice(0, parts.left.length - items) + parts.right;
		}
	}

};

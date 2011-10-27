define (['syntax/parser'], function(Syntax) {

	var tokens = {
		space : /\s+/,

		openTag : /\</,
		closeTag : /\>/,
		closingTag : /\/\>/,

		singleQuote : /\'/,
		doubleQuote : /\"/,

		commentEnd : /\-\-\>/,
		commentStart : /\<\!\-\-/
	};

	var triggers = {
		openTag : function(states) {
			var last = _.last(states);
			if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			} else if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			}
			states.push('tagBody');
			return 'openTag';
		},

		closeTag : function(states) {
			var last = _.last(states);
			if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			} else if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			}
			states.push('text');
			return 'closeTag';
		},

		text : function(states) {
			var last = _.last(states);
			if (last == 'tagBody') {
				states.push('attribute');
				return 'tagBody';
			} else if (last == 'attribute') {
				return 'attribute';
			} else if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			} else if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			}
		},

		commentStart : function(states) {
			var last = _.last(states);
			if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			} else if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			} else {
				states.push('comment');
				return 'comment';
			}
		},

		commentEnd : function(states) {
			var last = _.last(states);
			if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			} else if (last == 'singleQuotedString') {
				states.push('singleQuotedString');
				return 'singleQuotedString';
			} else if (last == 'comment') {
				states.push('text');
				return 'comment';
			}
		},

		singleQuote : function(states) {
			if (_.last(states) == 'singleQuotedString') {
				states.push(_.atIndex(states, 1));
				return 'singleQuotedString';
			}

			if (_.atIndex(states, 1) == 'backslash') {
				return 'singleQuotedString';
			}

			states.push('singleQuotedString');
			return 'singleQuotedString';
		},

		doubleQuote : function(states) {
			if (_.last(states) == 'doubleQuotedString') {
				states.push(_.atIndex(states, 1));
				return 'doubleQuotedString';
			}
			if (_.atIndex(states, 1) == 'backslash') {
				return 'doubleQuotedString';
			}

			states.push('doubleQuotedString');
			return 'doubleQuotedString';
		}
	}

	return new Syntax.Highlighter(tokens, triggers);

});


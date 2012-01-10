define (['syntax/parser'], function(Syntax) {

	var tokens = {
		space : /\s+/,
		tab : /\t/,

		number : /[0-9]+/,
		syntax : /[\{\}\[\]]|function/,

		singleQuote : /\'/,
		doubleQuote : /\"/,

		// comment : /\/\*/,

		commentEnd : /\/\*/,
		commentStart : /\*\//,

		keyword : /^(if|else|return|break|continue|for|while|do|in|new|var)$/
	};

	var triggers = {
		keyword : function(states) {
			var last = _.last(states);
			if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			}
			if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			}
			states.push('keyword');
			return 'keyword';
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

		number : function(states) {
			var last = _.last(states);
			if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			}
			if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			}
			states.push('number');
			return 'number';
		},

		syntax : function(states) {
			var last = _.last(states);
			if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			}
			if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			}
			states.push('syntax');
			return 'number';
		},

		commentStart : function(states) {
			var last = _.last(states);
			if (last == 'singleQuotedString') {
				return 'singleQuotedString';
			}
			if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			}
			states.push('comment');
			return 'comment';
		},

		commentEnd : function(states) {
			var last = _.last(states);
			if (last == 'doubleQuotedString') {
				return 'doubleQuotedString';
			}
			if (last == 'singleQuotedString') {
				states.push('singleQuotedString');
				return 'singleQuotedString';
			}
			if (last == 'comment') {
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

define (['syntax/parser'], function(Syntax) {

	var precedence = [	'singleQuote',
						'doubleQuote',
						'commentStart',
						'commentEnd',
						'comment'
	];

	var tokens = {
		space : /\s+/,
		tab : /\t/,

		openTag : /\</,
		closeTag : /\>/,
		closingTag : /\/\>/,

		singleQuote : /\'/,
		doubleQuote : /\"/,

		commentStart : /\!\-\-/,
		commentEnd : /\-\-/
	};

	var triggers = {
		openTag : function(states) {
			var last = _.last(states);
			states.push('tagBody');
			return 'openTag';
		},

		closeTag : function(states) {
			var last = _.last(states);
			if (last == 'commentEnd') {
				states.push(_.atIndex(1));
				return 'comment';
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
			}
		},

		commentStart : function(states) {
			var last = _.last(states);
			if (last == 'tagBody') {
				states.push('commentEnd');
				return 'comment';
			}
		},

		commentEnd : function(states) {
			var last = _.last(states);
				states.push(_.atIndex(states, 1));
				return 'comment';
		},

		singleQuote : function(states) {
			if (_.last(states) == 'singleQuote') {
				states.push(_.atIndex(states, 1));
				return 'singleQuotedString';
			}

			if (_.atIndex(states, 1) == 'backslash') {
				return 'singleQuotedString';
			}

			states.push('singleQuote');
			return 'singleQuotedString';
		},

		doubleQuote : function(states) {
			if (_.last(states) == 'doubleQuote') {
				states.push(_.atIndex(states, 1));
				return 'doubleQuotedString';
			}
			if (_.atIndex(states, 1) == 'backslash') {
				return 'doubleQuotedString';
			}

			states.push('doubleQuote');
			return 'doubleQuotedString';
		}
	}

	return new Syntax.Highlighter(tokens, triggers, precedence);

});

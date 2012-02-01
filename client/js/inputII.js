define('inputII', function() {
	
	// Functions bound to single events
	var bindings = [],

	// Functions bound to multiple key combinations
		combinations = [],
	
	// Currently pressed keys
		flags    = {},
	
	// Textarea element used to capture printable keystrokes
		textArea = document.createElement('textArea');
	
	document.body.appendChild(textArea);

	// Utility
	// -------
	
	function areActive(states) {
		for (var i = 0, l = states.length; i < l; ++i) {
			if (!flags[i]) return false;
		}
		return true;
	}

	function addBinding(keyCodes, fn) {
		if (_.isString(keyCodes)) {
			bindings[keyCodes] || (bindings[keyCodes] = []);
			bindings[keyCodes].push(fn);
		} else {
			bindings.push(fn);
		}
	}

	function removeBinding(name, fn) {
		var binding = bindings[name];
		if (!binding) return;
		binding = _.without(binding, fn);
	}

	function fireBindings(name, e) {
		if (_.isString(name)) {
			if (name in bindings) invokeAll(bindings[name], e);
		} else {
			fireActive(name);
		}
	}

	function fireActive(e) {
		var binding;
		for (var i = 0, l = bindings.length; i < l; ++i) {
			binding = bindings[i];
			if (areActive(binding[0])) {
				bindings[1](e);
			}
		}
	}

	// Invoke all of the elements in an array 
	// with a certain value
	function invokeAll(array, value) {
		for (var i = 0, l = array.length; i < l; ++i) {
			array[i](value);
		}
	}

	// Parse a string of '+' delimited keys into
	// an array of integer key codes
	function toKeyCodes(string) {
		var keys = string.split('+');

		keys = _.map(keys, function(key) {
			key = _.trim(key);
			return aliases[key] || key.charCodeAt(0);
		});

		return keys;
	}

	// Sort the key codes in ascending order
	function sortKeyCodes(keyCodes) {
		return _.sortBy(keyCodes, function(x) { return x });
	}

	function addFlag(flag) {
		flags[flag] = true;
	}

	function removeFlag(flag) {
		delete flags[flag];
	}

	// Check the hidden textArea for printable characters
	function getKeyInput(callback) {
		textArea.focus();
		setTimeout(function() {
			callback(textArea.value || null);
			textArea.value = '';
		}, 10);
	}
	
	function textInput(e, character) {
		var keyCode = e.which || e.charCode || e.keyCode,
			code = character ? character.charCodeAt(0) : keyCode,
			extended = _.extend(e, { which : code }),
			extras;

		addFlag(code);

		// If a character is given, fire the 'printable' event
		if (character) {

			// If multiple characters where caught, fire the
			// events multiple times
			if (character.length > 1) {
				extras = _.tail(character.split(''));
				_.each(extras, _.bind(textInput, null, e));
				character = character.slice(0, 1);
			}

			fireBindings('printable', _.extend(extended, {
				character : character
			}));

		} else {

			fireBindings('meta', extended);

		}

		fireBindings('keypress', extended);
	}

	// Human readable synonyms to the key codes
	var aliases = {

		backspace : 8,  '⌫' : 8,
		tab       : 9,  '⇥' : 9,
		'return'  : 13, '↩' : 13,
		pause     : 19,

		'caps-lock' : 20, '⇪' : 20,
		'escape'    : 27, '⎋' : 27,

		shift : 16, '⇧' : 16,
		ctrl  : 17, '^' : 17,
		alt   : 18, '⌥' : 18,

		space : 32, '␣' : 32,
		
		up    : 38, '↑' : 38,
		left  : 37, '←' : 37,
		right : 39, '→' : 39,
		down  : 40, '↓' : 40,

		insert   : 45, 
		delete   : 45, '⌫' : 45,
		command  : 91, '⌘' : 91,

		asterisk : 106, '*' : 106,
		plus     : 107, '+' : 107,
		minus    : 109, '-' : 109,
		equals   : 187, '=' : 187,
		comma    : 188, ',' : 188

	};


	// Internal event handlers
	// -----------------------
	
	// Event handlers perform internal administration
	// before firing any event handlers listening
	// to that event
	var handlers = {
		

		onMouseDown : function(e) {
			addFlag('mousedown');
			fireBindings('mouseDown');
		},

		onMouseMove : function(e) {
			if (flags['mousedown']) fireBindings('drag');
			fireBindings('mousemove');
		},

		onMouseUp : function(e) {
			removeFlag('mousedown');
			fireBindings('mouseup');
		},

		onKeyPress : function(e, character) {
			getKeyInput(_.bind(textInput, null, e));
		},

		onKeyDown : function(e) {
			var code = e.which || e.charCode || e.keyCode;
			console.log('keydown:', code);
			addFlag(code);
			fireBindings('keydown', _.extend(e, {
				which : code
			}));
		},

		onKeyUp : function(e) {
			var code = e.which || e.charCode || e.keyCode;
			console.log('keypress:', code);
			if (!code in flags) throw Error('Invalid flag');
			removeFlag(code);
			fireBindings('keyup', _.extend(e, {
				which : code
			}));
		},

		onScrollFF : function(e) {
			fireBindings('scroll', _.extend(e, {
				delta : -e.detail / 3
			}));
		},

		onScroll : function(e) {
			fireBindings('scroll', _.extend(e, {
				delta : e.wheelDelta / 120
			}));
		}


	};


	// Internal event listeners
	// ------------------------
	
	var events = {

		'mousedown': handlers.onMouseDown,
		'mousemove': handlers.onMouseMove,
		'mouseup'  : handlers.onMouseUp,
	
		'keypress' : handlers.onKeyPress,
		'keydown'  : handlers.onKeyDown,
		'keyup'    : handlers.onKeyUp,
									
		'DOMMouseScroll' : handlers.onScrollFF,
		'mousewheel'     : handlers.onScroll

	};
	

	// Interface
	// ---------
	
	// List of events that will be automatically
	// added to the interface
	var namedEvents = ['printable', 'control', 'mousemove', 'mousedown',
					   'mouseup', 'click', 'doubleClick', 'tripleClick',
					   'drag', 'scroll'];
	
	var input = {

		// Check to see id an array of keys are currently
		// being pressed
		is : _.compose(areActive, toKeyCodes),

		bind : function(codes, fn) {
			bindings.push([toKeyCodes(codes), fn]);
		},

		unbind : function(fn) {
			for (var i = 0, l = bindings.length; i < l; ++i) {
				if (bindings[i][1] === fn) {
					bindings.splice(i, 1);
					return;
				}
			}
		},

		setClipboard : function(string) {
			textArea.value = string;
		}

	};

	// Add all of the named events to the interface
	_.each(namedEvents, function(name) {
		input[name] = _.bind(addBinding, null, name);
	});


	// Attach all of the event listeners needed
	_.each(events, function(fn, name) {
		_.listen(name, function(e) {
			fn(e || window.e);
		});
	});

	return input;

});
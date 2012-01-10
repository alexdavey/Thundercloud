define('inputII', function() {
	
	// Functions bound to single events
	var bindings = [],

	// Functions bound to multiple key combinations
		combinations = [],
	
	// Currently pressed keys
		flags    = {},
	
	// Textarea element used to capture printable keystrokes
		textArea = _.createElement({ type : 'textArea' });


	// Utility
	// -------
	
	function areActive(states) {
		for (var i = 0, l = states.length; i < l; ++i) {
			if (!flags[i]) return false;
		}
		return true;
	}

	function addBinding(keyCodes, fn) {
		if (!bindings[name]) bindings[name] = [];
		bindings[name].push(fn);
	}

	function removeBinding(name, fn) {
		var binding = bindings[name];
		if (!binding) return;
		binding = _.without(binding, fn);
	}

	function fireBindings(name, e) {
		if (_.isString(name)) {
			invokeAll(bindings[name], e);
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

		_.map(keys, function(key) {
			key = _.trim(key);
			return aliases[key] || key.charCodeAt(0);
		});

		return keys;
	}

	// Sort the key codes in ascending order
	function sortKeyCodes(keyCodes) {
		return _.sortBy(keyCodes, function(x) { return x });
	}

	// // Check to see if the current key combination is bound 
	// // to an array of key codes
	// function checkKeyCombinations(keyCodes) {
	// 	for (var i = 0, l = keyCodes.length; i < l; ++i) {
	// 		if (!keycodes[i] in flags) return false;
	// 	}
	// 	return true;
	// }

	function addFlag(flag) {
		flags[flag] = true;
	}

	function removeFlag(flag) {
		delete flags[flag];
	}

	// Check the hidden textArea for printable characters
	function getKeyInput() {
		setTimeout(function() {
			return textArea.value || null;
		}, 10);
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


	// Internal event listeners
	// ------------------------
	
	var events = {

		'mousedown': onMouseDown,
		'mousemove': onMouseMove,
		'mouseup'  : onMouseUp,
	
		'keypress' : onKeyPress,
		'keydown'  : onKeyDown,
		'keyup'    : onKeyUp,
									
		'DOMMouseScroll' : onScrollFF,
		'mousewheel'     : onScroll

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
		}

		onMouseMove : function(e) {
			fireBindings('mousemove');
		}

		onMouseUp : function(e) {
			removeFlag('mousedown');
			fireBindings('mouseup');
		}

		onKeyPress : function(e) {
			var keyCode = e.charCode == null ? e.keyCode : e.charCode;

			getKeyInput(function(character) {
				var code = character ? character.charCodeAt(0) : keyCode,
					extended = _.extend(e, { which : code });

				addFlag(code);

				if (character) {

					fireBindings('printable', _.extend(extended, {
						character : character
					}));

				} else {

					fireBindings('meta', extended);

				}

				fireBindings('keypress', extended);
			});

		}

		onKeyDown : function(keycode) {
			var code = e.charCode == null ? e.keyCode : e.charCode;
			addFlag(code);
			fireBindings('keydown', _.extend(e, {
				which : code
			}));
		}

		onKeyUp : function(keycode) {
			var code = e.charCode == null ? e.keyCode : e.charCode;
			removeFlag(code);
			fireBindings('keyup', _.extend(e, {
				which : code
			}));
		}

		onScrollFF function(e) {
			fireBindings('scroll', _.extend(e, {
				delta : -e.detail / 3
			}));
		}

		onScroll : function(e) {
			fireBindings('scroll', _.extend(e, {
				delta : e.wheelDelta / 120
			}));
		}


	};
	


	// Interface
	// ---------
	
	var input = {

		// Check to see id an array of keys are currently
		// being pressed
		is : _.compose(areActive, toKeyCodes);

		bind : function(codes, fn) {
			bindings.push(toKeyCodes(codes));
		},

		unbind : function(fn) {
			for (var i = 0, l = bindings.length; ++i) {
				if (bindings[i][1] === fn) {
					bindings.splice(i, 1);
					return;
				}
			}
		},

		printable : function(fn) {
			
		},

		control : function(fn) {
			
		},

		mouseDown : function(fn) {
			
		},

		mouseUp : function(fn) {
			
		},

		click : function(fn) {
			
		},

		drag : function(fn) {
			
		},

		scroll : function(fn) {
			
		},

		setClipboard : function(string) {
			textArea.value = string;
		}

	};


	// Attach all of the event listeners needed
	_.each(events, function(fn, name) {
		_.listen(name, function(e) {
			fn(e || window.e);
		});
	});

	return input;

});

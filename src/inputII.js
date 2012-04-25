define('inputII', ['trie'], function(Trie) {

	"use strict";
	
	// Functions bound to single events
	var Bindings = new Trie,

	// Currently pressed keys
		flags    = {},
	
	// Textarea element used to capture printable keystrokes
		textArea = document.createElement('textArea');
	
	document.body.appendChild(textArea);

	window.Bindings = Bindings;


	// Utility
	// -------
	
	function removeBinding(name, fn) {
		var functions = Bindings.has(name);
		functions = _.without(functions, fn);
	}

	// Fire all bindings with a given name
	function fireBindings(name, e, extended) {
		var binding = Bindings.has([name]);
		if (extended) e = _.extend(e, extended);
		if (binding) invokeAll(binding, e);
	}

	// Fire all active flags with the event object e
	function fireActive(e) {
		var active = _.keys(_.withoutObj(flags, false));
		invokeAll(Bindings.keyFilter(active), e);
	}

	// function cancelEvent(e) {
	// 	e.stopPropagation();
	// 	e.preventDefault();
	// }

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
			return aliases[key] || (key.length > 1 ? key : key.charCodeAt(0));
		});

		return keys;
	}

	// Sort the key codes in ascending order
	function sortKeyCodes(keyCodes) {
		return _(keyCodes).sort();
	}

	function addFlag(flag, e) {
		flags[flag] = true;
		fireActive(e || undefined);
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
			textArea.blur();
		}, 10);
	}
	
	function textInput(e, character) {
		var keyCode = e.which || e.charCode || e.keyCode,
			code = character ? character.charCodeAt(0) : keyCode,
			extended = _.extend(e, { which : code }),
			extras;

		// addFlag(/* code */keyCode, e);

		// If a character is given, fire the 'printable' event
		if (character) {

			// If multiple characters where caught, fire the
			// events multiple times
			if (character.length > 1) {
				extras = _.tail(character.split(''));
				_.each(extras, _.bind(textInput, null, e));
				character = character.slice(0, 1);
			}

			fireBindings('printable', extended, { character : character });

		} else {

			fireBindings('meta', extended);

		}

		fireBindings('keypress', extended);
	}

	// Human readable aliases to the key codes
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

		// insert   : 45, TODO: find correct keycode
		delete   : 45, /* '⌫' : 45, */ // TODO: Same here
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
	// before firing any functions subscribed to that event
	var handlers = {

		onMouseDown : function(e) {
			addFlag('mouseDown', e);
			fireBindings('mouseDown', e);
		},

		onMouseMove : function(e) {
			if (flags.mouseDown) fireBindings('drag', e);
			fireBindings('mouseMove', e);
		},

		onMouseUp : function(e) {
			removeFlag('mouseDown');
			fireBindings('mouseUp');
		},

		onKeyPress : function(e, character) {
			getKeyInput(_.bind(textInput, null, e));
		},

		onKeyDown : function(e) {
			var code = e.which || e.charCode || e.keyCode;
			// Tabs need special treatment
			if (code !== 9) getKeyInput(_.bind(textInput, null, e));
			addFlag(code, e);
			fireBindings('keyDown', e, { which : code });
		},

		onKeyUp : function(e) {
			var code = e.which || e.charCode || e.keyCode;
			// if (!(code in flags)) throw Error('Invalid flag');
			removeFlag(code);
			fireBindings('keyUp', e, { which : code });
		},

		onScrollFF : function(e) {
			fireBindings('scroll', e, { delta : -e.detail / 3 });
		},

		onScroll : function(e) {
			fireBindings('scroll', e, { delta : e.wheelDelta / 120 });
		}


	};


	// Internal event listeners
	// ------------------------
	
	var events = {

		'mouseDown': handlers.onMouseDown,
		'mouseMove': handlers.onMouseMove,
		'mouseUp'  : handlers.onMouseUp,
	
		'keyPress' : handlers.onKeyPress,
		'keyDown'  : handlers.onKeyDown,
		'keyUp'    : handlers.onKeyUp,
									
		'DOMMouseScroll' : handlers.onScrollFF,
		'mouseWheel'     : handlers.onScroll

	};
	

	// Interface
	// ---------
	
	// List of events that will be automatically
	// added to the interface
	var namedEvents = ['printable', 'control', 'mouseMove', 'mouseDown',
					   'mouseUp', 'click', 'doubleClick', 'tripleClick',
					   'drag', 'scroll', 'meta'];
	
	var input = {

		// Check to see id an array of keys are currently
		// being pressed
		is : function(keys) {
			var codes = toKeyCodes(keys);
			return _.all(codes, function(code) {
				return code in flags;
			});
		},

		bind : function(codes, fn) {
			Bindings.pushList(toKeyCodes(codes), fn);
			return fn;
		},

		unbind : function(paths, fn) {
			var bindings = Bindings.has(paths);
			bindings = bindings && _.without(bindings, fn);
		},

		setClipboard : function(string) {
			textArea.value = string;
		}

	};

	// Add all of the named events to the interface
	_.each(namedEvents, function(name) {
		input[name] = function(fn) {
			Bindings.pushList([name], fn);
			return fn;
		}
	});

	// Attach all of the event listeners needed
	_.each(events, function(fn, name) {
		_.listen(name.toLowerCase(), function(e) {
			fn(e || window.e);
		});
	});

	return input;

});

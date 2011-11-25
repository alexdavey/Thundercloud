define(function() {

	var keymap = {
		 8   : 'backspace', 		9 : 'tab',
		 13  : 'enter', 			16  : 'shift',
		 17  : 'ctrl', 				18  : 'alt',
		 19  : 'pause/break', 		20  : 'caps lock',
		 27  : 'escape', 			33  : 'page up',
		 34  : 'page down', 		35  : 'end',
		 36  : 'home', 				37  : 'left arrow',
		 38  : 'up arrow', 			39  : 'right arrow',
		 40  : 'down arrow', 		45  : 'insert',
		 46  : 'delete', 			48  : '0',
		 49  : '1', 				50  : '2',
		 51  : '3', 				52  : '4',
		 53  : '5',					54  : '6',
		 55  : '7',					56  : '8',
		 57  : '9',					65  : 'a',
		 66  : 'b',					67  : 'c',
		 68  : 'd',					69  : 'e',
		 70  : 'f',					71  : 'g',
		 72  : 'h',					73  : 'i',
		 74  : 'j',					75  : 'k',
		 76  : 'l',					77  : 'm',
		 78  : 'n',					79  : 'o',
		 80  : 'p',					81  : 'q',
		 82  : 'r',					83  : 's',
		 84  : 't',					85  : 'u',
		 86  : 'v',					87  : 'w',
		 88  : 'x',					89  : 'y',
		 90  : 'z',					91  : 'left window key',
		 92  : 'right window key', 	93  : 'select key',
		 96  : 'numpad 0', 			97  : 'numpad 1',
		 98  : 'numpad 2', 			99  : 'numpad 3',
		 100 : 'numpad 4',			101 : 'numpad 5',
		 102 : 'numpad 6',			103 : 'numpad 7',
		 104 : 'numpad 8',			105 : 'numpad 9',
		 106 : 'multiply',			107 : 'add',
		 109 : 'subtract',			110 : 'decimal point',
		 111 : 'divide', 			112 : 'f1',
		 113 : 'f2',				114 : 'f3',
		 115 : 'f4',				116 : 'f5',
		 117 : 'f6',				118 : 'f7',
		 119 : 'f8',				120 : 'f9',
		 121 : 'f10',				122 : 'f11',
		 123 : 'f12',				144 : 'num lock',
		 145 : 'scroll lock',		186 : 'semi-colon',
		 187 : 'equal sign',		188 : 'comma',
		 189 : 'dash',				190 : 'period',
		 191 : 'forward slash',		219 : 'open bracket',	
		 220 : 'back slash', 		221 : 'close braket',
		 222 : 'single quote'
	};

	// User subscribed events are stored in
	// the events object
	var events = {
		drag : [],
		drop : [],
		mouseMove : [],
		mouseDown : [],
		keyPress : [],
		keyDown : [],
		keyUp : []
	};

	var flags = [],
		mouseDown = false;

	var handlers = {

		keyDown : function(e) {
			e || (e = window.e);
			flags[e.keyCode] = 1;
			fire('keydown');
			fire(e);
		},

		keyUp : function(e) {
			e || (e = window.e);
			flags[e.keyCode] = 0;
			fire('keyup', e);
			fire(e);
		},

		keyPress : function(e) {
			e || (e = window.e);
			flags[e.keyCode] = 0;
			fire('keypress');
			fire(e);
		},

		mouseDown : function(e) {
			e || (e = window.e)
			mouseDown = true;
			fire('mouseDown', e);
		},

		mouseUp : function(e) {
			e || (e = window.e);
			mouseDown = false;
			fire('mouseup', e);
		},

		mouseMove : function(e) {
			e || (e = window.e);
			if (mouseDown) {
				fire('drag', e);
			}
		}
		
	};

	_.each(handlers, _.bind(_.listen, _, document));

	function indexOf(obj, value) {
		for (var i in obj) {
			if (obj[i] === value && obj.hasOwnProperty(i)) {
				return i;
			}
		}
	}

	function isRegistered(events) {
		var currentState = !events;
		if (currentState) {
			
		}
	}
	
	var combo = {

		on : function(keyCombo, fn) {
			var keys = keyCombo.split('+');
			_.map(keys, _.trim);
			
		},

		fire : function(name, e) {
			if (arguments.length < 2) {
				
			} else {
				var handlers = actions[name];
				if (handlers !== undefined) {
					for (var i = 0, l = handlers; ++i) {
						handlers[i](e);
					}
				}
			}
		},

		drag : function(fn) {
			actions.drag.push(fn);
		},

		drop : function(fn) {
			actions.drop.push(fn);
		}

	};


	return combo;

});

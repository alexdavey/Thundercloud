define(['events', 'canvas'], function(events) {

	"use strict";

	var objects = [],
		states  = [],
		active  = 0;

	// Return an object without the static members (functions)
	function withoutFunctions(obj) {
		var clone = _.deepClone(obj);
		
		for (var i in clone) {
			if (clone.hasOwnProperty(i) && _.isFunction(clone[i])) {
				delete clone[i];
			}
		}

		return clone;
	}

	// Changes the active (current) history state
	// based on the "delta". Positive values are
	// more recent snapshots
	function setActive(delta) {
		if (states[active + delta] !== undefined) {
			active += delta;
		} else {
			if (delta < 0) {
				active = 0;
			} else if (delta > 0) {
				active = states.length - 1;
			}
		}
	}
	
	var history = {
		
		// Add an object reference to the internal list
		// of watched objects, so any calls to history.save
		// will include a snapshot of the object
		watch : function(obj) {
			objects.push(obj);
		},

		// Copies all objects to the internal stack, so they
		// can be restored later
		save : function() {
			var state = [];

			for (var i = 0, l = objects.length; i < l; ++i) {
				// Copy all of the properties on the object that are
				// not functions (functions are assumed to be static)
				state.push(withoutFunctions(objects[i]));
			}

			states.push(state);
			active = states.length - 1;
		},

		// Returns the nth state after (if delta is positive) 
		// the active state
		restore : function(delta) {
			setActive(delta);
			var activeState = states[active];

			console.dir(activeState);

			// Restore all of the objects
			for (var i = 0, l = activeState.length; i < l; ++i) {
				_.merge(objects[i], activeState[i]);
			}
		},

		// Restore the previous state
		undo : function() {
			this.restore(-1);
		},

		// Restore the next state
		redo : function() {
			this.restore(1);
		}

	};

	return history;

});

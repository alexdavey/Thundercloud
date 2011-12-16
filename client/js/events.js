define('events', function() {

	"use strict";

	var subscribers = {};

	function notifyAll(evt, info) {
		var subs, sub;
		if (evt in subscribers) {
			subs = subscribers[evt];
			// Loop over all of the subscribers for that event
			for (var i = 0, l = subs.length; i < l; ++i) {
				subs[i].call(info);
			}
		}
	}
	
	var events = {
		
		subscribe : function(evt, fn, context) {
			var callback = _.bind(fn, context);
			if (evt in subscribers) {
				subscribers[evt].push(callback);
			} else {
				subscribers[evt] = [callback];
			}
		},

		publish : function(evt, info) {
			notifyAll(evt, info);
			notifyAll('*', info);
		},

		unsubscribe : function() {
			
		}

	};

	return events;

});

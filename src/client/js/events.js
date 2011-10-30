define(function() {

	"use strict";

	var subscribers = {};

	function notifyAll(evt, info) {
		var subs;
		if (evt in subscribers) {
			subs = subscribers[evt];
			for (var i = 0, l = subs.length; i < l; ++i) {
				subs[i](info);
			}
		}
	}
	
	var events = {
		
		subscribe : function(evt, fn) {
			if (evt in subscribers) {
				subscribers[evt].push(fn);
			} else {
				subscribers[evt] = [fn];
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

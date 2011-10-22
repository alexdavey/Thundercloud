"use strict";

_.mixin({

	getId : function(id) {
		return document.getElementById(id);
	},

	getClass : function(className) {
		return document.getElementsByClassName(className);
	},

	getTag : function(tagName) {
		return document.getElementsByTagName(tagName);
	},

	atIndex : function(array, i) {
		return i > 0 ? array[i] : array[array.length + i];
	},

	mouse : function(e) {
		e = e || window.e;
		return {
			x : e.pageX || e.clientX,
			y : e.pageY || e.clientY
		};
	},
	
	splitText : function(text, position) {
		return {
			left : text.slice(0, position),
			right : text.slice(position)
		};
	},

	listen : function(el, type, fn) {
		if (arguments.length == 2) {
			fn = type;
			type = el;
			el = document;
		}

		if (el.attachEvent)
			el.attachEvent(type, fn);
		else {
			el.addEventListener(type, fn, false);
		}
	}
});

(function() {

		var div = document.createElement('div'),
			cache = {};

		_.getTag('canvas')[0].appendChild(div);

		_.mixin({

			computedCSS : function (className) {
				if (className in cache) {
					return cache[className];
				} else {
					div.className = className;
					var color = getComputedStyle(div, null).color;

					cache[className] = color;
					return color;
				}
			},
			
			clearCache : function() {
				cache = {};
			}

		});

})();

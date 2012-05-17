"use strict";

_.mixin({

	partial : function() {
		var args = _.toArray(arguments);
		args.splice(1, 0, null);
		return _.bind.apply(_, args);
	},

	filterObj : function(obj, fn, ctx) {
		var filtrate = {};

		_.each(obj, function(value, key) {
			if (fn.call(ctx, value, key)) filtrate[key] = obj[key];
		});

		return filtrate;
	},

	withoutObj : function(obj, value, ctx) {
		return _.filterObj(obj, function(test) {
			return test !== value;
		}, ctx);
	},

	invokeAll : function(array) {
		var args = _.tail(arguments);
		_.each(array, function(fn) {
			fn.fn.apply(fn.ctx || null, args);
		});
	},

	trim : function(string) {
		if (!this) return this;
		if (string.trim) return string.trim();
		return this.replace(/^\s+|\s+$/g, '');
	},

	offset : function(el) {
		var curleft = 0,
			curtop  = 0;	

		if (el.offsetParent) {
			do {
				curleft += el.offsetLeft;
				curtop += el.offsetTop;
			} while (el = el.offsetParent);	
		}

		return { top : curtop, left : curleft };
	},

	deepClone : function(obj) {
		var newObj = {},
			prop;

		if (_.isArray(obj)) {
			return _.clone(obj);
		}

		for (var i in obj) {
			prop = obj[i];

			if (obj.hasOwnProperty(i)) {
				if (typeof prop == 'object') {
					newObj[i] = _.deepClone(prop);
				} else {
					newObj[i] = prop;
				}
			}

		}

		return newObj;
	},

	merge : function(to, from) {
		for (var i in from) {
			if (from.hasOwnProperty(i)) {
				to[i] = from[i];
			}
		}
	},

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

	addElement : function(obj) {
		var el = document.createElement(obj.tag);
		delete obj.tag;

		if ('css' in obj) {
			$.css(el, obj.css);
			delete obj.css;
		}

		$.merge(el, obj);
		return el;
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
	},

	insertSorted : function(array, model) {
		var z = _.pluck(array, 'z');
		array.splice(_.sortedIndex(z, model.z), 0, model);
		return array;
	}
});

(function() {

		// Satisfy DOMless test suite
		if (typeof document === 'undefined') return;

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

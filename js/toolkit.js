(function(window, document, undefined) {

var slice = [].slice;

var $ = function(x, fn, ctx) {
	switch ($.type(x)) {
		case 'string':
			var one = x.charAt(0);
			if (one == '#') return document.getElementById(x.substring(1));
			if (one == '.') return document.getElementsByClassName(x.substring(1));
			return document.getElementsByTagName(x);
		case 'array': // Deliberate fall through
		case 'object':
			return $.each(x, fn, ctx);
		case 'function':
			$.ready(x);
	}
};

var each = $.each = function(object, iterator, context) { 
	if ([].forEach && [].forEach === {}.forEach) {
		return object.forEach(iterator, context);
	} else if ($.type(object) == 'array') {
		for (var i = 0, l = object.length; i < l; i++) {
			iterator.call(context, object[i], i, object);
		}
	} else {
		for (var i in object) {
			if (object.hasOwnProperty(i))
				iterator.call(context, object[i], i, object);
		}
	}
};

$.map = function(object, iterator, context) {
	if ([].map && [].map === {}.map) return object.map(iterator, context);
	each(object, function(obj, key) {
		object[key] = iterator.call(context, object[key], key, object);
	});
};

$.merge = function(one, two) {
	each(two, function(value, key) {
		one[key] = value;
	});
	return one;
};

$.clone = function(object) {
	return $.merge({}, object);
};

$.type = function(thing) {
	return {}.toString.call(thing).slice(8, -1).toLowerCase();
};

$.css = function(el, styles, value) {
	var elStyles = (el && el.style ? el.style : (el || {}).style = {});
	if ($.type(styles) == 'string') return el[styles];
	if ('float' in styles) {
		elStyles['cssFloat'] = elStyles['styleFloat'] = styles['float'];
		delete styles['float'];
	}
	$.merge(elStyles, styles);
};

$.listen = function(el, type, fn) {
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
		
};

$.unListen = function(el, type, fn) {
	if (arguments.length == 2) {
		fn = type;
		type = el;
		el = document;
	}
	if (el.detachEvent)
		el.detachEvent(type, fn);
	else
		el.removeEventListener(type, fn, false);
};

$.addClass = function(el, className) {
	if ($.hasClass(el, className)) return;
	var lastChar = el.className.charAt(-1);
	el.className += (lastChar == ' ' ?  className : ' ' + className);
};

$.removeClass = function(el, className) {
	new RegExp('\\b' + className + '\\b?').replace(el.className, '');
};

$.hasClass = function(el, className) {
	var classes = el.className;
	if (!classes) return false;
	if (classes == className) return true;
	return new RegExp('\\b' + className + '\\b').test(classes);
};

var bind = $.bind = function(fn, context) {
	var outer = slice.call(arguments, 2);

	return function() {
		var args = [], inner = slice.call(arguments);

		each(outer, function(value) {
			args.push(value === undefined ? inner.shift() : value);
		});

		[].push.apply(args, inner);
		return fn.apply(context, args);
	};
};

$.mouse = function(e) {
	e = e || window.e;
	var x, y;

	if (e.pageX) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x = e.clientX;
		y = e.clientY;
	}

	return { x : x, y : y };
};

$.addElement = function(obj) {
	var el = document.createElement(obj.tag);
	delete obj.tag;

	if ('css' in obj) {
		$.css(el, obj.css);
		delete obj.css;
	}

	$.merge(el, obj);
	return el;
};

$.require = function(url, callback) {
	$.append($('head'), { src : url, onload : callback });
};

$.append = function(parentNode, el) {
	parentNode.appendChild($.addElement(el));
};

$.hide = bind($.css, $, undefined, { display : 'none' });

$.show = bind($.css, $, undefined, { display : 'none' });

$.send = function(type, url, data, callback) {
	var ajax = XMLHttpRequest || 
		ActiveXObject("Msxml2.XMLHTTP.6.0") || 
		ActiveXObject("Msxml2.XMLHTTP.3.0");

	req.open(type, url);
	req.onReadyStateChange = function() {
		if (request.readyState == 4 && callback) callback(req);
	};
	req.send(data);
};

$.get = bind($.send, $, 'get', undefined, null);

$.post = bind($.send, $, 'post');

$.animate = function(el, start, end, time) {

	var animate = function() {
		if (time > 0) {
			time -= 1 / 30;

			$.map(start, function(value, key) {
				return value += Math.abs(value - end[key]) / (time * 30);
			});
			
			$.css(el, start);
		}
	}

	setInterval(animate, 30);
};

$.noConflict = function() {
	window.$ = $$;
	return $;
};

$.ready = (function() {
	var ready = false, queue = [];

	each(['DomContentLoaded', 'readystatechange', 'load'], function(type) {
		$.listen(type, function() {
			ready = true;
			each(queue, function(fn, key) { fn.call(window, window, document) });
			queue = [];
		});
	});

	return function(fn) {
		ready ? fn.call(window, window, document) : queue.push(fn);
	};

})();

var $$ = window.$;
window.$ = $;

})(window, document);

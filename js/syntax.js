(function() {

window.syntax = {

	tokens : {

		html : {
			comment : /<!--(.*)-->/,
			doctype : /<!doctype (.*)>/i,
			string : /("|')(?:.*)\1/,
			openTag : /<[a-z]>/i,
			closeTag : /<\/[a-z]>/i
		}

	},

	getColor : (function() {
		var div = document.createElement('div');
			inherited = div.style.color,
			cache = {};

		return function(className) {
			if (className in cache) return cache[className];
			div.className = className;
			var color = getComputedStyle ? 
					getComputedStyle(div, null).color : 
					div.style.color;

			cache[className] = color = (color == inherited ? 'default' : color);
			return color;
		};

	})(),

};

})();

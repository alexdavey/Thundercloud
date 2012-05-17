define('plugin', ['canvas', 'events', 'input'], function(canvas, events, input) {

	"use strict";

	function within(x, y, model) {
		return model.x <= x && (model.x + model.width) >= x &&
				model.y <= y && (model.y + model.height) >= y;
	}
	
	var plugin = {

		elements : [],
		
		element : function(element) {
			_.insertSorted(plugin.elements, element, element.z);
			return element;
		}

	};

	events.subscribe('canvas.post-render', function() {
		_.each(plugin.elements, function(model) {
			if (model.visible) model.render(canvas.ctx, model, canvas);
		});
	});

	input.mouseDown(function(e) {
		var mouse = _.mouse(e),
			offset = _.offset(canvas.paper),
			predicate = _.partial(within, mouse.x - offset.left, mouse.y - offset.top),
			inside = _.filter(plugin.elements, predicate);

		// console.dir(inside);

		_.each(inside, function(model) {
			console.dir(model);
			if (_.isFunction(model.click) && model.clickable) model.click(e, mouse.x, mouse.y);
		});
	});
	
	return plugin;

});

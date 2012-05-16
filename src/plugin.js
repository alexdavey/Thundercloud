define('plugin', ['canvas', 'events'], function(canvas, events) {

	
	var plugin = {

		elements : [],
		
		element : function(element) {
			_.insertSorted(plugin.elements, element, element.z);
			return element;
		}

	};

	events.subscribe('post-render', function() {
		_.each(plugin.elements, function(model) {
			if (model.visible) model.render(canvas.ctx, model, canvas);
		});
	});

	
	return plugin;

});

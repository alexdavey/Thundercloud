require(['plugin', 'events', 'viewport', 'text', 'settings'], function(plugin, events, viewport, text, settings) {

	"use strict";

	function render(ctx, model) {
		if (text.source.length <= viewport.height + 1) return;

		var oldLineCap = ctx.lineCap,
			x = model.x,
			y = model.bar.offset;
	
		ctx.lineCap = 'round';
		ctx.strokeStyle = 'rgba(181, 181, 181, 0.5)';
		ctx.lineWidth = model.width;

		ctx.beginPath();

		ctx.moveTo(x, y);
		ctx.lineTo(x, y + model.bar.height);

		ctx.stroke();

		ctx.lineCap = oldLineCap;
	}
	
	var model = plugin.element({
		visible : true,
		clickable : true,
		floating : true,
		width : 8,
		height : settings.height,
		render : render,
		x : settings.width - 8,
		y : 0,
		z : 10,
		bar :  {
			height : 0,
			offset : 0
		}
	});

	events.subscribe('viewport.change|text.change', function() {
		var canvasHeight = settings.height,
			textLength = text.source.length;

		model.bar.height = (viewport.height / textLength) * canvasHeight - 16;
		model.bar.offset = (canvasHeight / textLength) * viewport.startRow + 8;
	});

	model.click = function(e, x, y) {
		viewport.shiftTo('start', (y / settings.height) * text.source.length);
	};

});

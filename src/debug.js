require(['canvas', 'events'], function(canvas, events) {

	function render() {
		canvas.render();
	}
	
	events.subscribe('textmodified', render);

});

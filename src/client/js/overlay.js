define(['settings'], function(settings) {

	function toggleDisplay(el) {
		var styles = el.style;
		styles.display = (styles.display == 'none' ? 'block' : 'none');
	}
	
	var settingsButton = _.getId('settings'),
		lightbox = _.getId('lightbox');

	_.listen(settingsButton, 'click', function() {
		toggleDisplay(lightbox);
	});

});
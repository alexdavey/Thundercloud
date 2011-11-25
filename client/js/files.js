define(function() {

	var ajax = (function() {

		var defaults = {
			method : 'GET',
			path : window.location.href,
			callback : function() { }
		};

		return function(params) {

			_.defaults(params || {}, defaults);

			var req = new XMLHttpRequest();
			req.open(params.method, params.path);
			req.setRequestHeader('Content-Type', 'text/plain');

			req.onReadyStateChange = function() {
				if (request.readyState === 4 && request.status === 200) {
					var type = request.getResponseHeader("Content-Type");
					if (type.match(/^text/)) {
						params.callback(request.responseText);
					}
				}

			req.send(data);
		};
	};

	})();
	
	var files = {
		
		read : function(path, callback) {
			ajax({
				path : window.location.href + 'read/',
				callback : callback
			});
			console.log('called');
		},

		write : function(file, path, callback) {
			ajax({
				method : 'PUT',
				path : window.location.href + path,
				callback : callback
			});
		}

	};

	return files;

});

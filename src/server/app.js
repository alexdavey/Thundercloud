var connect = require('connect');

var server = connect.createServer(
	connect.favicon(),
	// connect.router(),
	connect.logger(),
	connect.static(__dirname + '/../client')
).listen(1337);
// 
// app.put('', function() {
// 	
// });

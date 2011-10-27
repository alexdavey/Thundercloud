var io = require('socket.io').listen(80),
	fs = require('fs');

io.sockets.on('connection', function(socket) {
	socket.on('read', read.bind(socket));
	socket.on('write', write.bind(socket));
});

function read(socket, data) {
	data = JSON.parse(data);
	fs.readFile(data.path, function(err, file) {
		if (err) {
			socket.emit('response', { error : true });
			throw err;
		}

		socket.emit('response', file);
	});
}

function write(socket, data) {
	data = JSON.parse(data);

}

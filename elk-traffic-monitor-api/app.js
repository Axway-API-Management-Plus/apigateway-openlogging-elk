const APIBuilder = require('@axway/api-builder-runtime');
const server = new APIBuilder();

// lifecycle examples
server.on('starting', function () {
	server.logger.debug('server is starting!');
});

server.on('started', function () {
	server.logger.debug('server started!');
});

// start the server
server.start();

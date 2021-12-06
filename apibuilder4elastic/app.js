const APIBuilder = require('@axway/api-builder-runtime');

if(process.env.APM_ENABLED) {
	console.log(`Application performance monitoring enabled. Using APM-Server: ${process.env.APM_SERVER || 'http://apm-server:8200'}`);
	require('elastic-apm-node').start({
		serviceName: 'APIBuilder4Elastic',
		serverUrl: process.env.APM_SERVER || 'http://apm-server:8200' 
	});
}

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

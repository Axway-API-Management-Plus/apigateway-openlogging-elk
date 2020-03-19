/**
 * This file is executed by Docker HEALTHCHECK on an interval specified in the Dockerfle in
 * the root of your service.
 *
 * The code makes a request to a bound path served by API Builder to see if the server is ready.
 * It fails on error accessing the path or if the success property of the response is false.
 */
const http = require('http');
const options = {
	// we keep this in sync with the --timeout value in Dockerfile
	timeout: 5000,
	host: 'localhost',
	port: process.env.PORT || 8080,
	path: '/apibuilderPing.json'
};

http.request(options, (resp) => {
	let data = '';

	resp.on('data', (chunk) => {
		data += chunk;
	});

	resp.on('end', () => {
		// Check response from the healthcheck API.
		// The default implementation returns 200 and { success: true }
		// when ready. This will need to be modified if you are providing
		// a custom healthcheck implementation.
		try {
			const body = JSON.parse(data);
			if (!body.success) {
				process.exitCode = 1;
			}
		} catch (e) {
			process.exitCode = 1;
		}
	});
}).on('error', function () {
	process.exitCode = 1;
}).end();

const https = require('https');

async function sendRequest(url, options, data, expectedRC) {
	return new Promise((resolve, reject) => {
		try {
			options.path = encodeURI(options.path);
			var req = https.request(url, options, function (response) {
				var chunks = [];
				var statusCode = response.statusCode;
				response.on("data", function (chunk) {
					chunks.push(chunk);
				});

				response.on("end", function () {
					var body = Buffer.concat(chunks);
					if (statusCode < 200 || statusCode > 299 && statusCode!=expectedRC) {
						reject({message: `Unexpected response for HTTP-Request. Response: ${body.toString()}`, statusCode: statusCode });
						return;
                    }
					const userResponse = body.toString();
					if (!userResponse) {
						resolve({body: userResponse, headers: response.headers });
						return;
					}
					resolve({body: JSON.parse(userResponse), headers: response.headers });
					return;
				});
			});
			req.on("error", function (error) {
				reject(error);
				return;
            });
            if(data) {
                req.write(data);
            }
			req.end();
		} catch (ex) {
			reject(ex);
		}
	});
}

module.exports = {
    sendRequest
}
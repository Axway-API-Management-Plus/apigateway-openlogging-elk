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
						reject(`Unexpected response for HTTP-Request. Response-Code: ${statusCode}`);
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

function _getCookie(cookies, cookieName) {
	const fields = cookies.split(";");
	for (var i = 0; i < fields.length; ++i) {
		var cookie = fields[i].trim();
		const foundCookie = cookie.substring(0, cookie.indexOf("="));
		if(cookieName == foundCookie) {
			return cookie.substring(cookie.indexOf("=")+1);
		}
	}
	return;
}

function _getSession(headers) {
    const setCookieHeaders = headers['set-cookie'];
	for (var i = 0; i < setCookieHeaders.length; ++i) {
        var setCookie = setCookieHeaders[i].trim();
        if(setCookie.startsWith('APIMANAGERSESSION=')) {
            session = setCookie.substring(setCookie.indexOf("=")+1, setCookie.indexOf(";"));
            return session;
        }
	}
    throw new Error('No session found.');
}

/**
 * Tests whether or not the API Builder application is in developer mode.  The test
 * is to check to see if @axway/api-builder-admin exists.
 *
 * @returns {boolean} True if in developer mode.
 */
function isDeveloperMode() {
	try {
		// If we are in "development mode" we are going to have @axway/api-builder-admin
		// dependency installed. So we guarantee that only generate config files in
		// "development mode" and ensure immutable production environments.
		// eslint-disable-next-line import/no-unresolved
		require('@axway/api-builder-admin');
		return true;
	} catch (ex) {
		// when we run plugin test suite @axway/api-builder-admin is not there 
		// so we are kind of simulating production mode
		return false;
	}
}

function getManagerConfig(apiManagerConfig, groupId) {
	if (apiManagerConfig[groupId]) {
		if (!apiManagerConfig[groupId].password) {
			apiManagerConfig[groupId].password = apiManagerConfig.password;
			apiManagerConfig[groupId].username = apiManagerConfig.username;
		}
		return apiManagerConfig[groupId];
	} else {
		if (apiManagerConfig.url.indexOf('#') != -1) {
			throw new Error(`You have configured API-Manager URLs based on groupIds (e.g. group-a#https://manager-host.com:8075), but the groupId: ${groupId} ist NOT configured. Please check the configuration parameter: API_MANAGER`);
		}
		return apiManagerConfig;
	}
}

module.exports = {
    sendRequest, 
    _getCookie, 
    _getSession, 
	isDeveloperMode, 
	getManagerConfig
}
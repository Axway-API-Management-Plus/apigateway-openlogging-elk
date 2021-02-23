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
						reject({message: "Unexpected response for HTTP-Request.", statusCode: statusCode });
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

async function parseAPIManagerConfig(pluginConfig, options) {
	if(!pluginConfig.apimanager.username) {
		throw new Error(`Required parameter: apimanager.username is not set.`)
	}
	if(!pluginConfig.apimanager.password) {
		throw new Error(`Required parameter: apimanager.password is not set.`)
	}
	if(!pluginConfig.apimanager.url) {
		// If no API-Manager URL is given, use the Admin-Node-Manager URL
		const managerURL = new URL(pluginConfig.apigateway.url);
		managerURL.port = 8075;
		options.logger.info(`Parameter API_MANAGER not set. Expect API-Manager on URL: ${managerURL.toString()}`);
		pluginConfig.apimanager.default = {
				url: managerURL.toString(),
				username: pluginConfig.apimanager.username,
				password: pluginConfig.apimanager.password
		}
	} else {
		// Check, if multiple API-Manager URLs based on the groupId and regions are given (Format: groupId|managerUrl or groupId|region|managerUrl)
		if(pluginConfig.apimanager.url.indexOf('|')!=-1) {
			pluginConfig.apimanager.perGroupAndRegion = true;
			options.logger.info(`Parse group/region based API_MANAGER: ${pluginConfig.apimanager.url}.`);
			// Looks like manager URLs are given based on groupIds and regions
			pluginConfig.apimanager.url.split(',').forEach(groupRegionAndURL => {
				groupRegionAndURL = groupRegionAndURL.trim().toLowerCase().split('|');
				if(groupRegionAndURL.length == 1) {
					// The default API-Manager
					options.logger.debug(`Found default API-Manager URL: ${groupRegionAndURL[0]}`);
					pluginConfig.apimanager.default = { url: groupRegionAndURL[0], username: pluginConfig.apimanager.username, password: pluginConfig.apimanager.password } 
				} else if(groupRegionAndURL.length == 2) {
					// Only the Group-ID is given
					options.logger.debug(`Found API-Manager URL: ${groupRegionAndURL[1]} for group: ${groupRegionAndURL[0]}`);
					pluginConfig.apimanager[groupRegionAndURL[0]] = { url: groupRegionAndURL[1], username: pluginConfig.apimanager.username, password: pluginConfig.apimanager.password } 
				} else if(groupRegionAndURL.length == 3) {
					// Group-ID and region is given (Just create a map with a special key)
					options.logger.debug(`Found API-Manager URL: ${groupRegionAndURL[2]} for group: ${groupRegionAndURL[1]} and region: ${groupRegionAndURL[1]}`);
					pluginConfig.apimanager[`${groupRegionAndURL[0]}###${groupRegionAndURL[1]}`] = { url: groupRegionAndURL[2], username: pluginConfig.apimanager.username, password: pluginConfig.apimanager.password} 
				} else {
					return Promise.reject(`Unexpected API-Manager format: ${groupRegionAndURL}`);
				}
			});
		} else { // If not, create a default API-Manager
			options.logger.info(`Using only default API_MANAGER: ${pluginConfig.apimanager.url}.`);
			pluginConfig.apimanager.default = {
				url: pluginConfig.apimanager.url,
				username: pluginConfig.apimanager.username,
				password: pluginConfig.apimanager.password
			}
		}
	}
}

function getManagerConfig(apiManagerConfig, groupId, region) {
	if(groupId == undefined && region == undefined) {
		if(apiManagerConfig.default == undefined) {
			throw new Error(`Cannot return API-Manager config without groupId and region as no default API-Manager is configured.`);
		} else {
			return apiManagerConfig.default;
		}
	}
	var key = groupId;
	if(region != undefined) {
		key = `${groupId}###${region}`.toLowerCase();
	}
	// Check if the requested combination based on groupId and region exists and return it directly
	if (apiManagerConfig[key]) {
		return apiManagerConfig[key];
	} else {
	// 
		if (apiManagerConfig.perGroupAndRegion && !apiManagerConfig.default) {
			throw new Error(`You have configured API-Manager URLs based on groupIds (e.g. group-a|https://manager-host.com:8075), but the groupId: ${groupId} is NOT configured and no default is configured. Please check the configuration parameter: API_MANAGER`);
		}
		return apiManagerConfig.default;
	}
}

async function checkAPIManagers(apiManagerConfig, options) {
	var finalResult = { isValid: true };
	for (const [key, config] of Object.entries(apiManagerConfig)) {
		if(typeof config != 'object') continue;
		finalResult[key] = config;
		try {
			var data = `username=${config.username}&password=${config.password}`;
			var reqOptions = {
				path: `/api/portal/v1.3/login`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': data.length
				},
				agent: new https.Agent({ rejectUnauthorized: false })
			};
			const result = await sendRequest(config.url, reqOptions, data, 303)
				.then(response => {
					return response;
				})
				.catch(err => {
					throw new Error(`Cannot login to API-Manager: '${config.url}'. Got error: ${err}`);
				});
			const session = _getSession(result.headers);
			var reqOptions = {
				path: `/api/portal/v1.3/currentuser`,
				headers: {
					'Cookie': `APIMANAGERSESSION=${session}`
				},
				agent: new https.Agent({ rejectUnauthorized: false })
			};
			const currentUser = await sendRequest(config.url, reqOptions)
				.then(response => {
					return response;
				})
				.catch(err => {
					throw new Error(`Cant get current user: ${err}`);
				});
			if(currentUser.body.role!='admin') {
				options.logger.error(`User: ${currentUser.body.loginName} has no admin role on API-Manager: ${config.url}.`);
				finalResult.isValid = false;
				finalResult[key].isValid = false;
			} else {
				finalResult[key].isValid = true;
			}
		} catch (ex) {
			options.logger.error(ex);
			throw ex;
		}
	}
	return finalResult;
}

module.exports = {
    sendRequest, 
    _getCookie, 
	isDeveloperMode, 
	getManagerConfig,
	checkAPIManagers,
	parseAPIManagerConfig
}
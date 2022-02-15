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

function _getCookies(headers) {
    const receivedCookies = headers['set-cookie'];
	var parsedCookies = "";
	var semicolon = "";
	for (var i = 0; i < receivedCookies.length; ++i) {
        var receivedCookie = receivedCookies[i].trim();
		var cookieName = receivedCookie.substring(0, receivedCookie.indexOf("="));
		var cookieValue = receivedCookie.substring(receivedCookie.indexOf("=")+1, receivedCookie.indexOf(";"));
		parsedCookies += `${semicolon}${cookieName}=${cookieValue}`
		semicolon = "; ";
	}
	return parsedCookies;
    //throw new Error(`Error parsing received cookies: ${JSON.stringify(setCookies)}');
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
	if(pluginConfig.apimanager.enabled == false) {
		options.logger.warn(`API-Manager is disabled. Using Local-API-Details lookup only. Users have unrestricted Traffic-Monitor view by default (You may use an external authorization) instead. API-Management KPIs are disabled.`);
		return;
	}
	if(!pluginConfig.apimanager.username) {
		throw new Error(`Required parameter: apimanager.username is not set.`)
	}
	if(!pluginConfig.apimanager.password) {
		throw new Error(`Required parameter: apimanager.password is not set.`)
	}
	pluginConfig.apimanager.configs = {};
	if(!pluginConfig.apimanager.url) {
		// If no API-Manager URL is given, use the default Admin-Node-Manager URL
		const managerURL = new URL(pluginConfig.apigateway.configs.default.url);
		managerURL.port = 8075;
		options.logger.info(`Parameter API_MANAGER not set. Expect API-Manager on URL: ${managerURL.toString()}`);
		pluginConfig.apimanager.configs.default = {
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
					pluginConfig.apimanager.configs.default = { url: groupRegionAndURL[0], username: pluginConfig.apimanager.username, password: pluginConfig.apimanager.password } 
				} else if(groupRegionAndURL.length == 2) {
					// Only the Group-ID is given
					options.logger.debug(`Found API-Manager URL: ${groupRegionAndURL[1]} for group: ${groupRegionAndURL[0]}`);
					pluginConfig.apimanager.configs[`${groupRegionAndURL[0]}`] = { url: groupRegionAndURL[1], username: pluginConfig.apimanager.username, password: pluginConfig.apimanager.password, group: groupRegionAndURL[0] };
				} else if(groupRegionAndURL.length == 3) {
					// Group-ID and region is given (Just create a map with a special key)
					options.logger.debug(`Found API-Manager URL: ${groupRegionAndURL[2]} for group: ${groupRegionAndURL[1]} and region: ${groupRegionAndURL[1]}`);
					pluginConfig.apimanager.configs[`${groupRegionAndURL[0]}###${groupRegionAndURL[1]}`] = { url: groupRegionAndURL[2], username: pluginConfig.apimanager.username, password: pluginConfig.apimanager.password, group: groupRegionAndURL[0], region: groupRegionAndURL[1]} 
				} else {
					return Promise.reject(`Unexpected API-Manager format: ${groupRegionAndURL}`);
				}
			});
		} else { // If not, create a default API-Manager
			options.logger.info(`Using only default API_MANAGER: ${pluginConfig.apimanager.url}.`);
			pluginConfig.apimanager.configs.default = {
				url: pluginConfig.apimanager.url,
				username: pluginConfig.apimanager.username,
				password: pluginConfig.apimanager.password
			}
		}
	}
}

function getManagerConfig(apiManagerConfig, groupId, region) {
	if(groupId == undefined && region == undefined) {
		if(apiManagerConfig.configs.default == undefined) {
			throw new Error(`Cannot return API-Manager config without groupId and region as no default API-Manager is configured.`);
		} else {
			return apiManagerConfig.configs.default;
		}
	}
	var key = groupId.toLowerCase();
	if(region != undefined && region != "N/A" && region != "n/a") {
		key = `${groupId}###${region}`.toLowerCase();
	}
	// Check if the requested combination based on groupId and region exists and return it directly
	if (apiManagerConfig.configs && apiManagerConfig.configs[key]) {
		return apiManagerConfig.configs[key];
	} else {
		if (apiManagerConfig.perGroupAndRegion && !apiManagerConfig.configs.default) {
			throw new Error(`You have configured API-Manager URLs based on groupIds (e.g. group-a|https://manager-host.com:8075), but the groupId: ${groupId} is NOT configured and no default is configured (lookup key: '${key}'). Please check the configuration parameter: API_MANAGER`);
		}
		return apiManagerConfig.configs.default;
	}
}

async function parseANMConfig(pluginConfig, options) {
	pluginConfig.apigateway.configs = {};
		// Check, if multiple Admin-Node-Manager URLs based on the region are configured (Format: region|anmUrl)
	if(pluginConfig.apigateway.url.indexOf('|')!=-1) {
		pluginConfig.apigateway.perRegion = true;
		options.logger.info(`Parse region based ADMIN_NODE_MANAGER: ${pluginConfig.apigateway.url}.`);
		// Looks like ANM URLs are given based on regions
		pluginConfig.apigateway.url.split(',').forEach(regionAndURL => {
			regionAndURL = regionAndURL.trim().toLowerCase().split('|');
			if(regionAndURL.length == 1) {
				// The default Admin-Node-Manager
				options.logger.debug(`Found default Admin-Node-Manager URL: ${regionAndURL[0]}`);
				pluginConfig.apigateway.configs.default = { url: regionAndURL[0] } 
			} else if(regionAndURL.length == 2) {
				// Only the Region is given
				options.logger.debug(`Found Admin-Node-Manager URL: ${regionAndURL[1]} for region: ${regionAndURL[0]}`);
				pluginConfig.apigateway.configs[`${regionAndURL[0]}`] = { url: regionAndURL[1] };
			} else {
				return Promise.reject(`Unexpected Admin-Node-Manager (ADMIN_NODE_MANAGER) format: ${regionAndURL}`);
			}
		});
	} else { // If not, create a default Admin-Node-Manager config object
		options.logger.info(`Using only default Admin-Node-Manager: ${pluginConfig.apigateway.url}.`);
		pluginConfig.apigateway.configs.default = {
			url: pluginConfig.apigateway.url
		}
	}
}

function getANMConfig(anmConfig, region) {
	if(region == undefined) {
		if(anmConfig.configs.default == undefined) {
			throw new Error(`Cannot return Admin-Node-Manager config without a region as no default Admin-Node-Manager is configured.`);
		} else {
			return anmConfig.configs.default;
		}
	}
	var key = region.toLowerCase();
	if (anmConfig.configs && anmConfig.configs[key]) {
		return anmConfig.configs[key];
	} else {
		if(!anmConfig.configs.default) {
			throw new Error(`Cannot return Admin-Node-Manager config for region: '${region}' as no default Admin-Node-Manager is configured.`);
		}
		return anmConfig.configs.default;
	}
}

async function checkAPIManagers(apiManagerConfig, options) {
	var finalResult = { isValid: true };
	if(apiManagerConfig.enabled == false) {
		finalResult.message = "Nothing to validate as API-Manager is disabled.";
		return finalResult;
	}
	for (const [key, config] of Object.entries(apiManagerConfig.configs)) {
		if(typeof config != 'object') continue;
		finalResult[key] = config;
		try {
			options.logger.debug(`Validating connection to API-Manager URL: '${config.url}'`)
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
					throw new Error(`Cannot login to API-Manager: '${config.url}'. Got error: ${JSON.stringify(err)}`);
				});
			const cookies = _getCookies(result.headers);
			var reqOptions = {
				path: `/api/portal/v1.3/currentuser`,
				headers: {
					'Cookie': cookies
				},
				agent: new https.Agent({ rejectUnauthorized: false })
			};
			const currentUser = await sendRequest(config.url, reqOptions)
				.then(response => {
					return response;
				})
				.catch(err => {
					throw new Error(`Error validating API-Manager user. Error: '${JSON.stringify(err)}'`);
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
	if(finalResult.isValid) {
		finalResult.message = "Connection to API-Manager(s) successfully validated."
	} else {
		finalResult.message = "There was an error validating the API-Manager connection."
	}
	return finalResult;
}

module.exports = {
    sendRequest, 
    _getCookie, 
	isDeveloperMode, 
	getManagerConfig,
	getANMConfig,
	checkAPIManagers,
	parseAPIManagerConfig,
	parseANMConfig
}
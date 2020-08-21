const https = require('https');

var pluginConfig = {};
var cache = {};
var logger;

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
/**
 * Action method.
 *
 * @param {object} params - A map of all the parameters passed from the flow.
 * @param {object} options - The additional options provided from the flow
 *	 engine.
 * @param {object} options.pluginConfig - The service configuration for this
 *	 plugin from API Builder config.pluginConfig['api-builder-plugin-pluginName']
 * @param {object} options.logger - The API Builder logger which can be used
 *	 to log messages to the console. When run in unit-tests, the messages are
 *	 not logged.  If you wish to test logging, you will need to create a
 *	 mocked logger (e.g. using `simple-mock`) and override in
 *	 `MockRuntime.loadPlugin`.  For more information about the logger, see:
 *	 https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/logging.html
 * @param {*} [options.pluginContext] - The data provided by passing the
 *	 context to `sdk.load(file, actions, { pluginContext })` in `getPlugin`
 *	 in `index.js`.
 * @return {*} The response value (resolves to "next" output, or if the method
 *	 does not define "next", the first defined output).
 */
async function lookupCurrentUser(params, options) {
	const { requestHeaders, apiManagerUserRequired } = params;
	logger = options.logger;
	cache = options.pluginContext.cache;
	pluginConfig = options.pluginConfig;
	if (!requestHeaders) {
		throw new Error('You must provide the requestHeaders originally sent to the ANM to this method.');
	}
	if(!requestHeaders.cookie) {
		throw new Error('The requestHeaders do not contain the cookie header.');
	}
	const VIDUSR = _getCookie(requestHeaders.cookie, "VIDUSR");
	if(!VIDUSR) {
		logger.trace(`Received cookies: ${requestHeaders.cookie}`);
		throw new Error('The requestHeaders do not contain the required cookie VIDUSR');
	}
	if(!requestHeaders['csrf-token']) {
		logger.trace(`Received headers: ${requestHeaders}`);
		throw new Error('The requestHeaders do not contain the required header csrf-token');
	}
	if(cache.has(VIDUSR)) {
		return cache.get(VIDUSR);
	}
	const user = {};
	logger.trace(`Trying to get current user based on VIDUSR: ${VIDUSR}`);
	user.loginName = await _getCurrentGWUser(VIDUSR);
	logger.trace(`Current user is: ${user.loginName}`);
	user.gatewayManager = {isAdmin : false};
	var permissions = await _getCurrentGWPermissions(VIDUSR, requestHeaders['csrf-token'], loginName);
	if(permissions.includes("adminusers_modify")) {
		user.gatewayManager.isAdmin = true;
		logger.debug(`Current user is: '${user.loginName}' Is Gateway admin: ${user.gatewayManager.isAdmin}`);
		return user;
	}
	logger.trace(`Trying to load API-Manager user using Login-Name: '${user.loginName}'`);
	const users = await _getManagerUser(user);
	if(!users || users.length == 0) {
		throw new Error(`User: '${user.loginName}' not found in API-Manager.`);
	}
	user.apiManager = users[0];
	var org = await _getOrganization(user.apiManager.organizationId);
	user.apiManager.organizationName = org.name;
	logger.debug(`User: '${user.loginName}' (Role: ${user.apiManager.role}) found in API-Manager. Organization: '${user.apiManager.organizationName}'`);
	cache.set( VIDUSR, user);
	return user;
}

async function lookupAPIDetails(params, options) {
	const { apiName, apiPath } = params;
	cache = options.pluginContext.cache;
	pluginConfig = options.pluginConfig;
	if (!apiName) {
		throw new Error('You must provide the apiName that should be used to lookup the API.');
	}
	if (!apiPath) {
		throw new Error('You must provide the apiPath that should be used to lookup the API.');
	}
	if(cache.has(apiPath)) {
		return cache.get(apiPath);
	}
	const proxies = await _getAPIProxy(apiName);
	if(!proxies || proxies.length == 0) {
		throw new Error(`No APIs found with name: '${apiName}'`);
	}
	apiProxy = undefined;
	for (i = 0; i < proxies.length; i++) {
		api = proxies[i];
		if(apiPath.startsWith(api.path)) {
			apiProxy = api;
		}
	}
	if(!apiProxy) {
		throw new Error(`No APIs found with name: '${apiName}' and apiPath: '${apiPath}'`);
	}
	var org = await _getOrganization(apiProxy.organizationId);
	apiProxy.organizationName = org.name;
	// Remove a few properties we really don't need
	delete apiProxy.corsProfiles;
	delete apiProxy.securityProfiles;
	delete apiProxy.authenticationProfiles;
	delete apiProxy.inboundProfiles;
	delete apiProxy.outboundProfiles;
	delete apiProxy.serviceProfiles;
	delete apiProxy.caCerts;
	if(cache.set(apiPath, apiProxy));
	return apiProxy;
}

async function _getCurrentGWUser(VIDUSR) {
	var options = {
		path: '/api/rbac/currentuser',
		headers: {
			'Cookie': `VIDUSR=${VIDUSR}`
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	loginName = await sendRequest(pluginConfig.apigateway.url, options)
		.then(response => {
			return response.result;
		})
		.catch(err => {
			throw new Error(`Error getting current user Request sent to: '${pluginConfig.apigateway.hostname}'. ${err}`);
		});
	return loginName;
}

async function _getCurrentGWPermissions(VIDUSR, csrfToken, loginName) {
	var options = {
		path: '/api/rbac/permissions/currentuser',
		headers: {
			'Cookie': `VIDUSR=${VIDUSR}`, 
			'csrf-token': csrfToken
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	result = await sendRequest(pluginConfig.apigateway.url, options)
		.then(response => {
			return response.result;
		})
		.catch(err => {
			throw new Error(err);
		});
	if(result.user!=loginName) {
		throw new Error(`Error reading current permissions from API-Gateway Manager. Loginname: ${loginName} does not match to retrieved user: ${result.user}.`);
	}
	return result.permissions;
}

async function _getManagerUser(user) {
	var options = {
		path: `/api/portal/v1.3/users?field=loginName&op=eq&value=${user.loginName}&field=enabled&op=eq&value=enabled`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(pluginConfig.apimanager.username + ':' + pluginConfig.apimanager.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	managerUser = await sendRequest(pluginConfig.apimanager.url, options)
		.then(response => {
			return response;
		})
		.catch(err => {
			throw new Error(err);
		});
	return managerUser;
}

async function _getAPIProxy(apiName) {
	var options = {
		path: `/api/portal/v1.3/proxies?field=name&op=eq&value=${apiName}`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(pluginConfig.apimanager.username + ':' + pluginConfig.apimanager.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	apiProxy = await sendRequest(pluginConfig.apimanager.url, options)
		.then(response => {
			return response;
		})
		.catch(err => {
			throw new Error(`Error getting APIs with API-Name: ${apiName}. Request sent to: '${pluginConfig.apimanager.url}'. ${err}`);
		});
	return apiProxy;
}

async function sendRequest(url, options) {
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
					if (statusCode < 200 || statusCode > 299) {
						reject(`Unexpected response for HTTP-Request. Response-Code: ${statusCode}`);
						return;
					}
					const userResponse = body.toString();
					if (!userResponse) {
						resolve(userResponse);
						return;
					}
					resolve(JSON.parse(userResponse));
					return;
				});
			});
			req.on("error", function (error) {
				reject(error);
				return;
			});
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

async function _getOrganization(orgId) {
	if(cache.has(`ORG-${orgId}`)) {
		var org = cache.get(`ORG-${orgId}`);
		logger.debug(`Organization: '${org.name}' (ID: ${orgId}) found in cache.`);
		return org;
	}
	var options = {
		path: `/api/portal/v1.3/organizations/${orgId}`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(pluginConfig.apimanager.username + ':' + pluginConfig.apimanager.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	org = await sendRequest(pluginConfig.apimanager.url, options)
		.then(response => {
			if(!response) {
				throw new Error(`Organization with : '${orgId}' not found in API-Manager.`);
			}
			return response;
		})
		.catch(err => {
			throw new Error(err);
		});
	if(!org.enabled) {
		throw new Error(`Organization: '${org.name}' is disabled.`);
	}
	if(!org.development) {
		throw new Error(`Organization: '${org.name}' is not a development organization.`);
	}
	cache.set(`ORG-${orgId}`, org)
	return org;
}

module.exports = {
	lookupCurrentUser, 
	lookupAPIDetails
};

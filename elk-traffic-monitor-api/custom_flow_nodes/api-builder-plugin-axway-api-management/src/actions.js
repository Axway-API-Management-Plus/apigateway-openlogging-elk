const https = require('https');

var pluginConfig = {};
var cache = {};

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
	const { logger } = options;
	cache = options.pluginContext.userCache;
	pluginConfig = options.pluginConfig;
	debugger;
	if (!requestHeaders) {
		throw new Error('You must provide the requestHeaders originally sent to the ANM to this method.');
	}
	if(!requestHeaders.cookie) {
		throw new Error('The requestHeaders do not contain the cookie header.');
	}
	const VIDUSR = _getCookie(requestHeaders.cookie, "VIDUSR");
	if(!VIDUSR) {
		throw new Error('The requestHeaders do not contain the required cookie VIDUSR');
	}
	if(!requestHeaders['csrf-token']) {
		throw new Error('The requestHeaders do not contain the required header csrf-token');
	}
	if(cache.has(VIDUSR)) {
		return cache.get(VIDUSR);
	}
	const user = {};
	debugger;
	user.loginName = await _getCurrentGWUser(VIDUSR);
	user.gatewayManager = {isAdmin : false};
	var permissions = await _getCurrentGWPermissions(VIDUSR, requestHeaders['csrf-token'], loginName);
	if(permissions.includes("adminusers_modify")) {
		user.gatewayManager.isAdmin = true;
		return user;
	}
	const users = await _getManagerUser(user);
	if(!users || users.length == 0) {
		throw new Error(`User: '${user.loginName}' not found in API-Manager.`);
	}
	user.apiManager = users[0];
	user.apiManager.organizationName = await _getOrganizationName(user.apiManager.organizationId);
	cache.set( VIDUSR, user);
	return user;
	//logger.info('Lookup user');
}

async function lookupAPIDetails(params, options) {
	const { apiPath } = params;
	cache = options.pluginContext.userCache;
	pluginConfig = options.pluginConfig;
	if (!apiPath) {
		throw new Error('You must provide the apiPath that should be used to lookup the API.');
	}
	if(cache.has(apiPath)) {
		return cache.get(apiPath);
	}
	const proxies = await _getAPIProxy(apiPath);
	if(!proxies || proxies.length == 0) {
		throw new Error(`No API found exposed on path: '${apiPath}'`);
	}
	apiProxy = proxies[0]; // We just pick the first result
	apiProxy.organizationName = await _getOrganizationName(apiProxy.organizationId);
	// Remove a few properties we really don't need
	apiProxy.corsProfiles = null;
	apiProxy.securityProfiles = null;
	apiProxy.authenticationProfiles = null;
	apiProxy.inboundProfiles = null;
	apiProxy.outboundProfiles = null;
	apiProxy.serviceProfiles = null;
	apiProxy.caCerts = null;
	return apiProxy;
}

async function _getCurrentGWUser(VIDUSR) {
	var options = {
		method: 'GET',
		hostname: pluginConfig.apigateway.hostname,
		port: pluginConfig.apigateway.port,
		path: '/api/rbac/currentuser',
		headers: {
			'Cookie': `VIDUSR=${VIDUSR}`
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	loginName = await sendRequest(options)
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
		method: 'GET',
		hostname: pluginConfig.apigateway.hostname,
		port: pluginConfig.apigateway.port,
		path: '/api/rbac/permissions/currentuser',
		headers: {
			'Cookie': `VIDUSR=${VIDUSR}`, 
			'csrf-token': csrfToken
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	result = await sendRequest(options)
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
		method: 'GET',
		hostname: pluginConfig.apimanager.hostname,
		port: pluginConfig.apimanager.port,
		path: `/api/portal/v1.3/users?field=loginName&op=eq&value=${user.loginName}&field=enabled&op=eq&value=true`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(pluginConfig.apimanager.username + ':' + pluginConfig.apimanager.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	managerUser = await sendRequest(options)
		.then(response => {
			return response;
		})
		.catch(err => {
			throw new Error(err);
		});
	return managerUser;
}

async function _getAPIProxy(apiPath) {
	var options = {
		method: 'GET',
		hostname: pluginConfig.apimanager.hostname,
		port: pluginConfig.apimanager.port,
		path: `/api/portal/v1.3/proxies?field=path&op=eq&value=${apiPath}`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(pluginConfig.apimanager.username + ':' + pluginConfig.apimanager.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	apiProxy = await sendRequest(options)
		.then(response => {
			return response;
		})
		.catch(err => {
			throw new Error(`Error getting API-Proxy details for API exposed on path: ${apiPath} Request sent to: '${pluginConfig.apimanager.hostname}:${pluginConfig.apimanager.port}'. ${err}`);
		});
	return apiProxy;
}

async function sendRequest(options) {
	return new Promise((resolve, reject) => {
		var req = https.request(options, function (response) {
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

			response.on("error", function (error) {
				reject(error);
				return;
			});
		});
		req.end();
	});
}

function _getCookie(cookies, cookieName) {
	const fields = cookies.split(",");
	for (var i = 0; i < fields.length; ++i) {
		var cookie = fields[i].trim();
		const foundCookie = cookie.substring(0, cookie.indexOf("="));
		if(cookieName == foundCookie) {
			return cookie.substring(cookie.indexOf("=")+1);
		}
	}
	return;
}

async function _getOrganizationName(orgId) {
	if(cache.has(`ORG-${orgId}`)) {
		return cache.get(`ORG-${orgId}`).name;
	}
	var options = {
		method: 'GET',
		hostname: pluginConfig.apimanager.hostname,
		port: pluginConfig.apimanager.port,
		path: `/api/portal/v1.3/organizations/${orgId}`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(pluginConfig.apimanager.username + ':' + pluginConfig.apimanager.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	org = await sendRequest(options)
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
	return org.name;
}

module.exports = {
	lookupCurrentUser, 
	lookupAPIDetails
};

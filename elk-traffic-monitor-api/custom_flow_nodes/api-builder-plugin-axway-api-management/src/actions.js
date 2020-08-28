const https = require('https');
const { sendRequest, _getCookie } = require('./utils');

var pluginConfig = {};
var cache = {};
var logger;

const securityDeviceTypes = {
	apiKey: "API-Key",
	basic: "HTTP Basic",
	oauth: "OAuth",
	oauthExternal: "OAuth (External)", 
	authPolicy: "Security policy", 
	awsHeader: "AWS Header", 
	awsQuery: "AWS Query", 
	twoWaySSL: "Mutual SSL", 
	passThrough: "Pass Through"
  };

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
	const { apiName, apiPath, operationId } = params;
	logger = options.logger;
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
	apiProxy.apiSecurity = await _getAPISecurity(apiProxy, operationId);
	apiProxy.requestPolicy = await _getRequestPolicy(apiProxy, operationId);
	apiProxy.routingPolicy = await _getRoutingPolicy(apiProxy, operationId);
	apiProxy.responsePolicy = await _getResponsePolicy(apiProxy, operationId);
	apiProxy.backendBasePath = await _getBackendBasePath(apiProxy, operationId);
	apiProxy.faulthandlerPolicy = await _getFaulthandlerPolicy(apiProxy, operationId);
	// Remove a few properties we really don't need
	delete apiProxy.id;
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
			return response.body.result;
		})
		.catch(err => {
			throw new Error(`Error getting current user Request sent to: '${pluginConfig.apigateway.hostname}'. ${err}`);
		});
	return loginName;
}

async function _getAPISecurity(apiProxy, operationId) {
	if(!operationId) {
		for (var i = 0; i < apiProxy.securityProfiles.length; ++i) {
			var securityProfile = apiProxy.securityProfiles[i];
			if(!securityProfile.isDefault) continue;
			// For now we pick the first Security device
			return securityDeviceTypes[securityProfile.devices[0].type];
		}
		return "N/A";
	}
	throw new Error('_getAPISecurity with operationId not yet supported.');
}

async function _getRequestPolicy(apiProxy, operationId) {
	if(!operationId) {
		if(apiProxy.outboundProfiles._default.requestPolicy) {
			return getPolicyName(apiProxy.outboundProfiles._default.requestPolicy);
		} else {
			return "N/A";
		}
	}
	throw new Error('_getRequestPolicy with operationId not yet supported.');
}

async function _getRoutingPolicy(apiProxy, operationId) {
	if(!operationId) {
		if(apiProxy.outboundProfiles._default.routePolicy) {
			return getPolicyName(apiProxy.outboundProfiles._default.routePolicy);
		} else {
			return "N/A";
		}
	}
	throw new Error('_getRoutingPolicy with operationId not yet supported.');
}

async function _getResponsePolicy(apiProxy, operationId) {
	if(!operationId) {
		if(apiProxy.outboundProfiles._default.responsePolicy) {
			return getPolicyName(apiProxy.outboundProfiles._default.responsePolicy);
		} else {
			return "N/A";
		}
	}
	throw new Error('_getResponsePolicy with operationId not yet supported.');
}

async function _getFaulthandlerPolicy(apiProxy, operationId) {
	if(!operationId) {
		if(apiProxy.outboundProfiles._default.faultHandlerPolicy) {
			return getPolicyName(apiProxy.outboundProfiles._default.faultHandlerPolicy);
		} else {
			return "N/A";
		}
	}
	throw new Error('_getResponsePolicy with operationId not yet supported.');
}

function getPolicyName(policy) {
	// An internal policy-name looks like this 
	// <key type='FilterCircuit'><id field='name' value='Response Policy 1'/></key>
	// or like so:
	// <key type='CircuitContainer'><id field='name' value='Custom policies'/><key type='FilterCircuit'><id field='name' value='Request Policy 1'/></key></key>
	policy = policy.substring(policy.indexOf("<key type='FilterCircuit'>"));
	policyName = policy.substring(policy.indexOf("value='")+7, policy.lastIndexOf("'/></key>"));
	return policyName;
}

async function _getBackendBasePath(apiProxy, operationId) {
	if(!operationId) {
		return apiProxy.serviceProfiles._default.basePath
	}
	throw new Error('_getBackendBasePath with operationId not yet implemented.');
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
			return response.body.result;
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
			return response.body;
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
			return response.body;
		})
		.catch(err => {
			throw new Error(`Error getting APIs with API-Name: ${apiName}. Request sent to: '${pluginConfig.apimanager.url}'. ${err}`);
		});
	return apiProxy;
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
			if(!response.body) {
				throw new Error(`Organization with : '${orgId}' not found in API-Manager.`);
			}
			return response.body;
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

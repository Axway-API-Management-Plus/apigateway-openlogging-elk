const https = require('https');
const { sendRequest, _getCookie, getManagerConfig } = require('./utils');
const fs = require('fs');
const path = require('path');

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
	const { requestHeaders, apiManagerUserRequired, groupId } = params;
	logger = options.logger;
	cache = options.pluginContext.cache;
	pluginConfig = options.pluginConfig;
	var user = {};
	// default the user to be a Non-Admin user
	user.gatewayManager = {isAdmin : false};
	var permissions = {};
	var VIDUSR;
	if (!requestHeaders) {
		throw new Error('You need to provide Request-Headers with Cookies or an Authorization header.');
	}
	if(!requestHeaders.cookie && !requestHeaders.authorization) {
		throw new Error('You must provide either the VIDUSR cookie + csrf-token or an HTTP-Basic Authorization header.');
	}
	if(requestHeaders.authorization) {
		logger.trace(`Trying to authorize user based on Authorization header.`);
		user.loginName = await _getCurrentGWUser(headers = {'Authorization': `${requestHeaders.authorization}`});
		logger.trace(`Authorized user is: ${user.loginName}`);
		permissions = await _getCurrentGWPermissions(headers = {'Authorization': `${requestHeaders.authorization}`}, loginName);
	} else {
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
		logger.trace(`Trying to get current user based on VIDUSR cookie.`);
		user.loginName = await _getCurrentGWUser(headers = {'Cookie': `VIDUSR=${VIDUSR}`});
		logger.trace(`Current user is: ${user.loginName}`);
		permissions = await _getCurrentGWPermissions(headers = {'Cookie': `VIDUSR=${VIDUSR}`, 'csrf-token': requestHeaders['csrf-token']}, loginName);
	}
	if(permissions.includes("adminusers_modify")) {
		user.gatewayManager.isAdmin = true;
		logger.debug(`Current user is: '${user.loginName}' Is Gateway admin: ${user.gatewayManager.isAdmin}`);
		return user;
	}
	logger.trace(`Trying to load API-Manager user using Login-Name: '${user.loginName}'`);
	const users = await _getManagerUser(user, groupId);
	if(!users || users.length == 0) {
		throw new Error(`User: '${user.loginName}' not found in API-Manager.`);
	}
	user.apiManager = users[0];
	var org = await _getOrganization(user.apiManager.organizationId, groupId);
	user.apiManager.organizationName = org.name;
	logger.debug(`User: '${user.loginName}' (Role: ${user.apiManager.role}) found in API-Manager. Organization: '${user.apiManager.organizationName}'`);
	if(VIDUSR!=undefined) {
		cache.set( VIDUSR, user);
	}
	return user;
}

async function lookupAPIDetails(params, options) {
	var { apiName, apiPath, operationId, groupId, region, mapCustomProperties } = params;
	logger = options.logger;
	cache = options.pluginContext.cache;
	pluginConfig = options.pluginConfig;
	if (!apiPath) {
		throw new Error('You must provide the apiPath that should be used to lookup the API.');
	}
	if(region) region = region.toLowerCase();
	const cacheKey = `${apiPath}###${groupId}###${region}`;
	logger.debug(`Trying to lookup API-Details from cache using key: '${cacheKey}'`);
	if(cache.has(cacheKey)) {
		logger.debug(`Found API-Details in cache with key: '${cacheKey}'`);
		return cache.get(cacheKey);
	}
	logger.debug(`No API-Details found in cache using key: '${cacheKey}'. Trying to lookup API locally.`);
	try {
		var proxies = await _getAPILocalProxies(apiPath, groupId, region, options);
	} catch (ex) {
		logger.warn(`Error looking up API locally. ${JSON.stringify(ex)}`);
	}
	if(proxies == undefined) {
		// To lookup the API in API-Manager the API-Name is required
		if (!apiName) {
			throw new Error(`API not found locally, based on path: ${apiPath}. To perform a query against an API-Manager you must provide the apiName.`);
		}
		logger.debug(`API not configured locally, trying to get details from API-Manager.`);
		proxies = await _getAPIProxy(apiName, groupId, region);
	}
	if(!proxies || proxies.length == 0) {
		throw new Error(`No APIs found with name: '${apiName}'`);
	}
	apiProxy = undefined;
	for (i = 0; i < proxies.length; i++) {
		api = proxies[i];
		if(apiPath.startsWith(api.path)) {
			apiProxy = api;
			break;
		}
	}
	if(!apiProxy) {
		throw new Error(`No APIs found with name: '${apiName}' and apiPath: '${apiPath}'`);
	}
	// Skip all the lookups if the API is locally configured and just take it as it is
	if(!apiProxy.locallyConfigured) {
		var org = await _getOrganization(apiProxy.organizationId, groupId, region);
		apiProxy.organizationName = org.name;
		apiProxy.apiSecurity = await _getAPISecurity(apiProxy, operationId);
		apiProxy.requestPolicy = await _getRequestPolicy(apiProxy, operationId);
		apiProxy.routingPolicy = await _getRoutingPolicy(apiProxy, operationId);
		apiProxy.responsePolicy = await _getResponsePolicy(apiProxy, operationId);
		apiProxy.backendBasePath = await _getBackendBasePath(apiProxy, operationId);
		apiProxy.faulthandlerPolicy = await _getFaulthandlerPolicy(apiProxy, operationId);
		if(!apiProxy.version) apiProxy.version = 'N/A';
		// Remove a few properties we don't really need in the response
		delete apiProxy.id;
		delete apiProxy.corsProfiles;
		delete apiProxy.securityProfiles;
		delete apiProxy.authenticationProfiles;
		delete apiProxy.inboundProfiles;
		delete apiProxy.outboundProfiles;
		delete apiProxy.serviceProfiles;
		delete apiProxy.caCerts;
		if(mapCustomProperties) {
			apiProxy = await _addCustomProperties(apiProxy, groupId, region);
		}
	}
	if(cache.set(cacheKey, apiProxy));
	return apiProxy;
}

async function getCustomPropertiesConfig(params, options) {
	const { groupId, region } = params;
	pluginConfig = options.pluginConfig;
	logger = options.logger;
	cache = options.pluginContext.cache;
	return await _getConfiguredCustomProperties(groupId, region);
}

async function _getAPILocalProxies(apiPath, groupId, region, options) {
	if(options.pluginConfig.localLookupFile != undefined)  {
		var localAPIConfig = {};
		// File is given, try to read it
		var localProxies = JSON.parse(fs.readFileSync(options.pluginConfig.localLookupFile), null);
		localAPIConfig = { ...localProxies };
		var filenames = await _getGroupRegionFilename(options.pluginConfig.localLookupFile, groupId, region);
		if(filenames.groupFilename) {
			var groupProxies = JSON.parse(fs.readFileSync(filenames.groupFilename), null);
			localAPIConfig[groupId] = groupProxies;
		}
		if(filenames.regionFilename) {
			var regionProxies = JSON.parse(fs.readFileSync(filenames.regionFilename), null);
			localAPIConfig[`${groupId}###${region}`] = regionProxies;
		}
		if(localAPIConfig == undefined) {
			return;
		} else {
			var proxy = await _getLocalProxy(regionProxies, apiPath);
			if(proxy!=undefined) return proxy;
			proxy = await _getLocalProxy(groupProxies, apiPath);
			if(proxy!=undefined) return proxy;
			proxy = await _getLocalProxy(localProxies, apiPath);
			return proxy;
		}
	} else {
		options.logger.debug(`No local API-Lookup file configured.`);
		return;
	}
}

async function _getLocalProxy(localProxies, apiPath) {
	if(localProxies == undefined) return;
	//options.logger.debug(`Trying to read API-Details for path: ${apiPath} from local config file`);
	// Try a direct hit with the given apiPath
	var proxy;
	if(localProxies[apiPath]) {
		proxy = localProxies[apiPath];
	} else {
		// Iterate over all configured APIs
		for (const [key, val] of Object.entries(localProxies)) { 
			if(apiPath.startsWith(key)) {
				var currentProxy = val;
			}
			// Use the last proxy as the last must be the most precise
			proxy = currentProxy;	
		}
	}
	if(proxy==undefined) return;
	var proxies = [];
	proxy.path = apiPath; // Copy the path, as it's normally returned by the API-Manager
	proxies.push(proxy);
	proxy.locallyConfigured = true;
	return proxies;
}

async function _getGroupRegionFilename(basefilename, groupId, region) {
	var baseFile = path.parse(basefilename);
	var groupFilename = `${baseFile.dir}${path.sep}${baseFile.name}.${groupId}${baseFile.ext}`;
	var regionFilename = `${baseFile.dir}${path.sep}${baseFile.name}.${groupId}.${region}${baseFile.ext}`;
	var result = {};
	if(fs.existsSync(groupFilename)) {
		result["groupFilename"] = groupFilename;
	}
	if(fs.existsSync(regionFilename)) {
		result["regionFilename"] = regionFilename;
	}
	return result;
}

async function _getCurrentGWUser(requestHeaders) {
	var options = {
		path: '/api/rbac/currentuser',
		headers: requestHeaders,
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	loginName = await sendRequest(pluginConfig.apigateway.url, options)
		.then(response => {
			return response.body.result;
		})
		.catch(err => {
			throw new Error(`Error getting current user Request sent to: '${pluginConfig.apigateway.url}'. ${err}`);
		});
	return loginName;
}

async function _addCustomProperties(apiProxy, groupId) {
	var apiCustomProperties = await _getConfiguredCustomProperties(groupId);
	apiProxy.customProperties = {};
	for (var prop in apiCustomProperties) {
		if (Object.prototype.hasOwnProperty.call(apiCustomProperties, prop)) {
			if(apiProxy[prop]!=undefined) {
				apiProxy.customProperties[prop] = apiProxy[prop];
				delete apiProxy[prop];
			}
		}
	}
	return apiProxy;
}



async function _getAPISecurity(apiProxy, operationId) {
	if(!operationId) {
		for (var i = 0; i < apiProxy.securityProfiles.length; ++i) {
			var securityProfile = apiProxy.securityProfiles[i];
			if(!securityProfile.isDefault) continue;
			// For now we pick the first Security device
			if(securityProfile.devices.length==0) return securityDeviceTypes['passThrough'];
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

async function _getCurrentGWPermissions(requestHeaders, loginName) {
	var options = {
		path: '/api/rbac/permissions/currentuser',
		headers: requestHeaders,
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

async function _getManagerUser(user, groupId) {
	const apiManagerConfig = getManagerConfig(pluginConfig.apimanager, groupId);
	var options = {
		path: `/api/portal/v1.3/users?field=loginName&op=eq&value=${user.loginName}&field=enabled&op=eq&value=enabled`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	managerUser = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			return response.body;
		})
		.catch(err => {
			throw new Error(err);
		});
	return managerUser;
}

async function _getAPIProxy(apiName, groupId, region) {
	const apiManagerConfig = getManagerConfig(pluginConfig.apimanager, groupId, region);
	var options = {
		path: `/api/portal/v1.3/proxies?field=name&op=eq&value=${apiName}`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	apiProxy = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			return response.body;
		})
		.catch(err => {
			throw new Error(`Error getting APIs with API-Name: ${apiName}. Request sent to: '${apiManagerConfig.url}'. ${err}`);
		});
	return apiProxy;
}

async function _getOrganization(orgId, groupId, region) {
	const apiManagerConfig = getManagerConfig(pluginConfig.apimanager, groupId, region);
	const orgCacheKey = `ORG-${orgId}###${groupId}###${region}`
	if(cache.has(orgCacheKey)) {
		var org = cache.get(orgCacheKey);
		logger.debug(`Organization: '${org.name}' (ID: ${orgId}) found in cache for groupId: ${groupId} in region: ${region}.`);
		return org;
	}
	var options = {
		path: `/api/portal/v1.3/organizations/${orgId}`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	org = await sendRequest(apiManagerConfig.url, options)
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
	cache.set(orgCacheKey, org)
	return org;
}

async function _getConfiguredCustomProperties(groupId, region) {
	const apiManagerConfig = getManagerConfig(pluginConfig.apimanager, groupId, region);
	const customPropCacheKey = `CUSTOM_PROPERTIES###${groupId}###${region}`
	if(cache.has(customPropCacheKey)) {
		var propertiesConfig = cache.get(customPropCacheKey);
		logger.debug(`Custom properties found in cache with groupId: ${groupId} and region ${region}.`);
		return propertiesConfig;
	}
	logger.debug(`Reading custom properties for groupId: ${groupId}. from API-Manager: ${apiManagerConfig.url}`);
	var options = {
		path: `/api/portal/v1.3/config/customproperties`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	propertiesConfig = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			if(!response.body) {
				throw new Error(`Error getting custom properties from API-Manager: ${apiManagerConfig.ur}`);
			}
			return response.body.api;
		})
		.catch(err => {
			throw new Error(err);
		});
	cache.set(customPropCacheKey, propertiesConfig, 1800);
	return propertiesConfig;
}

module.exports = {
	lookupCurrentUser, 
	lookupAPIDetails,
	getCustomPropertiesConfig
};

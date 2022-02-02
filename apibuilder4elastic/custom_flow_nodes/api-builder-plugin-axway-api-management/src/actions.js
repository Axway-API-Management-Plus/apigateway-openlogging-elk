const https = require('https');
const { sendRequest, _getCookie, getManagerConfig, getANMConfig } = require('./utils');
const fs = require('fs');
const path = require('path');

var pluginConfig = {};
var cache = {};

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
	const { requestHeaders, getApiManagerUser, region } = params;
	var { unrestrictedPermissions } = params;
	const logger = options.logger;
	cache = options.pluginContext.cache;
	pluginConfig = options.pluginConfig;
	var user = {};
	// default the user to be a Non-Admin user
	user.gatewayManager = {isUnrestricted : false};
	var permissions = {};
	var VIDUSR;
	if (!requestHeaders) {
		throw new Error('You need to provide Request-Headers with Cookies or an Authorization header.');
	}
	if(!requestHeaders.cookie && !requestHeaders.authorization) {
		throw new Error('You must provide either the VIDUSR cookie + csrf-token or an HTTP-Basic Authorization header.');
	}
	if (!unrestrictedPermissions || unrestrictedPermissions=="") {
		unrestrictedPermissions = "adminusers_modify";
	}
	var regionLogMessage = "";
	if(region) {
		regionLogMessage = ` (Region: ${region})`;
	}
	if(requestHeaders.authorization) {
		logger.debug(`Trying to authorize user based on Authorization header ${regionLogMessage}.`);
		user.loginName = await _getCurrentGWUser(headers = {'Authorization': `${requestHeaders.authorization}`}, region, logger);
		logger.debug(`Authorized user is: ${user.loginName}`);
		permissions = await _getCurrentGWPermissions(headers = {'Authorization': `${requestHeaders.authorization}`}, user.loginName, region);
	} else {
		VIDUSR = _getCookie(requestHeaders.cookie, "VIDUSR");
		if(!VIDUSR) {
			logger.trace(`Received cookies: ${requestHeaders.cookie}`);
			throw new Error('The requestHeaders do not contain the required cookie VIDUSR');
		}
		if(cache.has(VIDUSR)) {
			return cache.get(VIDUSR);
		}
		if(!requestHeaders['csrf-token']) {
			logger.trace(`Received headers: ${requestHeaders}`);
			throw new Error('The requestHeaders do not contain the required header csrf-token');
		}
		logger.trace(`Trying to get current user based on VIDUSR cookie ${regionLogMessage}.`);
		try {
			user.loginName = await _getCurrentGWUser(headers = {'Cookie': requestHeaders.cookie}, region, logger);
		} catch (err) { 
			// Might happen if the request has been sent to the wrong ANM by a Load-Balancer in between. (Session Stickyness not working as expected)
			// With that, the session cookie sent is not known
			// Only mitigating the problem, but not really fully solving the issue - Load-Balanced request must be investigated
			logger.warn(`Unexpected error while trying to get current user from the ANM. (Perhaps using a Load-Balancer bteween APIBuilder4Elastic and Admin-Node-Manager which is not sticky?!). Trying again ...`);
			logger.debug(`Exception message error: ${JSON.stringify(err)}`);
			user.loginName = await _getCurrentGWUser(headers = {'Cookie': requestHeaders.cookie}, region, logger);
		}
		logger.trace(`Current user is: ${user.loginName}`);
		permissions = await _getCurrentGWPermissions(headers = {'Cookie': requestHeaders.cookie, 'csrf-token': requestHeaders['csrf-token']}, user.loginName, region);
	}
	if(unrestrictedPermissions.split(",").every( function(perm) { return permissions.includes(perm); })) {
		user.gatewayManager.isUnrestricted = true;
		logger.debug(`Current user is: '${user.loginName}'. Unrestricted Traffic-Monitor access: ${user.gatewayManager.isUnrestricted}`);
		if(VIDUSR) {
			cache.set( VIDUSR, user);
		}
		return user;
	// getApiManagerUser is set by the flow based on the userAuthorization toggle 
	} else if(getApiManagerUser == false || pluginConfig.apimanager.enabled == false) {
		logger.debug(`Current user is: '${user.loginName}'. Unrestricted Traffic-Monitor access: ${user.gatewayManager.isUnrestricted}. Don't try to get user on API-Manager.`);
		if(VIDUSR) {
			cache.set( VIDUSR, user);
		}
		return user;
	}
	logger.trace(`Trying to load API-Manager user using Login-Name: '${user.loginName}'`);
	const users = await _getManagerUser(user);
	if(!users || users.length == 0) {
		throw new Error(`User: '${user.loginName}' not found in API-Manager.`);
	}
	user.apiManager = users[0];
	// Get the name of the primary organization, ignore the Dev-Status if the user has multiple organizations
	options.mustBeDevelopmentOrg = (user.apiManager.orgs2Name) ? false : true;
	var org = await _getOrganization(user.apiManager, null, null, options);
	user.apiManager.organizationName = org.name;
	logger.debug(`User: '${user.loginName}' (Role: ${user.apiManager.role}) found in API-Manager. Organization: '${user.apiManager.organizationName}'`);
	if(VIDUSR) {
		cache.set( VIDUSR, user);
	}
	return user;
}

async function lookupTopology(params, options) {
	const { requestHeaders, region } = params;
	const logger = options.logger;
	pluginConfig = options.pluginConfig;
	
	cache = options.pluginContext.cache;
	if (!requestHeaders) {
		throw new Error('You need to provide Request-Headers with Cookies or an Authorization header.');
	}
	if(!requestHeaders.cookie && !requestHeaders.authorization) {
		throw new Error('You must provide either the VIDUSR cookie + csrf-token or an HTTP-Basic Authorization header.');
	}
	let cacheKey = `${requestHeaders.host}###region`;
	if(!requestHeaders.host) {
		logger.warn(`Host header not found, using static cache-key for the API-Gateway topology lookup.`);
		cacheKey = "apigwTopology";
	}
	if(cache.has(cacheKey)) {
		return cache.get(cacheKey);
	}
	var topology;
	if(requestHeaders.authorization) {
		logger.debug(`Trying to get API-Gateway topology based on Authorization header.`);
		topology = await _getTopology(headers = {'Authorization': `${requestHeaders.authorization}`}, region, logger);
	} else {
		logger.trace(`Trying to get API-Gateway topology based on VIDUSR cookie.`);
		topology = await _getTopology(headers = {'Cookie': requestHeaders.cookie, 'csrf-token': requestHeaders['csrf-token']}, region, logger);
	}
	if(topology.services) {
		topology.services = topology.services.filter(function(service) {
			return service.type!="nodemanager"; // Filter node manager service
		});
		if(region) {
			logger.info(`Successfully retrieved topology from Admin-Node-Manager for region: ${region}. Will be cached for 5 minutes.`);
		} else {
			logger.info(`Successfully retrieved topology from Admin-Node-Manager. Will be cached for 5 minutes.`);
		}
		cache.set( cacheKey, topology, 300);
		return topology;
	}
	// Without topology, inactive serviceIDs will not be included in the Traffic-Monitor result set
	logger.error(`Error retrieving topology from ANM. Without API-Gateway topology, inactive serviceIDs (removed instances) will not be included in the Traffic-Monitor result set.`);
	return {};
}

async function lookupAPIDetails(params, options) {
	var { apiName, apiPath, operationId, groupId, disableCustomProperties } = params;
	const { logger } = options;
	cache = options.pluginContext.cache;
	pluginConfig = options.pluginConfig;
	var proxies;
	if (!apiPath) {
		throw new Error('You must provide the apiPath that should be used to lookup the API.');
	}
	if(!disableCustomProperties) disableCustomProperties = false;
	if(params.region) {
		params.region = params.region.toLowerCase();
		if(params.region=="n/a") {
			delete params.region;
		}
	}
	const cacheKey = `${apiPath}###${groupId}###${params.region}`;
	logger.debug(`Trying to lookup API-Details from cache using key: '${cacheKey}'`);
	if(cache.has(cacheKey)) {
		logger.debug(`Found API-Details in cache with key: '${cacheKey}'`);
		return cache.get(cacheKey);
	}
	logger.info(`No API-Details found in cache using key: '${cacheKey}'. Trying to lookup API locally.`);
	try {
		proxies = await _getAPILocalProxies(params, options);
	} catch (ex) {
		logger.warn(`Error looking up API locally. ${JSON.stringify(ex)}`);
	}
	if(proxies == undefined) { // Nothing configured locally ... trying to lookup API at API-Manager
		// To lookup the API in API-Manager the API-Name is required
		if (!apiName) {
			logger.info(`API not configured locally, based on path: ${apiPath}. The API cannot be queried at the API Manager as no API name is given. Please configure this API path locally.`);
			return { name: 'Unknown API', method: 'Unknown Method'};
		}
		logger.debug(`API not configured locally, trying to get details from API-Manager.`);
		proxies = await _getAPIProxy(apiName, groupId, params.region);
	} else {
		logger.info(`API-Details for API with path: '${apiPath}' looked up locally.`);
	}
	if(!proxies || proxies.length == 0) {
		logger.warn(`No APIs found with name: '${apiName}'`);
		return { name: 'Unknown API', method: 'Unknown Method'};
	}
	var apiProxy = undefined;
	for (i = 0; i < proxies.length; i++) {
		var api = proxies[i];
		if(apiPath.startsWith(api.path)) {
			apiProxy = api;
			break;
		}
	}
	if(!apiProxy) {
		logger.warn(`No APIs found with name: '${apiName}' and apiPath: '${apiPath}'`);
		return { name: 'Unknown API', method: 'Unknown Method'};
	}
	// Skip  the lookups if the API is locally configured and just take it as it is
	if(!apiProxy.locallyConfigured) {
		var org = await _getOrganization(apiProxy, groupId, params.region, options);
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
		if(disableCustomProperties==false) {
			apiProxy = await _addCustomProperties(apiProxy, groupId, params.region, options);
		} else {
			logger.debug(`Support for custom properties is disabled. Return API-Proxy details without potentially configured custom properties.`);
		}
	}
	logger.info(`Return looked up API details based on API-Name: '${apiName}' and apiPath: '${apiPath}': ${JSON.stringify(apiProxy)}`);
	cache.set(cacheKey, apiProxy);
	return apiProxy;
}

async function lookupApplication(params, options) {
	const { logger } = options;
	var { applicationId, groupId } = params;
	pluginConfig = options.pluginConfig;
	cache = options.pluginContext.cache;
	if (!applicationId) {
		throw new Error('Missing parameter applicationId in order to lookup an application.');
	}
	if(params.region) {
		params.region = params.region.toLowerCase();
		if(params.region=="n/a") {
			delete params.region;
		}
	}
	const cacheKey = `application###${applicationId}###${groupId}###${params.region}`;
	logger.debug(`Trying to lookup application from cache using key: '${cacheKey}'`);
	if(cache.has(cacheKey)) {
		logger.debug(`Found application in cache with key: '${cacheKey}'`);
		return cache.get(cacheKey);
	}
	logger.info(`No application found in cache using key: '${cacheKey}'.`);
	var application = await _getApplication(applicationId, groupId, params.region);
	if(!application) {
		logger.info(`Application with ID: '${applicationId}' not found`);
		application = { id: applicationId, name: applicationId };
	} else {
		logger.info(`Return looked up application based on ID: '${applicationId}': ${JSON.stringify(application)}`);
	}
	cache.set(cacheKey, application);
	return application;
}

async function isIgnoreAPI(params, options) {
	var { apiPath, policyName, groupId } = params;
	const { logger } = options;
	cache = options.pluginContext.cache;
	pluginConfig = options.pluginConfig;
	if (!apiPath && !policyName) {
		return { status: 400, body: { message: 'You must either provide the apiPath or the policyName used to read the configuration.' }};
	}
	if(apiPath && apiPath.startsWith("%{[") && apiPath.endsWith("]}")) {
		return { status: 400, body: { message: `API-Path contains unresolved Logstash variable: '${apiPath}'. Please check Logstash pipeline configuration.` }};
	}
	if(policyName && policyName.startsWith("%{[") && policyName.endsWith("]}")) {
		return { status: 400, body: { message: `Policy-Name contains unresolved Logstash variable: '${policyName}'. Please check Logstash pipeline configuration.` }};
	}
	if(params.region) {
		params.region = params.region.toLowerCase();
		if(params.region=="n/a") {
			delete params.region;
		}
	}
	const cacheKey = `isIgnore###${groupId}###${params.region}###${apiPath}###${policyName}`;
	logger.debug(`Trying to lookup ignore status from cache using key: '${cacheKey}'`);
	if(cache.has(cacheKey)) {
		logger.debug(`Found ignore status in cache with key: '${cacheKey}'`);
		return cache.get(cacheKey);
	}
	try {
		var proxies = await _getAPILocalProxies(params, options);
	} catch (ex) {
		logger.warn(`Error looking up API locally. ${JSON.stringify(ex)}`);
	}
	// No config found - Return the default index:true
	if(proxies==undefined || proxies.length == 0) {
		logger.info(`API with apiPath: '${apiPath}', policyName: '${policyName}' not configured. Return default ingore: false.`);
		return {status: 200, body: { ignore: false }};
	}
	if(proxies.length > 1) {
		logger.warn(`No unique result for path: '${apiPath}', policy name: '${policyName}'. Return default ingore: false`);
		return {status: 200, body: { ignore: false }};
	}
	logger.info(`Return API with apiPath: '${apiPath}', policyName: '${policyName}' as to be ignored: ${proxies[0].ignore}`);
	var result = {status: 200, body: { ...proxies[0] }};
	cache.set(cacheKey, result);
	return result;
}

async function getCustomPropertiesConfig(params, options) {
	let { groupId,  disableCustomProperties} = params;
	if(!disableCustomProperties) disableCustomProperties = false;
	if(disableCustomProperties != false) {
		options.logger.debug(`Custom properties support is disabled. Return empty object as custom properties config.`);
		return {};
	}
	if(params.region) {
		params.region = params.region.toLowerCase();
	}
	pluginConfig = options.pluginConfig;
	if(pluginConfig.apimanager.enabled == false) return {}; // API-Manager is disabled, nothing to do
	const { logger } = options;
	cache = options.pluginContext.cache;
	let apiManagerConfig;
	var mergedCustomProperties = {};
	if(!pluginConfig.apimanager.perGroupAndRegion) {
		// Using a single API-Manager only.
		apiManagerConfig = getManagerConfig(pluginConfig.apimanager, groupId, params.region);
		return await _getConfiguredCustomProperties(apiManagerConfig, options);
	} else {
		// If multiple API-Managers are configured get custom-properties from all API-Managers and merge them together
		for (const [key, val] of Object.entries(pluginConfig.apimanager.configs)) { 
			logger.debug(`Trying to get custom properties from API-Manager with configuration: '${val}'`);
			apiManagerConfig = getManagerConfig(pluginConfig.apimanager, key, null);
			var managerCustomProperties = await _getConfiguredCustomProperties(apiManagerConfig, options);
			mergedCustomProperties = {...mergedCustomProperties, ...managerCustomProperties};
		}
	}
	return mergedCustomProperties;
}

async function _getAPILocalProxies(params, options) {
	var { apiPath, groupId, region, policyName } = params;
	const { logger } = options;
	const lookupFile = options.pluginConfig.localLookupFile;
	if(lookupFile != undefined && lookupFile != "")  {
		var localAPIConfig = {};
		// File is given, try to read it
		try {
			var localProxies = JSON.parse(fs.readFileSync(lookupFile), null);
		} catch (ex) {
			logger.error(`Error reading API-Lookup file: '${lookupFile}'. Error: ${ex}`);
			return;
		}
		logger.info(`Reading API-Details from local file: ${lookupFile}`);
		localAPIConfig = { ...localProxies };
		var filenames = await _getGroupRegionFilename(lookupFile, groupId, region);
		if(filenames.groupFilename) {
			logger.info(`Reading API-Details from local file: ${lookupFile}`);
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
			var proxy = await _getLocalProxy(regionProxies, apiPath, policyName, 'Region', options);
			if(proxy!=undefined) return proxy;
			proxy = await _getLocalProxy(groupProxies, apiPath, policyName, 'Group', options);
			if(proxy!=undefined) return proxy;
			proxy = await _getLocalProxy(localProxies, apiPath, policyName, 'General', options);
			return proxy;
		}
	} else {
		logger.debug(`No local API-Lookup file configured.`);
		return;
	}
}

async function _getLocalProxy(localProxies, apiPath, policyName, scope, options) {
	const { logger } = options;
	if(localProxies == undefined) {
		logger.warn(`No configuration found in file (${scope}).`);
		return;
	}
	var foundProxy;
	// If a policy is given, it is used separately for the lookup
	if(policyName != undefined && policyName != "") {
		logger.info(`Looking up information based on policy name: ${policyName}`);
		if(localProxies[`Policy: ${policyName}`]) {
			foundProxy =  localProxies[`Policy: ${policyName}`];
		}
	} else {
		var proxy = {
			method: "N/A", 
			organizationName: "N/A", 
			apiVersion: "N/A", 
			apiState: "N/A",
			apiSecurity: "N/A", 
			requestPolicy: "N/A", 
			routingPolicy: "N/A", 
			responsePolicy: "N/A", 
			faulthandlerPolicy: "N/A", 
			backendBasePath: "N/A"
		};
		// Perhaps, we have direct hit with the API-Path
		if(localProxies[apiPath]) {
			logger.info(`API-Details found based on API-Path: ${apiPath}`);
			foundProxy = localProxies[apiPath];
		} else {
			logger.info(`Try to find API-Details starting with: ${apiPath}`);
			// Iterate over all configured API-Proxies
			for (const [key, val] of Object.entries(localProxies)) { 
				if(apiPath.startsWith(key)) {
					var foundProxy = val;
				}
			}
		}
	}
	// If we don't have a match return nothing
	if(foundProxy==undefined) {
		logger.warn(`No API-Details found for API-Path: ${apiPath}`);
		return;
	}
	// Take over the configuration, preserve the default values
	proxy = {...proxy, ...foundProxy};
	logger.warn(`Found API-Details for API-Path: ${JSON.stringify(apiPath)}`);
	var proxies = [];
	proxy.path = apiPath; // Copy the path, as it's normally returned by the API-Manager and used for caching
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

async function _getCurrentGWUser(requestHeaders, region, logger) {
	var options = {
		path: '/api/rbac/currentuser',
		headers: requestHeaders,
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	var anmConfig = await getANMConfig(pluginConfig.apigateway, region);
	if(region) {
		logger.debug(`Trying to read current user from Admin-Node-Manager: ${anmConfig.url} based on region: ${region}`);
	} else {
		logger.debug(`Trying to read current user from Admin-Node-Manager: ${anmConfig.url}`);
	}
	var loginName = await sendRequest(anmConfig.url, options)
		.then(response => {
			return response.body.result;
		})
		.catch(err => {
			if(region) {
				throw new Error(`Error getting current user. Request sent to: '${anmConfig.url}' based on given region: '${region}'. Response: ${JSON.stringify(err)}`);
			} else {
				throw new Error(`Error getting current user. Request sent to: '${anmConfig.url}'. Response: ${JSON.stringify(err)}`);
			}
		});
	return loginName;
}

async function _getTopology(requestHeaders, region, logger) {
	var options = {
		path: '/api/topology',
		headers: requestHeaders,
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	var anmConfig = await getANMConfig(pluginConfig.apigateway, region);
	if(region) {
		logger.debug(`Trying to read topology from Admin-Node-Manager: ${anmConfig.url} based on region: ${region}`);
	} else {
		logger.debug(`Trying to read topology from Admin-Node-Manager: ${anmConfig.url}`);
	}
	var topology = await sendRequest(anmConfig.url, options)
		.then(response => {
			return response.body.result;
		})
		.catch(err => {
			if(region) {
				logger.error(`Error getting API-Gateway topology from Admin-Node-Manager based on given region: ${region}. Request sent to: '${anmConfig.url}'. Response-Code: ${err.statusCode}`);
			} else {
				logger.error(`Error getting API-Gateway topology from Admin-Node-Manager. Request sent to: '${anmConfig.url}'. Response-Code: ${err.statusCode}`);
			}
			logger.error(`This error will cause the application to fail in a future release.`);
			return {};
			// During a grace period it not cause the entire application to fail - Just EMT will not include all services.
			//throw new Error(`Error getting API-Gateway topology from Admin-Node-Manager. Request sent to: '${pluginConfig.apigateway.url}'. Response-Code: ${err.statusCode}`);
		});
	return topology;
}

async function _addCustomProperties(apiProxy, groupId, region, options) {
	const apiManagerConfig = getManagerConfig(pluginConfig.apimanager, groupId, region);
	var apiCustomProperties = await _getConfiguredCustomProperties(apiManagerConfig, options);
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

async function _getCurrentGWPermissions(requestHeaders, loginName, region) {
	var options = {
		path: '/api/rbac/permissions/currentuser',
		headers: requestHeaders,
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	var anmConfig = getANMConfig(pluginConfig.apigateway, region);
	var result = await sendRequest(anmConfig.url, options)
		.then(response => {
			return response.body.result;
		});
	if(result.user!=loginName) {
		throw new Error(`Error reading current permissions from API-Gateway Manager (${anmConfig.url}). Loginname: ${loginName} does not match to retrieved user: ${result.user}.`);
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
	var managerUser = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			return response.body;
		})
		.catch(err => {
			throw new Error(err);
		});
	return managerUser;
}

async function _getAPIProxy(apiName, groupId, region) {
	if(pluginConfig.apimanager.enabled == false) return;
	const apiManagerConfig = getManagerConfig(pluginConfig.apimanager, groupId, region);
	var options = {
		path: `/api/portal/v1.3/proxies?field=name&op=eq&value=${apiName}`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	const apiProxy = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			return response.body;
		})
		.catch(err => {
			throw new Error(`Error getting APIs with API-Name: ${apiName}. Request sent to: '${apiManagerConfig.url}'. ${err}`);
		});
	return apiProxy;
}

async function _getApplication(applicationId, groupId, region) {
	if(pluginConfig.apimanager.enabled == false) return undefined; // No lookup
	const apiManagerConfig = getManagerConfig(pluginConfig.apimanager, groupId, region);
	var options = {
		path: `/api/portal/v1.3/applications/${applicationId}`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	const appication = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			return response.body;
		})
		.catch(err => {
			if(err.statusCode == 404) return undefined; // No application found
			throw new Error(`Error getting application with ID: ${applicationId}. Request sent to: '${apiManagerConfig.url}'. ${err}`);
		});
	return appication;
}

async function _getOrganization(apiProxy, groupId, region, options) {
	const { logger, mustBeDevelopmentOrg } = options;
	if(apiProxy.locallyConfigured) {
		if(apiProxy.organizationName == undefined) apiProxy.organizationName = "N/A";
		return apiProxy;
	}
	var org;
	const orgId = apiProxy.organizationId;
	const apiManagerConfig = getManagerConfig(pluginConfig.apimanager, groupId, region);
	const orgCacheKey = `ORG-${orgId}###${groupId}###${region}`
	if(cache.has(orgCacheKey)) {
		org = cache.get(orgCacheKey);
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
	if(!org.development && mustBeDevelopmentOrg) {
		throw new Error(`Organization: '${org.name}' is not a development organization.`);
	}
	cache.set(orgCacheKey, org)
	return org;
}

async function _getConfiguredCustomProperties(apiManagerConfig, options) {
	const { logger } = options;
	const customPropCacheKey = `CUSTOM_PROPERTIES###${apiManagerConfig.url}`
	var propertiesConfig;
	if(cache.has(customPropCacheKey)) {
		propertiesConfig = cache.get(customPropCacheKey);
		logger.debug(`Custom properties found in cache with url: ${apiManagerConfig.url}.`);
		return propertiesConfig;
	}
	logger.debug(`Reading custom properties from API-Manager: ${apiManagerConfig.url}`);
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
	lookupTopology,
	lookupAPIDetails,
	lookupApplication,
	getCustomPropertiesConfig,
	isIgnoreAPI
};

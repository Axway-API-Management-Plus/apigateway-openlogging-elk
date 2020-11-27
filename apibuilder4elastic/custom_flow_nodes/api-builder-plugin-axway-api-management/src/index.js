const path = require('path');
const { SDK } = require('@axway/api-builder-sdk');
const { lookupCurrentUser, lookupAPIDetails, getCustomPropertiesConfig } = require('./actions');
const { mergeCustomProperties } = require('./customProperties');
const NodeCache = require( "node-cache" );
const { sendRequest, _getSession, getManagerConfig } = require('./utils');
const https = require('https');

/**
 * Resolves the API Builder plugin.
 * @param {object} pluginConfig - The service configuration for this plugin
 *   from API Builder config.pluginConfig['api-builder-plugin-pluginName']
 * @param {string} pluginConfig.proxy - The configured API-builder proxy server
 * @param {object} options - Additional options and configuration provided by API Builder
 * @param {string} options.appDir - The current directory of the service using the plugin
 * @param {string} options.logger - An API Builder logger scoped for this plugin
 * @returns {object} An API Builder plugin.
 */
async function getPlugin(pluginConfig, options) {
	const cache = new NodeCache({ stdTTL: pluginConfig.lookupCacheTTL, useClones: false });
	const sdk = new SDK({ pluginConfig });
	if(pluginConfig.MOCK_LOOKUP_API=="true") {
		options.logger.info("MOCK_LOOKUP_API set to true - Lookup API will mock for tests");
		await addLookupAPIMocks(cache);
	} else {
		if(!pluginConfig.apigateway) {
			throw new Error(`API-Gateway (apigateway) paramater section is missing in configuration`);
		}
		if(!pluginConfig.apimanager) {
			throw new Error(`API-Manager (apimanager) paramater section is missing in configuration`);
		}
		if(!pluginConfig.apigateway.url) {
			throw new Error(`Required parameter: apigateway.url is not set.`);
		}
		if(!pluginConfig.apimanager.url) {
			// If no API-Manager URL is given, use the Admin-Node-Manager URL
			const managerURL = new URL(pluginConfig.apigateway.url);
			managerURL.port = 8075;
			pluginConfig.apimanager.url = managerURL.toString();
		} else {
			// Check, if multiple API-Manager URLs based on the groupId are given (Format: groupId#managerUrl)
			if(pluginConfig.apimanager.url.indexOf('#')!=-1) {
				// Looks like manager URLs are given based on groupIds
				pluginConfig.apimanager.url.split(',').forEach(groupAndURL => {
					groupAndURL = groupAndURL.trim().split('#');
					pluginConfig.apimanager[groupAndURL[0]] = { url: groupAndURL[1] };
				});
			}
		}
		if(!pluginConfig.apimanager.username) {
			throw new Error(`Required parameter: apimanager.username is not set.`)
		}
		if(!pluginConfig.apimanager.password) {
			throw new Error(`Required parameter: apimanager.password is not set.`)
		}
		if(pluginConfig.validateConfig==true) {
			var isAdmin = await isAPIManagerUserAdmin(pluginConfig.apimanager, options.logger);
			if(!isAdmin) {
				throw new Error(`Configured API-Manager user: ${pluginConfig.apimanager.username} is either incorrect or has no Admin-Role.`);
			} else {
				options.logger.info("Connection to API-Manager successfully validated.");
			}
		} else {
			options.logger.warn("Config validation is skipped, as parameter: pluginConfig.validateConfig=true");
		}
	}

	sdk.load(path.resolve(__dirname, 'flow-nodes.yml'), {lookupCurrentUser, lookupAPIDetails, getCustomPropertiesConfig, mergeCustomProperties }, { pluginContext: { cache: cache }, pluginConfig});
	return sdk.getPlugin();
}

async function isAPIManagerUserAdmin(apiManagerConfig, logger) {
	let groupIds = [];
	if(apiManagerConfig.url.indexOf('#') != -1) {
		apiManagerConfig.url.split(',').forEach(groupAndURL => {
			groupAndURL = groupAndURL.trim().split();
			groupIds.push(getManagerConfig(apiManagerConfig, groupAndURL[0]));
		});
	} else {
		// The groupId doesn't matter if we don't have multiple configured
		groupIds[0] = "NOT_SPECIFIED";
	}
	for (var i = 0; i < groupIds.length; ++i) {
		var groupId = groupIds[i].trim();	
		let config = getManagerConfig(apiManagerConfig, groupId);
		try {
			var data = `username=${config.username}&password=${config.password}`;
			var options = {
				path: `/api/portal/v1.3/login`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': data.length
				},
				agent: new https.Agent({ rejectUnauthorized: false })
			};
			result = await sendRequest(config.url, options, data, 303)
				.then(response => {
					return response;
				})
				.catch(err => {
					throw new Error(`Cant login to API-Manager: ${err}`);
				});
			const session = _getSession(result.headers);
			var options = {
				path: `/api/portal/v1.3/currentuser`,
				headers: {
					'Cookie': `APIMANAGERSESSION=${session}`
				},
				agent: new https.Agent({ rejectUnauthorized: false })
			};
			const currentUser = await sendRequest(apiManagerConfig.url, options)
				.then(response => {
					return response;
				})
				.catch(err => {
					throw new Error(`Cant get current user: ${err}`);
				});
			if(currentUser.body.role!='admin') {
				logger.error(`User: ${currentUser.body.loginName} has no admin role.`);
				return false;
			}
			return true;
		} catch (ex) {
			logger.error(ex);
			throw ex;
		}
	}
}

/**
 * This adds a number of Keys into the cache that are triggered 
 * by the Logstash-Pipeline tests. 
 * This avoids to have an API-Manager Up&Running 
 */
async function addLookupAPIMocks(cache) {
	cache.set( "/petstore/v2/user/Chris###group-2", {
		organizationName: "Mocked Org A", 
		version: "X.X.X", 
		deprecated: false, 
		state: "published",
		routingPolicy: "N/A", 
		requestPolicy: "N/A", 
		responsePolicy: "N/A", 
		faulthandlerPolicy: "N/A", 
		apiSecurity: "API-Key", 
		backendBasePath:"https://petstore.swagger.io"
	});
	cache.set( "/healthcheck###group-2", {organizationName: "Mocked Org B", version: "Z.Z.Z", deprecated: true, state: "unpublished"});
	cache.set( "/api/with/policies/backend/and/oauth###group-2", {
		organizationName: "Mocked Org B", 
		version: "Z.Z.Z", 
		deprecated: true, 
		state: "unpublished", 
		routingPolicy: "I do the routing", 
		requestPolicy: "My Request Policy", 
		responsePolicy: "I take care abouth the response", 
		faulthandlerPolicy: "OMG Errors",
		apiSecurity: "OAuth", 
		backendBasePath:"https://im.a.special.backend.host:7788"
	});
}

module.exports = getPlugin;
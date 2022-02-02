const path = require('path');
const { SDK } = require('@axway/api-builder-sdk');
const { lookupCurrentUser, lookupTopology, lookupAPIDetails, getCustomPropertiesConfig, isIgnoreAPI, lookupApplication } = require('./actions');
const { mergeCustomProperties } = require('./customProperties');
const { getAPIManagerConfig, getAPIManagerOrganizations } = require('./apiManagerAdapter');
const NodeCache = require( "node-cache" );
const { checkAPIManagers, parseAPIManagerConfig, parseANMConfig } = require('./utils');
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
		//await parseAPIManagerConfig(pluginConfig, options);
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
		await parseANMConfig(pluginConfig, options);
		await parseAPIManagerConfig(pluginConfig, options);
		if(pluginConfig.validateConfig==true) {
			var result = await checkAPIManagers(pluginConfig.apimanager, options);
			if(!result.isValid) {
				throw new Error(`Error checking configured API-Manager(s). ${JSON.stringify(result)}`);
			} else {
				options.logger.info(result.message);
			}
		} else {
			options.logger.warn("Config validation is skipped, as parameter: pluginConfig.validateConfig=false");
		}
	}

	sdk.load(path.resolve(__dirname, 'flow-nodes.yml'), {lookupCurrentUser, lookupTopology, lookupAPIDetails, getCustomPropertiesConfig, mergeCustomProperties, getAPIManagerConfig, getAPIManagerOrganizations, isIgnoreAPI, lookupApplication }, { pluginContext: { cache: cache }, pluginConfig});
	return sdk.getPlugin();
}

/**
 * This adds a number of Keys into the cache that are triggered 
 * by the Logstash-Pipeline tests. 
 * This avoids to have an API-Manager Up&Running when Logstash pipelines are tested. 
 */
async function addLookupAPIMocks(cache) {
	cache.set( "/petstore/v2/user/chris###group-2###us", {
		organizationName: "Mocked Org A", 
		version: "X.X.X", 
		deprecated: false, 
		state: "published",
		routingPolicy: "N/A", 
		requestPolicy: "N/A", 
		responsePolicy: "N/A", 
		faulthandlerPolicy: "N/A", 
		apiSecurity: "API-Key", 
		backendBasePath:"https://petstore.swagger.io", 
		customProperties: {}
	});
	cache.set( "/healthcheck###group-2###us", {
		organizationName: "Mocked Org B", 
		version: "Z.Z.Z", 
		deprecated: true, 
		state: "unpublished",
		customProperties: {}
	});
	cache.set( "/api/with/policies/backend/and/oauth###group-2###us", {
		organizationName: "Mocked Org B", 
		version: "Z.Z.Z", 
		deprecated: true, 
		state: "unpublished", 
		routingPolicy: "I do the routing", 
		requestPolicy: "My Request Policy", 
		responsePolicy: "I take care abouth the response", 
		faulthandlerPolicy: "OMG Errors",
		apiSecurity: "OAuth", 
		backendBasePath:"https://im.a.special.backend.host:7788", 
		customProperties: {
			customProperty1: "value 1",
			customProperty2: "value 2",
			customProperty3: "value 3"
		}
	});
	cache.set( "/api/with/custom/properties###group-2###us", {
		organizationName: "Mocked Org C", 
		version: "Z.Z.Z", 
		deprecated: true, 
		state: "pupublished", 
		routingPolicy: "N/A", 
		requestPolicy: "N/A", 
		responsePolicy: "N/A", 
		faulthandlerPolicy: "N/A", 
		apiSecurity: "OAPI-KeyAuth", 
		backendBasePath:"https://im.a.special.backend.host:7788", 
		customProperties: {
			customProperty1: "value 1",
			customProperty2: "value 2",
			customProperty3: "value 3"
		}
	});
	
	cache.set( "isIgnore###group-2###us###/favicon.ico###", {
		status: 200, body: { ignore: true }
	});
	cache.set( "isIgnore###group-2###us######Do not index this Policy", {
		status: 200, body: { ignore: true }
	});

	cache.set( "application###180b1f32-d72f-40f4-949a-fc3f3f7dec2c###group-2###us", {
		"id": "180b1f32-d72f-40f4-949a-fc3f3f7dec2c",
		"name": "Plexus Suite - Patient Monitoring",
		"description": "Physician app providing insight in wearable tracking data",
		"organizationId": "2bfaa1c2-49ab-4059-832d-f833ca1c0a74",
		"phone": null,
		"email": null,
		"createdBy": "778c42e1-7461-409d-afa7-e572d56d8d34",
		"managedBy": [],
		"createdOn": 1598603033910,
		"enabled": true,
		"image": null,
		"state": "approved"
	});
}

module.exports = getPlugin;
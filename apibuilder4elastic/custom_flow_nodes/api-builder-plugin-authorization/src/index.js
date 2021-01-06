const path = require('path');
const { SDK } = require('@axway/api-builder-sdk');
const actions = require('./actions');
const NodeCache = require( "node-cache" );

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
	var cacheTTL = 600;
	var authZConfig = {};
	if(process.env.AUTHZ_CONFIG) {
		var configFile = process.env.AUTHZ_CONFIG;
		// The config is expected in the main API-Builder conf folder and should be configured that way
		if(configFile.startsWith('conf') || configFile.startsWith('/conf')) {
			configFile = `../../../${configFile}`;
		}
		options.logger.debug(`Trying to load authorization config file: ${configFile}`);
		authZConfig = require(configFile);
		if(authZConfig.authorizationConfig.cacheTTL) {
			cacheTTL = authZConfig.authorizationConfig.cacheTTL;
			options.logger.debug(`Using configured cache TTL: ${cacheTTL}`);
		}
	}
	const cache = new NodeCache({ stdTTL: cacheTTL, useClones: false });
	const sdk = new SDK({ pluginConfig });
	sdk.load(path.resolve(__dirname, 'flow-nodes.yml'), actions, { pluginContext: { 
		cache: cache, 
		authZConfig: authZConfig.authorizationConfig, 
		responseHandler: authZConfig.handleResponse 
	}, pluginConfig });
	return sdk.getPlugin();
}

module.exports = getPlugin;

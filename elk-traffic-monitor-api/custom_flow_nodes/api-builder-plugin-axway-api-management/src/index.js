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
	const userCache = new NodeCache({ stdTTL: 3600, useClones: false });
	const sdk = new SDK({ pluginConfig });
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
		const managerURL = new URL(pluginConfig.apigateway.url);
		managerURL.port = 8075;
		pluginConfig.apimanager.url = managerURL.toString();
	}
	if(!pluginConfig.apimanager.username) {
		throw new Error(`Required parameter: apimanager.username is not set.`)
	}
	if(!pluginConfig.apimanager.password) {
		throw new Error(`Required parameter: apimanager.password is not set.`)
	}
	sdk.load(path.resolve(__dirname, 'flow-nodes.yml'), actions, { pluginContext: { userCache: userCache }, pluginConfig});
	return sdk.getPlugin();
}

module.exports = getPlugin;
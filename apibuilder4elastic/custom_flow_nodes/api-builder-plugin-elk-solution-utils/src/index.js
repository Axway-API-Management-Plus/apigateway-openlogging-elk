const path = require('path');
const { SDK } = require('@axway/api-builder-sdk');
const actions = require('./actions');
const { ElasticsearchClient } = require('@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch/src/actions/ElasticsearchClient.js');

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
	var elasticSearchConfig = require(path.resolve(options.appDir, "conf", "elasticsearch.default.js"));
	var pluginConfig = elasticSearchConfig.pluginConfig["@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch"]

	// Create a connection to Elasticsearch on startup
	var client = new ElasticsearchClient(pluginConfig.elastic).client;

	const sdk = new SDK({ pluginConfig });
	sdk.load(path.resolve(__dirname, 'flow-nodes.yml'), actions);
	return sdk.getPlugin();
}

module.exports = getPlugin;

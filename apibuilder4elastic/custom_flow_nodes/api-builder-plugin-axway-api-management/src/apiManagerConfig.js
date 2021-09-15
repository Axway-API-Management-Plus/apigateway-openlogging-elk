const { sendRequest, getManagerConfig } = require('./utils');
const https = require('https');

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
async function getAPIManagerConfig(params, options) {
	let { } = params;
	const { logger } = options;
	var pluginConfig = options.pluginConfig;
	var cache = options.pluginContext.cache;
	debugger;
	const apiManagerConfigs = [];
	for (const [key, config] of Object.entries(pluginConfig.apimanager.configs)) {
		if(cache.has(config.url)) {
			logger.debug(`Using cached API-Manager configuration for URL: ${config.url}`);
			apiManagerConfigs.push(cache.get(config.url));
		} else {
			logger.debug(`Reading API-Manager configuration from: ${config.url}`);
			try {
				var managerConfig = await _getManagerConfig(config);
				// Additionally add the API-Manager Connection details to the object (required by the KPI-Subflow)
				managerConfig.connection = config;
				apiManagerConfigs.push(managerConfig);
				cache.set( config.url, managerConfig, 3600);
			} catch (err) {
				throw new Error(`Error reading configuration from API-Manager: ${config.url}. Error: ${JSON.stringify(err)}`);
			}
		}
	}
	logger.info(`Going to get API-Management KPIs for ${apiManagerConfigs.length} configured API-Manager(s).`);
	return apiManagerConfigs;
}

async function _getManagerConfig(apiManagerConfig) {
	var options = {
		path: `/api/portal/v1.3/config`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	var managerConfig = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			return response.body;
		})
		.catch(err => {
			throw err;
		});
	return managerConfig;
}

module.exports = {
	getAPIManagerConfig
};

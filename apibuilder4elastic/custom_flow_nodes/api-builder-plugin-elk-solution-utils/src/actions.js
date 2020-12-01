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
async function getIndexConfig(params, options) {
	const { data, indexConfigs } = params;
	const { logger } = options;
	if (!data) {
		throw new Error('Missing required parameter: data');
	}
	if (!indexConfigs) {
		throw new Error('Missing required parameter: indexConfigs');
	}

	var indexConfig;
	var indexName;
	if(data.indexName != undefined) {
		logger.debug(`Index-Name: ${data.indexName} taken from variable: data.indexName`);
		indexName = data.indexName;
	} else if (data.params != undefined && data.params.indexName != undefined) {
		logger.debug(`Index-Name: ${data.params.indexName} taken from variable: data.params.indexName`);
		indexName = data.params.indexName;
	} else {
	  throw new Error("No indexname given. You must either give it a params.indexName or indexName");
	}
	indexConfig = indexConfigs[indexName];
	if(indexConfig == undefined) {
	  throw new Error(`No index configuration found with name: ${indexName}`);
	}
	// Add some default to avoid file read to fail
	if(indexConfig.rollup == undefined || indexConfig.rollup.config == undefined) {
		indexConfig.rollup = { config: "NotSet" } ;
	}
	return indexConfig;
}

module.exports = {
	getIndexConfig
};

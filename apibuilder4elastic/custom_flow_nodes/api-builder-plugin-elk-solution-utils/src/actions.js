const { ElasticsearchClient } = require('@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch/src/actions/ElasticsearchClient.js');
const { values } = require('../../../test/documents/http/getinfo_test_documents');
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
	if(indexConfig.ilm == undefined || indexConfig.ilm.config == undefined) {
		indexConfig.ilm = { config: "NotSet" } ;
	}
	return indexConfig;
}

async function getIndicesForLogtype(params, options) {
	const { logtype, indexConfigs } = params;
	const { logger } = options;
	if (!logtype) {
		throw new Error('Missing required parameter: logtype');
	}
	if (!indexConfigs) {
		throw new Error('Missing required parameter: indexConfigs');
	}

	var indicesForLogType = {};
	for (const [indexName, indexConfig] of Object.entries(indexConfigs)) {
		if(indexConfig.logType!=undefined && indexConfig.logType==logtype) {
			indicesForLogType[indexName] = indexConfig;
		}
	}
	if(Object.values(indicesForLogType).length==0) {
		throw new Error(`No indices configured for logtype: ${logtype}`);
	}
	return indicesForLogType;
}

async function createIndices(params, options) {
	const { indices, region } = params;
	const { logger } = options;
	if (!indices) {
		throw new Error('Missing required parameter: indices');
	}
	var client = new ElasticsearchClient().client;
	if(!client) {
		throw new Error('Elasticsearch client not present. Is Elasticsearch connection working?');
	}
	var regionSuffix = "";
	if(region != undefined && region!="N/A") {
		regionSuffix = `-${region.toLowerCase()}`
	}
	var intialCounter = "000001";
	var createdIndices = {};
	for (const [indexName, indexConfig] of Object.entries(indices)) {
		var aliasName = `${indexConfig.alias}${regionSuffix}`;
		var myIndexName = `${indexName}${regionSuffix}-${intialCounter}`;
		var indexExists = await client.indices.existsAlias({index: myIndexName, name: aliasName});
		if(indexExists.body) {
			logger.info(`Index: ${myIndexName} for region: ${region} with alias: ${aliasName} already exists.`);
			continue;
		}
		logger.info(`Creating index: ${myIndexName} for region: ${region} with alias: ${aliasName}`);
		var requestParams = { index: myIndexName, body: { aliases: { } } };
		requestParams.body.aliases[aliasName] = { "is_write_index": true };
		try {
			var result = await client.indices.create( requestParams, { ignore: [404], maxRetries: 3 });
		} catch(ex) {
			throw new Error(`Error creating index: ${myIndexName}. ${JSON.stringify(ex)}`);
		}
		if(result.statusCode != 200) {
			logger.error(`Error creating index: ${myIndexName}. ${JSON.stringify(result)}`);
		} else {
			createdIndices[myIndexName] = { alias: aliasName };
			logger.info(`Successfully created index: ${myIndexName} for region: ${region} with alias: ${aliasName}`);
		}
	}
	return createdIndices;
}

async function updateRolloverAlias(params, options) {
	const { indices } = params;
	const { logger } = options;
	if (!indices) {
		throw new Error('Missing required parameter: indices');
	}
	var client = new ElasticsearchClient().client;
	if(!client) {
		throw new Error('Elasticsearch client not present. Is Elasticsearch connection working?');
	}
	// For each configured index do
	for (const [indexName, indexConfig] of Object.entries(indices)) {
		// Get all initial indices with given index name (having a region)
		var indicesForName = await client.indices.get({index: `${indexName}-*-000001`}, { maxRetries: 3 });
		for (const [key, val] of Object.entries(indicesForName.body)) {
			logger.debug(`Check rollover alias for index: ${key}`);
			var writeIndexAliasName;
			for (const [aliasName, aliasSettings] of Object.entries(val.aliases)) {
				if(aliasSettings.is_write_index) {
					writeIndexAliasName = aliasName;
					break;
				}
			}
			// Check, if the rollover alias is still the default alias 
			if(writeIndexAliasName && writeIndexAliasName != val.settings.index.lifecycle.rollover_alias) {
				logger.info(`Going to change existing ILM rollover alias: ${val.settings.index.lifecycle.rollover_alias}  to: ${writeIndexAliasName} for index: ${key}`);
				// Update the Index ILM-Rollover-Alias to the WriteIndexAlias
				var updatedRolloverAliasResponse = await client.indices.putSettings({
					index: key, 
					body: { index: { "lifecycle.rollover_alias": writeIndexAliasName } } 
				}, { maxRetries: 3 });
				if(updatedRolloverAliasResponse.statusCode != 200) {
					logger.errr(`Error updateding rollover alias for index: ${key}. ${JSON.stringify(updatedRolloverAliasResponse)}`);
				}
			}
		}
	}
	return updatedRolloverAliasResponse;
}

module.exports = {
	getIndexConfig,
	getIndicesForLogtype,
	createIndices, 
	updateRolloverAlias
};

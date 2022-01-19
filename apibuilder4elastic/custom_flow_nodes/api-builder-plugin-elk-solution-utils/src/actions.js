const { ElasticsearchClient } = require('@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch/src/actions/ElasticsearchClient.js');
const os = require("os");
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
	// Additionally add the name to the indexConfig
	indexConfig.name = indexName;
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
		var indexExists = await client.indices.existsAlias({name: aliasName});
		if(indexExists.body) {
			logger.info(`Index with alias: ${aliasName} for region: ${region} already exists.`);
			continue;
		}
		logger.info(`Creating write index: ${myIndexName} for region: ${region} with alias: ${aliasName}`);
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
		/*
		 * Based on the main indexName get actual write index
		 * The given index name is for instance: apigw-trace-messages, apigw-traffic-details, ... 
		 * Examples: 
		 * Index: apigw-traffic-trace-000001 or apigw-traffic-trace-us-000001
		 * alias                   index                          filter routing.index routing.search is_write_index
		 * apigw-trace-messages-us apigw-trace-messages-us-000002 -      -             -              true
		 * apigw-trace-messages-us apigw-trace-messages-us-000001 -      -             -              false
		 */
		var indicesForName = await client.indices.get({index: `${indexName}-*`}, { maxRetries: 3 });
		logger.debug(`Check rollover alias for configured index: ${indexName} ... got ${Object.entries(indicesForName.body).length} indicies from Elasticsearch to check.`);
		// For each index returned on the name ...
		for (const [key, val] of Object.entries(indicesForName.body)) {
			logger.debug(`Check rollover alias for index: ${key} returned from Elasticsearch`);
			var writeIndexAliasName = undefined;
			// Check if current index is the write index
			for (const [aliasName, aliasSettings] of Object.entries(val.aliases)) {
				if(aliasSettings.is_write_index) {
					// If it is the write index, take over the write alias name to be used as the rollover alias
					logger.debug(`Index: ${key} is write index having writeIndexAliasName: ${aliasName}`);
					writeIndexAliasName = aliasName;
					break;
				}
			}
			if(writeIndexAliasName == undefined) {
				logger.debug(`Index ${key} is not the write index. Skipping ...`);
				continue;
			}
			// Check, if the rollover alias is still the default alias 
			if(writeIndexAliasName != val.settings.index.lifecycle.rollover_alias) {
				logger.info(`Change existing ILM rollover alias: ${val.settings.index.lifecycle.rollover_alias}  to: ${writeIndexAliasName} for index: ${key}`);
				// Update the Index ILM-Rollover-Alias to the WriteIndexAlias
				var updatedRolloverAliasResponse = await client.indices.putSettings({
					index: key, 
					body: { index: { "lifecycle.rollover_alias": writeIndexAliasName } } 
				}, { maxRetries: 3 });
				if(updatedRolloverAliasResponse.statusCode != 200) {
					logger.errr(`Error updateding rollover alias for index: ${key}. ${JSON.stringify(updatedRolloverAliasResponse)}`);
				} else {
					logger.debug(`Rollover alias for for index: ${key} successfully changed.`);
				}
			} else {
				logger.debug(`Existing ILM rollover alias: ${val.settings.index.lifecycle.rollover_alias} for index: ${key} is already correct. Nothing to do.`);
			}
		}
	}
	return updatedRolloverAliasResponse;
}

async function getPayloadFilename(params, options) {
	const { trafficDetails, correlationId, legNo, direction, region } = params;
	const { logger } = options;
	if (!trafficDetails) {
		throw new Error('Missing required parameter: trafficDetails');
	}
	if (typeof(trafficDetails) != 'object') {
		throw new Error('TrafficDetails must be an object');
	}
	if (!correlationId) {
		throw new Error('Missing required parameter: correlationId');
	}
	if (!legNo) {
		throw new Error('Missing required parameter: legNo');
	}
	if (!direction) {
		throw new Error('Missing required parameter: direction');
	}
	if(direction != "sent" && direction != "received") {
		throw new Error('Parameter: direction must be either sent or received.');
	}
	if(trafficDetails.body.hits.hits.length == 0) {
		return options.setOutput('noAccess', `No access as traffic details contains no hit.`);
	}
	if(trafficDetails.body.hits.hits.length > 1) {
		logger.warn(`Expected one Traffic-Details document for correlationId: ${correlationId} returned from Elasticsearch, but got: ${trafficDetails.body.hits.hits.length}. Using first document.`);
		logger.warn(`Returned Traffic-Details: ${JSON.stringify(trafficDetails)}`);
	}
	if(!trafficDetails.body.hits.hits[0]._source.transactionElements) {
		throw new Error(`Traffic-Details source must contain transactionElements.`);
	}
	if(!trafficDetails.body.hits.hits[0]._source.transactionElements[`leg${legNo}`]) {
		throw new Error(`No TransactionElement found with legNo: ${legNo}`);
	}
	var details = trafficDetails.body.hits.hits[0]._source;
	if(details.correlationId != correlationId) {
		throw new Error(`Traffic-Details correlationID: ${details.correlationId} does not match to correlationId: ${correlationId}`);
	}
	var transactionElement = details.transactionElements[`leg${legNo}`];
	var protocolInfo = transactionElement.protocolInfo;
	var filename;
	if(direction == "received") {
		filename = protocolInfo["recvPayload"]
	} else {
		filename = protocolInfo["sentPayload"]
	}
	if(!filename) {
		options.logger.debug(`No filename found for direction: ${direction} in protocolInfo: ${JSON.stringify(protocolInfo)}`);
		return options.setOutput('notFound', `No payload ${direction} for transaction: ${correlationId} on legNo: ${legNo}`);
	}
	// Example:
	// file:///opt/Axway/APIM/apigateway/logs/payloads/2020-07-03/08.55/0455ff5e82267be8182a553d-1-received
	var regex = /.*\/(\d{4}-\d{2}-\d{2}\/\d{2}\.\d{2}\/.*-\d+-(?:sent|received))/;
	var match = regex.exec(filename);
	if(match == null) {
		throw new Error(`Cannot parse given filename: '${filename}'`);
	}
	// 2020-07-03/08.55/0455ff5e82267be8182a553d-1-received
	var extractedFileName = match[1];
	if(region) {
		extractedFileName = region.toLowerCase() + "/" + extractedFileName;
	}
	return extractedFileName;
}

async function setupILMRententionPeriod(params, options) {
	const { indexConfig, ilmConfig, rententionPeriodConfig } = params;
	const { logger } = options;
	if (!indexConfig) {
		throw new Error('Missing required parameter: indexConfig');
	}
	if (!ilmConfig) {
		throw new Error('Missing required parameter: ilmConfig');
	}
	if (!rententionPeriodConfig) {
		logger.debug(`No retentionPeriodConfig is given. Using standard retention periods.`);
		return options.setOutput('notChanged', ilmConfig);
	}
	if (!indexConfig.name) {
		throw new Error('Index name is missing in indexConfig');
	}
	// Trying to read the retentionPeriodConfig file
	if (!rententionPeriodConfig.retentionPeriods) {
		throw new Error('rententionPeriodConfig must contain retentionPeriods object.');
	}
	const indexName = indexConfig.name;
	// Check if a retentionPeriod is defined for the given index
	if(!rententionPeriodConfig.retentionPeriods[indexName]) {
		logger.debug(`No retention period configured for index: ${indexName}. Using default ILM-Configuration.`);
		return options.setOutput('notChanged', ilmConfig);
	} else {
		var periodConfig = rententionPeriodConfig.retentionPeriods[indexName];
		// Defines when an index should be rolled over which means it enters the WARM, COLD, DELETE lifecycle
		debugger;
		if(periodConfig.rollover) {
			logger.info(`Changing ILM rollover configuration for index: ${indexName} with config: ${JSON.stringify(periodConfig.rollover)}`);
			var maxAge = parseInt(periodConfig.rollover.max_age);
			if(periodConfig.rollover.max_age) {
				ilmConfig.policy.phases.hot.actions.rollover.max_age = `${maxAge}d`;
			}
			if(periodConfig.rollover.max_size) {
				const maxSize = parseInt(periodConfig.rollover.max_size);
				if(isNaN(maxSize)) {
					throw new Error(`The given max_size: ${periodConfig.rollover.max_size} for index: ${indexName} is not a valid number.`);
				}
				if(maxSize<5) {
					throw new Error(`The given max_size: ${maxSize} for index: ${indexName} is too small. Please configure at least 5GB.`);
				}
				ilmConfig.policy.phases.hot.actions.rollover.max_size = `${maxSize}gb`;
			}
		}
		// The single value period is distributed across the lifecycle stages COLD AND DELETED. WARM is not considered for now, as an rolled over index should 
		// move to WARM immediatly after roll-over. This might be enhanced later if needed with extra config options instead of days only
		if(periodConfig.days) {
			var givenDays = parseInt(periodConfig.days);
			logger.info(`Changing ILM retention period for index: ${indexName} based on ${givenDays} number of days.`);
			// The given number of days is distrbuted evenly for stages COLD & DELETE
			var coldDays = Math.round(givenDays / 2); // It stay for a while warm before it goes to COLD
			var deleteDays = givenDays; // It stay for a while in COLD before delete
			ilmConfig.policy.phases.cold.min_age = `${coldDays}d`;
			ilmConfig.policy.phases.delete.min_age = `${deleteDays}d`;
		}
	}
	return ilmConfig;
}

async function getHostname(params, options) {
	const hostname = os.hostname();
	options.logger.debug(`API-Builder process is running on host: ${hostname}`);
	return hostname;
}

module.exports = {
	getIndexConfig,
	getIndicesForLogtype,
	createIndices, 
	updateRolloverAlias,
	getPayloadFilename,
	getHostname,
	setupILMRententionPeriod
};

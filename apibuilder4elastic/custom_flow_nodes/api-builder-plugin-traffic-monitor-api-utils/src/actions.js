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
async function handleFilterFields(parameters, options) {
	const { params, serviceID } = parameters;
	const { logger } = options;
	if (!params) {
		throw new Error('Missing required parameter: params');
	}
	if (!serviceID) {
		throw new Error('Missing required parameter: serviceID');
	}

	if(params.protocol == 'filetransfer') {
		params.protocol = 'fileTransfer';
	}

	var fields = [
		// This Object-Array declares for each field how to query it in ES
		{ fieldName: 'uri', queryType: 'match', queryLocation: 'http.uri', params: { operator: 'and' } },
		{ fieldName: 'wafStatus', queryType: 'match', queryLocation: 'http.wafStatus' },
		{ fieldName: 'finalStatus', queryType: 'match', queryLocation: 'finalStatus' },
		{ fieldName: 'remotePort', queryType: 'match', queryLocation: 'http.remotePort' },
		{ fieldName: 'remoteName', queryType: 'match', queryLocation: 'http.remoteName' },
		{ fieldName: 'localAddr', queryType: 'match', queryLocation: 'http.localAddr' },
		{ fieldName: 'status', queryType: 'match', queryLocation: 'http.status' },
		{ fieldName: 'subject', queryType: 'match', queryLocation: 'http.authSubjectId' },
		{ fieldName: 'operation', queryType: 'match', queryLocation: 'serviceContext.method' },
		{ fieldName: 'localPort', queryType: 'match', queryLocation: 'http.localPort' },
		{ fieldName: 'method', queryType: 'match', queryLocation: 'http.method' },
		{ fieldName: 'correlationId', queryType: 'match', queryLocation: 'correlationId' },
		{ fieldName: 'serviceName', queryType: 'match', queryLocation: 'serviceContext.service' },
		{ fieldName: 'servicetype', queryType: 'match', queryLocation: `${params.protocol}.serviceType` }
	];

	/* 
	 * Only if multiple fields & values are given in the request (e.g. search?field=uri&value=/v2/pet/findByStatus&field=method&value=GET)
	 * each is already an array  (e.g. field: ["uri", "method"], value: ["/v2/pet/findByStatus", "GET"] )
	 * Otherwise field and value is just a string (e.g. search?field=method&value=GET) --> field: method, value: GET
	 * The following converts the strings into an array
	 */
	if (typeof params.field == 'undefined') {
		params.field = [];
	}
	if (typeof params.field == 'string') {
		params.field = [params.field];
	}
	if (typeof params.value === 'undefined') {
		params.value = [];
	}
	if (typeof params.value == 'string') {
		params.value = [params.value];
	}

	var elasticSearchquery = { bool: { must: [] } } ;

	var filters = [];

	// Iterate over all known filter fields (e.g. uri, wafstatus, ...)
	fields.map(function (entry) {
		// Each field looks like so:
		// { fieldName: 'uri', queryType: 'match', queryLocation: 'http.uri', params: { operator: 'and' } }
		params.field.map(function (fieldEntry, index) {
			// This makes sure, that given request paramaters map to the correct field
			// as the API works like so: ...arch?field=uri&value=/petstore/v2/pet/findByTag&field=method&value=GET
			// This codes iterates over all fields and determines if  the field (which is basically a filter) is given
			if (entry.fieldName === fieldEntry) {
				// Is most of the time: match
				var queryType = entry.queryType;
				// Is the Elasticsearch property (e.g. http.uri)
				var queryLocation = entry.queryLocation;
				// May optionally contain additional params for the search query 
				var queryParams = entry.params;
				// Gets the value from the request (e.g. params.value[uri]) 
				var value = params.value[index];
				var filter = {};
				var filterQuery = {};
				// Example: filterQuery[http.uri] = /petstore/v2/pet/findByTag 
				filterQuery[queryLocation] = { query: value, ...queryParams };
				// Add search params to the filterQuery if given
				/*if(queryParams) {
					filterQuery = {...queryParams, ...filterQuery };
				}*/
				// Example: filter[match] = { http.uri: /petstore/v2/pet/findByTag }
				filter[queryType] = filterQuery;
				// All filters are then pushed into the queryFilters array
				// Example: [ {"match":{"http.uri":"/petstore/v2/pet/findByTag"}} , {"match":{"http.method":"GET"}} ]
				filters.push(filter);
				logger.debug(JSON.stringify(filter));
			}
		});
	});
	await addProtocolFilter(filters, params, logger);
	await addServiceIdFilter(filters, serviceID, logger);
	await addDurationFilter(filters, params, logger);
	await addAgoFilter(filters, params, logger);
	await addTimestampFilter(filters, params, logger);
	elasticSearchquery.bool.must = filters;
	logger.info(`Elasticsearch query: ${JSON.stringify(elasticSearchquery)}`);
	return elasticSearchquery;
}

async function addProtocolFilter(filters, params, logger) {
	/*
	 * Default handling for some of the fields
	 */
	if (typeof params.protocol == 'undefined') {
		params.protocol = 'http';
	}
	// Making sure, it's getting data only for the selected protocol
	filters.push({ "exists": { "field": params.protocol } });
}

async function addServiceIdFilter(filters, serviceID, logger) {
	if (serviceID == undefined) {
		throw new Error("The serviceID is missing.");
	}
	// Get the data from the correct API-Gateway instance
	filters.push({ "term": { "processInfo.serviceId": serviceID } });
}

async function addDurationFilter(filters, params, logger) {
	params.field.map(function (entry, index) {
		var op = params.op;
		var value = params.value[index];
		if (entry === 'duration') {
			var filter = {
				range: {
					"duration": {
						"gte": value
					}
				}
			};
			filters.push(filter);
			return filters;
		}
	});
}

async function addAgoFilter(filters, params, logger) {
	if (params.ago) {
		var ago = params.ago;
		var diff = convertAgo(ago, logger);
		var filter = {
			range: {
				"@timestamp": {
					gt: diff
				}
			}
		};
		filters.push(filter);
		return filters;
	}
}

async function addTimestampFilter(filters, params, logger) {
	params.field.map(function (entry, index, field) {
		var op = params.op;
		if (entry === 'timestamp') {
			// If timestamp is given, we expect to get a start and end
			var begin = params.value[index];
			var end = 0;
			if (field[index + 1] === 'timestamp') {
				end = params.value[index + 1];
			} else {
				return filters;
			}
			logger.debug(`Timestamp filter begin: ${begin}, end: ${end}`);
			var filter = {
				range: {
					"@timestamp": {
						"gte": begin,
						"lte": end
					}
				}
			};
			filters.push(filter);
			return filters;
		}
	});
}

function convertAgo(ago, logger) {
	var diff = ago.substring(0, ago.length - 1);
	var now = new Date();
	if (ago.endsWith('m')) {
		return now.setMinutes(now.getMinutes() - diff);
	} else if (ago.endsWith('h')) {
		return now.setHours(now.getHours() - diff);
	}
	logger.error(`Error converting ago: ${ago}`);
}

module.exports = {
	handleFilterFields
};

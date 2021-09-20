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
	const { params, serviceID, gatewayTopology, region } = parameters;
	const { logger } = options;
	if (!params) {
		throw new Error('Missing required parameter: params');
	}
	if (!serviceID) {
		throw new Error('Missing required parameter: serviceID');
	}
	if (!gatewayTopology) {
		throw new Error('Missing required parameter: gatewayTopology');
	}

	if (params.protocol == 'filetransfer') {
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
		{ fieldName: 'status', queryType: 'match', queryLocation: addStatusFilter },
		{ fieldName: 'subject', queryType: 'match', queryLocation: 'http.authSubjectId', params: { operator: 'and' } },
		{ fieldName: 'sslsubject', queryType: 'match', queryLocation: 'http.sslSubject', params: { operator: 'and' } },
		{ fieldName: 'operation', queryType: 'match', queryLocation: 'serviceContext.method', params: { operator: 'and' } },
		{ fieldName: 'localPort', queryType: 'match', queryLocation: 'http.localPort' },
		{ fieldName: 'method', queryType: 'match', queryLocation: 'http.method' },
		{ fieldName: 'correlationId', queryType: 'match', queryLocation: 'correlationId' },
		{ fieldName: 'serviceName', queryType: 'match', queryLocation: 'serviceContext.service', params: { operator: 'and' } },
		{ fieldName: 'servicetype', queryType: 'match', queryLocation: `${params.protocol}.serviceType` },
		{ fieldName: 'vhost', queryType: 'match', queryLocation: `http.vhost.text`, params: { operator: 'and' } },
		// Fields for JMS
		{ fieldName: 'jmsDeliveryMode', queryType: 'match', queryLocation: `${params.protocol}.jmsDeliveryMode` },
		{ fieldName: 'jmsDestination', queryType: 'match', queryLocation: `${params.protocol}.jmsDestination` },
		{ fieldName: 'jmsMessageID', queryType: 'match', queryLocation: `${params.protocol}.jmsMessageID` },
		{ fieldName: 'jmsPriority', queryType: 'match', queryLocation: `${params.protocol}.jmsPriority` },
		{ fieldName: 'jmsRedelivered', queryType: 'match', queryLocation: `${params.protocol}.jmsRedelivered` },
		{ fieldName: 'jmsReplyTojmsReplyTo', queryType: 'match', queryLocation: `${params.protocol}.jmsReplyTo` },
		{ fieldName: 'jmsStatus', queryType: 'match', queryLocation: `${params.protocol}.jmsStatus` },
		{ fieldName: 'jmsType', queryType: 'match', queryLocation: `${params.protocol}.jmsType` }
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

	var elasticSearchquery = { bool: { must: [] } };

	var filters = {
		mustFilters: [],
		mustNotFilters: []
	};

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
				if(typeof queryLocation == 'function') {
					queryLocation(filters, entry.fieldName, value, queryParams, params)
				} else {
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
					filters.mustFilters.push(filter);
				}
				logger.debug(JSON.stringify(filter));
			}
		});
	});
	debugger;
	await addProtocolFilter(filters.mustFilters, params, logger);
	await addServiceIdFilter(filters, serviceID, gatewayTopology, logger);
	await addRegionFilter(filters.mustFilters, region, logger);
	await addDurationFilter(filters.mustFilters, params, logger);
	await addAgoFilter(filters.mustFilters, params, logger);
	await addTimestampFilter(filters.mustFilters, params, logger);
	await addJMSPropertyFilter(filters.mustFilters, params, logger);
	if(filters.mustFilters.length != 0) {
		elasticSearchquery.bool.must = filters.mustFilters;
	}
	if(filters.mustNotFilters.length != 0) {
		elasticSearchquery.bool.must_not = filters.mustNotFilters;
	}
	logger.info(`Elasticsearch query: ${JSON.stringify(elasticSearchquery)}`);
	return elasticSearchquery;
}


async function createCircuitPathQuery(parameters, options) {
	const { params, user, authzConfig, gatewayTopology } = parameters;
	const { logger } = options;
	if (!params) {
		throw new Error('Missing required parameter: params');
	}
	if (!user) {
		throw new Error('Missing required parameter: user');
	}
	if (!authzConfig) {
		throw new Error('Missing required parameter: authzConfig');
	}
	if (!params.correlationID) {
		throw new Error('Missing required parameter: params.correlationID');
	}
	if (!gatewayTopology) {
		throw new Error('Missing required parameter: gatewayTopology');
	}
	if (!gatewayTopology.emtEnabled && !params.serviceID) {
		throw new Error('Missing required parameter: params.serviceID when not using EMT.');
	}
	var elasticQuery = { bool: { must: [
                { term: { correlationId: params.correlationID } },
            ] }
    };
	if(!gatewayTopology.emtEnabled) { // Don't include serviceId filter, if EMT is enabled
		elasticQuery.bool.must.push(
			{ term: { 'processInfo.serviceId': params.serviceID } }
		);
	}
	// If user is an Admin or AuthZ is disabled, return the base query
	if (user.gatewayManager.isUnrestricted || authzConfig.enableUserAuthorization == false) {
		return elasticQuery;
	}
	// If AuthZ based on API-Managers is enabled check if the user has an Admin-Role
	if (authzConfig.apimanagerOrganization && authzConfig.apimanagerOrganization.enabled) {
		var orgFilter;
		if (user.apiManager.role == "admin") {
			orgFilter = {
				exists: {
					"field": "transactionSummary.serviceContext"
				}
			};
		} else {
			orgFilter = {
				term: {
					"transactionSummary.serviceContext.apiOrg": user.apiManager.organizationName
				}
			};
		}
		elasticQuery.bool.must.push(orgFilter);
	}
	// Traffic-Details don't contain any custom properties - Hence an AuthZ based on Custom-Properties is not possible here
    return elasticQuery;
}

async function getTransactionElementLegInfo(parameters, options) {
	const { transactionElements, legIdParam, detailsParam, sheadersParam, rheadersParam, correlationId, timestamp } = parameters;
	const { logger } = options;
	var resultLegs = [];
	if (!transactionElements) {
		throw new Error('Missing required parameter: transactionElements');
	}
	if (legIdParam == undefined) {
		throw new Error('Missing required parameter: legIdParam');
	}
	if (detailsParam == undefined) {
		throw new Error('Missing required parameter: detailsParam');
	}
	if (sheadersParam == undefined) {
		throw new Error('Missing required parameter: sheadersParam');
	}
	if (rheadersParam == undefined) {
		throw new Error('Missing required parameter: rheadersParam');
	}
	if (!correlationId) {
		throw new Error('Missing required parameter: correlationId');
	}
	if (!timestamp) {
		throw new Error('Missing required parameter: timestamp');
	}
	for (var item in transactionElements) {
		let sourceLeg = transactionElements[item];
		let resultLeg = {
			details: null,
			rheaders: null,
			sheaders: null
		};
		if (legIdParam != '*' && legIdParam != sourceLeg.leg) {
			continue; // Skip this leg
		}
		if (detailsParam == '1') {
			await _addLegDetails(sourceLeg, resultLeg, correlationId, timestamp, logger);
		}
		if (rheadersParam == '1') {
			await _addFormattedHeaders(sourceLeg, resultLeg, correlationId, 'received', logger);	
		}
		if (sheadersParam == '1') {
			await _addFormattedHeaders(sourceLeg, resultLeg, correlationId, 'sent', logger);	
		}
		if(legIdParam != '*') {
			return resultLeg;
		}
		resultLegs[sourceLeg.leg] = resultLeg;	
	}
	// It might happen, that leg numbers are not in a row, for missing legs, we are adding an empty default
	// Note: 
	// It would certainly also be possible not to take over the given Leg number and instead 
	// to renumber the resultLegs. 
	// However, it may help to see the original Leg ID in case of errors for better analysis.
	for (var i = 0; i < resultLegs.length; i++) {
		if(resultLegs[i]==null) {
			resultLegs[i] = { details: {}, rheaders: [], sheaders: []};
		}
	}
	return resultLegs;
}

async function _addFormattedHeaders(sourceLeg, resultLeg, correlationId, direction, logger) {
	let rawHeader = [];
	try {
		if(direction == 'received') {
			if(!sourceLeg.protocolInfo.recvHeader) return;
			rawHeader = sourceLeg.protocolInfo.recvHeader.split("\r\n");
		} else {
			if(!sourceLeg.protocolInfo.sentHeader) return;
			rawHeader = sourceLeg.protocolInfo.sentHeader.split("\r\n");
		}
		// Formatting the headers
		let attributes = [];

		rawHeader.forEach(function (item, index) {
			if (index != 0) {
				let attribObj = {};
				let n = item.indexOf(":");
				let attribName = item.substr(0, n).toString();
				let atrribValue = (item.substr(n + 1).trim());
				if (attribName.length != 0) {
					attribObj[attribName] = atrribValue;
					attributes.push(attribObj);
				}
			}
		});
		if(direction == 'received') {
			resultLeg.rheaders = attributes;
		} else {
			resultLeg.sheaders = attributes;
		}
	} catch (err) {
		logger.error(`Error adding details for leg: ${sourceLeg.leg} of transaction: ${correlationId} (Header). Error: ${err}`);
	}
}

async function _addLegDetails(sourceLeg, resultLeg, correlationId, timestamp, logger) {
	try {
		var details = {};
		if(sourceLeg.protocolInfo.http) {
			details = { ...sourceLeg.protocolInfo.http};
			if(!sourceLeg.protocolInfo.http.vhost) details.vhost = null;
			details.statustext = sourceLeg.protocolInfo.http.statusText;
			details.subject = sourceLeg.protocolInfo.http.authSubjectId;
			details.type = 'http';
		} else if(sourceLeg.protocolInfo.jms) {
			details = { ...sourceLeg.protocolInfo.jms};
			if(!sourceLeg.protocolInfo.jms.jmsStatusText) details.jmsStatusText = null;
			details.type = 'jms';
		} else {
			logger.error(`Cannot get protocolInfo details from object: ${JSON.stringify(sourceLeg.protocolInfo)}`);
		}
		details.leg = sourceLeg.leg;
		details.timestamp = Date.parse(timestamp); //Needs to be formatted
		details.duration = sourceLeg.duration;
		details.correlationId = correlationId;
		details.serviceName = sourceLeg.serviceName;
		details.operation = sourceLeg.operation;
		details.finalStatus = (typeof sourceLeg.finalStatus === 'undefined') ? null : sourceLeg.finalStatus; //need to be checked - not always avail in test data 


		resultLeg.details = details;
	} catch (err) {
		logger.error(`Error adding details for leg: ${sourceLeg.leg} of transaction: ${correlationId} (Leg-Details). Error: ${err}`);
	}
}

function addStatusFilter(filters, fieldName, statusCodeFilter, queryParams, params) {
	if (typeof statusCodeFilter == 'undefined') {
		return;
	}
	if(!statusCodeFilter.match(/^!?[0-9x]{3}$/)) { // Matches 200, !500, !2xx, 3xx
		throw new Error(`Unsupported status code filter: ${statusCodeFilter}`);
	}
	var filtersToUse;
	if(statusCodeFilter.startsWith("!")) {
		filtersToUse = filters.mustNotFilters;
		statusCodeFilter = statusCodeFilter.replace("!", "");
	} else {
		filtersToUse = filters.mustFilters;
	}
	var startValue;
	var endValue;
	// Direct filter such as 200 or !200
	if(statusCodeFilter.indexOf("x")==-1) {
		startValue = parseInt(statusCodeFilter);
		endValue = parseInt(statusCodeFilter);
	// A range filter such as 2xx or !2xx or even 40x or !40x
	} else {
		startValue = parseInt(statusCodeFilter.replace(/x/g, "0"));
		endValue = parseInt(statusCodeFilter.replace(/x/g, "9"));
	}
	filtersToUse.push({ "range": { "http.status": { "gte": startValue, "lte": endValue } } });
	return filters;
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

async function addRegionFilter(filters, region, logger) {
	if(!region) return;
	filters.push({ "term": { "processInfo.gatewayRegion": region } });
}

async function addServiceIdFilter(filters, serviceID, gatewayTopology, logger) {
	if (serviceID == undefined) {
		throw new Error("The serviceID is missing.");
	}
	var includeOtherServiceIDs = false;
	var prefix;
	// If EMT is enabled, we also need to include services that no longer exists
	if(gatewayTopology.emtEnabled) {
		prefix = serviceID.substring(0,serviceID.indexOf("-")+1);
		logger.info(`EMT-Mode - Is enabled. Including serviceIds with prefix: ${prefix}`);
		logger.debug(`EMT-Mode - Topology: ${JSON.stringify(gatewayTopology)}`);
		// Figure out, if the serviceId of this request is the first in the topology and ignore services
		// having a totally different name. 
		// In that case traffic-7cb4f6989f-bjw8n vs. apimgr-6c9876cb48-g4sdq, services not starting with traffic-
		// will be ignored
		for (var i = 0; i < gatewayTopology.services.length; i++) {
			var service = gatewayTopology.services[i];
			if(service.id.startsWith(prefix)) {
				// The service belongs to the same gateways
				if(service.id == serviceID) {
					logger.debug(`EMT-Mode - Request for serviceID: ${serviceID} is handling other serviceIDs.`);
					includeOtherServiceIDs = true;
					break; 
				} else {
					break; // This request is not responsible to load remaining services
				}
			} else {
				logger.debug(`EMT-Mode - Ignoring serviceID: ${service.id}`);
				continue;
			}
		}
	}
	if(!includeOtherServiceIDs) {
		// For classic mode, we simply include the serviceId
		logger.debug(`Classic-Mode: Request for serviceId: ${serviceID} does NOT include other serviceIDs. Looking up this serviceId only.`);
		filters.mustFilters.push({ "term": { "processInfo.serviceId": serviceID } });
	} else {
		logger.info(`EMT-Mode - Request for serviceId: ${serviceID} is including other serviceIDs.`);
		// Include a wildcard for all services no longer active
		filters.mustFilters.push( { "bool": {
			// Should turns into an OR condition
			"should": [ {
				// Include the serviceId given
				"term": { "processInfo.serviceId": serviceID }
			},
				// And all other services 
			{
				"match": { "processInfo.serviceId.text": prefix }
			}
		 ]
		} });
		// But ignore all other Service-IDs which are still active, as they are handled by a separate dedicated request for this service-ID
		gatewayTopology.services.forEach(function (service) {
			if(service.id.startsWith(prefix) && service.id!=serviceID) {
				logger.info(`EMT-Mode - Exclude serviceID: ${service.id} as it handled by another request.`);
				filters.mustNotFilters.push({ "term": { "processInfo.serviceId": service.id } });
			}
		});
	}
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

async function addJMSPropertyFilter(filters, params, logger) {
	if(!params.jmsPropertyName) return;
	
	var propertyName = params.jmsPropertyName;
	var propertyValue = params.jmsPropertyValue;
	var filter = {
		match: {
			"recvHeader": {
				"query": `${propertyName} ${propertyValue}`,
				"operator": "and"
			}
		}
	};
	filters.push(filter);
	return filters;
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
	handleFilterFields,
	createCircuitPathQuery,
	getTransactionElementLegInfo
};

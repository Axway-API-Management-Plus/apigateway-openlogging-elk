const path = require('path');
const fs = require('fs');

/*
	By default, the solution uses user's API Manager organization to determine which 
	API-Requests they are allowed to see in the API Gateway Traffic-Monitor. 
	This behavior can be customized. 

	General authorizationConfig
*/
var authorizationConfig = {
	// For how long should the information cached by the API-Builder process
	cacheTTL: parseInt(process.env.EXT_AUTHZ_CACHE_TTL) ? process.env.EXT_AUTHZ_CACHE_TTL : 300,
	// If you would like to disable user authorization completely, set this flag to false
	enableUserAuthorization: true,
	// Authorize users based on their API-Manager organization (this is the default)
	apimanagerOrganization: {
		enabled: true
	},
	// You may use an external HTTP-Service used for the authorization
	// The configuration set here is passed to the methods: createRequestUri and handleResponse as a cfg object, 
	// which can use it as needed to generate the restricted query.
	// Consider the following purely as an example.
	externalHTTP : {
		enabled: false,
		// URI you want to use for the lookup - Implement the method: createRequestUri to replace for instance the loginName
		// e.g.: https://authz.ac.customer.com/api/v1/users/__loginName__/groups?registry=AD&caching=false&filter=apg-t
		uri: process.env.EXT_AUTHZ_URI, 
		// Wich indexed field should be used to customize the query
		// This field is used in a terms or match clause 
		// e.g.: customProperty1.apimId 
		restrictionField: "customProperties.field1",
		// When requesting details, such as CircuitPath or Payloads the Traffic-Details index is used, which stores 
		// custom properties at a different place as part of the transactionSummary object, 
		// hence this field must be used to limit the query. 
		detailedRestrictionField: "transactionSummary.customProperties.field1",
		// The type of the customProperty as it's configured in the API-Manager (custom, select, switch)
		// As they are indexed differently (keyword vs text), they are queried using a term or match clause
		// custom (text-field) --> { "match": { "customProperties.field1": "DGP UIF CSPARTINT CORSOEDMS CORSOLMS TCL" } }
		// select/switch --> { "terms": { "customProperties.field1": [ "DGP", "UIF", "CSPARTINT", "CORSOEDMS", "CORSOLMS", "TCL" ] } }
		restrictionFieldType: "select", 
		
		// If you would like to add some headers to the request you can do configure it here
		// headers: { requiredHeader: "HeaderValue"},
		// By default GET is used, but you can overwrite the method if you need
		// method: "POST",
		// Adjust the payload 
		//body: { JSON: "Payload is supported as of now" },

		options: {
			// Disables certificate validation completely
			// insecureSSL: true,

			// or use this CA to validate the server certificate
			// ca: fs.readFileSync('../../../config/certificates/external-https-ca.crt'),

			// Mutual SSL-Support
			/*
			 * cert: fs.readFileSync('PathToClientCertificate'),
			 * key: fs.readFileSync('PathToKeyFile'),
			 * Key passphrase
			 * passphrase: 'password'
			*/
		}
	}
}

/**
 * Method is called, when externalHTTP is enabled and before the request is send 
 * to the external service. You may use it to change the Uri if needed.
 *
 * @param {object} user - The user actually using the Traffic-Monitor (ANM).
 * @param {object} cfg - The configuration provided above within authorizationConfig.externalHTTP
 * @param {object} options.pluginConfig - The service configuration for this
 *	 plugin from API Builder config.pluginConfig['api-builder-plugin-pluginName']
 * @param {object} options.logger - The API Builder logger which can be used
 *	 to log messages to the console.
 * @return {string} returns the manipulated request URI, which should be send
 */
async function createRequestUri(user, cfg, options) {
	// Replace for instance the loginName which is part of the URI
	/* Example to use some kind of regex to be performed on the given username
		var match = /CN=([0-9a-zA-Z]*)/.exec(username);
		var userId = match[1];
	*/
	return cfg.uri.replace("__loginName__", user.loginName);
}

/**
 * Method is called, when externalHTTP is enabled after the response has returned 
 * from the external HTTP service. Implement it to create you restricted query.
 *
 * @param {object} response - The HTTP-Response returned from the external HTTP-Service.
 * @param {object} elasticQuery - The Elasticsearch query that should be enhanced with custom restrictions
 * @param {object} cfg - The configuration provided above within authorizationConfig.externalHTTP
 * @param {object} options.pluginConfig - The service configuration for this
 *	 plugin from API Builder config.pluginConfig['api-builder-plugin-pluginName']
 * @param {object} options.logger - The API Builder logger which can be used
 *	 to log messages to the console.
 * @param {object} restrictionField - contains either the value from externalHTTP.restrictionField or 
 *   externalHTTP.detailedRestrictionField. Depends if the user has requested the traffic overview or traffic details.
 * @return {string} returns the restricted Elasticsearch query, that will limit the query result according to the user permissions
 */
async function handleResponse(response, elasticQuery, cfg, options, restrictionField) {
	var filters = elasticQuery.bool.must;
	var regex = /.{3}-.{2}-.{2}-.{3}-.{1}-(.*)-.*/;
	var apimIds = [];
	const { logger } = options;
	for (const value of Object.values(response.body.data)) {
		logger.debug(`Try to parse result: '${value}'`);
		var match = regex.exec(value);
		if(match == null) {
			throw new Error(`Unexpected response format. Cannot parse: '${value}'`);
		}
		var apimId = match[1];
		if(apimIds.indexOf(apimId) == -1) {
			logger.debug(`Adding APIM-ID: ${apimId} to the list of allowed groups`);
			apimIds.push(apimId);
		}
	}
	var filter = {};
	if(cfg.restrictionFieldType == "custom") {
		filter[restrictionField] = apimIds.join(' ');
		filters.push({match: filter });
	} else {
		filter[restrictionField] = apimIds;
		filters.push({terms: filter });
	}
	return elasticQuery;
}

module.exports = {
	authorizationConfig,
	handleResponse,
	createRequestUri
}
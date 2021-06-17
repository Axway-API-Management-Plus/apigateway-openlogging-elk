const path = require('path');
const fs = require('fs');

var authorizationConfig = {
	// For how long should the information cached by the API-Builder process
	cacheTTL: parseInt(process.env.EXT_AUTHZ_CACHE_TTL) ? process.env.EXT_AUTHZ_CACHE_TTL : 300,
	externalHTTP : {
		// e.g.: https://authz.ac.customer.com/api/v1/users/__loginName__/groups?registry=AD&caching=false&filter=apg-t
		uri: process.env.EXT_AUTHZ_URI, 
		// e.g.: customProperty1.apimId
		restrictionField: "customProperties.field1",
		// When requesting details, such as CircuitPath or Payloads the Traffic-Details index is used, which stores 
		// custom properties at a different place as part of the transactionSummary object, 
		// hence this field must be used to limit the query. 
		detailedRestrictionField: "transactionSummary.customProperties.field1",
		// The type of the customProperty as it's configured in the API-Manager (custom, select, switch)
		restrictionFieldType: "select", 
		options: {
			// Disables certificate validation
			// insecureSSL: true,
			// Validate server certificate with this CA.
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

async function createRequestUri(user, cfg, options) {
	// Replace the loginName which is part of the URI
	return cfg.uri.replace("__loginName__", user.loginName);
}

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
	createRequestUri,
}
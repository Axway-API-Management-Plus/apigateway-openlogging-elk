/*
By default, the solution uses user's API Manager organization to determine which 
API-Requests they are allowed to see in the API Gateway Traffic-Monitor. 
This behavior can be customized. 

This option is customized for a very specific external HTTP service, as in this 
example, which returns  information about a user's access rights. This information 
is used to customize the Elasticsearch query. 

Example response for this service:
{
  "status": 200,
  "data": [
    "CHR-GP-SV-APG-P-DGP-Approver",
    "CHR-GP-SV-APG-P-UIF-Developer",
    "CHR-GP-SV-APG-P-UIF-Approver",
    "CHR-GP-SV-APG-P-CSPARTINT-Approver",
    "CHR-GP-SV-APG-P-CORSOEDMS-Approver",
    "CHR-GP-SV-APG-P-CORSOLMS-Approver",
    "CHR-GP-SV-APG-P-TCL-Approver",
    "CHR-DP-SV-APG-P-UIF-Developer",
    "CHR-DP-SV-APG-P-DGP-Approver",
    "CHR-DP-SV-APG-P-UIF-Approver",
    "CHR-DP-SV-APG-P-CSPARTINT-Approver",
    "CHR-DP-SV-APG-P-CORSOEDMS-Approver",
    "CHR-DP-SV-APG-P-CORSOLMS-Approver",
    "CHR-DP-SV-APG-P-TCL-Approver"
  ]
}
This result is parsed to get a collection of groups, which are used to customize the query.
*/

var authorizationConfig = {
	// For how long should the information cached by the API-Builder process
	cacheTTL: parseInt(process.env.EXT_AUTHZ_CACHE_TTL) ? process.env.EXT_AUTHZ_CACHE_TTL : 300,
	externalHTTP : {
		// URI you want to use for the lookup, the variable loginName will be replaced, all the rest is static
		// e.g.: https://authz.ac.customer.com/api/v1/users/${loginName}/groups?registry=AD&caching=false&filter=apg-t
		uri: process.env.EXT_AUTHZ_URI, 
		// Wich indexed field should be used to customize the query
		// This field is used in a terms or match clause 
		// e.g.: customProperty1.apimId 
		restrictionField: "customProperties.field1",
		// The type of the customProperty as it's configured in the API-Manager (custom, select, switch)
		// As they are indexed differently (keyword vs text), they are queried using a term or match clause
		// custom (text-field) --> { "match": { "customProperties.field1": "DGP UIF CSPARTINT CORSOEDMS CORSOLMS TCL" } }
		// select/switch --> { "terms": { "customProperties.field1": [ "DGP", "UIF", "CSPARTINT", "CORSOEDMS", "CORSOLMS", "TCL" ] } }
		restrictionFieldType: "select", 
	}
}

async function handleResponse(response, elasticQuery, cfg, options) {
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
		filter[cfg.restrictionField] = apimIds.join(' ');
		filters.push({match: filter });
	} else {
		filter[cfg.restrictionField] = apimIds;
		filters.push({terms: filter });
	}
	return elasticQuery;
}

module.exports = {
	authorizationConfig,
	handleResponse
}
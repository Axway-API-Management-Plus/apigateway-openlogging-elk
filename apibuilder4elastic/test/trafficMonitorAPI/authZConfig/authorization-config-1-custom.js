module.exports = {
	'userAuthorization': {
		// For how long should the information cached by the API-Builder process
		cacheTTL: parseInt(process.env.EXT_AUTHZ_CACHE_TTL) ? process.env.EXT_AUTHZ_CACHE_TTL : 300,
		'externalHTTP1' : {
			// e.g.: https://authz.ac.customer.com/api/v1/users/${loginName}/groups?registry=AD&caching=false&filter=apg-t
			uri: process.env.EXT_AUTHZ_URI, 
			// e.g.: customProperty1.apimId
			restrictionField: "customProperties.field1", 
			restrictionFieldType: "custom" // Simulates a custom property configured as clear text
		}
	}
};
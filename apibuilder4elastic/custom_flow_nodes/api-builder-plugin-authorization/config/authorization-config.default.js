module.exports = {
	pluginConfig: {
		'api-builder-plugin-authorization': {
			'organization': {
				// No config yet
			},
			// Option number one for external authorization
			'externalHTTPAuthorization1': {
				// e.g.: https://authz.ac.customer.com/api/v1/users/${loginName}/groups?registry=AD&caching=false&filter=apg-t
				uri: process.env.EXT_AUTHZ_URI, 
				// e.g.: customProperty1.apimId
				restrictionField: process.env.EXT_AUTHZ_RESTRICTION_FIELD,
				// For how long should the information being cached by the API-Builder process
				cacheTTL: parseInt(process.env.EXT_AUTHZ_CACHE_TTL) ? process.env.EXT_AUTHZ_CACHE_TTL : 600
			}
		}
	}
};

const path = require('path');
const fs = require('fs');

var authorizationConfig = {
	enableUserAuthorization: false,
	// For how long should the information cached by the API-Builder process
	cacheTTL: parseInt(process.env.EXT_AUTHZ_CACHE_TTL) ? process.env.EXT_AUTHZ_CACHE_TTL : 300,
	apimanagerOrganization: {
		enabled: false
	},
	externalHTTP : {
		enabled: false
	}
}

module.exports = {
	authorizationConfig
}
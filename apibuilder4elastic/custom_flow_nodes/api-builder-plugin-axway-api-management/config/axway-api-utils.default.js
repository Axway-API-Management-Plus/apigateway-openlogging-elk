module.exports = {
	pluginConfig: {
		'api-builder-plugin-axway-api-management': {
			'apigateway': {
				url: process.env.ADMIN_NODE_MANAGER,
				//username: process.env.API_GATEWAY_USERNAME, // For future use
				//password: process.env.API_GATEWAY_PASSWORD // For future use
			},
			'apimanager': {
				url: process.env.API_MANAGER, // If not set, the API-Gateway hostname is used
				username: process.env.API_MANAGER_USERNAME, // User with Admin-Privileges required
				password: process.env.API_MANAGER_PASSWORD 
			}, 
			// This is true, when running as part of the CI-Pipeline (GitHub Actions)
			// If true, some test API-Requests are then mocked
			MOCK_LOOKUP_API: process.env.MOCK_LOOKUP_API,
			// Optionally, the API-Builder is looking up APIs first the local configuration file
			localLookupFile: process.env.API_BUILDER_LOCAL_API_LOOKUP_FILE,
			// This optionally disables the validation of the configuration on API-Builder startup
			validateConfig: (process.env.VALIDATE_CONFIG) ? process.env.VALIDATE_CONFIG : true,
			// For how long should looked up entities (API, User) stay in the cached
			lookupCacheTTL: parseInt(process.env.LOOKUP_CACHE_TTL) ? process.env.LOOKUP_CACHE_TTL : 600
		}
	}
};

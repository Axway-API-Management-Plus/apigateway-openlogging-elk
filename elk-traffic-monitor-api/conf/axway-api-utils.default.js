module.exports = {
	pluginConfig: {
		'api-builder-plugin-axway-api-management': {
			'apigateway': {
				hostname: process.env.API_GATEWAY_HOSTNAME,
				port: parseInt(process.env.API_GATEWAY_PORT) || 8090 // Admin-Node-Manager server port
				//username: process.env.API_GATEWAY_USERNAME, // For future use
				//password: process.env.API_GATEWAY_PASSWORD // For future use
			},
			'apimanager': {
				hostname: process.env.API_MANAGER_HOSTNAME, // If not set, the API-Gateway hostname is used
				port: parseInt(process.env.API_MANAGER_PORT) || 8075, // API-Manager server port
				username: process.env.API_MANAGER_USERNAME, // User with Admin-Privileges required
				password: process.env.API_MANAGER_PASSWORD
			} 
		}
	}
};

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
			} 
		}
	}
};

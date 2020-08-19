module.exports = {
	pluginConfig: {
		'api-builder-plugin-axway-api-management': {
			'apigateway': {
				url: process.env.ADMIN_NODE_MANAGER,
				//username: process.env.ANM_USERNAME, // For future use
				//password: process.env.ANM_PASSWORD // For future use
			},
			'apimanager': {
				url: process.env.API_MANAGER, // If not set, the Admin-Node-Manager hostname is used
				username: process.env.API_MANAGER_USERNAME, // User with Admin-Privileges required
				password: process.env.API_MANAGER_PASSWORD
			} 
		}
	}
};

const { sendRequest } = require('./utils');
const https = require('https');
const os = require("os");

/**
 * Action method.
 *
 * @param {object} params - A map of all the parameters passed from the flow.
 * @param {object} options - The additional options provided from the flow
 *	 engine.
 * @param {object} options.pluginConfig - The service configuration for this
 *	 plugin from API Builder config.pluginConfig['api-builder-plugin-pluginName']
 * @param {object} options.logger - The API Builder logger which can be used
 *	 to log messages to the console. When run in unit-tests, the messages are
 *	 not logged.  If you wish to test logging, you will need to create a
 *	 mocked logger (e.g. using `simple-mock`) and override in
 *	 `MockRuntime.loadPlugin`.  For more information about the logger, see:
 *	 https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/logging.html
 * @param {*} [options.pluginContext] - The data provided by passing the
 *	 context to `sdk.load(file, actions, { pluginContext })` in `getPlugin`
 *	 in `index.js`.
 * @return {*} The response value (resolves to "next" output, or if the method
 *	 does not define "next", the first defined output).
 */
async function getAPIKPIs(params, options) {
	const { apiManagerConfig, previousKPIs, organization } = params;
	var { kpis } = params;
	const { logger } = options;

	await _checkCommonParams(params);
	kpis = await _addKPIMetaInformation(params, kpis);

	const apis = await _getManagerAPIs(apiManagerConfig.connection);
	// Unfortunately we have to check the organization like so, as everything in the Sub-Flow comes with $.request incl. the organization
	// Therefore the organization is always set
	if(organization && organization.name && organization.id) {
		logger.debug(`Filtering APIs for organization: ${organization.name} (${organization.id}).`);
		var apiCount = 0;
		for (i = 0; i < apis.length; i++) {
			var api = apis[i];
			if(api.organizationId == organization.id) {
				apiCount++;
			}
		}
		logger.debug(`Found: ${apiCount} APIs for organization ${organization.name} (${organization.id}).`);
		kpis.apis_total = apiCount;
		kpis.apis_total_diff = 0;
		kpis.organization = organization.name;
		if(previousKPIs) {
			kpis.apis_total_diff = await _getDifference(apiCount, previousKPIs.apis_total, "APIs", options);
		}
	} else {
		logger.debug(`Found: ${apis.length} APIs for all organizations.`);
		kpis.apis_total = apis.length;
		kpis.apis_total_diff = 0;
		if(previousKPIs) {
			kpis.apis_total_diff = await _getDifference(apis.length, previousKPIs.apis_total, "APIs", options);
		}
	}
	return kpis;
}

async function getAppKPIs(params, options) {
	const { apiManagerConfig, previousKPIs, includeSubscriptions, organization } = params;
	var { kpis } = params;
	const { logger } = options;

	await _checkCommonParams(params);
	kpis = await _addKPIMetaInformation(params, kpis);

	const apps = await _getManagerApplications(apiManagerConfig.connection);

	var consideredApps = apps;
	// Unfortunately we have to check the organization like so, as everything in the Sub-Flow comes with $.request incl. the organization
	// Therefore the organization is always set
	if(organization && organization.name && organization.id) {
		logger.debug(`Filtering Applications for organization: ${organization.name} (${organization.id}).`);
		consideredApps = [];
		var appCount = 0;
		for (i = 0; i < apps.length; i++) {
			var app = apps[i];
			if(app.organizationId == organization.id) {
				// 
				consideredApps.push(app);
				appCount++;
			}
		}
		logger.debug(`Found: ${appCount} Applications for organization ${organization.name} (${organization.id}).`);
		kpis.apps_total = appCount;
		kpis.apps_total_diff = 0;
		kpis.organization = organization.name;
		if(previousKPIs) {
			kpis.apps_total_diff = await _getDifference(appCount, previousKPIs.apps_total, "Applications", options);
		}
	} else {
		logger.debug(`Found: ${appCount} Applications for all organizations.`);
		kpis.apps_total = apps.length;
		kpis.apps_total_diff = 0;
		if(previousKPIs) {
			kpis.apps_total_diff = await _getDifference(apps.length, previousKPIs.apps_total, "Apps", options);
		}
	}
	if(includeSubscriptions) {
		var subscriptions_total = 0;
		// Collect the subscriptions for all apps
		logger.debug(`Getting subscriptions for: ${consideredApps} Applications.`);
		for (i = 0; i < consideredApps.length; i++) {
			var app = consideredApps[i];
			var subscriptions = await _getManagerApplicationSubscriptions(apiManagerConfig.connection, app);
			subscriptions_total = subscriptions_total + subscriptions.length;
		}
		kpis.subscriptions_total = subscriptions_total;
		if(previousKPIs) {
			kpis.subscriptions_total_diff = await _getDifference(kpis.subscriptions_total, previousKPIs.subscriptions_total, "Subscriptions", options);
		}
	}
	return kpis;
}

async function getOrgKPIs(params, options) {
	const { apiManagerConfig, previousKPIs, organization } = params;
	var { kpis } = params;
	const { logger } = options;

	await _checkCommonParams(params);
	kpis = await _addKPIMetaInformation(params, kpis);

	if(organization && organization.name && organization.id) {
		kpis.orgs_total = 1;
		kpis.orgs_total_diff = 0;
		kpis.organization = organization.name;
		return kpis;
	}

	const orgs = await _getManagerOrganizations(apiManagerConfig.connection);
	kpis.orgs_total = orgs.length;
	kpis.orgs_total_diff = 0;
	if(previousKPIs) {
		kpis.orgs_total_diff = await _getDifference(orgs.length, previousKPIs.orgs_total, "Orgs", options);
	}
	return kpis;
}

async function getUserKPIs(params, options) {
	const { apiManagerConfig, previousKPIs, organization } = params;
	var { kpis } = params;
	const { logger } = options;

	await _checkCommonParams(params);
	kpis = await _addKPIMetaInformation(params, kpis);

	const users = await _getManagerUsers(apiManagerConfig.connection);

	// Unfortunately we have to check the organization like so, as everything in the Sub-Flow comes with $.request incl. the organization
	// Therefore the organization is always set
	if(organization && organization.name && organization.id) {
		logger.debug(`Filtering Users for organization: ${organization.name} (${organization.id}).`);
		var userCount = 0;
		for (i = 0; i < users.length; i++) {
			var user = users[i];
			if(user.organizationId == organization.id) {
				userCount++;
			}
		}
		logger.debug(`Found: ${userCount} Users for organization ${organization.name} (${organization.id}).`);
		kpis.users_total = userCount;
		kpis.users_total_diff = 0;
		kpis.organization = organization.name;
		if(previousKPIs) {
			kpis.users_total_diff = await _getDifference(userCount, previousKPIs.users_total, "Users", options);
		}
	} else {
		kpis.users_total = users.length;
		kpis.users_total_diff = 0;
		if(previousKPIs) {
			kpis.users_total_diff = await _getDifference(users.length, previousKPIs.users_total, "Users", options);
		}
	}
	return kpis;
}

async function _getDifference(current, previous, type, options) {
	const { logger } = options;
	var diff;
	if(!previous) previous = 0;
	logger.debug(`Calculating ${type}-Difference. Current: ${current}, Previous: ${previous}`);
	diff = Math.abs(current - previous);
	if(current < previous) {
		diff = diff * -1;
	}
	return diff;
}

async function _checkCommonParams(params) {
	const { apiManagerConfig } = params;
	if (!apiManagerConfig) {
		throw new Error('Missing required parameter: apiManagerConfig');
	}
	if (!apiManagerConfig.connection || !apiManagerConfig.connection.url) {
		throw new Error('Missing required parameter: apiManagerConfig.connection.url');
	}
	if (!apiManagerConfig.connection || !apiManagerConfig.connection.username) {
		throw new Error('Missing required parameter: apiManagerConfig.connection.username');
	}
	if (!apiManagerConfig.connection || !apiManagerConfig.connection.password) {
		throw new Error('Missing required parameter: apiManagerConfig.connection.password');
	}
	if (!apiManagerConfig.portalName) {
		throw new Error('Missing required parameter: apiManagerConfig.portalName');
	}
}

async function _addKPIMetaInformation(params, kpis) {
	const { apiManagerConfig } = params;
	if(!kpis) {
		kpis = { meta: { apiManagerName: apiManagerConfig.portalName, apiManagerVersion: apiManagerConfig.productVersion, apiBuilderHostname: os.hostname() } };
	}	
	return kpis;
}

async function _getManagerAPIs(apiManagerConfig) {
	var options = {
		path: `/api/portal/v1.3/proxies`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	var apis = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			return response.body;
		})
		.catch(err => {
			throw new Error(err);
		});
	return apis;
}

async function _getManagerApplications(apiManagerConfig) {
	var options = {
		path: `/api/portal/v1.3/applications`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	var apps = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			return response.body;
		})
		.catch(err => {
			throw new Error(err);
		});
	return apps;
}

async function _getManagerApplicationSubscriptions(apiManagerConfig, application) {
	var options = {
		path: `/api/portal/v1.3/applications/${application.id}/apis`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	var subscriptions = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			return response.body;
		})
		.catch(err => {
			throw new Error(err);
		});
	return subscriptions;
}

async function _getManagerOrganizations(apiManagerConfig) {
	var options = {
		path: `/api/portal/v1.3/organizations`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	var orgs = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			return response.body;
		})
		.catch(err => {
			throw new Error(err);
		});
	return orgs;
}

async function _getManagerUsers(apiManagerConfig) {
	var options = {
		path: `/api/portal/v1.3/users`,
		headers: {
			'Authorization': 'Basic ' + Buffer.from(apiManagerConfig.username + ':' + apiManagerConfig.password).toString('base64')
		},
		agent: new https.Agent({ rejectUnauthorized: false })
	};
	var users = await sendRequest(apiManagerConfig.url, options)
		.then(response => {
			return response.body;
		})
		.catch(err => {
			throw new Error(err);
		});
	return users;
}

module.exports = {
	getAPIKPIs,
	getAppKPIs,
	getOrgKPIs,
	getUserKPIs
};

const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');
const decache = require('decache');

describe('Test group based user lookup', () => {
	let plugin;
	let flowNode;

	const enabledField = "&field=enabled&op=eq&value=enabled";

	// Loads environment variables from .env-multiple-groups - which has multiple API-Managers (mocked) configured 
	const envFilePath = path.join(__dirname, '.env-multiple-groups');
	if (fs.existsSync(envFilePath)) {
		delete process.env.API_MANAGER; // Otherwise it is not overwritten
		envLoader.config({ path: envFilePath });
	}
	// Delete the cached module 
	decache('../config/axway-api-utils.default.js');
	var pluginConfig = require('../config/axway-api-utils.default.js').pluginConfig['api-builder-plugin-axway-api-management'];

	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('axway-api-management');
	});

	describe('#lookupCurrentUserWithGroups', () => {
		it('should standard user, which needs to be looked up the correct API-Manager', async () => {
			nock('https://mocked-api-gateway:8190').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8190').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/testReplies/gateway/operatorRoleOnlyPermissions.json');
			nock('https://mocked-api-manager-2:8275').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=chris${enabledField}`).replyWithFile(200, './test/testReplies/apimanager/apiManagerUserChris.json');
			nock('https://mocked-api-manager-2:8275').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-f833ca1c0a74`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');

			const { value, output } = await flowNode.lookupCurrentUser({ 
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"}, 
				groupId: "group-5" // Based on given config, group-5 this will resolve to https://mocked-api-manager-2:8275
			});

			expect(value).to.deep.equal({
				"loginName": "chris",
				"gatewayManager": {
					"isAdmin": false
				},
				"apiManager": {
					"id": "d66a42d6-b9c7-4efd-b33a-de8b88545861",
					"organizationId": "2bfaa1c2-49ab-4059-832d-f833ca1c0a74",
					"organizationName": "API Development",
					"name": "Chris",
					"loginName": "chris",
					"email": "chris@axway.com",
					"role": "oadmin",
					"enabled": true,
					"createdOn": 1597338071490,
					"state": "approved",
					"type": "internal",
					"dn": "cn=chris,o=API Development,ou=organizations,ou=APIPortal"
				}
			});
			expect(output).to.equal('next');
		});
	});
});

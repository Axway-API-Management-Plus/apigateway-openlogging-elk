const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');
const decache = require('decache');
const simple = require('simple-mock');
const { checkAPIManagers } = require('../src/utils');

describe('Tests User-Lookup with API-Manager disabled', () => {
	let plugin;
	let flowNode;

	// Loads environment variables from .env if the file exists
	const envFilePath = path.join(__dirname, '.env');
	if (fs.existsSync(envFilePath)) {
		envLoader.config({ override: true, path: envFilePath });
	}

	// Delete the cached module to force reloading
	decache('../config/axway-api-utils.default.js');
	var pluginConfig = require('../config/axway-api-utils.default.js').pluginConfig['api-builder-plugin-axway-api-management'];

	// Simulate a regional configuration, which is used in the regional test
	pluginConfig.apigateway.url = "https://mocked-api-gateway:8190, dc1|https://mocked-dc1-api-gateway:8190, dc2|https://mocked-dc2-api-gateway:8190";

	// Disable the API-Manager for these tests
	pluginConfig.apimanager.enabled = false;

	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('axway-api-management');
	});

	describe('#API-Manager is disabled - lookupCurrentUser', () => {
		it('should result into an unrestricted API-Gateway User while API-Manager is disabled', async () => {
			nock('https://mocked-api-gateway:8190').get('/api/rbac/currentuser').reply(200, { "result": "operator" });
			nock('https://mocked-api-gateway:8190').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/testReplies/gateway/gatewayLogsMgmtPermissions.json');

			const { value, output } = await flowNode.lookupCurrentUser({ 
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"},
				unrestrictedPermissions: "logs,mgmt"
			});

			expect(value).to.deep.equal({
				"loginName": "operator",
				"gatewayManager": {
					"isUnrestricted": true
				}
			});
			expect(output).to.equal('next');
		});
    });

	describe('#API-Manager is disabled - lookupAPIDetails', () => {
		it('should return Unknown API as the API-Manager is disabled', async () => {			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'Petstore without security', apiPath: '/without/security'
			});
			expect(value.name).to.equal(`Unknown API`);
			expect(value.method).to.equal(`Unknown Method`);
			expect(output).to.equal('next');
		});
	});

	describe('#API-Manager is disabled - lookupApplication', () => {
		it('should return Unknown Application as the API-Manager is disabled', async () => {			
			const { value, output } = await flowNode.lookupApplication({ applicationId: '268fd3bd-3af6-4565-a3aa-6dc9559f1fbf' });
			expect(value.name).to.equal(`268fd3bd-3af6-4565-a3aa-6dc9559f1fbf`);
			expect(value.id).to.equal(`268fd3bd-3af6-4565-a3aa-6dc9559f1fbf`);
			expect(output).to.equal('next');
		});
	});

	describe('#API-Manager is disabled - getCustomPropertiesConfig', () => {
		it('should return empty object is API-Manager is disabled', async () => {			
			const { value, output } = await flowNode.getCustomPropertiesConfig({ });
			expect(value).to.deep.equal({});
			expect(output).to.equal('next');
		});
	});

	describe('#API-Manager is disabled - getAPIManagerConfig', () => {
		it('should return empty array is API-Manager is disabled', async () => {			
			const { value, output } = await flowNode.getAPIManagerConfig({ });
			expect(value).to.deep.equal([]);
			expect(output).to.equal('next');
		});
	});

	describe('#API-Manager is disabled - checkAPIManagers', () => {
		var options = { logger: {
			info: simple.mock(),
			trace: simple.mock(),
			error: simple.mock(), 
			debug: simple.mock(),
			warn: simple.mock()
		} };

		it('should skip the API-Manager validation', async () => {
			var configuredManagers = {
				"enabled": false,
				"configs": {
					"default": {
						url: "Not-relevant",
						username: "xxxx", password: "xxxx"
					}
				}
			}
			var result = await checkAPIManagers(configuredManagers, options);
			expect(result.isValid).to.equal(true);
			expect(result.message).to.equal("Nothing to validate as API-Manager is disabled.");
		});
	});
});
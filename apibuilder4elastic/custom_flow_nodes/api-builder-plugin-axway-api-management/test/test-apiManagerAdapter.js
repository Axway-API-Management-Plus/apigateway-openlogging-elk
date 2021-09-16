const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');
const decache = require('decache');

describe('Test API-Manager config', () => {
	let plugin;
	let flowNode;

	// Loads environment variables from .env if the file exists
	const envFilePath = path.join(__dirname, '.env');
	if (fs.existsSync(envFilePath)) {
		delete process.env.API_MANAGER; // Otherwise it is not overwritten
		envLoader.config({ path: envFilePath });
	}
	// Delete the cached module 
	decache('../config/axway-api-utils.default.js');
	decache('../../../conf/elasticsearch.default.js');
	var pluginConfig = require('../config/axway-api-utils.default.js').pluginConfig['api-builder-plugin-axway-api-management'];

	describe('#getAPIManagerConfig', () => {
		it('should return the API-Manager configuration', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/config').replyWithFile(200, './test/testReplies/apimanager/apiManagerConfig.json');

			plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
			plugin.setOptions({ validateOutputs: true });
			flowNode = plugin.getFlowNode('axway-api-management');
			
			const { value, output } = await flowNode.getAPIManagerConfig({ });

			expect(output).to.equal('next');
			expect(value).to.lengthOf(1); // One API-Manager configuration is expected
			expect(value[0].portalName).to.equal(`Axway API Manager`);
			// Make sure the result is cached - Remove the mocks
			nock.cleanAll();
			// This re-run should be delivered out of the cache
			var result = await flowNode.getAPIManagerConfig({ });
			expect(result.output).to.equal('next');
			expect(result.value).to.lengthOf(1); // One API-Manager configuration is expected
			expect(result.value[0].portalName).to.equal(`Axway API Manager`);
		});

		it('should return the API-Manager configuration when having multiple API-Managers with the same name', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/config').replyWithFile(200, './test/testReplies/apimanager/apiManagerConfig.json');
			nock('https://mocked-api-gateway2:8175').get('/api/portal/v1.3/config').replyWithFile(200, './test/testReplies/apimanager/apiManagerConfig.json');

			pluginConfig.apimanager.url = "https://mocked-api-gateway:8175,group-2|us|https://mocked-api-gateway2:8175"

			plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
			plugin.setOptions({ validateOutputs: true });
			flowNode = plugin.getFlowNode('axway-api-management');

			const { value, output } = await flowNode.getAPIManagerConfig({ } );

			expect(output).to.equal('next');
			expect(value).to.lengthOf(2); // One API-Manager configuration is expected
			expect(value[0].portalName).to.equal(`Axway API Manager`);
			expect(value[1].portalName).to.equal(`Axway API Manager (US GROUP-2)`);
		});	
	});

	describe('#getAPIManagerOrganizations', () => {
		it('should return the API-Manager organizations', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/organizations').replyWithFile(200, './test/testReplies/apimanager/apiManagerOrganizations.json');

			plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
			plugin.setOptions({ validateOutputs: true });
			flowNode = plugin.getFlowNode('axway-api-management');
			
			const { value, output } = await flowNode.getAPIManagerOrganizations({ apiManager: { url: "https://mocked-api-gateway:8175", username: "user", password: "pass" } });

			expect(output).to.equal('next');
			expect(value).to.lengthOf(8); // 
		});
	});
});

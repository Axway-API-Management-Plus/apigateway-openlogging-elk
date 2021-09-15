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

	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('axway-api-management');
	});

	describe('#getAPIManagerConfig', () => {
		it('should return the resolved application', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/config').replyWithFile(200, './test/testReplies/apimanager/apiManagerConfig.json');
			
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
	});
});

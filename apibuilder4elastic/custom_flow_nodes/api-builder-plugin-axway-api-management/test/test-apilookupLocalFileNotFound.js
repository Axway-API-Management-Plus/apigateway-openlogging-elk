const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');
const decache = require('decache');

describe('Test API Lookup', () => {
	let plugin;
	let flowNode;

	// Loads environment variables from .env if the file exists
	const envFilePath = path.join(__dirname, '.env');
	if (fs.existsSync(envFilePath)) {
		delete process.env.API_MANAGER; // Otherwise it is not overwritten
		envLoader.config({ path: envFilePath });
	}
	// Tests are using this local config file
	process.env.API_BUILDER_LOCAL_API_LOOKUP_FILE = 'test/testConfig/file-does-not-exists.json';
	// Delete the cached module 
	decache('../config/axway-api-utils.default.js');
	decache('../../../conf/elasticsearch.default.js');
	var pluginConfig = require('../config/axway-api-utils.default.js').pluginConfig['api-builder-plugin-axway-api-management'];

	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('axway-api-management');
		nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');
	});

	// Delete to make sure, other tests are not influenced
	after(() => delete process.env.API_BUILDER_LOCAL_API_LOOKUP_FILE );

	describe('#constructor', () => {
		it('[local-apilookup-0004] should return API-Name with the best match (/api/configured/locally)', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/api/configured/locally/something" });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'API not configured locally, based on path: /api/configured/locally/something. The API cannot be queried at the API Manager as no API name is given. Please configure this API path locally.');
			expect(output).to.equal('error');
		});
	});
});

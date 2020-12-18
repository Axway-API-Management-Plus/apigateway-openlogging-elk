const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');
const decache = require('decache');

describe('Test is Index-API', () => {
	let plugin;
	let flowNode;

	// Loads environment variables from .env if the file exists
	const envFilePath = path.join(__dirname, '.env');
	if (fs.existsSync(envFilePath)) {
		delete process.env.API_MANAGER; // Otherwise it is not overwritten
		envLoader.config({ path: envFilePath });
	}
	// Tests are using this local config file
	process.env.API_BUILDER_LOCAL_API_LOOKUP_FILE = 'test/testConfig/test-api-lookup.json';
	// Delete the cached module 
	decache('../config/axway-api-utils.default.js');
	decache('../../../conf/elasticsearch.default.js');
	var pluginConfig = require('../config/axway-api-utils.default.js').pluginConfig['api-builder-plugin-axway-api-management'];

	beforeEach(async () => {
		debugger;
		plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('axway-api-management');
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(plugin).to.be.a('object');
			expect(plugin.getFlowNodeIds()).to.deep.equal([
				'axway-api-management'
			]);
			expect(flowNode).to.be.a('object');

			// Ensure the flow-node matches the spec
			expect(flowNode.name).to.equal('Axway API-Management Utils');
			expect(flowNode.icon).to.be.a('string');
		});

		it('should define valid flow-nodes', () => {
			plugin.validate();
		});
	});

	describe('#isIndexAPITests', () => {
		it('[is-index-api-0001] should error when API-Path and PolicyName is not set', async () => {
			const { value, output } = await flowNode.isIndexAPI({ apiPath: null, policyName: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'You must either provide the apiPath or the policyName used to read the configuration.');
			expect(output).to.equal('error');
		});

		it('[local-apilookup-0002] should return index false based on the apiPath', async () => {
			const { value, output } = await flowNode.isIndexAPI({ apiPath: "/do/not/index/api" });

			expect(value.indexAPI).to.equal(false);
			expect(output).to.equal('next');
		});

		it('[local-apilookup-0003] should return default index true if API-Path is not configured', async () => {
			const { value, output } = await flowNode.isIndexAPI({ apiPath: "/not/configured/api" });

			expect(value.indexAPI).to.equal(true);
			expect(output).to.equal('next');
		});

		it('[local-apilookup-0004] should return default index true if Policy-Name is not configured', async () => {
			const { value, output } = await flowNode.isIndexAPI({ policyName: "Not configured policy" });

			expect(value.indexAPI).to.equal(true);
			expect(output).to.equal('next');
		});

		it('[local-apilookup-0005] should return index false if Policy-Name is configured to false', async () => {
			const { value, output } = await flowNode.isIndexAPI({ policyName: "Do not index this policy" });

			expect(value.indexAPI).to.equal(false);
			expect(output).to.equal('next');
		});
	});
});

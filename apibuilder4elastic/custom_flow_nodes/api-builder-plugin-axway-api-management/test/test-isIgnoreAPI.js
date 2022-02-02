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
		envLoader.config({ override: true, path: envFilePath });
	}
	// Tests are using this local config file
	process.env.API_BUILDER_LOCAL_API_LOOKUP_FILE = 'test/testConfig/test-api-lookup.json';
	// Delete the cached module 
	decache('../config/axway-api-utils.default.js');
	decache('../../../conf/elasticsearch.default.js');
	var pluginConfig = require('../config/axway-api-utils.default.js').pluginConfig['api-builder-plugin-axway-api-management'];

	beforeEach(async () => {
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
		it('[isIgnoreAPI-0001] should return 400 Bad Request when API-Path and PolicyName is not set', async () => {
			const { value, output } = await flowNode.isIgnoreAPI({ apiPath: null, policyName: null });
			expect(output).to.equal('next');
			expect(value).to.deep.equal({status: 400, body: { message: 'You must either provide the apiPath or the policyName used to read the configuration.' }});
		});

		it('[isIgnoreAPI-0002] should return ignore true based on the apiPath', async () => {
			const { value, output } = await flowNode.isIgnoreAPI({ apiPath: "/do/not/index/api", policyName: "", region: "N/A" });

			expect(value.body.ignore).to.equal(true);
			expect(value.status).to.equal(200);
			expect(output).to.equal('next');
		});

		it('[isIgnoreAPI-0003] should return default ignore false if API-Path is not configured', async () => {
			const { value, output } = await flowNode.isIgnoreAPI({ apiPath: "/not/configured/api" });

			expect(value.body.ignore).to.equal(false);
			expect(value.status).to.equal(200);
			expect(output).to.equal('next');
		});

		it('[isIgnoreAPI-0004] should return default ignore false if Policy-Name is not configured', async () => {
			const { value, output } = await flowNode.isIgnoreAPI({ policyName: "Not configured policy" });

			expect(value.body.ignore).to.equal(false);
			expect(value.status).to.equal(200);
			expect(output).to.equal('next');
		});

		it('[isIgnoreAPI-0005] should return ignore true if Policy-Name is configured to ignore this policy', async () => {
			const { value, output } = await flowNode.isIgnoreAPI({ policyName: "Do not index this policy" });

			expect(value.body.ignore).to.equal(true);
			expect(value.status).to.equal(200);
			expect(output).to.equal('next');
		});

		it('[isIgnoreAPI-0006] should return an error if the apiPath contains an unresolved Logstash variable', async () => {
			const { value, output } = await flowNode.isIgnoreAPI({ policyName: "%{[transact-something-in-the-middle-ri]}" });

			expect(value).to.deep.equal({status: 400, body: { message: "Policy-Name contains unresolved Logstash variable: '%{[transact-something-in-the-middle-ri]}'. Please check Logstash pipeline configuration." }});
			expect(output).to.equal('next');
		});

		it('[isIgnoreAPI-0006] should return an error if the apiPath contains an unresolved Logstash variable', async () => {
			const { value, output } = await flowNode.isIgnoreAPI({ apiPath: "%{[transact-something-in-the-middle-ri]}" });

			expect(value).to.deep.equal({status: 400, body: { message: "API-Path contains unresolved Logstash variable: '%{[transact-something-in-the-middle-ri]}'. Please check Logstash pipeline configuration." }});
			expect(output).to.equal('next');
		});	
	});
});

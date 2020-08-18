const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Test API Lookup', () => {
	let plugin;
	let flowNode;

	// Loads environment variables from .env if the file exists
	const envFilePath = path.join(__dirname, '.env');
	if (fs.existsSync(envFilePath)) {
		envLoader.config({ path: envFilePath });
	}
	var pluginConfig = require('../config/axway-api-utils.default.js').pluginConfig['api-builder-plugin-axway-api-management'];

	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('axway-api-management');
	});

	describe('#constructor apilookup', () => {
		it('should define flow-nodes', () => {
			expect(plugin).to.be.a('object');
			expect(plugin.getFlowNodeIds()).to.deep.equal([
				'axway-api-management'
			]);
			expect(flowNode).to.be.a('object');

			// Ensure the flow-node matches the spec
			expect(flowNode.name).to.equal('Axway API-Management Utils');
			expect(flowNode.icon).to.be.a('string');
			expect(flowNode.getMethods()).to.deep.equal([
				'lookupAPIDetails', 
				'lookupCurrentUser'
			]);
		});

		it('should define valid flow-nodes', () => {
			plugin.validate();
		});
	});

	describe('#lookupAPIDetails', () => {
		it('should error when api path is not set', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({
				apiPath: null
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'You must provide the apiPath that should be used to lookup the API.');
			expect(output).to.equal('error');
		});

		it('should follow the Error path if the API-Manager host cannot be reached/communicated', async () => {
			// We just have NO mock to make this test
			const { value, output } = await flowNode.lookupAPIDetails({
				apiPath: '/v1/unkownAPI'
			});

			expect(value).to.be.instanceOf(Error);
			expect(value.message).to.have.string(`Error sending request to API-Manager: unknown-host`);
			expect(output).to.equal('error');
		});

		it('should error with an unknown API', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=path&op=eq&value=/v1/unkownAPI').reply(200, '[]');
			const { value, output } = await flowNode.lookupAPIDetails({
				apiPath: '/v1/unkownAPI'
			});

			expect(value).to.be.instanceOf(Error);
			expect(value.message).to.have.string(`No API found exposed on path: '/v1/unkownAPI'`);
			expect(output).to.equal('error');
		});

		it('should return the resolved API proxy details (cache is tested as well)', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=path&op=eq&value=/v1/petstore').replyWithFile(200, './test/testReplies/apimanager/apiProxyFound.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiPath: '/v1/petstore'
			});
			expect(value.organizationName).to.equal(`API Development`);
			expect(value.name).to.equal(`Petstore HTTPS`);
			expect(value.path).to.equal(`/v1/petstore`);
			expect(output).to.equal('next');
			// Make sure the result is cached
			nock.cleanAll();
			// This re-run should be delivered out of the cache
			await flowNode.lookupAPIDetails({ 
				apiPath: '/v1/petstore'
			});
		});
	});
});

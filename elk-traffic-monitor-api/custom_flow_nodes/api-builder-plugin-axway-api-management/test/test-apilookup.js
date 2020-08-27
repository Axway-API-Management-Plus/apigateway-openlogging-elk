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
		it('should error when API-Name is not set', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({
				apiName: null
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'You must provide the apiName that should be used to lookup the API.');
			expect(output).to.equal('error');
		});

		it('should error when API-Path is not set', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({
				apiName: 'My great API', apiPath: null
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'You must provide the apiPath that should be used to lookup the API.');
			expect(output).to.equal('error');
		});

		it('should follow the Error path if the API-Manager host cannot be reached/communicated', async () => {
			// We just have NO mock to make this test
			const { value, output } = await flowNode.lookupAPIDetails({
				apiName: 'Unknown API', apiPath: '/v1/unkownAPI'
			});

			expect(value).to.be.instanceOf(Error);
			expect(value.message).to.have.string(`Error getting APIs with API-Name: Unknown API. Request sent to: 'https://mocked-api-gateway:8175'. Error: getaddrinfo`);
			expect(output).to.equal('error');
		});

		it('should error with an unknown API', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Unknown API').reply(200, '[]');
			const { value, output } = await flowNode.lookupAPIDetails({
				apiName: 'Unknown API', apiPath: '/v1/unkownAPI'
			});

			expect(value).to.be.instanceOf(Error);
			expect(value.message).to.equal(`No APIs found with name: 'Unknown API'`);
			expect(output).to.equal('error');
		});

		it('should error if the API-Name is found, but the API-Path doesnt match', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore HTTPS').replyWithFile(200, './test/testReplies/apimanager/apiProxyFound.json');
			const { value, output } = await flowNode.lookupAPIDetails({
				apiName: 'Petstore HTTPS', apiPath: '/v1/wrong'
			});

			expect(value).to.be.instanceOf(Error);
			expect(value.message).to.have.string(`No APIs found with name: 'Petstore HTTPS' and apiPath: '/v1/wrong'`);
			expect(output).to.equal('error');
		});

		it('should return the resolved API proxy details (cache is tested as well)', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore HTTPS').replyWithFile(200, './test/testReplies/apimanager/apiProxyFound.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'Petstore HTTPS', apiPath: '/v1/petstore'
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

		it('should return the default backend base path when not providing an operationId', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore HTTPS').replyWithFile(200, './test/testReplies/apimanager/apiProxyFound.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'Petstore HTTPS', apiPath: '/v1/petstore'
			});
			expect(value.backendBasePath).to.equal(`https://petstore.swagger.io`);
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

		it('should return API-Key security when not providing any operationId and API-Key is configured as default', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore HTTPS').replyWithFile(200, './test/testReplies/apimanager/apiProxyFound.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'Petstore HTTPS', apiPath: '/v1/petstore'
			});
			expect(value.apiSecurity).to.equal(`API-Key`);
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

		it('should return default policies when not providing an operationId', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore HTTPS').replyWithFile(200, './test/testReplies/apimanager/apiProxyWithDefaultPolicies.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'Petstore HTTPS', apiPath: '/v1/petstore'
			});
			//expect(value.organizationName).to.equal(`API Development`);
			expect(value.requestPolicy).to.equal(`Request Policy 1`);
			expect(value.routingPolicy).to.equal(`Routing Policy 1`);
			expect(value.responsePolicy).to.equal(`Response Policy 1`);
			expect(value.faulthandlerPolicy).to.equal(`Fault Handler Policy 1`);
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

		it('should return null for policies when no policy is configured', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore HTTPS').replyWithFile(200, './test/testReplies/apimanager/apiProxyFound.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'Petstore HTTPS', apiPath: '/v1/petstore'
			});
			//expect(value.organizationName).to.equal(`API Development`);
			expect(value.requestPolicy).to.equal(null);
			expect(value.routingPolicy).to.equal(null);
			expect(value.responsePolicy).to.equal(null);
			expect(value.faulthandlerPolicy).to.equal(null);
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

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

	describe('#lookupAPIDetails', () => {
		it('should error when API-Path is not set, which is used for local and online lookup', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: null});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'You must provide the apiPath that should be used to lookup the API.');
			expect(output).to.equal('error');
		});

		it('should return Unknown API-Details even if the API-Name is not set', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({
				apiPath: '/v1/unkownAPI', apiName: null
			});

			expect(value.name).to.equal(`Unknown API`);
			expect(value.method).to.equal(`Unknown Method`);
			expect(output).to.equal('next');
		});

		it('should follow the Error path if the API-Manager host cannot be reached/communicated', async () => {
			nock.cleanAll();
			// We just have NO mock to make this test
			const { value, output } = await flowNode.lookupAPIDetails({ apiName: 'Unknown API', apiPath: '/v1/unkownAPI' });

			expect(value).to.be.instanceOf(Error);
			expect(value.message).to.have.string(`Error getting APIs with API-Name: Unknown API. Request sent to: 'https://mocked-api-gateway:8175'. Error: getaddrinfo`);
			expect(output).to.equal('error');
		});

		it('should return API-Details for an unknown API', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=XXX Unknown API').reply(200, '[]');
			const { value, output } = await flowNode.lookupAPIDetails({
				apiName: 'XXX Unknown API', apiPath: '/v1/xxxUnkownAPI', region: "n/a" // n/a for region considered as not set in case Logstash is providing it anyway
			});

			expect(value.name).to.equal(`Unknown API`);
			expect(value.method).to.equal(`Unknown Method`);
			expect(output).to.equal('next');
		});

		it('should return Unknown API-Details even if the API-Name is found, but the API-Path doesnt match', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore HTTPS').replyWithFile(200, './test/testReplies/apimanager/apiProxyFound.json');
			const { value, output } = await flowNode.lookupAPIDetails({
				apiName: 'Petstore HTTPS', apiPath: '/v1/wrong'
			});

			expect(value.name).to.equal(`Unknown API`);
			expect(value.method).to.equal(`Unknown Method`);
			expect(output).to.equal('next');
		});

		it('should return the resolved API proxy details (cache is tested as well), Region N/A considered as not set', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore HTTPS').replyWithFile(200, './test/testReplies/apimanager/apiProxyFound.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'Petstore HTTPS', apiPath: '/v1/petstore', region: "N/A" // N/A for region considered as not set in case Logstash is providing it anyway
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
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');
			
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
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');
			
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
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');
			
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

		it('should return null for policies (Request, Response, ....) when no policy is configured', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore HTTPS').replyWithFile(200, './test/testReplies/apimanager/apiProxyFound.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'Petstore HTTPS', apiPath: '/v1/petstore'
			});
			//expect(value.organizationName).to.equal(`API Development`);
			expect(value.requestPolicy).to.equal("N/A");
			expect(value.routingPolicy).to.equal("N/A");
			expect(value.responsePolicy).to.equal("N/A");
			expect(value.faulthandlerPolicy).to.equal("N/A");
			expect(value.name).to.equal(`Petstore HTTPS`);
			expect(value.path).to.equal(`/v1/petstore`);
			expect(output).to.equal('next');
			// Make sure the result is cached
			nock.cleanAll();
			// This re-run should be delivered out of the cache - Should work without the Mocks!
			await flowNode.lookupAPIDetails({ 
				apiPath: '/v1/petstore'
			});
		});

		it('should ignore the given groupId, if only ONE API-Manager is configured anyway', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore HTTPS').replyWithFile(200, './test/testReplies/apimanager/apiProxyFound.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'Petstore HTTPS', apiPath: '/v1/petstore', groupId: 'group-unknown'
			});
			expect(value.organizationName).to.equal(`API Development`);
			expect(value.requestPolicy).to.equal("N/A");
			expect(value.routingPolicy).to.equal("N/A");
			expect(value.responsePolicy).to.equal("N/A");
			expect(value.faulthandlerPolicy).to.equal("N/A");
			expect(value.name).to.equal(`Petstore HTTPS`);
			expect(value.path).to.equal(`/v1/petstore`);
			expect(output).to.equal('next');
			nock.cleanAll();
		});

		it('should return passthrough as API-Security', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore without security').replyWithFile(200, './test/testReplies/apimanager/apiProxyPassthrough.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'Petstore without security', apiPath: '/without/security'
			});
			expect(output).to.equal('next');
			expect(value.organizationName).to.equal(`API Development`);
			expect(value.name).to.equal(`Petstore without security`);
			expect(value.path).to.equal(`/without/security`);
			expect(value.apiSecurity).to.equal(`Pass Through`);
			nock.cleanAll();
		});

		it('should return API incl. defined custom properties', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=API Custom-Properties Test').replyWithFile(200, './test/testReplies/apimanager/apiProxyWithCustomProps.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'API Custom-Properties Test', apiPath: '/api-custom-prop-test', disableCustomProperties: false
			});
			expect(output).to.equal('next');
			expect(value.organizationName).to.equal(`API Development`);
			expect(value.name).to.equal(`API Custom-Properties Test`);
			expect(value.path).to.equal(`/api-custom-prop-test`);
			expect(value.customProperties).to.be.a('object');
			expect(value.customProperties.customProperty1).to.equal(`Test-Input 1`);
			expect(value.customProperties.customProperty2).to.equal(`1`);
			expect(value.customProperties.customProperty3).to.equal(`true`);
			nock.cleanAll();
		});

		// Empty custom properties object make life easier in the Logstash pipeline / Test without parameter disableCustomProperties, which should default to false
		it('should return an empty custom properties object, even if there are no custom properties configured', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=No custom properties').replyWithFile(200, './test/testReplies/apimanager/apiProxyPassthrough.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'No custom properties', apiPath: '/without/security'
			});
			expect(output).to.equal('next');
			expect(value.organizationName).to.equal(`API Development`);
			expect(value.customProperties).to.be.a('object');
			nock.cleanAll();
		});

		it('should return API without custom properties as it is turned off', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies?field=name&op=eq&value=API Custom-Properties Test').replyWithFile(200, './test/testReplies/apimanager/apiProxyWithCustomProps.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/439ec2bd-0350-459c-8df3-bb6d14da6bc8`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');
			
			const { value, output } = await flowNode.lookupAPIDetails({ 
				apiName: 'API Custom-Properties Test', apiPath: '/api-custom-prop-test', disableCustomProperties: true
			});
			expect(output).to.equal('next');
			expect(value.organizationName).to.equal(`API Development`);
			expect(value.name).to.equal(`API Custom-Properties Test`);
			expect(value.path).to.equal(`/api-custom-prop-test`);
			expect(value.customProperties).to.be.undefined;
			nock.cleanAll();
		});
	});
});

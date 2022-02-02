const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');
const decache = require('decache');

describe('Test Application Lookup', () => {
	let plugin;
	let flowNode;

	// Loads environment variables from .env if the file exists
	const envFilePath = path.join(__dirname, '.env');
	if (fs.existsSync(envFilePath)) {
		envLoader.config({ override: true, path: envFilePath });
	}
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

	describe('#lookupApplication', () => {
		it('should error when the applicationId is not set', async () => {
			const { value, output } = await flowNode.lookupApplication({ applicationId: null});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing parameter applicationId in order to lookup an application.');
			expect(output).to.equal('error');
		});

		it('should follow the Error path if the API-Manager host cannot be reached/communicated', async () => {
			nock.cleanAll();
			// We just have NO mock to make this test
			const { value, output } = await flowNode.lookupApplication({ applicationId: '268fd3bd-3af6-4565-a3aa-6dc9559f1fbf', region: "N/A" });

			expect(value).to.be.instanceOf(Error);
			expect(value.message).to.have.string(`Error getting application with ID: 268fd3bd-3af6-4565-a3aa-6dc9559f1fbf. Request sent to: 'https://mocked-api-gateway:8175'. Error: getaddrinfo`);
			expect(output).to.equal('error');
		});

		it('should return the resolved application', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications/268fd3bd-3af6-4565-a3aa-6dc9559f1fbf').replyWithFile(200, './test/testReplies/apimanager/appPatientMonitoring.json');
			
			const { value, output } = await flowNode.lookupApplication({ applicationId: '268fd3bd-3af6-4565-a3aa-6dc9559f1fbf' });
			expect(value.name).to.equal(`Plexus Suite - Patient Monitoring`);
			expect(output).to.equal('next');
			// Make sure the result is cached - Remove the mocks
			nock.cleanAll();
			// This re-run should be delivered out of the cache
			await flowNode.lookupApplication({ applicationId: '268fd3bd-3af6-4565-a3aa-6dc9559f1fbf' });
		});

		it('should return an empty application having the ID as the name', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications/268fd3bd-3af6-4565-a3aa-NOT-FOUND').replyWithFile(404, './test/testReplies/apimanager/appNotFoundResponse.json');
			
			const { value, output } = await flowNode.lookupApplication({ applicationId: '268fd3bd-3af6-4565-a3aa-NOT-FOUND' });
			expect(value.name).to.equal(`268fd3bd-3af6-4565-a3aa-NOT-FOUND`);
			expect(value.id).to.equal(`268fd3bd-3af6-4565-a3aa-NOT-FOUND`);
			expect(output).to.equal('next');
			// Make sure the result is cached - Remove the mocks
			nock.cleanAll();
			// This re-run should be delivered out of the cache
			await flowNode.lookupApplication({ applicationId: '268fd3bd-3af6-4565-a3aa-NOT-FOUND' });
		});
		
	});
});

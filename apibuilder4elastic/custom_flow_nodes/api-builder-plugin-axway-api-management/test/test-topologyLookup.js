const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');
const decache = require('decache');

describe('Tests Topology-Lookup', () => {
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
	var pluginConfig = require('../config/axway-api-utils.default.js').pluginConfig['api-builder-plugin-axway-api-management'];
	// Simulate a regional configuration, which is used in the regional test
	pluginConfig.apigateway.url = "https://mocked-api-gateway:8190, dc1|https://mocked-dc1-api-gateway:8190, dc2|https://mocked-dc2-api-gateway:8190";

	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('axway-api-management');
	});

	describe('#lookupTopology', () => {
		it('should error when requestHeaders are not set', async () => {
			const { value, output } = await flowNode.lookupTopology({
				requestHeaders: null
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'You need to provide Request-Headers with Cookies or an Authorization header.');
			expect(output).to.equal('error');
		});

		it('should error when requestHeaders are set, but contain no cookie header', async () => {
			const { value, output } = await flowNode.lookupTopology({
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20"}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'You must provide either the VIDUSR cookie + csrf-token or an HTTP-Basic Authorization header.');
			expect(output).to.equal('error');
		});

		it('should result into the API-Gateway topology', async () => {
			nock('https://mocked-api-gateway:8190').get('/api/topology').replyWithFile(200, './test/testReplies/gateway/gatewayEMTTopology.json');

			const { value, output } = await flowNode.lookupTopology({ 
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"}
			});

			expect(value.emtEnabled).to.equal(true);
			expect(value.services).to.lengthOf(3); // We expect only 3 services, as the ANM is removed already
			expect(output).to.equal('next');
		});

		it('should result into the API-Gateway topology', async () => {
			nock('https://mocked-dc2-api-gateway:8190').get('/api/topology').replyWithFile(200, './test/testReplies/gateway/gatewayEMTTopology.json');

			const { value, output } = await flowNode.lookupTopology({ 
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"},
				region: "DC2"
			});

			expect(value.emtEnabled).to.equal(true);
			expect(value.services).to.lengthOf(3); // We expect only 3 services, as the ANM is removed already
			expect(output).to.equal('next');
		});
	});
});

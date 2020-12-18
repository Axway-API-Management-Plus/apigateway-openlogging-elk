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
	process.env.API_BUILDER_LOCAL_API_LOOKUP_FILE = 'test/testConfig/test-api-lookup.json';
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

	describe('#localLookupAPIDetails', () => {
		it('[local-apilookup-0001] should error when API-Path is not set', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'You must provide the apiPath that should be used to lookup the API.');
			expect(output).to.equal('error');
		});

		it('[local-apilookup-0002] should return API-Name, Org from local config file', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/api/configured/locally/longest/match" });

			expect(value.organizationName).to.equal(`Longest match Org`);
			expect(value.name).to.equal(`Locally configured API longest match`);
			expect(value.path).to.equal(`/api/configured/locally/longest/match`);
			expect(output).to.equal('next');
		});

		it('[local-apilookup-0003] should return API-Name of the generic API', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/api/configured/locally" });

			expect(value.organizationName).to.equal(`General Org`);
			expect(value.name).to.equal(`General API-Name`);
			expect(value.path).to.equal(`/api/configured/locally`);
			expect(output).to.equal('next');
		});

		it('[local-apilookup-0004] should return API-Name with the best match (/api/configured/locally)', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/api/configured/locally/something" });

			expect(value.organizationName).to.equal(`General Org`);
			expect(value.name).to.equal(`General API-Name`);
			expect(value.path).to.equal(`/api/configured/locally/something`);
			expect(output).to.equal('next');
		});

		it('[local-apilookup-0005] should return defaults for all fields.', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/minimal/config" });

			expect(value.name).to.equal(`The name is a MUST`);
			expect(value.path).to.equal(`/minimal/config`);
			expect(value.organizationName).to.equal(`N/A`);
			expect(value.apiVersion).to.equal(`N/A`);
			expect(value.apiSecurity).to.equal(`N/A`);
			expect(value.apiState).to.equal(`N/A`);
			expect(value.backendBasePath).to.equal(`N/A`);
			expect(value.faulthandlerPolicy).to.equal(`N/A`);
			expect(value.requestPolicy).to.equal(`N/A`);
			expect(value.responsePolicy).to.equal(`N/A`);
			expect(value.routingPolicy).to.equal(`N/A`);
			expect(output).to.equal('next');
		});
	});

	describe('#localLookupAPIDetailsIncludingGroupOnly', () => {

		it('[local-group-apilookup-0001] should return specific API based on the group', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/api/configured/for/group", groupId: "group-2"  });
			console.log(`AAAAA: ${JSON.stringify(value)}`);
			expect(value.organizationName).to.equal(`Group 2 Org`);
			expect(value.name).to.equal(`Group 2 API-Name`);
			expect(value.path).to.equal(`/api/configured/for/group`);
			expect(output).to.equal('next');
		});

		it('[local-group-apilookup-0002] should return longest match API based on the group', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/api/configured/for/group/some/longer/path", groupId: "group-2"  });
			console.log(`BBBBB: ${JSON.stringify(value)}`);
			expect(value.organizationName).to.equal(`Group 2 Org Long path`);
			expect(value.name).to.equal(`Group 2 API-Name Long Path`);
			expect(value.path).to.equal(`/api/configured/for/group/some/longer/path`);
			expect(output).to.equal('next');
		});

		it('[local-group-apilookup-0003] should return best match API based on the group', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/api/configured/for/group/some/other/path", groupId: "group-2"  });

			expect(value.organizationName).to.equal(`Group 2 Org`);
			expect(value.name).to.equal(`Group 2 API-Name`);
			expect(value.path).to.equal(`/api/configured/for/group/some/other/path`);
			expect(output).to.equal('next');
		});

		it('[local-group-apilookup-0004] should fall back to Non-Group based configuration', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/api/configured/locally", groupId: "group-2"  });

			expect(value.organizationName).to.equal(`General Org`);
			expect(value.name).to.equal(`General API-Name`);
			expect(value.path).to.equal(`/api/configured/locally`);
			expect(output).to.equal('next');
		});
	});

	describe('#localLookupAPIDetailsIncludingGroupAndRegion', () => {

		it('[local-region-apilookup-0001] should return specific API based on the group and region', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/us/api/configured/for/group/and/region/with/a/path", groupId: "group-2", region: "US"  });

			expect(value.organizationName).to.equal(`Group 2 US Org with a path`);
			expect(value.name).to.equal(`Group 2 US API-Name with a path`);
			expect(value.path).to.equal(`/us/api/configured/for/group/and/region/with/a/path`);
			expect(output).to.equal('next');
		});

		it('[local-region-apilookup-0002] should return best match API based on the group and region', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/us/api/configured/for/group/and/region/another/path", groupId: "group-2", region: "US"  });

			expect(value.organizationName).to.equal(`Group 2 US Org`);
			expect(value.name).to.equal(`Group 2 US API-Name`);
			expect(value.path).to.equal(`/us/api/configured/for/group/and/region/another/path`);
			expect(output).to.equal('next');
		});

		it('[local-region-apilookup-0003] should fallback to a group based API-COnfig', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/api/configured/for/group/and/some/stuff", groupId: "group-2", region: "US"  });

			expect(value.organizationName).to.equal(`Group 2 Org`);
			expect(value.name).to.equal(`Group 2 API-Name`);
			expect(value.path).to.equal(`/api/configured/for/group/and/some/stuff`);
			expect(output).to.equal('next');
		});

		it('[local-region-apilookup-0004] should fallback to the most generic API-Config', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/api/configured/locally", groupId: "group-2", region: "US"  });

			expect(value.organizationName).to.equal(`General Org`);
			expect(value.name).to.equal(`General API-Name`);
			expect(value.path).to.equal(`/api/configured/locally`);
			expect(output).to.equal('next');
		});

		it('[local-region-apilookup-0005] should fallback to the most generic API-Config - Best match', async () => {
			const { value, output } = await flowNode.lookupAPIDetails({ apiPath: "/api/configured/locally/and/another/stuff", groupId: "group-2", region: "US"  });

			expect(value.organizationName).to.equal(`General Org`);
			expect(value.name).to.equal(`General API-Name`);
			expect(value.path).to.equal(`/api/configured/locally/and/another/stuff`);
			expect(output).to.equal('next');
		});
	});
});

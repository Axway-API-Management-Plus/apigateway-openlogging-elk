const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const fs = require('fs');
const { ElasticsearchClient, mockElasticsearchMethod } = require('@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch/src/actions/ElasticsearchClient');

describe('flow-node elk-solution-utils', () => {
	let plugin;
	let flowNode;
	var client = new ElasticsearchClient({nodes: "https://api-env:9200", ssl: { rejectUnauthorized: false }}).client;
	client.isMocked = true;
	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('elk-solution-utils');
	});

	describe('#getIndicesForLogtype', () => {
		it('should error when missing required parameter: logtype', async () => {
			const { value, output } = await flowNode.getIndicesForLogtype({ logtype: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: logtype');
			expect(output).to.equal('error');
		});

		it('should error when missing required parameter: logtype', async () => {
			const { value, output } = await flowNode.getIndicesForLogtype({ logtype: "traffic-summary", indexConfigs: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: indexConfigs');
			expect(output).to.equal('error');
		});

		it('should error when no indices configured for given: logtype', async () => {
			var indexConfig = JSON.parse(fs.readFileSync('./test/testConfig/test_index_config.json'), null);
			const { value, output } = await flowNode.getIndicesForLogtype({ logtype: "unknownLogtype", indexConfigs: indexConfig });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'No indices configured for logtype: unknownLogtype');
			expect(output).to.equal('error');
		});

		it('should succeed with a valid configured logType', async () => {
			var indexConfig = JSON.parse(fs.readFileSync('./test/testConfig/test_index_config.json'), null);
			const { value, output } = await flowNode.getIndicesForLogtype({ logtype: "openlog", indexConfigs: indexConfig });

			var expectedIndices = {};
			expectedIndices['apigw-traffic-summary'] = indexConfig['apigw-traffic-summary'];
			expectedIndices['apigw-traffic-details'] = indexConfig['apigw-traffic-details'];

			expect(value).to.deep.equal(expectedIndices);
			expect(output).to.equal('next');
		});
	});

	describe('#createIndices', () => {
		it('should error when missing required parameter: indices', async () => {
			const { value, output } = await flowNode.createIndices({ indices: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: indices');
			expect(output).to.equal('error');
		});

		it('should succeed with valid parameters', async () => {
			var mockedIndexExistsFn = mockElasticsearchMethod(client, 'indices.existsAlias', './test/mock/indexNotFoundResponse.json', false);
			var mockedIndexCreateFn = mockElasticsearchMethod(client, 'indices.create', './test/mock/indexCreatedResponse.json', false);
			var indexConfig = JSON.parse(fs.readFileSync('./test/testConfig/test_index_config.json'), null);
			var indices = {};
			indices['apigw-traffic-summary'] = indexConfig['apigw-traffic-summary'];
			indices['apigw-traffic-details'] = indexConfig['apigw-traffic-details'];
			var { value, output } = await flowNode.createIndices({ indices: indices, region: "US" });

			var createdIndices = { 
				"apigw-traffic-details-us-000001": { alias: "apigw-traffic-details-us" },
				"apigw-traffic-summary-us-000001": { alias: "apigw-traffic-summary-us" },
			}

			expect(value).to.deep.equal(createdIndices);
			expect(mockedIndexExistsFn.callCount).to.equal(2);
			expect(mockedIndexCreateFn.callCount).to.equal(2);
			expect(output).to.equal('next');

			mockedIndexExistsFn = mockElasticsearchMethod(client, 'indices.existsAlias', './test/mock/indexAlreadyExistsResponse.json', false);
			mockedIndexCreateFn = mockElasticsearchMethod(client, 'indices.create', './test/mock/indexCreatedResponse.json', false);
			// Call it again and it should not fail, as it should check if indices already exists
			var { value, output } = await flowNode.createIndices({ indices: indices, region: "US" });
			expect(output).to.equal('next');
			expect(mockedIndexExistsFn.callCount).to.equal(2);
			expect(mockedIndexCreateFn.callCount).to.equal(0);
			expect(value).to.deep.equal({}); // We expect no index to be created
		});
	});
});

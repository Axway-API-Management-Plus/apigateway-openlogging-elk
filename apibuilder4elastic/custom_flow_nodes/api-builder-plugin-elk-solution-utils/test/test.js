const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const fs = require('fs');

describe('flow-node elk-solution-utils', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('elk-solution-utils');
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(plugin).to.be.a('object');
			expect(plugin.getFlowNodeIds()).to.deep.equal([
				'elk-solution-utils'
			]);
			expect(flowNode).to.be.a('object');

			// Ensure the flow-node matches the spec
			expect(flowNode.name).to.equal('APIM-ELK Solution utils');
			expect(flowNode.icon).to.be.a('string');
		});

		it('should define valid flow-nodes', () => {
			// if this is invalid, it will throw and fail
			plugin.validate();
		});
	});

	describe('#getIndexConfig', () => {
		it('should error when missing required parameter: data', async () => {
			// Invoke #hello with a non-number and check error.
			const { value, output } = await flowNode.getIndexConfig({ data: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: data');
			expect(output).to.equal('error');
		});

		it('should error when missing required parameter: indexConfigs', async () => {
			// Invoke #hello with a non-number and check error.
			const { value, output } = await flowNode.getIndexConfig({ data: 'Something' });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: indexConfigs');
			expect(output).to.equal('error');
		});

		it('should fail if indexName && params.indexName is not given in data', async () => {
			var indexConfigs = JSON.parse(fs.readFileSync('./test/test_index_config.json'), null);
			const { value, output } = await flowNode.getIndexConfig({ data: { anyProp: 'anyValue'}, indexConfigs: indexConfigs });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'No indexname given. You must either give it a params.indexName or indexName');
			expect(output).to.equal('error');
		});

		it('should fail if the indexName is unknown with valid argument', async () => {
			var indexConfigs = JSON.parse(fs.readFileSync('./test/test_index_config.json'), null);
			const { value, output } = await flowNode.getIndexConfig({ data: {params: {indexName: 'Unknown'} }, indexConfigs: indexConfigs });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'No index configuration found with name: Unknown');
			expect(output).to.equal('error');
		});

		it('should succeed with a valid index name given in params.indexName', async () => {
			var indexConfigs = JSON.parse(fs.readFileSync('./test/test_index_config.json'), null);
			var expectedConfig = indexConfigs['test-index-name'];
			const { value, output } = await flowNode.getIndexConfig({ data: {params: {indexName: 'test-index-name'} }, indexConfigs: indexConfigs });

			expectedConfig.rollup = { config: "NotSet" } ;
			expect(value).to.deep.equal(expectedConfig);
			expect(output).to.equal('next');
		});

		it('should succeed with a valid index name given in indexName', async () => {
			var indexConfigs = JSON.parse(fs.readFileSync('./test/test_index_config.json'), null);
			var expectedConfig = indexConfigs['test-index-name'];
			const { value, output } = await flowNode.getIndexConfig({ data: {indexName: 'test-index-name'}, indexConfigs: indexConfigs });

			expectedConfig.rollup = { config: "NotSet" } ;
			expect(value).to.deep.equal(expectedConfig);
			expect(output).to.equal('next');
		});

		it('should add defaults for rollup jobs', async () => {
			var indexConfigs = JSON.parse(fs.readFileSync('./test/test_index_config.json'), null);
			var expectedConfig = indexConfigs['test-index-name'];
			const { value, output } = await flowNode.getIndexConfig({ data: {indexName: 'test-index-name'}, indexConfigs: indexConfigs });

			expectedConfig.rollup = { config: "NotSet" } ;
			expect(value).to.deep.equal(expectedConfig);
			expect(output).to.equal('next');
		});
	});
});

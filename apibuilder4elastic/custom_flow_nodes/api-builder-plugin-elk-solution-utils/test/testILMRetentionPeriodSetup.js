const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const fs = require('fs');
const path = require('path');

describe('flow-node elk-solution-utils ILM Rentention-Period setup', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin, {}, {appDir: path.resolve("../..")});
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('elk-solution-utils');
	});

	describe('##setupILMRententionPeriodSetup', () => {
		it('should error when missing required parameter: indexConfig', async () => {
			const { value, output } = await flowNode.setupILMRententionPeriod({ indexConfig: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: indexConfig');
			expect(output).to.equal('error');
		});

		it('should error when missing required parameter: ilmConfig', async () => {
			const { value, output } = await flowNode.setupILMRententionPeriod({ indexConfig: {}, ilmConfig: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: ilmConfig');
			expect(output).to.equal('error');
		});

		it('should return with No-Change when missing required parameter: rententionPeriodConfig', async () => {
			const { value, output } = await flowNode.setupILMRententionPeriod({ indexConfig: {}, ilmConfig: { test: "123"} });

			expect(output).to.equal('notChanged');
			expect(value).to.deep.equal({ test: "123"});
		});

		it('should error when index name is missing in indexConfig', async () => {
			const { value, output } = await flowNode.setupILMRententionPeriod({ indexConfig: {}, ilmConfig: {}, rententionPeriodConfig: {} });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'The name of the index is missing in the IndexConfig');
			expect(output).to.equal('error');
		});

		it('should return UN-Changed the ILM-Config, as the index name is not configured/known.', async () => {
			var trafficDetailsILMPolicy = JSON.parse(fs.readFileSync('./test/ilmPolicy/trafficDetailsILM-Policy.json'), null);
			var retentionPeriodConfig = JSON.parse(fs.readFileSync('./test/testConfig/test-retention-period-config.json'), null);
			
			const { value, output } = await flowNode.setupILMRententionPeriod({ 
				ilmConfig: trafficDetailsILMPolicy, 
				indexConfig: { name: "not-configured-index-name" },
				rententionPeriodConfig: retentionPeriodConfig
			});
			expect(output).to.equal('notChanged');
			expect(value).to.deep.equal(trafficDetailsILMPolicy);
		});

		it('should return updated ILM-Policy based on the provide config object', async () => {
			var trafficDetailsILMPolicy = JSON.parse(fs.readFileSync('./test/ilmPolicy/trafficDetailsILM-Policy.json'), null);
			var retentionPeriodConfig = JSON.parse(fs.readFileSync('./test/testConfig/test-retention-period-config.json'), null);
			const { value, output } = await flowNode.setupILMRententionPeriod({ 
				ilmConfig: trafficDetailsILMPolicy, 
				indexConfig: { name: "apigw-traffic-summary" },
				rententionPeriodConfig: retentionPeriodConfig
			});

			expect(output).to.equal('next');
			expect(value.policy.phases.hot.actions.rollover).to.deep.equal({max_age: "7d", max_size: "15gb" });
			expect(value.policy.phases.warm.min_age).to.equal("0ms");
			expect(value.policy.phases.cold.min_age).to.equal("4d");
			expect(value.policy.phases.delete.min_age).to.equal("7d");
		});

		it('should error as the configured max size is too small.', async () => {
			var trafficDetailsILMPolicy = JSON.parse(fs.readFileSync('./test/ilmPolicy/trafficDetailsILM-Policy.json'), null);
			var retentionPeriodConfig = JSON.parse(fs.readFileSync('./test/testConfig/test-retention-period-config.json'), null);
			const { value, output } = await flowNode.setupILMRententionPeriod({ 
				ilmConfig: trafficDetailsILMPolicy, 
				indexConfig: { name: "max-size-too-small" },
				rententionPeriodConfig: retentionPeriodConfig
			});
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'The given max_size: 1 for index: max-size-too-small is too small. Please configure at least 5GB.');
			expect(output).to.equal('error');
		});

		it('should pass also with less configuration options.', async () => {
			var trafficDetailsILMPolicy = JSON.parse(fs.readFileSync('./test/ilmPolicy/trafficDetailsILM-Policy.json'), null);
			var retentionPeriodConfig = JSON.parse(fs.readFileSync('./test/testConfig/test-retention-period-config.json'), null);
			const { value, output } = await flowNode.setupILMRententionPeriod({ 
				ilmConfig: trafficDetailsILMPolicy, 
				indexConfig: { name: "less-config" },
				rententionPeriodConfig: retentionPeriodConfig
			});
			expect(output).to.equal('next');
			expect(value.policy.phases.hot.actions.rollover).to.deep.equal({max_age: "8d", max_size: "30gb" });
		});

		it('should when invalid config is provided', async () => {
			var trafficDetailsILMPolicy = JSON.parse(fs.readFileSync('./test/ilmPolicy/trafficDetailsILM-Policy.json'), null);
			var retentionPeriodConfig = JSON.parse(fs.readFileSync('./test/testConfig/test-retention-period-config.json'), null);
			const { value, output } = await flowNode.setupILMRententionPeriod({ 
				ilmConfig: trafficDetailsILMPolicy, 
				indexConfig: { name: "invalid-config" },
				rententionPeriodConfig: retentionPeriodConfig
			});
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'The given max_size: xxx for index: invalid-config is not a valid number.');
			expect(output).to.equal('error');
		});
	});
});

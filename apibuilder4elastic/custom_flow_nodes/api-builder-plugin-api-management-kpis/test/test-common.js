const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');

describe('flow-node api-management-kpis', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('api-management-kpis');
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(plugin).to.be.a('object');
			expect(plugin.getFlowNodeIds()).to.deep.equal([
				'api-management-kpis'
			]);
			expect(flowNode).to.be.a('object');
		});

		it('should define valid flow-nodes', () => {
			plugin.validate();
		});
	});

	describe('#API-KPIs', () => {
		it('should error when missing required parameter apiManagerConfig', async () => {
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: null
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: apiManagerConfig');
			expect(output).to.equal('error');
		});

		it('should error when missing required parameter apiManagerConfig.connection.url', async () => {
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: {}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: apiManagerConfig.connection.url');
			expect(output).to.equal('error');
		});

		it('should error when missing required parameter apiManagerConfig.connection.username', async () => {
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { connection: { url: "https://api-env:8075", username: null, password: null }, portalName: null }
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: apiManagerConfig.connection.username');
			expect(output).to.equal('error');
		});

		it('should error when missing required parameter apiManagerConfig.connection.password', async () => {
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { connection: { url: "https://api-env:8075", username: "dummy", password: null }}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: apiManagerConfig.connection.password');
			expect(output).to.equal('error');
		});

		it('should error when missing required parameter apiManagerConfig.portalName', async () => {
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { connection: { url: "https://api-env:8075", username: "dummy", password: "123456" }}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: apiManagerConfig.portalName');
			expect(output).to.equal('error');
		});
	});
});

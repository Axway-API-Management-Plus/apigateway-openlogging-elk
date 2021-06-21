const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const fs = require('fs');

describe('Flow node CreateCircuitPath query', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('traffic-monitor-api-utils');
	});

	describe('#CreateCircuitPath', () => {
		it('should error when required parameter params is missing', async () => {
			const { value, output } = await flowNode.createCircuitPathQuery({ params: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: params');
			expect(output).to.equal('error');
		});
		it('should error when required parameter user is missing', async () => {
			const { value, output } = await flowNode.createCircuitPathQuery({ params: {}, user: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: user');
			expect(output).to.equal('error');
		});
		it('should error when required parameter authzConfig is missing', async () => {
			const { value, output } = await flowNode.createCircuitPathQuery({ params: {}, user: {} });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: authzConfig');
			expect(output).to.equal('error');
		});
		

		it('should error when required params.correlationId is missing', async () => {
			const { value, output } = await flowNode.createCircuitPathQuery({ params: {}, user: {}, authzConfig: {} });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: params.correlationID');
			expect(output).to.equal('error');
		});

		it('should error when required parameter params.serviceId is missing', async () => {
			const { value, output } = await flowNode.createCircuitPathQuery({ params: { correlationID: 123 }, user: {}, authzConfig: {}, gatewayTopology: {} } );

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: params.serviceID when not using EMT.');
			expect(output).to.equal('error');
		});

		it('should succeed with valid parameters as an API-Manager User', async () => {
			const { value, output } = await flowNode.createCircuitPathQuery( { params: { correlationID: "MyCorrelationId", serviceID: "TestServiceId" }, gatewayTopology: {}, user: {
				apiManager: { role: "user", organizationName: "Test-Org" },  
				gatewayManager: {}
			}, authzConfig: { 
				apimanagerOrganization: { enabled: true }
			} } );

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({
				bool: {
					must: [
						{ term: { correlationId: "MyCorrelationId" } },
						{ term: { 'processInfo.serviceId': "TestServiceId" } },
						{ term: { 'transactionSummary.serviceContext.apiOrg': "Test-Org" } }
					]
				}
			});
		});

		it('should succeed with valid parameters having API-Manager Org-AuthZ disabled', async () => {
			const { value, output } = await flowNode.createCircuitPathQuery( { params: { correlationID: "MyCorrelationId", serviceID: "TestServiceId" }, gatewayTopology: {}, user: {
				apiManager: { role: "user", organizationName: "Test-Org" },  
				gatewayManager: {}
			}, authzConfig: { 
				apimanagerOrganization: { enabled: false }
			} } );

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({
				bool: {
					must: [
						{ term: { correlationId: "MyCorrelationId" } },
						{ term: { 'processInfo.serviceId': "TestServiceId" } }
					]
				}
			});
		});

		it('should succeed with valid parameters with API-Manager Admin-Role', async () => {
			const { value, output } = await flowNode.createCircuitPathQuery( { params: { correlationID: "MyCorrelationId", serviceID: "TestServiceId" }, gatewayTopology: {}, user: {
				apiManager: { role: "admin", organizationName: "Test-Org" },  
				gatewayManager: {}
			}, authzConfig: { 
				apimanagerOrganization: { enabled: true }
			} } );

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({
				bool: {
					must: [
						{ term: { correlationId: "MyCorrelationId" } },
						{ term: { 'processInfo.serviceId': "TestServiceId" } },
						{ exists: { field: "transactionSummary.serviceContext" } }
					]
				}
			});
		});

		it('should succeed when EMT is enabled', async () => {
			var topology = JSON.parse(fs.readFileSync('./test/mockedReplies/emtTopology.json'), null);
			const { value, output } = await flowNode.createCircuitPathQuery( { params: { correlationID: "MyCorrelationId", serviceID: "TestServiceId" }, gatewayTopology: topology, user: {
				apiManager: { role: "admin", organizationName: "Test-Org" },  
				gatewayManager: {}
			}, authzConfig: { 
				apimanagerOrganization: { enabled: true }
			} } );

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({
				bool: {
					must: [
						{ term: { correlationId: "MyCorrelationId" } },
						{ exists: { field: "transactionSummary.serviceContext" } }
					]
				}
			});
		});
	});
});

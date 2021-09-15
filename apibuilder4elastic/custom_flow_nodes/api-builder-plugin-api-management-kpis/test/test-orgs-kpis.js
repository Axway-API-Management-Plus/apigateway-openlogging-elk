const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const nock = require('nock');

describe('flow-node api-management-kpis', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('api-management-kpis');
	});

	describe('#Org-KPIs', () => {
		it('should error if one of the common parameters is missing', async () => {
			const { value, output } = await flowNode.getOrgKPIs({
				apiManagerConfig: { connection: { url: "https://api-env:8075", username: "dummy", password: "123456" }}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: apiManagerConfig.portalName');
			expect(output).to.equal('error');
		});

		it('should succeed with valid arguments and return a new KPIs object', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/organizations').replyWithFile(200, './test/testReplies/orgs/6-orgs-response.json');
			const { value, output } = await flowNode.getOrgKPIs({
				apiManagerConfig: { connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, portalName: "My API-Manager", productVersion: "7.7.20210830" }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({apiManager:{name:"My API-Manager", version: "7.7.20210830" }, orgs_total: 6, orgs_total_diff:0});
		});

		it('should succeed with valid arguments and return merged KPIs object', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/organizations').replyWithFile(200, './test/testReplies/orgs/6-orgs-response.json');
			const { value, output } = await flowNode.getOrgKPIs({
				apiManagerConfig: { connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, portalName: "My API-Manager", productVersion: "7.7.20210830" },
				kpis: { apiManager:{name:"Test API-Manager", version: "7.7.20210530" }, apis_total: 235, apis_total_diff: 2 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				apiManager:{name:"Test API-Manager", version: "7.7.20210530" }, 
				orgs_total: 6, orgs_total_diff: 0,
				apis_total: 235, apis_total_diff: 2
			});
		});

		it('should succeed with valid arguments and return new KPIs object with caclulated differences (Orgs reduced)', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/organizations').replyWithFile(200, './test/testReplies/orgs/6-orgs-response.json');
			const { value, output } = await flowNode.getOrgKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {orgs_total: 15, orgs_total_diff: 2 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				apiManager:{name:"My API-Manager", version: "7.7.20210830" }, 
				orgs_total: 6, orgs_total_diff: -9
			});
		});

		it('should succeed with valid arguments and return new KPIs object with caclulated differences (Orgs added)', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/organizations').replyWithFile(200, './test/testReplies/orgs/6-orgs-response.json');
			const { value, output } = await flowNode.getOrgKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {orgs_total: 1, orgs_total_diff: 1 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				apiManager:{name:"My API-Manager", version: "7.7.20210830" }, 
				orgs_total: 6, orgs_total_diff: 5
			});
		});
	});
});

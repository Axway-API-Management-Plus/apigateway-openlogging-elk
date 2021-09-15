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

	describe('#API-KPIs', () => {
		it('should succeed with valid arguments and return a new KPIs object', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/discovery/apis').replyWithFile(200, './test/testReplies/apis/3-apis-response.json');
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, portalName: "My API-Manager", productVersion: "7.7.20210830" }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({apiManager:{name:"My API-Manager", version: "7.7.20210830" }, apis_total:3, apis_total_diff:0});
		});

		it('should succeed with valid arguments and return merged KPIs object', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/discovery/apis').replyWithFile(200, './test/testReplies/apis/3-apis-response.json');
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, portalName: "My API-Manager", productVersion: "7.7.20210830" },
				kpis: { apiManager:{name:"Test API-Manager", version: "7.7.20210530" }, apps_total: 235, apps_total_diff: 2 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				apiManager:{name:"Test API-Manager", version: "7.7.20210530" }, 
				apps_total: 235, apps_total_diff: 2, apis_total:3, apis_total_diff:0
			});
		});

		it('should succeed with valid arguments and return new KPIs object with caclulated differences (APIs reduced)', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/discovery/apis').replyWithFile(200, './test/testReplies/apis/3-apis-response.json');
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {apis_total: 5, apis_total_diff: 1 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				apiManager:{name:"My API-Manager", version: "7.7.20210830" }, 
				apis_total:3, apis_total_diff: -2
			});
		});

		it('should succeed with valid arguments and return new KPIs object with caclulated differences (APIs added)', async () => {			
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/discovery/apis').replyWithFile(200, './test/testReplies/apis/3-apis-response.json');
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {apis_total: 1, apis_total_diff: 1 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				apiManager:{name:"My API-Manager", version: "7.7.20210830" }, 
				apis_total:3, apis_total_diff: 2
			});
		});
	});
});

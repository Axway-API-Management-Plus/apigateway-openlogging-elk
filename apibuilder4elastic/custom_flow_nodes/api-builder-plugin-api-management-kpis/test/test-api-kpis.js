const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const nock = require('nock');
const os = require("os");

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
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies').replyWithFile(200, './test/testReplies/proxies/proxies-response.json');
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, portalName: "My API-Manager", productVersion: "7.7.20210830" }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal(
				{
					meta: {apiManagerName:"My API-Manager", apiManagerVersion: "7.7.20210830", apiBuilderHostname: os.hostname() }, 
					apis_total:30, apis_total_diff:0
				}
			);
		});

		it('should succeed with valid arguments and return merged KPIs object', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies').replyWithFile(200, './test/testReplies/proxies/proxies-response.json');
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, portalName: "My API-Manager", productVersion: "7.7.20210830" },
				kpis: { 
					meta: { apiManagerName:"Test API-Manager", apiManagerVersion: "7.7.20210530", apiBuilderHostname: os.hostname() }, 
					apps_total: 235, apps_total_diff: 2 
				}
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				meta: {apiManagerName:"Test API-Manager", apiManagerVersion: "7.7.20210530", apiBuilderHostname: os.hostname() }, 
				apps_total: 235, apps_total_diff: 2, apis_total:30, apis_total_diff:0
			});
		});

		it('should succeed with valid arguments and return new KPIs object with caclulated differences (APIs reduced)', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies').replyWithFile(200, './test/testReplies/proxies/proxies-response.json');
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {apis_total: 32, apis_total_diff: 1 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				meta: {apiManagerName:"My API-Manager", apiManagerVersion: "7.7.20210830", apiBuilderHostname: os.hostname()}, 
				apis_total:30, apis_total_diff: -2
			});
		});

		it('should succeed with valid arguments and return new KPIs object with caclulated differences (APIs added)', async () => {			
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies').replyWithFile(200, './test/testReplies/proxies/proxies-response.json');
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {apis_total: 1, apis_total_diff: 1 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				meta:{apiManagerName:"My API-Manager", apiManagerVersion: "7.7.20210830", apiBuilderHostname: os.hostname() }, 
				apis_total:30, apis_total_diff: 29
			});
		});

		it('should return APIs only for the given organization.', async () => {			
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/proxies').replyWithFile(200, './test/testReplies/proxies/proxies-response.json');
			const { value, output } = await flowNode.getAPIKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {apis_total: 1, apis_total_diff: 1 },
				organization: {id: "2c724048-653e-418c-977f-b33f6219ee16", name: "Axway"}
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				meta:{apiManagerName:"My API-Manager", apiManagerVersion: "7.7.20210830", apiBuilderHostname: os.hostname() }, 
				apis_total:2, apis_total_diff: 1, // Expect 2 APIs for Axway out of 30
				organization: "Axway"
			});
		});
	});
});

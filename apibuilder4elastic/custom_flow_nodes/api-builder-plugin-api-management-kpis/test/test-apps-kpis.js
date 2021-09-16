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

	describe('#Apps-KPIs', () => {
		it('should error if one of the common parameters is missing', async () => {
			const { value, output } = await flowNode.getAppKPIs({
				apiManagerConfig: { connection: { url: "https://api-env:8075", username: "dummy", password: "123456" }}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: apiManagerConfig.portalName');
			expect(output).to.equal('error');
		});

		it('should succeed with valid arguments and return a new KPIs object', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications').replyWithFile(200, './test/testReplies/apps/2-apps-response.json');
			const { value, output } = await flowNode.getAppKPIs({
				apiManagerConfig: { connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, portalName: "My API-Manager", productVersion: "7.7.20210830" }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal(
				{meta: {apiManagerName:"My API-Manager", apiManagerVersion: "7.7.20210830", apiBuilderHostname: os.hostname() }, 
				apps_total:2, apps_total_diff:0
			});
		});

		it('should succeed with valid arguments and return merged KPIs object', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications').replyWithFile(200, './test/testReplies/apps/2-apps-response.json');
			const { value, output } = await flowNode.getAppKPIs({
				apiManagerConfig: { connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, portalName: "My API-Manager", productVersion: "7.7.20210830" },
				kpis: { meta: { apiManagerName:"Test API-Manager", apiManagerVersion: "7.7.20210530", apiBuilderHostname: os.hostname() }, apis_total: 235, apis_total_diff: 2 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				meta:{apiManagerName:"Test API-Manager", apiManagerVersion: "7.7.20210530", apiBuilderHostname: os.hostname() }, 
				apps_total: 2, apps_total_diff: 0,
				apis_total: 235, apis_total_diff: 2
			});
		});

		it('should succeed with valid arguments and return new KPIs object with caclulated differences (Apps reduced)', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications').replyWithFile(200, './test/testReplies/apps/2-apps-response.json');
			const { value, output } = await flowNode.getAppKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {apps_total: 5, apps_total_diff: 1 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				meta:{apiManagerName:"My API-Manager", apiManagerVersion: "7.7.20210830", apiBuilderHostname: os.hostname() }, 
				apps_total:2, apps_total_diff: -3
			});
		});

		it('should succeed with valid arguments and return new KPIs object with caclulated differences (Apps added)', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications').replyWithFile(200, './test/testReplies/apps/2-apps-response.json');
			const { value, output } = await flowNode.getAppKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {apps_total: 1, apps_total_diff: 1 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				meta: {apiManagerName:"My API-Manager", apiManagerVersion: "7.7.20210830", apiBuilderHostname: os.hostname() }, 
				apps_total:2, apps_total_diff: 1
			});
		});

		it('should succeed with valid arguments and return new KPIs object with caclulated differences (Apps added)', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications').replyWithFile(200, './test/testReplies/apps/2-apps-response.json');
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications/8f16d498-5163-4481-b34a-3fdb81db09ab/apis').replyWithFile(200, './test/testReplies/apps/subscription-app-1-response.json');
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications/d33bc178-d686-41c4-a9b0-8b5a0eabbc5d/apis').replyWithFile(200, './test/testReplies/apps/subscription-app-2-response.json');
			const { value, output } = await flowNode.getAppKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "user", password: "password" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {subscriptions_total: 5, subscriptions_total_diff: 1 },
				includeSubscriptions: true
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				meta:{apiManagerName:"My API-Manager", apiManagerVersion: "7.7.20210830", apiBuilderHostname: os.hostname() }, 
				apps_total:2, apps_total_diff: 2,
				subscriptions_total: 2, subscriptions_total_diff: -3
			});
		});
	});
});

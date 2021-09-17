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
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications').replyWithFile(200, './test/testReplies/apps/4-apps-response.json');
			const { value, output } = await flowNode.getAppKPIs({
				apiManagerConfig: { connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, portalName: "My API-Manager", productVersion: "7.7.20210830" }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal(
				{meta: {apiManagerName:"My API-Manager", apiManagerVersion: "7.7.20210830", apiBuilderHostname: os.hostname() }, 
				apps_total:4, apps_total_diff:0,
				organization: "< All >"
			});
		});

		it('should succeed with valid arguments and return merged KPIs object', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications').replyWithFile(200, './test/testReplies/apps/4-apps-response.json');
			const { value, output } = await flowNode.getAppKPIs({
				apiManagerConfig: { connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, portalName: "My API-Manager", productVersion: "7.7.20210830" },
				kpis: { meta: { apiManagerName:"Test API-Manager", apiManagerVersion: "7.7.20210530", apiBuilderHostname: os.hostname() }, apis_total: 235, apis_total_diff: 2 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				meta:{apiManagerName:"Test API-Manager", apiManagerVersion: "7.7.20210530", apiBuilderHostname: os.hostname() }, 
				apps_total: 4, apps_total_diff: 0,
				apis_total: 235, apis_total_diff: 2,
				organization: "< All >"
			});
		});

		it('should succeed with valid arguments and return new KPIs object with caclulated differences (Apps reduced)', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications').replyWithFile(200, './test/testReplies/apps/4-apps-response.json');
			const { value, output } = await flowNode.getAppKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "myuser", password: "mypass" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {apps_total: 7, apps_total_diff: 1 }
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				meta:{apiManagerName:"My API-Manager", apiManagerVersion: "7.7.20210830", apiBuilderHostname: os.hostname() }, 
				apps_total:4, apps_total_diff: -3,
				organization: "< All >"
			});
		});

		it('should succeed with valid arguments and return new KPIs object with caclulated differences (Apps added)', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications').replyWithFile(200, './test/testReplies/apps/4-apps-response.json');
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
				apps_total:4, apps_total_diff: 3,
				organization: "< All >"
			});
		});

		it('should including subscriptions to these applications', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications').replyWithFile(200, './test/testReplies/apps/4-apps-response.json');
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications/118c6617-1e2f-4242-bea7-4c23a373b6fe/apis').replyWithFile(200, './test/testReplies/apps/subscription-app-1-response.json');
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications/01ecde65-7335-4cbf-a1bf-6fc2250515e2/apis').replyWithFile(200, './test/testReplies/apps/subscription-app-2-response.json');
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications/9c5934fa-7c71-43b1-bcf8-694aa9f36d55/apis').replyWithFile(200, './test/testReplies/apps/subscription-app-2-response.json');
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications/f3a990fc-d3d7-4412-86e7-c26ff4a39b3b/apis').reply(200, []);
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
				apps_total:4, apps_total_diff: 4,
				subscriptions_total: 3, subscriptions_total_diff: -2,
				organization: "< All >"
			});
		});

		it('should return applications for the organization only.', async () => {
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications').replyWithFile(200, './test/testReplies/apps/12-apps-response.json');
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications/923bbf72-13c6-40fa-8d70-dfe060dc04d1/apis').replyWithFile(200, './test/testReplies/apps/subscription-app-1-response.json');
			nock('https://mocked-api-gateway:8175').get('/api/portal/v1.3/applications/6122ec36-716b-4890-b1ad-a7eb6539f80d/apis').replyWithFile(200, './test/testReplies/apps/subscription-app-2-response.json');
			const { value, output } = await flowNode.getAppKPIs({
				apiManagerConfig: { 
					connection: { url: "https://mocked-api-gateway:8175", username: "user", password: "password" }, 
					portalName: "My API-Manager", productVersion: "7.7.20210830"
				},
				previousKPIs: {subscriptions_total: 5, subscriptions_total_diff: 1 },
				organization: {id: "2c724048-653e-418c-977f-b33f6219ee16", name: "Axway"},
				includeSubscriptions: true
			});

			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				meta:{apiManagerName:"My API-Manager", apiManagerVersion: "7.7.20210830", apiBuilderHostname: os.hostname() }, 
				apps_total:2, apps_total_diff: 2, // 2 applications out of the 12 belong to organization Axway
				subscriptions_total: 2, subscriptions_total_diff: -3,
				organization: "Axway"
			});
		});
	});
});

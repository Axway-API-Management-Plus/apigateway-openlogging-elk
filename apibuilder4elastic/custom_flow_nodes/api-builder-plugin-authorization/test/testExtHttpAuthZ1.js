const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const fs = require('fs');
const path = require('path');
const nock = require('nock');
const envLoader = require('dotenv');

// Loads environment variables from .env if the file exists
const envFilePath = path.join(__dirname, '.env-test');
if (fs.existsSync(envFilePath)) {
	envLoader.config({ path: envFilePath });
}

describe('flow-node Authorization', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		debugger;
		process.env.AUTHZ_CONFIG = '../test/testConfig/authorization-config-extAuthZ.js';
		plugin = await MockRuntime.loadPlugin(getPlugin);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('authorization');
	});

	after(async () => {
		delete process.env.AUTHZ_CONFIG;
	});

	describe('#externalHTTPAuthZFilter', () => {
		it('should return with HTTP output', async () => {
			const { value, output } = await flowNode.switchOnAuthZ({ });

			expect(output).to.equal('extHttp');
		});

		it('should error when missing required parameter user', async () => {
			const { value, output } = await flowNode.addExtHTTPAuthzFilter({
				user: null
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: user');
			expect(output).to.equal('error');
		});

		it('should error when missing required parameter elasticQuery', async () => {
			const { value, output } = await flowNode.addExtHTTPAuthzFilter({
				user: { "user": "MyUser"}, elasticQuery: null
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: elasticQuery');
			expect(output).to.equal('error');
		});

		it('should error when parameter user is not an object', async () => {
			const { value, output } = await flowNode.addExtHTTPAuthzFilter({
				user: "A String", elasticQuery: {}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Parameter: user must be an object');
			expect(output).to.equal('error');
		});

		it('should error when parameter filters is not an array', async () => {
			const { value, output } = await flowNode.addExtHTTPAuthzFilter({
				user: { user: "my user"}, elasticQuery: "A String"
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Parameter: elasticQuery must be an object');
			expect(output).to.equal('error');
		});

		it('should error if the response is unexpected', async () => { 
			var elasticQuery = JSON.parse(fs.readFileSync('./test/mock/givenElasticQuery.json'), null);
			nock('https://external-http:8180').defaultReplyHeaders({'Content-Type': 'application/json; charset=utf-8'})
				.get(`/api/v1/users/anna/groups?registry=AD&caching=false&filter=apg-t`)
				.replyWithFile(200, './test/mock/extAuthZ/unexpectedResponse.json');

			const { value, output } = await flowNode.addExtHTTPAuthzFilter({
				user: { loginName: "anna" }, elasticQuery: elasticQuery
			});
			
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Unexpected response format. Cannot parse: \'The-format is unexpected\'');
			expect(output).to.equal('error');
		});

		it('should add the filter for ONE APIM-ID', async () => { 
			var user = JSON.parse(fs.readFileSync('./test/mock/noAdminUserObject.json'), null);
			var elasticQuery = JSON.parse(fs.readFileSync('./test/mock/givenElasticQuery.json'), null);
			let expectedQuery = JSON.parse(JSON.stringify(elasticQuery));
			nock('https://external-http:8180').defaultReplyHeaders({'Content-Type': 'application/json; charset=utf-8'})
				.get(`/api/v1/users/anna/groups?registry=AD&caching=false&filter=apg-t`)
				.replyWithFile(200, './test/mock/extAuthZ/response2.json');
			
			const { value, output } = await flowNode.addExtHTTPAuthzFilter({
				user: user, elasticQuery: elasticQuery
			});
			
			expectedQuery.bool.must.push({
				terms: {  "customProperties.field1" : ["MAAS"] }
			});

			expect(value).to.be.instanceOf(Object);
			expect(value).to.deep.equal(expectedQuery);
			expect(output).to.equal('next');
		});

		it('should add the filter for MULTIPLE APIM-IDs', async () => { 
			var user = JSON.parse(fs.readFileSync('./test/mock/noAdminUserObject.json'), null);
			var elasticQuery = JSON.parse(fs.readFileSync('./test/mock/givenElasticQuery.json'), null);
			let expectedQuery = JSON.parse(JSON.stringify(elasticQuery));
			nock('https://external-http:8180').defaultReplyHeaders({'Content-Type': 'application/json; charset=utf-8'})
				.get(`/api/v1/users/anna/groups?registry=AD&caching=false&filter=apg-t`)
				.replyWithFile(200, './test/mock/extAuthZ/response1.json');
			
			const { value, output } = await flowNode.addExtHTTPAuthzFilter({
				user: user, elasticQuery: elasticQuery
			});
			
			expectedQuery.bool.must.push({
				terms: {  "customProperties.field1" : ["DGP", "UIF", "CSPARTINT", "CORSOEDMS", "CORSOLMS", "TCL"] }
			});

			expect(value).to.be.instanceOf(Object);
			expect(value).to.deep.equal(expectedQuery);
			expect(output).to.equal('next');
		});

		it('should result in No-Access if no groups are returned and it should be cached', async () => { 
			var user = JSON.parse(fs.readFileSync('./test/mock/noAdminUserObject.json'), null);
			var elasticQuery = JSON.parse(fs.readFileSync('./test/mock/givenElasticQuery.json'), null);
			nock('https://external-http:8180').defaultReplyHeaders({'Content-Type': 'application/json; charset=utf-8'})
				.get(`/api/v1/users/anna/groups?registry=AD&caching=false&filter=apg-t`)
				.replyWithFile(200, './test/mock/extAuthZ/noGroupResponse.json');

			var { value, output } = await flowNode.addExtHTTPAuthzFilter({
				user: user, elasticQuery: elasticQuery
			});

			expect(output).to.equal('noAccess');
			expect(value).to.equal('User: anna has no access');
			// Clear the mock, it should not matter as the result must be cached
			nock.cleanAll();

			var { value, output } = await flowNode.addExtHTTPAuthzFilter({
				user: user, elasticQuery: elasticQuery
			});
			expect(output).to.equal('noAccess');
			expect(value).to.equal('User: anna has no access');
		});
	});
});

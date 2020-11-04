const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Test API-Lookup endpoint', function () {
	this.timeout(30000);
	let server;
	let auth;

	afterEach(() => {
		nock.cleanAll();
	});

	beforeEach(() => {
		nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/mockedReplies/apimanager/customPropertiesConfig.json');
	});

	/**
	 * Start API Builder.
	 */
	/**
	 * Start API Builder.
	 */
	before(() => {
		const envFilePath = path.join(__dirname, '../.env');
		if (fs.existsSync(envFilePath)) {
			envLoader.config({ path: envFilePath });
		}
		server = startApiBuilder();
		auth = {
			user: server.apibuilder.config.apikey || 'test',
			password: ''
		};
		return server.started;
	});

	/**
	 * Stop API Builder after the tests.
	 */
	after(() => stopApiBuilder(server));

	describe('trace endpoint tests', () => {

		it('[apilookup-0001] Should return http 200 with API details for an existing API', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore%20HTTPS').replyWithFile(200, './test/mockedReplies/apimanager/oneApiProxyFound.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS').replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=Petstore%20HTTPS&apiPath=/my/api/exists/with/some/more&groupId=XXXX`, // The groupd doesn't matter for this test
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.organizationName).to.equal('Chris Org');
				expect(body.path).to.equal('/my/api/exists');
				nock.cleanAll();
			});
		});

		it('[apilookup-0002] Should return http 404 for an unknown API', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=UnknownAPI').reply(200, '[]');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=UnknownAPI&apiPath=/any/path&groupId=XXXX`, // The groupd doesn't matter for this test
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(404);
				expect(body).to.be.an('Object');
				expect(body.message).to.equal(`No APIs found with name: 'UnknownAPI'`);
				nock.cleanAll();
			});
		});

		it('[apilookup-0003] Should return 200 with API including configured policies', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore-with-policies').replyWithFile(200, './test/mockedReplies/apimanager/ApiProxyWithPoliciesConfigured.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS').replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=Petstore-with-policies&apiPath=/my/api/exists/with/policies&groupId=XXXX`, // The groupd doesn't matter for this test
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.organizationName).to.equal('Chris Org');
				expect(body.requestPolicy).to.equal('My Request Policy');
				expect(body.routingPolicy).to.equal('I do the routing');
				expect(body.responsePolicy).to.equal('I take care abouth the response');
				expect(body.faulthandlerPolicy).to.equal('All faults to me');
				expect(body.path).to.equal('/my/api/exists/with/policies');
				nock.cleanAll();
			});
		});

		it('[apilookup-0004] Should return N/A values for Policies, etc. when not given by the API', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=API-without-Policies').replyWithFile(200, './test/mockedReplies/apimanager/oneApiProxyFound.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS').replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=API-without-Policies&apiPath=/my/api/exists/with/some/more&groupId=XXXX`, // The groupd doesn't matter for this test
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.organizationName).to.equal('Chris Org');
				expect(body.requestPolicy).to.equal("N/A");
				expect(body.routingPolicy).to.equal("N/A");
				expect(body.responsePolicy).to.equal("N/A");
				expect(body.faulthandlerPolicy).to.equal("N/A");
				expect(body.path).to.equal('/my/api/exists');
				nock.cleanAll();
			});
		});

		it('[apilookup-0005] Should return http 200 with API configured backend base path', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore-with-special-backend').replyWithFile(200, './test/mockedReplies/apimanager/ApiProxyWithSpecialBackendBasePath.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS').replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=Petstore-with-special-backend&apiPath=/my/api/exists/with/backend&groupId=XXXX`, // The groupd doesn't matter for this test
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.organizationName).to.equal('Chris Org');
				expect(body.backendBasePath).to.equal('https://im.a.special.backend.host:7788');
				expect(body.path).to.equal('/my/api/exists/with/backend');
				nock.cleanAll();
			});
		});

		it('[apilookup-0006] should return OAuth security', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore%20OAuth').replyWithFile(200, './test/mockedReplies/apimanager/ApiProxyWithSpecialBackendBasePath.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS').replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=Petstore%20OAuth&apiPath=/my/api/exists/with/backend&groupId=XXXX`, // The groupd doesn't matter for this test
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.organizationName).to.equal('Chris Org');
				expect(body.backendBasePath).to.equal('https://im.a.special.backend.host:7788');
				expect(body.path).to.equal('/my/api/exists/with/backend');
				nock.cleanAll();
			});
		});

		it('[apilookup-0007] should return "N/A" for the API-Version if not defined for the API', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Myshop').replyWithFile(200, './test/mockedReplies/apimanager/apiProxyWithoutVersion.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS').replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=Myshop&apiPath=/MyShopAPI&groupId=XXXX`, // The groupd doesn't matter for this test
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.version).to.equal('N/A');
				
				nock.cleanAll();
			});
		});

		it.only('[apilookup-0008] should return API incl. customProperties object', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore HTTPS').replyWithFile(200, './test/mockedReplies/apimanager/apiProxyWithCustomProperties.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS').replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=Petstore%20HTTPS&apiPath=/my/api/with/custom/properties&groupId=XXXX`, // The groupd doesn't matter for this test
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.path).to.equal('/my/api/with/custom/properties');
				expect(body.customProperties.customProperty1).to.equal('Test-Input 1');
				expect(body.customProperties.customProperty2).to.equal('1');
				expect(body.customProperties.customProperty3).to.equal('true');
				nock.cleanAll();
			});
		});
		
	});
});
	

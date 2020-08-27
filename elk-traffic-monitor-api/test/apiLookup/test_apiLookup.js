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
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=Petstore%20HTTPS&apiPath=/my/api/exists/with/some/more`,
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
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=UnknownAPI&apiPath=/any/path`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(404);
				expect(body).to.be.an('Object');
				expect(body.message).to.equal(`No APIs found with name: 'UnknownAPI'`);
			});
		});

		it('[apilookup-0003] Should return http 200 with API including configured policies', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore%20HTTPS').replyWithFile(200, './test/mockedReplies/apimanager/ApiProxyWithPoliciesConfigured.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS').replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=Petstore%20HTTPS&apiPath=/my/api/exists/with/some/more`,
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
				expect(body.path).to.equal('/my/api/exists');
				nock.cleanAll();
			});
		});

		it.only('[apilookup-0004] Should NULL values for Policies, etc. when not given by the API', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore%20HTTPS').replyWithFile(200, './test/mockedReplies/apimanager/oneApiProxyFound.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS').replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=Petstore%20HTTPS&apiPath=/my/api/exists/with/some/more`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.organizationName).to.equal('Chris Org');
				expect(body.requestPolicy).to.equal(null);
				expect(body.routingPolicy).to.equal(null);
				expect(body.responsePolicy).to.equal(null);
				expect(body.faulthandlerPolicy).to.equal(null);
				expect(body.path).to.equal('/my/api/exists');
				nock.cleanAll();
			});
		});

		it('[apilookup-0005] Should return http 200 with API configured backend base path', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore%20HTTPS').replyWithFile(200, './test/mockedReplies/apimanager/ApiProxyWithSpecialBackendBasePath.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS').replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=Petstore%20HTTPS&apiPath=/my/api/exists/with/some/more`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.organizationName).to.equal('Chris Org');
				expect(body.backendBasePath).to.equal('https://im.a.special.backend.host:7788');
				expect(body.path).to.equal('/my/api/exists');
				nock.cleanAll();
			});
		});

		it('[apilookup-0006] should return OAuth security', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=name&op=eq&value=Petstore%20HTTPS').replyWithFile(200, './test/mockedReplies/apimanager/ApiProxyWithSpecialBackendBasePath.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS').replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=Petstore%20HTTPS&apiPath=/my/api/exists/with/some/more`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.organizationName).to.equal('Chris Org');
				expect(body.backendBasePath).to.equal('https://im.a.special.backend.host:7788');
				expect(body.path).to.equal('/my/api/exists');
				nock.cleanAll();
			});
		});
	});
});
	

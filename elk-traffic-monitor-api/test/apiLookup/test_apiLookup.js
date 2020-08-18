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
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=path&op=eq&value=/my/api/exists').replyWithFile(200, './test/mockedReplies/apimanager/oneApiProxyFound.json');
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-f833ca1c0a74').replyWithFile(200, './test/mockedReplies/apimanager/organizationAPIDevelopment.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiPath=/my/api/exists`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.organizationName).to.equal('API Development');
				expect(body.path).to.equal('/my/api/exists');
			});
		});

		it('[apilookup-0002] Should return http 404 for an unknown API', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/proxies?field=path&op=eq&value=/omg/this/api/doesnt/exists').reply(200, '[]');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiName=UnknownAPI&apiPath=/any/path`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(404);
				expect(body).to.be.an('Object');
				expect(body.message).to.equal(`API not found`);
			});
		});
	});
});
	

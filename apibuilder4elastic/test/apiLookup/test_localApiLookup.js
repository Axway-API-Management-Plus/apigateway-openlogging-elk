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
	before(() => {
		const envFilePath = path.join(__dirname, '../.env');
		if (fs.existsSync(envFilePath)) {
			envLoader.config({ path: envFilePath });
		}
		process.env.API_BUILDER_LOCAL_API_LOOKUP_FILE = 'test/apiLookup/test-api-lookup.json';
		server = startApiBuilder();
		auth = {
			user: server.apibuilder.config.apikey || 'test',
			password: ''
		};
		return server.started;
	});

	/**
	 * Stop API Builder after the tests and reset the local lookup file to null
	 */
	after(() => {
		process.env.API_BUILDER_LOCAL_API_LOOKUP_FILE = null;
		stopApiBuilder(server)
	});

	describe('trace endpoint tests', () => {

		it('[local-apilookup-0001] Should return http 200 with API details for a locally configured API', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/api?apiPath=/api/configured/locally`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.organizationName).to.equal('Local Org');
				expect(body.path).to.equal('/api/configured/locally');
				nock.cleanAll();
			});
		});		
	});
});
	

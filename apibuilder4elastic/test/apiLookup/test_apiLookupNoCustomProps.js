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
	before(() => {
		const envFilePath = path.join(__dirname, '../.env');
		if (fs.existsSync(envFilePath)) {
			envLoader.config({ path: envFilePath });
		}
		process.env.DISABLE_CUSTOM_PROPERTIES = true;
		nock.cleanAll();
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

	describe('API-Lookup tests without custom properties', () => {

		it('[apilookup-no-custom-props-0001] should return API details without custom properties', () => {
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
		
	});
});
	

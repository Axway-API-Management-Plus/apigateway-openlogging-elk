const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Test Application-Lookup endpoint', function () {
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

		it('[applookup-0001] Should return http 200 with Application details for an existing applications', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/applications/268fd3bd-3af6-4565-a3aa-6dc9559f1fbf').replyWithFile(200, './test/mockedReplies/apimanager/appPatientMonitoring.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/application?applicationId=268fd3bd-3af6-4565-a3aa-6dc9559f1fbf`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.name).to.equal('Plexus Suite - Patient Monitoring');
				expect(body.id).to.equal('268fd3bd-3af6-4565-a3aa-6dc9559f1fbf');
				nock.cleanAll();
			});
		});

		it('[applookup-0002] Should return http 200 for an unknown application - ID is the name', () => {
			nock('https://mocked-api-gateway:8075').get('/api/portal/v1.3/applications/268fd3bd-3af6-4565-a3aa-UNKNOWN-APP').replyWithFile(404, './test/mockedReplies/apimanager/appNotFoundResponse.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/lookup/application?applicationId=268fd3bd-3af6-4565-a3aa-UNKNOWN-APP`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.name).to.equal('268fd3bd-3af6-4565-a3aa-UNKNOWN-APP');
				expect(body.id).to.equal('268fd3bd-3af6-4565-a3aa-UNKNOWN-APP');
				nock.cleanAll();
			});
		});		
	});
});
	

const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../../../_base');
const getDate = require('../../../util');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Endpoints', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `apigw-traffic-summary-emt-search_test_${getRandomInt(9999)}`;

	beforeEach(() => {
		// Simulate all responses in this test-file to be an admin, which will not lead to any result restriction
		nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "david" });
		nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/adminUserDavid.json');
		nock('https://mocked-api-gateway:8090').get('/api/topology').replyWithFile(200, './test/mockedReplies/apigateway/sampleEMTTopology.json');
	});

	afterEach(() => {
		nock.cleanAll();
	});

	/**
	 * Start API Builder.
	 */
	before(() => {
		return new Promise(function(resolve, reject){
			const envFilePath = path.join(__dirname, '../../../.env');
			if (fs.existsSync(envFilePath)) {
				envLoader.config({ path: envFilePath });
			}
			server = startApiBuilder();
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const entryset = require('../../../documents/http/search_test_documents_for_emt');
				sendToElasticsearch(elasticConfig, indexName, 'traffic-summary/index_template.json', entryset)
				.then(() => {
					setTimeout(resolve(), 500); // Wait a few moments to give ES the chance to index the data completely
				})
				.catch(err => reject(err));
			});
		});
	});

	/**
	 * Stop API Builder after the tests.
	 */
	after(() => stopApiBuilder(server));

	describe('Search with EMT', async () => {
		// See issue: #https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/114
		it('[EMT-Search-0001] Should also include other Service-IDs than the one (traffic-7dff459748-bjw8n) given', async () => { 
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/traffic-7cb4f6989f-bjw8n/ops/search`,
				headers: {
					'cookie': 'VIDUSR=Search-0022-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				debugger;
				expect(body.data).to.have.lengthOf(2); // Expected two results - One for the given Service-ID and the one already GONE
				expect(body.data[0].correlationId).to.equals('7a240f5f0e21555d2d343482');
				expect(body.data[1].correlationId).to.equals('19250f5f4321b5ba2a4de364');
			});
		});

		// See issue: #https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/114
		it('[EMT-Search-0002] Should NOT return other requests than from the given service: (traffic-7cb4f6989f-jbmf7) ', async () => { 
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/traffic-7cb4f6989f-jbmf7/ops/search`,
				headers: {
					'cookie': 'VIDUSR=Search-0022-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1); // We expect ONE result for the given Service-Id
				expect(body.data[0].correlationId).to.equals('c0df605fa2047bebbOPTIONS');
			});
		});
	});
});

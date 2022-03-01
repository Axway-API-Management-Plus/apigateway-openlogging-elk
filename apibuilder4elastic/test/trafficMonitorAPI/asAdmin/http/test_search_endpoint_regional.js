const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../../../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Endpoints', function () {
	this.timeout(30000);
	let server;
	let auth;
	const randomNo = getRandomInt(9999);
	const indexName = `apigw-traffic-summary-%REGION%-search_region_test_${randomNo}`;
	const indexNameEu = `apigw-traffic-summary-eu-search_region_test_${randomNo}`;
	const indexNameUs = `apigw-traffic-summary-us-search_region_test_${randomNo}`;

	beforeEach(() => {
		// Simulate all responses in this test-file to be an admin, which will not lead to any result restriction
		nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(403, { "error": "Invalid user - Request is expected at the regional ANM." });

		nock('https://mocked-us-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "david" });
		nock('https://mocked-us-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/adminUserDavid.json');
		nock('https://mocked-us-api-gateway:8090').get('/api/topology').reply(200, { result: {} });

		nock('https://mocked-eu-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "david" });
		nock('https://mocked-eu-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/adminUserDavid.json');
		nock('https://mocked-eu-api-gateway:8090').get('/api/topology').reply(200, { result: {} });
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
			// Regional configured ANM
			process.env.ADMIN_NODE_MANAGER = "us|https://mocked-us-api-gateway:8090,eu|https://mocked-eu-api-gateway:8090";
			server = startApiBuilder();
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const euEntryset = require('../../../documents/http/search_eu_test_documents.js');
				const usEntryset = require('../../../documents/http/search_us_test_documents.js');
				sendToElasticsearch(elasticConfig, indexNameEu, 'traffic-summary/index_template.json', euEntryset)
				.catch(err => reject(err));

				sendToElasticsearch(elasticConfig, indexNameUs, 'traffic-summary/index_template.json', usEntryset)
				.then(() => {
					resolve();
				})
				.catch(err => reject(err));
			});
		});
	});

	/**
	 * Stop API Builder after the tests.
	 */
	after(() => stopApiBuilder(server));

	describe('Search regional', () => {
		it('[Search-Regional-0001] Execute a search with region EU, must ONE entry EU', async () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-2/ops/search?region=EU`,
				headers: {
					'cookie': 'VIDUSR=Search-Count-0001-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].correlationId).to.equal('OPTIONS-CALL-EU');
			});
		});

		it('[Search-Regional-0002] Execute a search with region US, must ONE entry US', async () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-2/ops/search?count=5&region=US`,
				headers: {
					'cookie': 'VIDUSR=Search-Count-0002-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].correlationId).to.equal('OPTIONS-CALL-US');
			});
		});
	});
});

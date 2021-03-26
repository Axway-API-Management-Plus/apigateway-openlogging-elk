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
	const indexName = `apigw-traffic-summary-search_test_skipped_authz_${getRandomInt(9999)}`;

	/**
	 * Start API Builder.
	 */
	before(() => {
		return new Promise(function(resolve, reject){
			delete process.env.AUTHZ_CONFIG; // Make sure, it is not using config from a previous test
			const envFilePath = path.join(__dirname, '../../../.env');
			if (fs.existsSync(envFilePath)) {
				envLoader.config({ path: envFilePath });
			}
			process.env.AUTHZ_CONFIG = "../../../test/trafficMonitorAPI/authZConfig/authorization-config-skipped.js";
			server = startApiBuilder();
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const entryset = require('../../../documents/http/search_count_documents');
				sendToElasticsearch(elasticConfig, indexName, 'traffic-summary/index_template.json', entryset)
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
	after(() => {
		stopApiBuilder(server);
	});

	describe('Disabled User-AuthZ - Search endpoint tests', () => {
		it('[Disabled-AuthZ-Search-0001] Execute a search when user authorization is disabled', () => {
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search`,
				headers: {
					'cookie': 'VIDUSR=Restricted-Search-0001-CHRIS-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(10);
				nock.cleanAll();
			});
		});
	});
});
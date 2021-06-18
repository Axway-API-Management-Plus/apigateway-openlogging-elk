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
	const indexName = `apigw-traffic-details-getinfo_test_${getRandomInt(9999)}`;

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
			process.env.AUTHZ_CONFIG = "../../../test/trafficMonitorAPI/authZConfig/authorization-config-1.js";
			server = startApiBuilder();
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const entryset = require('../../../documents/http/getinfo_test_documents');
				var indexTemplate = JSON.parse(fs.readFileSync('./elasticsearch_config/traffic-details/index_template.json'), null);
				// Add the transactionSummary.customProperties.field1 - This reality this happens based on configured API-Manager Custom-Properties
				indexTemplate.mappings.properties["transactionSummary.customProperties.field1"] = { type: "keyword" } ;
				sendToElasticsearch(elasticConfig, indexName, indexTemplate, entryset)
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

	describe('Ext-Http AuthZ - GetInfo endpoint tests', () => {
		it.only('[Ext-Http AuthZ-Getinfo-0001] Should return a result', () => {
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorChris.json');

			nock('https://mocked-server:8443')
				.defaultReplyHeaders({'Content-Type': 'application/json; charset=utf-8'})
				.get('/api/v1/users/chris/groups?registry=AD&caching=false&filter=apg-t')
				.replyWithFile(200, './test/mockedReplies/extAuthZ/response1.json');

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/*/getinfo?format=json&details=1&rheaders=1&sheaders=1`,
				headers: {
					'cookie': 'VIDUSR=Restricted-Getinfo-0001-CHRIS-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(2);
				nock.cleanAll();
			});
		});
	});
});
	

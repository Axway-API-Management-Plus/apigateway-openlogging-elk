const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../../../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const dotenv = require('dotenv');

describe('Payload restricted using Ext HTTP-Service', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `apigw-traffic-details-payload_test_${getRandomInt(9999)}`;
	const payloadFolder = `./test/mockedReplies/payloads`;

	/**
	 * Start API Builder.
	 */
	before(() => {
		return new Promise(function(resolve, reject){
			delete process.env.AUTHZ_CONFIG; // Make sure, it is not using config from a previous test
			const envFilePath = path.join(__dirname, '../../../.env');
			// Make sure the existing environment variables are overwritten (https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set)
			const envConfig = dotenv.parse(fs.readFileSync(envFilePath));
			for (const k in envConfig) {
				process.env[k] = envConfig[k];
			}
			process.env.AUTHZ_CONFIG = "../../../test/trafficMonitorAPI/authZConfig/authorization-config-1.js";
			process.env.PAYLOAD_FOLDER = payloadFolder;
			server = startApiBuilder();
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const entryset = require('../../../documents/http/getinfo_test_documents');
				var indexTemplate = JSON.parse(fs.readFileSync('./elasticsearch_config/traffic-details/index_template.json'), null);
				// Add the transactionSummary.customProperties.field1 - This reality this happens based on configured API-Manager Custom-Properties
				indexTemplate.mappings.properties["transactionSummary.customProperties.field1"] = { type: "keyword" } ;
				indexTemplate.index_patterns = [indexName];
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
	after(() => {
		stopApiBuilder(server);
	});

	describe('Ext-HTTP-User-AuthZ - Payload endpoint tests', () => {
		it('[Ext-AuthZ-Payload-0001] Should return payload as the authz is disabled', () => {
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorChris.json');
			nock('https://mocked-api-gateway:8090').get('/api/topology').reply(200, { result: {} });

			nock('https://mocked-server:8443')
				.defaultReplyHeaders({'Content-Type': 'application/json; charset=utf-8'})
				.get('/api/v1/users/chris/groups?registry=AD&caching=false&filter=apg-t')
				.replyWithFile(200, './test/mockedReplies/extAuthZ/response1.json');

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/0455ff5e82267be8182a553d/1/received`,
				headers: {
					'cookie': 'VIDUSR=Restricted-Search-0001-CHRIS-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				nock.cleanAll();
			});
		});
	});
});
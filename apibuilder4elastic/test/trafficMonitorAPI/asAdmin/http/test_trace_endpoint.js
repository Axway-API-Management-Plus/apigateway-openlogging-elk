const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../../../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Traffic Monitor API', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `apigw-trace-traffic_test_${getRandomInt(9999)}`;

	beforeEach(() => {
		// Simulate all responses in this test-file to be an admin, which will not lead to any result restriction
		nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "david" });
		nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/adminUserDavid.json');
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
				const entryset = require('../../../documents/http/trace_test_documents');
				sendToElasticsearch(elasticConfig, indexName, 'trace-messages/index_template.json', entryset)
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

	describe('trace endpoint tests', () => {

		it('[trace-0001] Should return http 200 and an empty array (no trace info) with no format parameter provided', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/trace/81adfd5ef8008da2d6186cdb`,
				headers: {
					'cookie': 'VIDUSR=trace-0001-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(0);
			});
		});

		it('[trace-0002] Should return http 200 and an empty array (no trace info) with format parameter unsupported and supported value (json) provided', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/trace/81adfd5ef8008da2d6186cdb?format=json`,
				headers: {
					'cookie': 'VIDUSR=trace-0002-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(0);
			});
		});

		it('[trace-0003] Should return http 400 (Bad Request) and unknown format with format parameter and unsupported value (xml) provided', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/trace/81adfd5ef8008da2d6186cdb?format=xml`,
				headers: {
					'cookie': 'VIDUSR=trace-0003-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(400);
				expect(body).to.be.a('string');
				expect(body).to.equal('unknown format');
			});
		});

		it('[trace-0004] Should return the selected trace message with the correct depth and ordering based on timestamp and offset', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/trace/TRACE-TEST-DEPTH`,
				headers: {
					'cookie': 'VIDUSR=trace-0004-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(4);

				expect(body[0].level).to.equal('INFO');
				expect(body[0].text).to.equal('Value:     {customProperty3=false}');
				expect(body[0].time).to.equal(1593686275790);
				expect(body[0].depth).to.equal(5);

				expect(body[1].level).to.equal('WARN');
				expect(body[1].text).to.equal('No leading spaces for this message');
				expect(body[1].time).to.equal(1593686275790);
				expect(body[1].depth).to.equal(0);

				expect(body[2].level).to.equal('INFO');
				expect(body[2].text).to.equal('Trace Filter {');
				expect(body[2].time).to.equal(1593686275790);
				expect(body[2].type).to.equal('trace');
				expect(body[2].depth).to.equal(3);

				expect(body[3].level).to.equal('ERROR');
				expect(body[3].text).to.equal('connection timed out after 30000ms');
				expect(body[3].time).to.equal(1593686275790);
				expect(body[3].depth).to.equal(2);
			});
		});

		it('[trace-0005] Should return http 200 and an array of length 2 (trace info) with format parameter provided', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/trace/5bb7e85e940e4dcca856cd26?format=json`,
				headers: {
					'cookie': 'VIDUSR=trace-0005-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(2);
			});
		});

		it('[trace-0006] Should return entire trace message that contains some special characters', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/trace/8cfac8602703e3b0356039b9?format=json`,
				headers: {
					'cookie': 'VIDUSR=trace-0005-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(1);

				expect(body[0].level).to.equal('ERROR');
				expect(body[0].text).to.equal('OpenAPIValidator [Path \'/id\'] Instance type (string) does not match any allowed primitive type (allowed: [\"integer\"])');
				expect(body[0].type).to.equal('trace');
			});
		});
	});
});
	

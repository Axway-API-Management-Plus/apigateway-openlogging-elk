const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../../../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Payload', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `apigw-traffic-details-payload_test_${getRandomInt(9999)}`;
	const payloadFolder = `./test/mockedReplies/payloads`;

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
			process.env.PAYLOAD_FOLDER = payloadFolder;
			// Should be limited to bytes => This is a large payload, that should be limited.
			process.env.PAYLOAD_SIZE_LIMIT = 48;
			server = startApiBuilder();
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const entryset = require('../../../documents/http/getinfo_test_documents');
				sendToElasticsearch(elasticConfig, indexName, 'traffic-details/index_template.json', entryset)
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

	describe('Payload tests', () => {
		it('[Payload-0001]  Should return sent payload for leg 0', () => {
			const testPayload = fs.readFileSync(`${payloadFolder}/2020-07-03/08.55/0455ff5e82267be8182a553d-0-sent`);
			return requestAsync({
				method: 'GET',  // 
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/0455ff5e82267be8182a553d/0/sent`,
				headers: {
					'cookie': 'VIDUSR=Getinfo-0001-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(response.headers["content-type"]).to.equal("application/vordel-xact-data; charset=utf-8");
				expect(body).to.be.an('String');
				expect(body).to.include(testPayload);
				//expect(decodedDody).to.include('X-CorrelationID: Id-5d7bf75fae00e64a0245fd25');
				//expect(decodedDody).to.include('Server: Gateway');
			});
		});

		it('[Payload-0002] Should return the received payload from leg 1', () => {
			const testPayload = fs.readFileSync(`${payloadFolder}/2020-07-03/08.55/0455ff5e82267be8182a553d-1-received`);
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/0455ff5e82267be8182a553d/1/received`,
				headers: {
					'cookie': 'VIDUSR=Getinfo-0002-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(response.headers["content-type"]).to.equal("application/vordel-xact-data; charset=utf-8");
				expect(body).to.be.an('String');
				expect(body).to.be.an('String');
				expect(body).to.include(testPayload);
				//expect(decodedDody).to.include('X-CorrelationID: Id-5d7bf75fae00e64a0245fd25');
				//expect(decodedDody).to.include('Server: Gateway');
			});
		});

		it('[Payload-0003] Payload should shown and is limited to a certain size', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/LargePayloadTest/1/received`,
				headers: {
					'cookie': 'VIDUSR=Getinfo-0002-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC', 
					'Accept': '*/*' // That is the way the SHOW request is triggered
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(response.headers["content-type"]).to.equal("application/vordel-xact-data; charset=utf-8");
				expect(body).to.be.an('String');
				expect(body).to.equal("This is a large payload, that should be limited.");
				//expect(decodedDody).to.include('X-CorrelationID: Id-5d7bf75fae00e64a0245fd25');
				//expect(decodedDody).to.include('Server: Gateway');
			});
		});

		it('[Payload-0004] Payload should be SAVED and is NOT limited to a certain size (request is missing a CSRF-Token)', () => {
			const testPayload = fs.readFileSync(`${payloadFolder}/2021-01-09/10.00/LargePayloadTest-1-received`);
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/LargePayloadTest/1/received`,
				headers: {
					'cookie': 'VIDUSR=Getinfo-0002-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC', 
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' // Payload requested for SAVE
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(response.headers["content-type"]).to.equal("application/vordel-xact-data; charset=utf-8");
				expect(body).to.be.an('String');
				expect(body).to.include(testPayload);
				//expect(decodedDody).to.include('X-CorrelationID: Id-5d7bf75fae00e64a0245fd25');
				//expect(decodedDody).to.include('Server: Gateway');
			});
		});
	});
});
	

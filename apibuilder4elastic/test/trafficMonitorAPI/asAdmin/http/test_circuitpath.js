const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../../../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');
const _base = require('../../../_base');

describe('Traffic Monitor API', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `apigw-traffic-details-circuitpath_test_${getRandomInt(9999)}`;

	beforeEach(() => {
		// Simulate all responses in this test-file to be an admin, which will not lead to any result restriction
		nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "david" });
		nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/adminUserDavid.json');
		nock('https://mocked-api-gateway:8090').get('/api/topology').reply(200, { result: {} });
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
				const entryset = require('../../../documents/http/circuitpath_test_documents');
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

	describe('circuitpath endpoint tests', () => {

		it('[circuitpath-0001] Should return http 200 and (Health Check) Policy with 2 filters', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/4e645e5e4600bb590c881179/*/circuitpath`,
				headers: {
					'cookie': 'VIDUSR=circuitpath-0001-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(1);
				expect(body[0]).to.be.an('Object');
				expect(body[0]).to.have.property('policy');
				expect(body[0].policy).to.equal('Health Check');
				expect(body[0].filters).to.be.an('Array');
				expect(body[0].filters).to.have.lengthOf(2);
				expect(body[0].filters[0].status).to.equal('Pass');
			});
		});
		it('[circuitpath-0002] Should return HTTP 200 and a API Broker Policy with 2 Filters and sub-Policys and -filters', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/c8705e5ecc00adca32be7472/*/circuitpath`,
				headers: {
					'cookie': 'VIDUSR=circuitpath-0002-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(1);
				expect(body[0]).to.be.an('Object');
				expect(body[0]).to.have.property('policy');
				expect(body[0].policy).to.equal('API Broker');
				expect(body[0].filters).to.be.an('Array');
				expect(body[0].filters).to.have.lengthOf(2);
				expect(body[0].filters[0].status).to.equal('Pass');
				expect(body[0].filters[0].subPaths).to.not.exist;
				expect(body[0].filters[1].subPaths).to.be.an('Array');
				expect(body[0].filters[1].subPaths).to.have.lengthOf(1);
				expect(body[0].filters[1].subPaths[0].policy).to.equal('Default API Proxy Routing');
				expect(body[0].filters[1].subPaths[0].filters).to.have.lengthOf(1);

			});
		});
		it('[circuitpath-0003] Should return http 200 and an empty array because no policies have been executed', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/edb1705e7d0168a34d74bfba/*/circuitpath`,
				headers: {
					'cookie': 'VIDUSR=circuitpath-0003-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(0);
			});
		});
		it('[circuitpath-0004] Should return http 200 and empty array even the correlationID does not exist in database', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/111111111111111111111111/*/circuitpath`,
				headers: {
					'cookie': 'VIDUSR=circuitpath-0004-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(0);
			});
		});
		it('[circuitpath-0005] Should return http 200 and have a API Manager Protection Policy with 7 filters with 2 fails and subpath with several filters', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/1ab3705e920284217e6aae73/*/circuitpath`,
				headers: {
					'cookie': 'VIDUSR=circuitpath-0005-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(1);
				expect(body).to.have.lengthOf(1);
				expect(body[0].filters).to.be.an('Array');
				expect(body[0].policy).to.equal('API Manager Protection Policy');
				expect(body[0].filters).to.have.lengthOf(7);
				expect(body[0].filters[0].status).to.equal('Pass');
				expect(body[0].filters[1].status).to.equal('Pass');
				expect(body[0].filters[2].status).to.equal('Fail');
				expect(body[0].filters[3].status).to.equal('Pass');
				expect(body[0].filters[4].status).to.equal('Fail');
				expect(body[0].filters[5].status).to.equal('Pass');
				expect(body[0].filters[6].status).to.equal('Pass');
				expect(body[0].filters[1].subPaths).to.be.an('Array');
				expect(body[0].filters[1].subPaths).to.have.lengthOf(1);
				expect(body[0].filters[1].subPaths[0].policy).to.equal('Secure Headers');
				expect(body[0].filters[1].subPaths[0].filters).to.have.lengthOf(7);
				expect(body[0].filters[1].subPaths[0].filters[0].status).to.equal('Pass');
				expect(body[0].filters[1].subPaths[0].filters[1].status).to.equal('Pass');
				expect(body[0].filters[1].subPaths[0].filters[2].status).to.equal('Pass');
				expect(body[0].filters[1].subPaths[0].filters[3].status).to.equal('Pass');
				expect(body[0].filters[1].subPaths[0].filters[4].status).to.equal('Pass');
				expect(body[0].filters[1].subPaths[0].filters[5].status).to.equal('Pass');
				expect(body[0].filters[1].subPaths[0].filters[6].status).to.equal('Pass');
			});
		});

	});
});
	

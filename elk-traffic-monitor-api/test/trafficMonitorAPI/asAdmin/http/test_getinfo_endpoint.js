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
			auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const entryset = require('../../../documents/http/getinfo_test_documents');
				sendToElasticsearch(elasticConfig, indexName, 'traffic_details_index_template.json', entryset)
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

	describe('Search', () => {
		it('[Getinfo-0001]  Should return http 200 with details and headers for all legs (*) ', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/*/getinfo?format=json&details=1&rheaders=1&sheaders=1`,
				headers: {
					'cookie': 'VIDUSR=Getinfo-0001-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(2);
				expect(body[0]).to.be.an('Object');
				expect(body[0]).to.have.property('details');
				expect(body[0].details.leg).to.equal(1);
				expect(body[0]).to.have.property('rheaders');
				expect(body[0]).to.have.property('sheaders');
				expect(body[1]).to.have.property('details');
				expect(body[1].details.leg).to.equal(0);
				expect(body[1]).to.have.property('rheaders');
				expect(body[1]).to.have.property('sheaders');
			});
		});

		it('[Getinfo-0002] Should return http 200 with details and all headers for leg 0', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/0/getinfo?format=json&details=1&rheaders=1&sheaders=1`,
				headers: {
					'cookie': 'VIDUSR=Getinfo-0002-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).not.to.be.an('Array');
				expect(body).to.be.an('Object');
				expect(body).to.have.property('details');
				expect(body.details.leg).to.equal(0);
				expect(body).to.have.property('rheaders');
				expect(body).to.have.property('sheaders');
			});
		});
		it('[Getinfo-0003] Should return http 200 with details and all headers for leg 1', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/1/getinfo?format=json&details=1&rheaders=1&sheaders=1`,
				headers: {
					'cookie': 'VIDUSR=Getinfo-0003-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).not.to.be.an('Array');
				expect(body).to.be.an('Object');
				expect(body).to.have.property('details');
				expect(body.details.leg).to.equal(1);
				expect(body).to.have.property('rheaders');
				expect(body).to.have.property('sheaders');
			});
		});
		it('[Getinfo-0004] Should return http 200 without details but all headers for all legs (*)', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/*/getinfo?format=json&details=0&rheaders=1&sheaders=1`,
				headers: {
					'cookie': 'VIDUSR=Getinfo-0004-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(2);
				expect(body[0]).to.be.an('Object');
				expect(body[0]).to.have.property('details');
				expect(body[0].details).to.equal(null);
				expect(body[0]).to.have.property('rheaders');
				expect(body[0]).to.have.property('sheaders');
				expect(body[1]).to.be.an('Object');
				expect(body[1]).to.have.property('details');
				expect(body[1].details).to.equal(null);
				expect(body[1]).to.have.property('rheaders');
				expect(body[1]).to.have.property('sheaders');
			});
		});
		it('[Getinfo-0005] Should return http 200 with details but no headers for all legs (*)', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/*/getinfo?format=json&details=1&rheaders=0&sheaders=0`,
				headers: {
					'cookie': 'VIDUSR=Getinfo-0005-DAVID-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(2);
				expect(body[0]).to.be.an('Object');
				expect(body[0]).to.have.property('details');
				expect(body[0]).to.have.property('rheaders');
				expect(body[0].rheaders).to.equal(null);
				expect(body[0]).to.have.property('sheaders');
				expect(body[0].sheaders).to.equal(null);
				expect(body[1]).to.be.an('Object');
				expect(body[1]).to.have.property('details');
				expect(body[1]).to.have.property('rheaders');
				expect(body[1].rheaders).to.equal(null);
				expect(body[1]).to.have.property('sheaders');
				expect(body[1].sheaders).to.equal(null);
			});
		});


	});
});
	

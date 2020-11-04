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
		// 
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
				const entryset = require('../../../documents/http/circuitpath_test_documents');
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

	describe('circuitpath endpoint tests', () => {

		it('[anm-basic-0001] Should work without using the VIDUSR cookie, but instead an HTTP-Basic AuthZ header', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/4e645e5e4600bb590c881179/*/circuitpath`,
				headers: {
					'Authorization': 'Basic YWRtaW46Y2hhbmdlbWU='
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(1);
				expect(body[0]).to.be.an('Object');
				expect(body[0]).to.have.property('policy');
			});
		});

		it('[anm-basic-0002] Should also work, when some cookies are provided', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/4e645e5e4600bb590c881179/*/circuitpath`,
				headers: {
					'Authorization': 'Basic YWRtaW46Y2hhbmdlbWU=', 
					'Cookie': 'AnyCooke=11231231231'
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(1);
				expect(body[0]).to.be.an('Object');
				expect(body[0]).to.have.property('policy');
			});
		});
	});
});
	

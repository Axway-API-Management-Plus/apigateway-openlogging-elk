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
	const indexName = `apigw-traffic-summary-filetransfer_search_test_${getRandomInt(9999)}`;

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
				const entryset = require('../../../documents/filetransfer/filetransfer_search_document');
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
	after(() => stopApiBuilder(server));

	describe('Search', () => {
		it('[Filetransfer-Search-0001] Execute a search without any filter with protocol filetransfer', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?protocol=filetransfer`,
				headers: {
					'cookie': 'VIDUSR=Search-0001-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(2);
				checkFiletransferFields(body.data);
			});
		});

		it('[Filetransfer-Search-0002] Execute a search for a specific duration - Should only 1 entry', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=duration&op=lt&value=110&protocol=filetransfer`,
				headers: {
					'cookie': 'VIDUSR=Search-0001-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
			});
		});

		it('[Filetransfer-Search-0003] Execute a search for a specific service type', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=servicetype&value=ftps&protocol=filetransfer`,
				headers: {
					'cookie': 'VIDUSR=Search-0001-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
			});
		});
	});
});

function checkFiletransferFields(data) {
	data.map((entry) => {
		expect(entry).to.have.property('remoteAddr');
		expect(entry).to.have.property('uploadFile');
		expect(entry).to.have.property('direction');
		expect(entry).to.have.property('servicetype');
		expect(entry).to.have.property('size');
		expect(entry).to.have.property('duration');
		expect(entry).to.have.property('timestamp');
		expect(entry).to.have.property('correlationId');
		expect(entry).to.have.property('subject');
		expect(entry).to.have.property('finalStatus');
		expect(entry).to.have.property('type');
	});
}

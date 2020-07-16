const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('./_base');
const fs = require('fs');
const getDate = require('./util');

describe('Endpoints', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `search_count_test_${getRandomInt(9999)}`;

	/**
	 * Start API Builder.
	 */
	before(() => {
		return new Promise(function(resolve, reject){
			server = startApiBuilder();
			auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const entryset = require('./documents/basic/search_count_documents');
				sendToElasticsearch(elasticConfig, indexName, entryset)
				.then(() => {
					resolve();
				});
			});
		});
	});

	/**
	 * Stop API Builder after the tests.
	 */
	after(() => stopApiBuilder(server));

	describe('Search', () => {
		it('[Search-Count-0001] Execute a search without any restriction - ES will default to 10 results', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(10);
			});
		});

		it('[Endpoint-Count-0002] with a given count parameter we can control the result size - validate this', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?count=5`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(5);
			});
		});

		it('[Endpoint-Count-0003] A count going above the ES default', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?count=50`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				// We have 13 documents in our test-file
				expect(body.data).to.have.lengthOf(13);
			});
		});

	});
});

const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('./_base');
const fs = require('fs');

describe('Traffic Monitor API', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `test_index_${getRandomInt(9999)}`;

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
				const entryset = require('./documents/basic/search_test_documents');
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

	describe('circuitpath endpoint tests', () => {

		it('[circuitpath-0001] Execute a GET on circuitpath resource to retrieve the filterpath 1 policy with 2 Filter (Healthcheck API) for a given transactionID from instance-1', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/c8705e5ecc00adca32be7472/*/circuitpath`,
				auth: auth,
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

		it('[circuitpath-0002] Execute a GET on circuitpath resource to retrieve the filterpath with 5 policies (Todo API) for a given transactionID from instance-1', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/5a22b35e4254b9c6d22d7dc4/*/circuitpath`,
				auth: auth,
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
			});
		});

	});
});
	

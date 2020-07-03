const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('./_base');
const fs = require('fs');

describe('Endpoints', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `getinfo_test_${getRandomInt(9999)}`;

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

	describe('Search', () => {

		it('[Search-0001] Execute a getInfo for a specific correlationId from instance-1', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/any/bb30715e5300e189d1da43fc/*/getinfo`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				/*
				expect(body).to.have.lengthOf(1);
				expect(body[0]).to.be.an('Object');
				expect(body[0]).to.have.property('policy');
				expect(body[0].policy).to.equal('Health Check');
				expect(body[0].filters).to.be.an('Array');
				expect(body[0].filters).to.have.lengthOf(2);
				expect(body[0].filters[0].status).to.equal('Pass');
				*/
			});
		});
	});
});
	

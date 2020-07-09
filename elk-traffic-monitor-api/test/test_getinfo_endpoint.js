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
				const entryset = require('./documents/basic/getinfo_test_documents');
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

		it('[Getinfo-0001]  Should return http 200 with details and headers for all legs (*) ', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/*/getinfo?format=json&details=1&rheaders=1&sheaders=1`,
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

		it('[Getinfo-0002 Should return http 200 with details and all headers for leg 0', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/0/getinfo?format=json&details=1&rheaders=1&sheaders=1`,
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
		it('[Getinfo-0003 Should return http 200 with details and all headers for leg 1', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/1/getinfo?format=json&details=1&rheaders=1&sheaders=1`,
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
		it('[Getinfo-0004 Should return http 200 without details but all headers for all legs (*)', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/*/getinfo?format=json&details=0&rheaders=1&sheaders=1`,
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
		it('[Getinfo-0005 Should return http 200 with details but no headers for all legs (*)', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/*/getinfo?format=json&details=1&rheaders=0&sheaders=0`,
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
	

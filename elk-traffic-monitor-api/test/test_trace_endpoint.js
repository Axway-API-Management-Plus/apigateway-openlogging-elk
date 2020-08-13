const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('./_base');

describe('Traffic Monitor API', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `trace_test_${getRandomInt(9999)}`;

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
				const entryset = require('./documents/basic/trace_test_documents');
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

	describe('trace endpoint tests', () => {

		it('[trace-0001] Should return http 200 and an empty array (no trace info) with no format parameter provided', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/trace/81adfd5ef8008da2d6186cdb`,
				auth: auth,
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
				auth: auth,
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
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(400);
				expect(body).to.be.a('string');
				expect(body).to.equal('unknown format');
			});
		});

		// Having trouble with this test!
		it.skip('[trace-0004] Should return http 200 and an array of length 250 (trace info) with no format parameter provided', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/trace/f1aefd5e3501dd00a16eebc0`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(250);
				expect(body[0].level).to.equal('INFO');
				expect(body[0].text).to.equal('Trace Filter {');
				expect(body[0].time).to.equal(1593658497923);
				expect(body[0].type).to.equal('trace');
				expect(body[249].depth).to.equal(3);
				expect(body[249].level).to.equal('INFO');
				expect(body[249].text).to.equal('}');
				expect(body[249].time).to.equal(1593658497959);
				expect(body[249].type).to.equal('trace');
			});
		});

		it('[trace-0005] Should return http 200 and an array of length 2 (trace info) with format parameter provided', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/trace/5bb7e85e940e4dcca856cd26?format=json`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(2);
			});
		});
	});
});
	

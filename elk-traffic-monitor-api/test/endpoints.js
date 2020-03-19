const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('./_base');
const fs = require('fs');

describe('Endpoints', function () {
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

	describe('Search', () => {
		debugger;
		it('[Search-0001] Execute a search without a limit including all requests from instance-1', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(4);
				checkFields(body.data, false);
			});
		});

		it('[Endpoint-0002] should return with one result for instance-2', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-2/ops/search`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				checkFields(body.data, false);
			});
		});

		it('[Endpoint-0003] should restrict based on the URI and HTTP Verb', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=uri&value=%2Fv2%2Fpet%2FfindByStatus&field=method&value=GET`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].uri).to.equals('/v2/pet/123');
				expect(body.data[0].method).to.equals('GET');
				checkFields(body.data, true);
			});
		});
		it('[Endpoint-0004] should return 1 entry based on duration filter', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=duration&op=gt&value=100`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				checkFields(body.data, true);
			});
		});
		it('[Endpoint-0005] should return 1 entry based on operation filter', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=operation&value=findPetsByStatus`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].operation).to.equals('findPetsByStatus');
				checkFields(body.data, true);
			});
		});
		it('[Endpoint-0006] should return 0 entries as all test data is in the past', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?ago=5m`, // The first entry is generated with 8 minutes in the past
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(0);
			});
		});
		it('[Endpoint-0007] should return 2 when using a custom time-range', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=timestamp&op=gt&value=1577833200000&field=timestamp&op=lt&value=1585691940000`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(4);
			});
		});
		it('[Endpoint-0008] should return two entries with localport 8080', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=localPort&value=8080`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(2);
				expect(body.data[0].localPort).to.equals('8080');
			});
		});

		it('[Endpoint-0009] should return one entry with localport 8080 and given subject-id', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=localPort&value=8080&field=subject&value=Chris-Test`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].localPort).to.equals('8080');
				expect(body.data[0].subject).to.equals('Chris-Test');
			});
		});
		it('[Endpoint-0010] should return one entry with localport 8080 and given subject-id', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=status&value=404`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].status).to.equals(404);
				expect(body.data[0].uri).to.equals('/favicon.ico');
			});
		});
		it('[Endpoint-0011] should return one entry with localadr 1.1.1.1', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=localAddr&value=1.1.1.1`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].subject).to.equals('Chris-Test');
				expect(body.data[0].uri).to.equals('/healthcheck');
			});
		});
		it('[Endpoint-0012] should return one entry with remoteName (remoteHost) TestHost', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=remoteName&value=TestHost`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].subject).to.equals('Chris-Test');
				expect(body.data[0].uri).to.equals('/healthcheck');
			});
		});
		it('[Endpoint-0013] should return one entry with remotePort 59641', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=remotePort&value=59641`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].status).to.equals(404);
				expect(body.data[0].uri).to.equals('/favicon.ico');
			});
		});
		it('[Endpoint-0014] should return one entry with service name Petstore HTTP', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=serviceName&value=Petstore%20HTTP`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].status).to.equals(200);
				expect(body.data[0].uri).to.equals('/v2/pet/123');
			});
		});
		it('[Endpoint-0015] should return one entry with service name Petstore HTTP', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=wafStatus&value=1`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].status).to.equals(404);
				expect(body.data[0].uri).to.equals('/favicon.ico');
			});
		});
		it('[Endpoint-0016] should return one entry with the given correlation id', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=correlationId&value=c8705e5ecc00adca32be7472`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].status).to.equals(200);
				expect(body.data[0].serviceName).to.equals('Petstore HTTP');
			});
		});
		it('[Endpoint-0017] should return one entry with final status Error', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=finalStatus&value=Error`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].uri).to.equals('/healthcheck');
			});
		});
		it('[Endpoint-0018] should return results with a wirldcard path.', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=uri&value=%2Fv2%2Fpet`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].uri).to.equals('/v2/pet/123');
			});
		});
		it('[Endpoint-0019] Should return 1 entry in the last 10 minutes (ago=10m)', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?ago=10m`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].uri).to.equals('/v2/pet/123');
			});
		});
		it('[Endpoint-0020] Should return 2 entries in the last 30 minutes (ago=30m)', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?ago=30m`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(2);
				expect(body.data[0].uri).to.equals('/v2/pet/123');
			});
		});
		it('[Endpoint-0020] Should only 2 entries in the last 2 hours (ago=120h)', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?ago=2h`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(3);
				expect(body.data[0].uri).to.equals('/v2/pet/123');
			});
		});
	});
});

function checkFields(data, hasServiceContext) {
	data.map((entry) => {
		expect(entry).to.have.property('timestamp');
		expect(entry).to.have.property('statustext');
		expect(entry).to.have.property('method');
		expect(entry).to.have.property('status');
		expect(entry).to.have.property('wafStatus');
		expect(entry).to.have.property('localPort');
		expect(entry).to.have.property('uri');
		expect(entry).to.have.property('duration');
		expect(entry).to.have.property('type');
		expect(entry).to.have.property('finalStatus');
		if(hasServiceContext) {
			expect(entry).to.have.property('subject');
			expect(entry).to.have.property('correlationId');
			expect(entry).to.have.property('serviceName');
			expect(entry).to.have.property('operation');
		}
	});
}

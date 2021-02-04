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
	const indexName = `apigw-traffic-summary-search_test_${getRandomInt(9999)}`;

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
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const entryset = require('../../../documents/http/search_test_documents');
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
		it('[Search-0001] Execute a search without a limit including all requests from instance-1', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search`,
				headers: {
					'cookie': 'VIDUSR=Search-0001-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(5);
				// Validate the default ordering is working
				expect(body.data[0].timestamp).gt(body.data[1].timestamp);
				expect(body.data[1].timestamp).gt(body.data[2].timestamp);
				expect(body.data[2].timestamp).gt(body.data[3].timestamp);
				checkFields(body.data, false);
			});
		});

		it('[Endpoint-0002] should return with one result for instance-2', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-2/ops/search`,
				headers: {
					'cookie': 'VIDUSR=Search-0002-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
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
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=uri&value=%2Fv2%2Fpet%2FfindByStatus&field=method&value=GET`,
				headers: {
					'cookie': 'VIDUSR=Search-0003-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].uri).to.equals('/petstore/v2/pet/findByStatus');
				expect(body.data[0].method).to.equals('GET');
				checkFields(body.data, true);
			});
		});
		it('[Endpoint-0004] should return 1 entry based on duration filter', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=duration&op=gt&value=100`,
				headers: {
					'cookie': 'VIDUSR=Search-0004-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(2);
				checkFields(body.data, true);
			});
		});
		it('[Endpoint-0005] should return 1 entry based on operation filter', () => {
			const auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=operation&value=findPetsByStatus`,
				headers: {
					'cookie': 'VIDUSR=Search-0005-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
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
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?ago=5m`, // The first entry is generated with 8 minutes in the past
				headers: {
					'cookie': 'VIDUSR=Search-0006-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(0);
			});
		});
		it('[Endpoint-0007] should return 2 when using a custom time-range', () => {
			// 
			/**
			 * The dates given here must be aligned with dates in search_test_documents.js. Currently configured like so:
			 * 8m		--> "682c0f5fbe23dc8e1d80efe2"
			 * 15m		--> "7a240f5f0e21555d2d343482"   --> This is expected to be found
			 * 120h		--> "4e270f5f05224d71a5f24b78"
			 * 65m		--> "19250f5f4321b5ba2a4de364"   --> This is expected to be found
			 * 30000h	--> "b8250f5f7a2195dc1581d52c"
			 */
			const greaterThenThisDate = getDate('10h', true);
			const lowerThanThisDate = getDate('10m', true);
			console.log(`Query with greaterThenThisDate: ${greaterThenThisDate} and lowerThanThisDate: ${lowerThanThisDate}`);
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=timestamp&op=gt&value=${greaterThenThisDate}&field=timestamp&op=lt&value=${lowerThanThisDate}`,
				headers: {
					'cookie': 'VIDUSR=Search-0007-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(2);
				expect(body.data[0].correlationId).to.equal("7a240f5f0e21555d2d343482");
				expect(body.data[1].correlationId).to.equal("19250f5f4321b5ba2a4de364");
			});
		});
		it('[Endpoint-0008] should return 3 when using a wider custom time-range', () => {
			// 
			/**
			 * The dates given here must be aligned with dates in search_test_documents.js. Currently configured like so:
			 * 
			 * 8m		--> "682c0f5fbe23dc8e1d80efe2"   --> This is expected to be found
			 * 15m		--> "7a240f5f0e21555d2d343482"   --> This is expected to be found
			 * 120h		--> "4e270f5f05224d71a5f24b78"
			 * 65m		--> "19250f5f4321b5ba2a4de364"   --> This is expected to be found
			 * 30000h	--> "b8250f5f7a2195dc1581d52c"
			 */
			const greaterThenThisDate = getDate('110h', true);
			const lowerThanThisDate = getDate('5m', true);
			console.log(`Query with greaterThenThisDate: ${greaterThenThisDate} and lowerThanThisDate: ${lowerThanThisDate}`);
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=timestamp&op=gt&value=${greaterThenThisDate}&field=timestamp&op=lt&value=${lowerThanThisDate}`,
				headers: {
					'cookie': 'VIDUSR=Search-0008-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(4);
				expect(body.data[0].correlationId).to.equal("11111111111111111111111111");
				expect(body.data[1].correlationId).to.equal("682c0f5fbe23dc8e1d80efe2");
				expect(body.data[2].correlationId).to.equal("7a240f5f0e21555d2d343482");
				expect(body.data[3].correlationId).to.equal("19250f5f4321b5ba2a4de364");
			});
		});
		it('[Endpoint-0009] should return two entries with localport 8080', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=localPort&value=8080`,
				headers: {
					'cookie': 'VIDUSR=Search-0009-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(2);
				expect(body.data[0].localPort).to.equals(8080);
			});
		});

		it('[Endpoint-0010A] should return one entry with localport 8080 and given subject-id', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=localPort&value=8080&field=subject&value=Chris-Test`,
				headers: {
					'cookie': 'VIDUSR=Search-0010-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].localPort).to.equals(8080);
				expect(body.data[0].subject).to.equals('Chris-Test');
			});
		});
		it('[Endpoint-0010B] should return one entry with localport 8080 and a part of the original subject ID', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=localPort&value=8080&field=subject&value=Chris`,
				headers: {
					'cookie': 'VIDUSR=Search-0010-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].localPort).to.equals(8080);
				expect(body.data[0].subject).to.equals('Chris-Test');
			});
		});
		it('[Endpoint-0011] should return one entry with localport 8080 and given subject-id', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=status&value=404`,
				headers: {
					'cookie': 'VIDUSR=Search-0011-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
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
		it('[Endpoint-0012] should return one entry with localadr 1.1.1.1', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=localAddr&value=1.1.1.1`,
				headers: {
					'cookie': 'VIDUSR=Search-0012-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
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
		it('[Endpoint-0013] should return one entry with remoteName (remoteHost) TestHost', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=remoteName&value=TestHost`,
				headers: {
					'cookie': 'VIDUSR=Search-0013-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
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
		it('[Endpoint-0014] should return one entry with remotePort 59641', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=remotePort&value=59641`,
				headers: {
					'cookie': 'VIDUSR=Search-0014-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
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
		it('[Endpoint-0015] should return one entry with service name Petstore HTTP', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=serviceName&value=Petstore%20HTTP`,
				headers: {
					'cookie': 'VIDUSR=Search-0015-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(2);
				expect(body.data[0].status).to.equals(200);
				expect(body.data[0].uri).to.equals('/petstore/v2/pet/findByTag');
				expect(body.data[1].uri).to.equals('/petstore/v2/pet/findByStatus');
			});
		});
		it('[Endpoint-0016] should return one entry WAF-Status 1', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=wafStatus&value=1`,
				headers: {
					'cookie': 'VIDUSR=Search-0016-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
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
		it('[Endpoint-0017] should return one entry with the given correlation id', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=correlationId&value=682c0f5fbe23dc8e1d80efe2`,
				headers: {
					'cookie': 'VIDUSR=Search-0017-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].status).to.equals(200);
				expect(body.data[0].serviceName).to.equals('Petstore');
			});
		});
		it('[Endpoint-0018] should return one entry with final status Error', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=finalStatus&value=Error`,
				headers: {
					'cookie': 'VIDUSR=Search-0018-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				expect(body.data[0].uri).to.equals('/healthcheck');
			});
		});
		it('[Endpoint-0019] should return results with a wildcard path.', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=uri&value=%2Fv2%2Fpet`,
				headers: {
					'cookie': 'VIDUSR=Search-0019-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(2);
				expect(body.data[0].uri).to.equals('/petstore/v2/pet/findByTag');
				expect(body.data[1].uri).to.equals('/petstore/v2/pet/findByStatus');
			});
		});
		it('[Endpoint-0020] Should return 1 entry in the last 10 minutes (ago=10m)', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?ago=10m`,
				headers: {
					'cookie': 'VIDUSR=Search-0020-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(2);
				expect(body.data[0].uri).to.equals('/petstore/v2/pet/findByTag');
			});
		});
		it('[Endpoint-0021] Should return 2 entries in the last 30 minutes (ago=30m)', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?ago=30m`,
				headers: {
					'cookie': 'VIDUSR=Search-0021-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(3);
				expect(body.data[0].uri).to.equals('/petstore/v2/pet/findByTag');
			});
		});
		it('[Endpoint-0022] Should return 4 entries in the last 2 hours (ago=120h)', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?ago=2h`,
				headers: {
					'cookie': 'VIDUSR=Search-0022-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(4);
				expect(body.data[0].uri).to.equals('/petstore/v2/pet/findByTag');
			});
		});
		it('[Endpoint-0023] Should include the V-Host value', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=correlationId&value=7a240f5f0e21555d2d343482`,
				headers: {
					'cookie': 'VIDUSR=Search-0022-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body.data[0].vhost).to.equal('api.customer.com:443', 'V-Host is not part of the result');
			});
		});
		it('[Endpoint-0024] Should not return anything when using the wrong request protocol.', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?protocol=filetransfer`,
				headers: {
					'cookie': 'VIDUSR=Search-0022-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(0);
			});
		});
		it('[Endpoint-0025] Should return the OPTIONS request including the URI', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-2/ops/search?protocol=http&field=method&value=OPTIONS`,
				headers: {
					'cookie': 'VIDUSR=Search-0022-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
				checkFields(body.data, false);
			});
		});

		// See issue #52
		it('[Endpoint-0026] With query on v2/pet/findByTag should return only ONE API.', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=uri&value=%2Fpetstore%2Fv2%2Fpet%2FfindByTag&field=method&value=GET`,
				headers: {
					'cookie': 'VIDUSR=Search-0022-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1); // We expect ONE API as a result
				expect(body.data[0].uri).to.equals('/petstore/v2/pet/findByTag');
				expect(body.data[0].correlationId).to.equals('11111111111111111111111111');
			});
		});

		it('[Endpoint-0027] Should ignore the region if null', () => {
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=uri&value=%2Fpetstore%2Fv2%2Fpet%2FfindByTag&field=method&value=GET`,
				headers: {
					'cookie': 'VIDUSR=Search-0022-DAVID-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1); // We expect ONE API as a result
				expect(body.data[0].uri).to.equals('/petstore/v2/pet/findByTag');
				expect(body.data[0].correlationId).to.equals('11111111111111111111111111');
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
		if(entry.method!='OPTIONS') {
			expect(entry).to.have.property('finalStatus');
		}
		if(hasServiceContext) {
			expect(entry).to.have.property('subject');
			expect(entry).to.have.property('correlationId');
			expect(entry).to.have.property('serviceName');
			expect(entry).to.have.property('operation');
		}
	});
}

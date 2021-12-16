const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../../../_base');
const getDate = require('../../../util');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const dotenv = require('dotenv');

describe('Endpoints', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `apigw-traffic-summary-jms_search_test_${getRandomInt(9999)}`;

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
			// Make sure the existing environment variables are overwritten (https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set)
			const envConfig = dotenv.parse(fs.readFileSync(envFilePath));
			for (const k in envConfig) {
				process.env[k] = envConfig[k];
			}
			server = startApiBuilder();
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const entryset = require('../../../documents/jms/jms_search_document.js');
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
		it('[JMS-Search-0001] Execute a search for JMS Traffic', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?protocol=jms`,
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
				checkFields(body.data);
				expect(body.data[0].correlationId).to.equals('222222222222222222222222');
				expect(body.data[0].jmsMessageID).to.equals('ID:interface1-36199-1111111111111-189:755:1:1:1');
				expect(body.data[0].jmsCorrelationID).to.equals('A-JMS-Correlation-ID');
				expect(body.data[0].jmsDestination).to.equals('queue://com.customer.APPLIC.msg.WWSWO.PROD.P44.XXX_ShipmentService');
				expect(body.data[0].jmsProviderURL).to.equals('remote');
				expect(body.data[0].jmsDeliveryMode).to.equals(185);
				expect(body.data[0].jmsPriority).to.equals(4);
				expect(body.data[0].jmsReplyTo).to.equals('A-Sample-Reply-To');
				expect(body.data[0].jmsRedelivered).to.equals(800);
				expect(body.data[0].jmsTimestamp).to.equals(1625040681291);
				expect(body.data[0].jmsExpiration).to.equals(0);
				expect(body.data[0].jmsType).to.equals('TextMessageToTestWith');
				expect(body.data[0].jmsStatus).to.equals('SuccessToTest');
				expect(body.data[0].jmsStatusText).to.equals('A great status text');
				expect(body.data[0].subject).to.equals('A test subject id');
			});
		});

		it('[JMS-Search-0002] Execute a search for JMS Traffic including all filter which should match to one result', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?field=leg&value=0&field=jmsType&value=TextMessageToTestWith&field=jmsDeliveryMode&value=185&field=jmsRedelivered&value=800&field=jmsStatus&value=SuccessToTest&field=jmsDestination&value=queue%3A%2F%2Fcom.customer.APPLIC.msg.WWSWO.PROD.P44.XXX_ShipmentService&field=jmsMessageID&value=ID%3Ainterface1-36199-1111111111111-189%3A755%3A1%3A1%3A1&field=jmsReplyTojmsReplyTo&value=A-Sample-Reply-To&field=jmsPriority&value=4&count=1000&protocol=jms`,
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
				expect(body.data[0].correlationId).to.equals('222222222222222222222222');
				expect(body.data[0].jmsMessageID).to.equals('ID:interface1-36199-1111111111111-189:755:1:1:1');
				expect(body.data[0].jmsCorrelationID).to.equals('A-JMS-Correlation-ID');
				expect(body.data[0].jmsDestination).to.equals('queue://com.customer.APPLIC.msg.WWSWO.PROD.P44.XXX_ShipmentService');
				expect(body.data[0].jmsProviderURL).to.equals('remote');
				expect(body.data[0].jmsDeliveryMode).to.equals(185);
				expect(body.data[0].jmsPriority).to.equals(4);
				expect(body.data[0].jmsReplyTo).to.equals('A-Sample-Reply-To');
				expect(body.data[0].jmsRedelivered).to.equals(800);
				expect(body.data[0].jmsTimestamp).to.equals(1625040681291);
				expect(body.data[0].jmsExpiration).to.equals(0);
				expect(body.data[0].jmsType).to.equals('TextMessageToTestWith');
				expect(body.data[0].jmsStatus).to.equals('SuccessToTest');
				expect(body.data[0].jmsStatusText).to.equals('A great status text');
				expect(body.data[0].subject).to.equals('A test subject id');
			});
		});

		it('[JMS-Search-0003] Execute a search for JMS Traffic using the JMS-Property filter', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search?jmsPropertyName=process_id&jmsPropertyValue=CHRISTXM2JS&protocol=jms`,
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
				expect(body.data[0].correlationId).to.equals('222222222222222222222222');
			});
		});
	});
});

function checkFields(data) {
	data.map((entry) => {
		expect(entry).to.have.property('jmsMessageID');
		expect(entry).to.have.property('jmsCorrelationID');
		expect(entry).to.have.property('jmsDestination');
		expect(entry).to.have.property('jmsProviderURL');
		expect(entry).to.have.property('jmsDeliveryMode');
		expect(entry).to.have.property('jmsPriority');
		expect(entry).to.have.property('jmsReplyTo');
		expect(entry).to.have.property('jmsRedelivered');
		expect(entry).to.have.property('jmsTimestamp');
		expect(entry).to.have.property('jmsExpiration');
		expect(entry).to.have.property('jmsType');
		expect(entry).to.have.property('jmsStatus');
		expect(entry).to.have.property('jmsStatusText');
		expect(entry).to.have.property('leg');
		expect(entry).to.have.property('timestamp');
		expect(entry).to.have.property('duration');
		expect(entry).to.have.property('correlationId');
		expect(entry).to.have.property('serviceName');
		expect(entry).to.have.property('subject');
		expect(entry).to.have.property('operation');
		expect(entry).to.have.property('type');
		expect(entry.type).to.equals('jms');
		expect(entry).to.have.property('finalStatus');
	});
}

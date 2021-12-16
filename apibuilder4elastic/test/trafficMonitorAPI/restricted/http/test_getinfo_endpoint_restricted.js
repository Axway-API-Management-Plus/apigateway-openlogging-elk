const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../../../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const dotenv = require('dotenv');

describe('Endpoints', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `apigw-traffic-details-getinfo_test_${getRandomInt(9999)}`;

	beforeEach(() => {
		// Just return an empty topology as it's not required for the tests in this file
		nock('https://mocked-api-gateway:8090').get('/api/topology').reply(200, { result: {} });
	});

	/**
	 * Start API Builder.
	 */
	before(() => {
		return new Promise(function(resolve, reject){
			delete process.env.AUTHZ_CONFIG; // Make sure, it is not using config from a previous test
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
				const entryset = require('../../../documents/http/getinfo_test_documents');
				sendToElasticsearch(elasticConfig, indexName, 'traffic-details/index_template.json', entryset)
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

		it('[Restricted-Getinfo-0001] Should return a result, as the transaction belongs to the users org', () => {
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorChris.json');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=chris&field=enabled&op=eq&value=enabled`).replyWithFile(200, './test/mockedReplies/apimanager/apiManagerUserChris.json');		
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS`).replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/*/getinfo?format=json&details=1&rheaders=1&sheaders=1`,
				headers: {
					'cookie': 'VIDUSR=Restricted-Getinfo-0001-CHRIS-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Array');
				expect(body).to.have.lengthOf(2);
				nock.cleanAll();
			});
		});

		it('[Restricted-Getinfo-0002 Should NOT return anything, as the transaction is for a different org', () => {
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "rene" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorRene.json');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=rene&field=enabled&op=eq&value=enabled`).replyWithFile(200, './test/mockedReplies/apimanager/apiManagerUserRene.json');		
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-MAX`).replyWithFile(200, './test/mockedReplies/apimanager/organizationMax.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/http/0455ff5e82267be8182a553d/0/getinfo?format=json&details=1&rheaders=1&sheaders=1`,
				headers: {
					'cookie': 'VIDUSR=Getinfo-0002-CHRIS-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(500);
			});
		});
	});
});
	

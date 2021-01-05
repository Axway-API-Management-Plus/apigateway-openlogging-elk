const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../../../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Endpoints', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `apigw-traffic-summary-ext-http-custom-${getRandomInt(9999)}`;

	/**
	 * Start API Builder.
	 */
	before(() => {
		return new Promise(function(resolve, reject){
			const envFilePath = path.join(__dirname, '../../../.env');
			if (fs.existsSync(envFilePath)) {
				envLoader.config({ path: envFilePath });
			}
			process.env.AUTHZ_CONFIG = "../../../test/trafficMonitorAPI/authZConfig/authorization-config-1-custom.js";
			server = startApiBuilder();
			auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const entryset = require('../../../documents/http/search_test_documents');
				var indexTemplate = JSON.parse(fs.readFileSync('./elasticsearch_config/traffic-summary/index_template.json'), null);
				// Add the customProperties.field1 - This normally happens based on configured API-Manager Custom-Properties
				indexTemplate.mappings.properties["customProperties.field1"] = { type: "text", norms: false } ;
				indexTemplate.index_patterns = [indexName];
				sendToElasticsearch(elasticConfig, indexName, indexTemplate, entryset)
				.then(() => {
					resolve();
				})
				.catch(err => reject(err));
			});
		});
	});

	afterEach(() => {
		nock.cleanAll()
	});

	/**
	 * Stop API Builder after the tests.
	 */
	after(() => {
		stopApiBuilder(server);
		delete process.env.AUTHZ_CONFIG;
	});

	describe('Search', () => {
		it('[Restricted-Search-ExtHttp1-Custom-0001] Execute ', async () => {
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorChris.json');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=chris&field=enabled&op=eq&value=enabled`).replyWithFile(200, './test/mockedReplies/apimanager/apiManagerUserChris.json');		
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS`).replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');

			nock('https://mocked-server:8443')
				.defaultReplyHeaders({'Content-Type': 'application/json; charset=utf-8'})
				.get('/api/v1/users/chris/groups?registry=AD&caching=false&filter=apg-t')
				.replyWithFile(200, './test/mockedReplies/extAuthZ/response1.json');
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search`,
				headers: {
					'cookie': 'VIDUSR=Restricted-Search-0001-CHRIS-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(2);
				
			});
		});

		it('[Restricted-Search-ExtHttp1-Custom-0002] Should return only ONE entry', async () => {
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "rene" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorRene.json');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=rene&field=enabled&op=eq&value=enabled`).replyWithFile(200, './test/mockedReplies/apimanager/apiManagerUserRene.json');		
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-MAX`).replyWithFile(200, './test/mockedReplies/apimanager/organizationMax.json');

			nock('https://mocked-server:8443')
				.defaultReplyHeaders({'Content-Type': 'application/json; charset=utf-8'})
				.get('/api/v1/users/rene/groups?registry=AD&caching=false&filter=apg-t')
				.replyWithFile(200, './test/mockedReplies/extAuthZ/response2.json');
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search`,
				headers: {
					'cookie': 'VIDUSR=Restricted-Search-0002-MAX-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				nock.cleanAll();
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(1);
			});
		});

		it('[Restricted-Search-ExtHttp1-Custom-0003] Should return only NO entry as user has NO group', async () => {
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "max" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorMax.json');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=max&field=enabled&op=eq&value=enabled`).replyWithFile(200, './test/mockedReplies/apimanager/apiManagerUserMax.json');		
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-MAX`).replyWithFile(200, './test/mockedReplies/apimanager/organizationMax.json');

			nock('https://mocked-server:8443')
				.defaultReplyHeaders({'Content-Type': 'application/json; charset=utf-8'})
				.get('/api/v1/users/max/groups?registry=AD&caching=false&filter=apg-t')
				.replyWithFile(200, './test/mockedReplies/extAuthZ/noGroupResponse.json');
			return await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search`,
				headers: {
					'cookie': 'VIDUSR=Restricted-Search-0002-MAX-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				nock.cleanAll();
				expect(response.statusCode).to.equal(403);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(0);
			});
		});
	});
});
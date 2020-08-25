const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Endpoints', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `apigw-traffic-search_count_test_${getRandomInt(9999)}`;

	/**
	 * Start API Builder.
	 */
	before(() => {
		return new Promise(function(resolve, reject){
			const envFilePath = path.join(__dirname, '../.env');
			if (fs.existsSync(envFilePath)) {
				envLoader.config({ path: envFilePath });
			}
			server = startApiBuilder();
			auth = {
				user: server.apibuilder.config.apikey || 'test',
				password: ''
			};
			server.apibuilder.config.testElasticIndex = indexName;
			elasticConfig = server.apibuilder.config.pluginConfig['@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch'].elastic;
			server.started
			.then(() => {
				const entryset = require('../documents/basic/search_count_documents');
				sendToElasticsearch(elasticConfig, indexName, 'traffic_details_index_template.json', entryset)
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
	after(() => {
		stopApiBuilder(server);
	});

	describe('Search', () => {
		it('[Restricted-Search-0001] Execute a search as Org-Admin without any filter - Only two of them belong to Chris-Org', () => {
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorChris.json');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=chris&field=enabled&op=eq&value=enabled`).replyWithFile(200, './test/mockedReplies/apimanager/apiManagerUserChris.json');		
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS`).replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
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
				nock.cleanAll();
			});
		});

		it('[Restricted-Search-0002] Execute a search - NOT being an API-GW-Admin - But admin in API-Manager', () => {
			// For that kind of user all APIs having a service-context should be returned
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "max" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorMax.json');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=max&field=enabled&op=eq&value=enabled`).replyWithFile(200, './test/mockedReplies/apimanager/apiManagerUserMax.json');		
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-MAX`).replyWithFile(200, './test/mockedReplies/apimanager/organizationMax.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search`,
				headers: {
					'cookie': 'VIDUSR=Restricted-Search-0002-MAX-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(9); // Nine entries have any kind of serviceContext
				nock.cleanAll();
			});
		});

		it('[Restricted-Search-0003] Execute a search - NOT being an API-GW-Admin - Normal user in API-Manager', () => {
			// For that kind of user all APIs having a service-context should be returned
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "rene" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorRene.json');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=rene&field=enabled&op=eq&value=enabled`).replyWithFile(200, './test/mockedReplies/apimanager/apiManagerUserRene.json');		
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-MAX`).replyWithFile(200, './test/mockedReplies/apimanager/organizationMax.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/search`,
				headers: {
					'cookie': '_ga=GA1.1.177509375.1593442001; iconSize=16x16; cookie_pressed_153=false; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; VIDUSR=Restricted-Search-0003-RENE-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.an('Object');
				expect(body).to.have.property('data');
				expect(body.data).to.have.lengthOf(2);
				nock.cleanAll();
			});
		});
	});
});
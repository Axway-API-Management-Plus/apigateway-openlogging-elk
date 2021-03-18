const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../../../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Payload restricted', function () {
	this.timeout(30000);
	let server;
	let auth;
	const indexName = `apigw-traffic-details-payload_test_${getRandomInt(9999)}`;
	const payloadFolder = `./test/mockedReplies/payloads`;

	/**
	 * Start API Builder.
	 */
	before(() => {
		return new Promise(function(resolve, reject){
			const envFilePath = path.join(__dirname, '../../../.env');
			if (fs.existsSync(envFilePath)) {
				envLoader.config({ path: envFilePath });
			}
			process.env.PAYLOAD_FOLDER = payloadFolder;
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
	after(() => {
		stopApiBuilder(server);
	});

	describe('Payload restricted', () => {
		it('[Restricted-Payload-0001] Should return payload - API belongs to User-Organization', () => {
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorChris.json');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=chris&field=enabled&op=eq&value=enabled`).replyWithFile(200, './test/mockedReplies/apimanager/apiManagerUserChris.json');		
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-CHRIS`).replyWithFile(200, './test/mockedReplies/apimanager/organizationChris.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/0455ff5e82267be8182a553d/1/received`,
				headers: {
					'cookie': 'VIDUSR=Restricted-Search-0001-CHRIS-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				nock.cleanAll();
			});
		});

		it('[Restricted-Payload-0002] Get Payload - NOT being an API-GW-Admin - But admin in API-Manager', () => {
			// For that kind of users payload of all APIs having a service-context should be returned
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "max" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorMax.json');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=max&field=enabled&op=eq&value=enabled`).replyWithFile(200, './test/mockedReplies/apimanager/apiManagerUserMax.json');		
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-MAX`).replyWithFile(200, './test/mockedReplies/apimanager/organizationMax.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/0455ff5e82267be8182a553d/1/received`,
				headers: {
					'cookie': 'VIDUSR=Restricted-Search-0002-MAX-1597468226-Z+qdRW4rGZnwzQ==', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.be.equal('HTTP/1.1 200 OK\r\nserver: API Builder/4.27.29\r\nrequest-id: e923342a-cf72-4c93-a774-78d1fa80c002\r\nx-xss-protection: 1; mode=block\r\nx-frame-options: DENY\r\nsurrogate-control: no-store\r\ncache-control: no-store, no-cache, must-revalidate, proxy-revalidate\r\npragma: no-cache\r\nexpires: 0\r\nx-content-type-options: nosniff\r\nstart-time: 1593791748423\r\ncontent-type: application/json; charset=utf-8\r\nresponse-time: 1\r\ncontent-md5: 0c682d056c69de8e90bbdf0a677891d8\r\ncontent-length: 281\r\netag: W/"119-iMSR0WMPy7z6deRjls2eUuMCX5I"\r\nVary: Accept-Encoding\r\nDate: Fri, 03 Jul 2020 15:55:48 GMT\r\nConnection: close\r\n\r\n\r\nRECEIVED-PAYLOAD-LEG-1');
				nock.cleanAll();
			});
		});

		it('[Restricted-Payload-0003] Get payload - NOT being an API-GW-Admin - Normal user in API-Manager - Different Org - Should return 403', () => {
			nock('https://mocked-api-gateway:8090').get('/api/rbac/currentuser').reply(200, { "result": "rene" });
			nock('https://mocked-api-gateway:8090').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/mockedReplies/apigateway/operatorRene.json');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=rene&field=enabled&op=eq&value=enabled`).replyWithFile(200, './test/mockedReplies/apimanager/apiManagerUserRene.json');		
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-MAX`).replyWithFile(200, './test/mockedReplies/apimanager/organizationMax.json');
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/0455ff5e82267be8182a553d/0/sent`,
				headers: {
					'cookie': '_ga=GA1.1.177509375.1593442001; iconSize=16x16; cookie_pressed_153=false; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; VIDUSR=Restricted-Search-0003-RENE-1597762865-iUI5a8+v+zLkNA%3d%3d; APIMANAGERSTATIC=92122e5c-6bb3-4fd1-ad2f-08b65554d116', 
					'csrf-token': '04F9F07E59F588CDE469FC367A12ED3A4B845FDA9A9AE2D9A77686823067CDDC'
				},
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(403);
				nock.cleanAll();
			});
		});
	});
});
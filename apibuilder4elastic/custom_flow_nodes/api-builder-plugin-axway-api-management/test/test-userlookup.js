const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');
const decache = require('decache');

describe('Tests User-Lookup with complete configuration parameters', () => {
	let plugin;
	let flowNode;

	const enabledField = "&field=enabled&op=eq&value=enabled";

	// Loads environment variables from .env if the file exists
	const envFilePath = path.join(__dirname, '.env');
	if (fs.existsSync(envFilePath)) {
		delete process.env.API_MANAGER; // Otherwise it is not overwritten
		envLoader.config({ path: envFilePath });
	}
	// Delete the cached module 
	decache('../config/axway-api-utils.default.js');
	var pluginConfig = require('../config/axway-api-utils.default.js').pluginConfig['api-builder-plugin-axway-api-management'];

	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('axway-api-management');
	});

	describe('#lookupCurrentUser', () => {
		it('should error when requestHeaders are not set', async () => {
			const { value, output } = await flowNode.lookupCurrentUser({
				requestHeaders: null
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'You need to provide Request-Headers with Cookies or an Authorization header.');
			expect(output).to.equal('error');
		});

		it('should error when requestHeaders are set, but contain no cookie header', async () => {
			const { value, output } = await flowNode.lookupCurrentUser({
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20"}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'You must provide either the VIDUSR cookie + csrf-token or an HTTP-Basic Authorization header.');
			expect(output).to.equal('error');
		});

		it('should error when requestHeaders are set, but the VIDUSR cookie is missing', async () => {
			const { value, output } = await flowNode.lookupCurrentUser({
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"XXX-VIDUSR=1597381095-XTawGDtJhBA7Zw%3d%3d;"}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'The requestHeaders do not contain the required cookie VIDUSR');
			expect(output).to.equal('error');
		});

		it('should error when requestHeaders are set, but the CSRF-Token is missing', async () => {
			const { value, output } = await flowNode.lookupCurrentUser({
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw%3d%3d;"}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'The requestHeaders do not contain the required header csrf-token');
			expect(output).to.equal('error');
		});

		it('should error with an invalid Cookie', async () => {
			nock('https://mocked-api-gateway:8190').get('/api/rbac/currentuser').replyWithFile(403, './test/testReplies/gateway/unknownSessionCookie.txt', {
				'Content-Type': 'text/html',
			});
			const { value, output } = await flowNode.lookupCurrentUser({
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=has-expired-cookie;", "csrf-token": "436386FFE9196A8A4A8211992240639DBF65A4BC13549BC7777F2D2DB9BE7F0B"}
			});

			expect(value).to.be.instanceOf(Error);
			expect(value.message).to.have.string('Error getting current user. Request sent to');
			expect(output).to.equal('error');
		});

		it('should error with if user does not exists in the API-Manager', async () => {
			nock('https://mocked-api-gateway:8190').get('/api/rbac/currentuser').reply(200, {"result": "chris"});
			nock('https://mocked-api-gateway:8190').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/testReplies/gateway/operatorRoleOnlyPermissions.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=chris${enabledField}`).reply(200, [] );
			const { value, output } = await flowNode.lookupCurrentUser({ 
				// Let's assume this cookie resolves to username admin - which is unknown in the API-Manager
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597404606-ZQr/l9c2HvlhtA==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'User: \'chris\' not found in API-Manager.');
			expect(output).to.equal('error');
		});

		it('should result into an API-Gateway Admin-User (based on permission: adminusers_modify), which requires no lookup to the API-Manager', async () => {
			nock('https://mocked-api-gateway:8190').get('/api/rbac/currentuser').reply(200, { "result": "gwadmin" });
			nock('https://mocked-api-gateway:8190').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/testReplies/gateway/gatewayAdminOnlyPermissions.json');

			const { value, output } = await flowNode.lookupCurrentUser({ 
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"}
			});

			expect(value).to.deep.equal({
				"loginName": "gwadmin",
				"gatewayManager": {
					"isAdmin": true
				}
			});
			expect(output).to.equal('next');
		});

		it('should result into a normal API-Gateway User which requires no login to API-Manager as flag apiManagerUserRequired is set to false', async () => {
			nock('https://mocked-api-gateway:8190').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8190').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/testReplies/gateway/operatorRoleOnlyPermissions.json');

			const { value, output } = await flowNode.lookupCurrentUser({ 
				getApiManagerUser: false, requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"}
			});

			expect(value).to.deep.equal({
				"loginName": "chris",
				"gatewayManager": {
					"isAdmin": false
				}
			});
			expect(output).to.equal('next');
		});

		it('should result into a standard API-Gateway User (NOT HAVING permission: adminusers_modify), which requires user lookup to the API-Manager', async () => {
			nock('https://mocked-api-gateway:8190').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8190').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/testReplies/gateway/operatorRoleOnlyPermissions.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=chris${enabledField}`).replyWithFile(200, './test/testReplies/apimanager/apiManagerUserChris.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-f833ca1c0a74`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');

			const { value, output } = await flowNode.lookupCurrentUser({ 
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"}
			});

			expect(value).to.deep.equal({
				"loginName": "chris",
				"gatewayManager": {
					"isAdmin": false
				},
				"apiManager": {
					"id": "d66a42d6-b9c7-4efd-b33a-de8b88545861",
					"organizationId": "2bfaa1c2-49ab-4059-832d-f833ca1c0a74",
					"organizationName": "API Development",
					"name": "Chris",
					"loginName": "chris",
					"email": "chris@axway.com",
					"role": "oadmin",
					"enabled": true,
					"createdOn": 1597338071490,
					"state": "approved",
					"type": "internal",
					"dn": "cn=chris,o=API Development,ou=organizations,ou=APIPortal"
				}
			});
			expect(output).to.equal('next');
		});

		it('should should cache the result', async () => {
			nock('https://mocked-api-gateway:8190').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8190').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/testReplies/gateway/operatorRoleOnlyPermissions.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=chris${enabledField}`).replyWithFile(200, './test/testReplies/apimanager/apiManagerUserChris.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-f833ca1c0a74`).replyWithFile(200, './test/testReplies/apimanager/organizationAPIDevelopment.json');

			const { value, output } = await flowNode.lookupCurrentUser({ 
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"}
			});

			expect(value).to.deep.equal({
				"loginName": "chris",
				"gatewayManager": {
					"isAdmin": false
				},
				"apiManager": {
					"id": "d66a42d6-b9c7-4efd-b33a-de8b88545861",
					"organizationId": "2bfaa1c2-49ab-4059-832d-f833ca1c0a74",
					"organizationName": "API Development",
					"name": "Chris",
					"loginName": "chris",
					"email": "chris@axway.com",
					"role": "oadmin",
					"enabled": true,
					"createdOn": 1597338071490,
					"state": "approved",
					"type": "internal",
					"dn": "cn=chris,o=API Development,ou=organizations,ou=APIPortal"
				}
			});
			expect(output).to.equal('next');

			nock.cleanAll();
			await flowNode.lookupCurrentUser({ 
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"}
			});
		});

		it('should error if belonging organization is disabled', async () => {
			nock('https://mocked-api-gateway:8190').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8190').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/testReplies/gateway/operatorRoleOnlyPermissions.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=chris${enabledField}`).replyWithFile(200, './test/testReplies/apimanager/apiManagerUserChris.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-f833ca1c0a74`).replyWithFile(200, './test/testReplies/apimanager/disabledOrganization.json');

			const { value, output } = await flowNode.lookupCurrentUser({ 
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Organization: \'API Development\' is disabled.');
			expect(output).to.equal('error');
		});

		it('should error if belonging organization has no development flag', async () => {
			nock('https://mocked-api-gateway:8190').get('/api/rbac/currentuser').reply(200, { "result": "chris" });
			nock('https://mocked-api-gateway:8190').get('/api/rbac/permissions/currentuser').replyWithFile(200, './test/testReplies/gateway/operatorRoleOnlyPermissions.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/users?field=loginName&op=eq&value=chris${enabledField}`).replyWithFile(200, './test/testReplies/apimanager/apiManagerUserChris.json');
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/organizations/2bfaa1c2-49ab-4059-832d-f833ca1c0a74`).replyWithFile(200, './test/testReplies/apimanager/noDevelopmentOrg.json');

			const { value, output } = await flowNode.lookupCurrentUser({ 
				requestHeaders: {"host":"api-gateway:8090","max-forwards":"20", "cookie":"VIDUSR=1597381095-XTawGDtJhBA7Zw==;", "csrf-token": "CF2796B3BD18C1B0B5AB1C8E95B75662E92FBC04BD799DEB97838FC5B9C39348"}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Organization: \'API Development\' is not a development organization.');
			expect(output).to.equal('error');
		});
	});
});

const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Configuration parameter tests', () => {

	var pluginConfig = {};

	describe('#Missing config parameter tests', () => {
		it('should error when API-Gateway parameters are missing at all', async () => {
			try {
				const plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
			} catch(e) {
				expect(e).to.be.an('Error')
				.and.to.have.property('message', 'API-Gateway (apigateway) paramater section is missing in configuration');
			}
		});
		it('should error when API-Manager parameters are missing at all', async () => {
			try {
				pluginConfig.apigateway = {};
				expect(await MockRuntime.loadPlugin(getPlugin,pluginConfig)).to.throw('API-Manager (apimanager) paramater section is missing in configuration');
			} catch(e) {
				expect(e).to.be.an('Error')
				.and.to.have.property('message', 'API-Manager (apimanager) paramater section is missing in configuration');
			}
		});
		it('should error when API-Gateway URL is missing', async () => {
			try {
				pluginConfig.apimanager = {};
				pluginConfig.apigateway = {};
				const plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
			} catch(e) {
				expect(e).to.be.an('Error')
				.and.to.have.property('message', 'Required parameter: apigateway.url is not set.');
			}
		});
		it('should error when API-Manager username is not set', async () => {
			try {
				pluginConfig.apimanager = {};
				pluginConfig.apigateway = {};
				pluginConfig.apigateway.url = "https://api-gateway-host:8090";
				const plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
			} catch(e) {
				expect(e).to.be.an('Error')
				.and.to.have.property('message', 'Required parameter: apimanager.username is not set.');
			}
		});
		it('should error when API-Manager password is not set', async () => {
			try {
				pluginConfig.apimanager = {};
				pluginConfig.apigateway = {};
				pluginConfig.apigateway.url = "https://api-gateway-host:8090";
				pluginConfig.apimanager.username = "apiadmin";
				const plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
			} catch(e) {
				expect(e).to.be.an('Error')
				.and.to.have.property('message', 'Required parameter: apimanager.password is not set.');
			}
		});
		it('should NOT FAIL when API-Manager URL is not set', async () => {
			nock('https://any-gateway-host:8075').post(`/api/portal/v1.3/login`).reply(303, {}, { 'Set-Cookie': 'APIMANAGERSESSION=AdminSessionSession;Version=1;Comment="Session for API Management";Path=/api/portal/v1.3/;Secure;HttpOnly' });
			nock('https://any-gateway-host:8075').get(`/api/portal/v1.3/currentuser`).replyWithFile(200, './test/testReplies/apimanager/currentAdminUser.json');

			pluginConfig.apimanager = {};
			pluginConfig.apigateway = {};
			pluginConfig.apigateway.url = "https://any-gateway-host:8090";
			pluginConfig.apimanager.username = "apiadmin";
			pluginConfig.apimanager.password = "changeme";
			plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
			plugin.setOptions({ validateOutputs: true });
			flowNode = plugin.getFlowNode('axway-api-management');
			expect(pluginConfig.apimanager.hostname).to.equal(pluginConfig.apigateway.hostname);
		});

		it('should FAIL when the API-Manager user is NOT an Admin', async () => {			
			nock('https://mocked-api-gateway:8175').post(`/api/portal/v1.3/login`).reply(303, {}, { 'Set-Cookie': 'APIMANAGERSESSION=MyMockSession;Version=1;Comment="Session for API Management";Path=/api/portal/v1.3/;Secure;HttpOnly' });
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/currentuser`).replyWithFile(200, './test/testReplies/apimanager/currentNonAdminUser.json');

			pluginConfig.apimanager = {};
			pluginConfig.apigateway = {};
			pluginConfig.apigateway.url = "https://mocked-api-gateway:8190";
			pluginConfig.apimanager.url = "https://mocked-api-gateway:8175";
			pluginConfig.apimanager.username = "user";
			pluginConfig.apimanager.password = "invalid";
			pluginConfig.validateConfig = true;
			try {
				const { value, output } = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
				expect(output).to.equal('error');
			} catch(e) {
				expect(e).to.be.an('Error')
				.and.to.have.property('message', 'Error checking configured API-Manager(s). {"isValid":false,"default":{"url":"https://mocked-api-gateway:8175","username":"user","password":"invalid","isValid":false}}');
			}
			nock.cleanAll();
		});

		it('should succeed with a valid admin user', async () => {			
			nock('https://mocked-api-gateway:8175').post(`/api/portal/v1.3/login`).reply(303, {}, { 'Set-Cookie': 'APIMANAGERSESSION=MyValidSession;Version=1;Comment="Session for API Management";Path=/api/portal/v1.3/;Secure;HttpOnly' });
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/currentuser`).replyWithFile(200, './test/testReplies/apimanager/currentAdminUser.json');

			pluginConfig.apimanager = {};
			pluginConfig.apigateway = {};
			pluginConfig.apigateway.url = "https://mocked-api-gateway:8190";
			pluginConfig.apimanager.url = "https://mocked-api-gateway:8175";
			pluginConfig.apimanager.username = "apiadmin";
			pluginConfig.apimanager.password = "changeme";
			pluginConfig.validateConfig = true;
			await MockRuntime.loadPlugin(getPlugin,pluginConfig);
			nock.cleanAll();
		});
	});
});


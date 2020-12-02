const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, getRandomInt } = require('../_base');
const path = require('path');
const fs = require('fs');
const os = require('os');
const nock = require('nock');
const envLoader = require('dotenv');
const { ElasticsearchClient } = require('@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch/src/actions/ElasticsearchClient.js');
const { spyElasticSearchMethod } = require('./spyElasticsearch');
const { renderString, renderTemplateFile } = require('template-file');


describe('Test Setup Indices endpoint', function () {
	this.timeout(30000);
	let server;
	let auth;

	var randomId = getRandomInt(999);

	// Init elasticsearch client, which is a singleton
	const envFilePath = path.join(__dirname, '../.env');
	if (fs.existsSync(envFilePath)) {
		envLoader.config({ path: envFilePath });
	}
	
	var client = new ElasticsearchClient({node: process.env.ELASTICSEARCH_HOSTS}).client;

	afterEach(() => {
	});

	beforeEach(() => {
	});

	/**
	 * Start API Builder.
	 */
	before(() => {
		auth = {
			user: 'test',
			password: ''
		};
	});

	function generateRandomConfig(configFile, suffix) {
		var tempDir = path.join(os.tmpdir(), `/elk-test-${randomId}${suffix}`);
		fs.mkdirSync(tempDir);
		var testConfig = path.join(tempDir, 'index_config.json');
		console.log(`Using test-config: ${testConfig}`);
		var data = { id: randomId };
		renderTemplateFile(configFile, data)
			.then(function(renderedString) {
				fs.writeFileSync(testConfig, renderedString);
			});
		// This tells the API-Builder process, which config to use before it starts
		process.env.INDEX_CONFIG_FILE = testConfig;
	}

	/**
	 * Stop API Builder after the tests.
	 */
	after(() => {
		stopApiBuilder(server);
		nock.cleanAll();
	});

	describe('Setup index tests', () => {
		it('[upgrade-setup-0001] Validate an existing configuration can be updated', async () => {
			console.log('Going to configure test index as in version 1.0.0');
			// Contains the configuration as it was in version 1.0.0
			var testConfigFileV1 = 'test/setupIndices/test-config-v1.0.0/index_config_template.json';
			generateRandomConfig(testConfigFileV1, '-v1');
			// Start API-Builder with version 1.0 settings
			server = startApiBuilder();
			await server.started;
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/mockedReplies/apimanager/customPropertiesConfig.json');
			// Init the setup process for the traffic-summary index
			await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/setup/index/traffic-summary-${randomId}`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {				
				expect(response.statusCode).to.equal(200);
			});
			// Stop API-Builder after it has been configured as in V1.0.0
			await stopApiBuilder(server);
			console.log('Elasticsearch index configured as in version 1.0.0');

			// Setup to the updated configuration
			var testConfigFileV1_1 = 'test/setupIndices/test-config/index_config_template.json';
			generateRandomConfig(testConfigFileV1_1, '-v11');
			server = startApiBuilder();
			await server.started;
			console.log('Upgrading test index to version 1.1.0');
			nock('https://mocked-api-gateway:8075').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/mockedReplies/apimanager/customPropertiesConfig.json');

			// Setup some spy to see what happens in Elasticsearch
			const spyGetTemplate = 		spyElasticSearchMethod(client, 'indices.getTemplate');
			const spyPutTemplate = 		spyElasticSearchMethod(client, 'indices.putTemplate');
			const spyIndicesRollover = 	spyElasticSearchMethod(client, 'indices.rollover');
			const spyPutILMPolicyFn = 	spyElasticSearchMethod(client, 'ilm.putLifecycle');
			const spyGetILMPolicyFn = 	spyElasticSearchMethod(client, 'ilm.getLifecycle');
			const spyIndicesExists = 	spyElasticSearchMethod(client, 'indices.existsAlias'); // As the alias is given this method is used
			const spyIndicesCreate = 	spyElasticSearchMethod(client, 'indices.create');

			// Fire the setup endpoint
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/setup/index/traffic-summary-${randomId}`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				// Some of the calls happen internally in other flow-nodes (e.g. ILM asignment to Index-Template)
				expect(spyGetTemplate.callCount).to.equals(3, "indices.getTemplate was not called 3 times");
				expect(spyPutTemplate.callCount).to.equals(2, "indices.putTemplate was not called 2 times"); // The template should be inserted
				expect(spyPutILMPolicyFn.callCount).to.equals(1, "ilm.putLifecycle was not called"); // Expected to setup the ILM-Policy
				expect(spyGetILMPolicyFn.callCount).to.equals(1, "ilm.getLifecycle was not called"); // Is called as part of the ilm.putLifecycle
				expect(spyIndicesExists.callCount).to.equals(2, "indices.exists was not called"); //
				expect(spyIndicesCreate.callCount).to.equals(0, "indices.create was called"); // but the index already exists
				expect(spyIndicesRollover.callCount).to.equals(1, "indices.rollover was not called"); // but it should, as the V1.0.0 index should be rolled over
				
				expect(response.statusCode).to.equal(200);
				nock.cleanAll();
			});
		});
	});

	
});
	

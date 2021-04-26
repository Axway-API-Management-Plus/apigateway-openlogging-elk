const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, getRandomInt } = require('../_base');
const path = require('path');
const fs = require('fs');
const os = require('os');
const nock = require('nock');
const envLoader = require('dotenv');
const { ElasticsearchClient } = require('@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch/src/actions/ElasticsearchClient.js');
const { spyElasticSearchMethod } = require('./spyElasticsearch');
const { renderFile } = require('template-file');


describe('Test Setup Indices endpoint with custom properties disable', function () {
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
		nock.cleanAll();
	});

	/**
	 * Start API Builder.
	 */
	before(async () => {
		await generateRandomConfig("test/setupIndices/test-config/index_config_template.json");
		server = startApiBuilder();
		auth = {
			user: server.apibuilder.config.apikey || 'test',
			password: ''
		};
		return server.started;
	});

	async function generateRandomConfig(configFile) {
		var tempDir = path.join(os.tmpdir(), `/elk-test-${randomId}`);
		fs.mkdirSync(tempDir);
		var testConfig = path.join(tempDir, 'index_config.json');
		console.log(`Using test-config: ${testConfig}`);
		var data = { id: randomId };
		var renderedString = await renderFile(configFile, data);
		fs.writeFileSync(testConfig, renderedString);
		delete process.env.INDEX_CONFIG_FILE;
		process.env.INDEX_CONFIG_FILE = testConfig;
		process.env.DISABLE_SETUP_FLOWS = false;
		process.env.DISABLE_CUSTOM_PROPERTIES = true;
	}

	/**
	 * Stop API Builder after the tests.
	 */
	after(() => {
		stopApiBuilder(server)
		process.env.DISABLE_SETUP_FLOWS = true;
		process.env.DISABLE_CUSTOM_PROPERTIES = false;
	});

	describe('Setup index tests without custom properties', () => {
		it('[setup-index-no-custom-props-0001] Testing initial configuration - Custom properties disabled', () => {
			// Test basically succeeds if not trying to reach customProperties REST-API ast API-Manager
			const spyGetTemplate = 		spyElasticSearchMethod(client, 'indices.getTemplate');
			const spyPutTemplate = 		spyElasticSearchMethod(client, 'indices.putTemplate');
			const spyIndicesRollover = 	spyElasticSearchMethod(client, 'indices.rollover');
			const spyPutILMPolicyFn = 	spyElasticSearchMethod(client, 'ilm.putLifecycle');
			const spyGetILMPolicyFn = 	spyElasticSearchMethod(client, 'ilm.getLifecycle');
			const spyIndicesExists = 	spyElasticSearchMethod(client, 'indices.existsAlias'); // As the alias is given this method is used
			const spyIndicesCreate = 	spyElasticSearchMethod(client, 'indices.create');

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
				expect(spyIndicesExists.callCount).to.equals(0, "indices.exists should not be called"); // 
				expect(spyIndicesCreate.callCount).to.equals(0, "indices.create should not be called"); // 
				expect(spyIndicesRollover.callCount).to.equals(0, "indices.rollover should not be called"); // As the index has just been created
				
				expect(response.statusCode).to.equal(200);
				nock.cleanAll();
			});
		});
	});
});
	

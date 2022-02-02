const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');
const decache = require('decache');

describe('Test Get custom properties from API-Manager', () => {
	let plugin;
	let flowNode;

	// Loads environment variables from .env if the file exists
	const envFilePath = path.join(__dirname, '.env');
	if (fs.existsSync(envFilePath)) {
		envLoader.config({ override: true, path: envFilePath });
	}
	// Delete the cached module 
	decache('../config/axway-api-utils.default.js');
	decache('../../../conf/elasticsearch.default.js');
	var pluginConfig = require('../config/axway-api-utils.default.js').pluginConfig['api-builder-plugin-axway-api-management'];

	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin,pluginConfig);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('axway-api-management');
	});

	describe('#getCustomPropertiesSingleAPIManager', () => {

		it('should return custom properties from a single API-Manager.', async () => {
			nock.cleanAll();
			nock('https://mocked-api-gateway:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');

			const { value, output } = await flowNode.getCustomPropertiesConfig({ });

			expect(value).to.deep.equal(
				{
					"customProperty1": {
						"label": "Custom Property #1",
						"type": "custom",
						"disabled": false,
						"required": false,
						"permissions": {
							"user": {
								"read": true,
								"write": true,
								"visible": true
							},
							"admin": {
								"read": true,
								"write": true,
								"visible": true
							},
							"oadmin": {
								"read": true,
								"write": true,
								"visible": true
							}
						}
					},
					"customProperty2": {
						"label": "Custom Property #2",
						"type": "select",
						"disabled": false,
						"required": false,
						"permissions": {
							"user": {
								"read": true,
								"write": true,
								"visible": true
							},
							"admin": {
								"read": true,
								"write": true,
								"visible": true
							},
							"oadmin": {
								"read": true,
								"write": true,
								"visible": true
							}
						},
						"options": [
							{
								"value": "1",
								"label": "Value 1"
							},
							{
								"value": "2",
								"label": "Value 2"
							},
							{
								"value": "3",
								"label": "Value 3"
							}
						]
					},
					"customProperty3": {
						"label": "Custom Property #3",
						"type": "switch",
						"disabled": false,
						"required": false,
						"permissions": {
							"user": {
								"read": true,
								"write": true,
								"visible": true
							},
							"admin": {
								"read": true,
								"write": true,
								"visible": true
							},
							"oadmin": {
								"read": true,
								"write": true,
								"visible": true
							}
						},
						"options": [
							{
								"value": true,
								"label": "ON"
							},
							{
								"value": false,
								"label": "OFF"
							}
						]
					}
				}
			);
			expect(output).to.equal('next');
		});
	});
});

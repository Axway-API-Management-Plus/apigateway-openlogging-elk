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
	const envFilePath = path.join(__dirname, '.env-multi-apimanager-no-default');
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

	describe('#getCustomProperties', () => {
		it('should not return custom properties if feature is disabled', async () => {
			const { value, output } = await flowNode.getCustomPropertiesConfig({ disableCustomProperties: true });

			expect(value).to.deep.equal({});
			expect(output).to.equal('next');
		});

		it('should return custom properties merged from different API-Managers.', async () => {
			nock('https://manager-1:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig.json');
			nock('https://manager-2:8175').get(`/api/portal/v1.3/config/customproperties`).replyWithFile(200, './test/testReplies/apimanager/customPropertiesConfig2nd.json');

			const { value, output } = await flowNode.getCustomPropertiesConfig({ });

			expect(value).to.deep.equal(
				{
					"2ndCustomProperty1": {
					  "disabled": false, 
					  "label": "Custom Property #1",
					  "permissions": {
						"admin": {
						  "read": true, "visible": true, "write": true
						},"oadmin": {
						  "read": true, "visible": true, "write": true
						},"user": {
						  "read": true, "visible": true, "write": true
						}
					  }, "required": false, "type": "custom"
					},
					"2ndCustomProperty3": {
					  "disabled": false, "label": "Custom Property #3", "options": [
						{
						  "label": "ON", "value": true
						},{
						  "label": "OFF", "value": false
						}
					  ], "permissions": {
						"admin": {
						  "read": true, "visible": true, "write": true
						}, "oadmin": {
						  "read": true, "visible": true, "write": true
						}, "user": {
						  "read": true, "visible": true, "write": true
						}
					  }, "required": false, "type": "switch"
					}, "customProperty1": {
					  "disabled": false, "label": "Custom Property #1", "permissions": {
						"admin": {
						  "read": true, "visible": true, "write": true
						}, "oadmin": {
						  "read": true, "visible": true, "write": true
						}, "user": {
						  "read": true, "visible": true, "write": true
						}
					  }, "required": false, "type": "custom"
					}, "customProperty2": {
					  "disabled": false, "label": "Custom Property #2", "options": [
						{
						  "label": "Value 1", "value": "1"
						}, {
						  "label": "Value 2", "value": "2"
						}, {
						  "label": "Value 3", "value": "3"
						}
					  ], "permissions": {
						"admin": {
						  "read": true, "visible": true, "write": true
						}, "oadmin": {
						  "read": true, "visible": true, "write": true
						}, "user": {
						  "read": true, "visible": true, "write": true
						}
					  }, "required": false, "type": "select"
					}, "customProperty3": {
					  "disabled": false, "label": "Custom Property #3", "options": [
						{
						  "label": "ON", "value": true
						}, {
						  "label": "OFF", "value": false
						}
					  ], "permissions": {
						"admin": {
						  "read": true, "visible": true, "write": true
						}, "oadmin": {
						  "read": true, "visible": true, "write": true
						}, "user": {
						  "read": true, "visible": true, "write": true
						}
					  }, "required": false, "type": "switch"
					}
				}
			);
			expect(output).to.equal('next');
		});
	});
});

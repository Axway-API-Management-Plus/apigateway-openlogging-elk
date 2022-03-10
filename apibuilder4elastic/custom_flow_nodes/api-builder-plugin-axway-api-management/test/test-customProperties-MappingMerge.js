const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');
const decache = require('decache');

describe('Merge custom properties tests', () => {

	let plugin;
	let flowNode;

	const envFilePath = path.join(__dirname, '.env');
	if (fs.existsSync(envFilePath)) {
		envLoader.config({ override: true, path: envFilePath });
	}
	// Delete the cached module 
	decache('../config/axway-api-utils.default.js');
	var pluginConfig = require('../config/axway-api-utils.default.js').pluginConfig['api-builder-plugin-axway-api-management'];

	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin, {MOCK_LOOKUP_API:"true", ...pluginConfig});
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('axway-api-management');
	});

	describe('#Index template mapping custom properties merge tests', () => {
		it('should error custom properties are missing', async () => {
			const { value, output } = await flowNode.mergeCustomPropertiesIntoIndexTemplate({ });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: customProperties');
			expect(output).to.equal('error');
		});

		it('should error when desiredIndexTemplate is missing', async () => {
			const { value, output } = await flowNode.mergeCustomPropertiesIntoIndexTemplate({ customProperties: { } });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: desiredIndexTemplate');
			expect(output).to.equal('error');
		});

		it('should return noUpdate if mergeCustomProperties is false', async () => {
			var desiredIndexTemplate = JSON.parse(fs.readFileSync('./test/testInput/desiredIndexTemplate.json'), null);
			const { value, output } = await flowNode.mergeCustomPropertiesIntoIndexTemplate({ 
				customProperties: JSON.parse(fs.readFileSync('./test/testInput/customPropertiesConfig.json'), null), 
				desiredIndexTemplate: desiredIndexTemplate, 
				customPropertiesSettings: { merge: false }
			});

			expect(output).to.equal('noUpdate');
			expect(value).to.deep.equal(desiredIndexTemplate);
		});

		it('should NOT error when actualIndexTemplate is missing', async () => {
			const { value, output } = await flowNode.mergeCustomPropertiesIntoIndexTemplate({ 
				customProperties: JSON.parse(fs.readFileSync('./test/testInput/customPropertiesConfig.json'), null), 
				desiredIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/desiredIndexTemplate.json'), null), 
				customPropertiesSettings: { merge: true, parent: "" }
			});

			expect(output).to.equal('next');
			expect(value.mappings.properties['customProperties.customProperty1']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty1']).to.deep.equal({type: "text", norms: false, fields: {keyword: { type: "keyword"}}});
			expect(value.mappings.properties['customProperties.customProperty2']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty2'].type).to.equal('keyword');
			expect(value.mappings.properties['customProperties.customProperty3']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty3'].type).to.equal('keyword');
		});

		it('should merge into indexMappingTemplate as custom properties are missing and parent is not set', async () => {
			const { value, output } = await flowNode.mergeCustomPropertiesIntoIndexTemplate({ 
				customProperties: JSON.parse(fs.readFileSync('./test/testInput/customPropertiesConfig.json'), null), 
				desiredIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/desiredIndexTemplate.json'), null),
				actualIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/actualIndexTemplate.json'), null), 
				customPropertiesSettings: { merge: true }
			});
			expect(output).to.equal('next');
			expect(value.mappings.properties['customProperties.customProperty1']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty1']).to.deep.equal({type: "text", norms: false, fields: {keyword: { type: "keyword"}}});
			expect(value.mappings.properties['customProperties.customProperty2']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty2'].type).to.equal('keyword');
			expect(value.mappings.properties['customProperties.customProperty3']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty3'].type).to.equal('keyword');
		});

		it('should result in no update required as custom properties already part of the mapping', async () => {
			const { value, output } = await flowNode.mergeCustomPropertiesIntoIndexTemplate({ 
				customProperties: JSON.parse(fs.readFileSync('./test/testInput/customPropertiesConfig.json'), null), 
				desiredIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/desiredIndexTemplateWithCustomProps.json'), null),
				actualIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/actualIndexTemplateWithCustomProps.json'), null), 
				customPropertiesSettings: { merge: true, parent: "" }
			});
			expect(output).to.equal('noUpdate');
			expect(value.mappings.properties['customProperties.customProperty1']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty1']).to.deep.equal({type: "text" });
			expect(value.mappings.properties['customProperties.customProperty2']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty2'].type).to.equal('keyword');
			expect(value.mappings.properties['customProperties.customProperty3']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty3'].type).to.equal('keyword');
		});

		it('should result in an update as some of the required custom properties are missing', async () => {
			const { value, output } = await flowNode.mergeCustomPropertiesIntoIndexTemplate({ 
				customProperties: JSON.parse(fs.readFileSync('./test/testInput/customPropertiesConfig.json'), null), 
				desiredIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/desiredIndexTemplate.json'), null),
				actualIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/actualIndexTemplateWithLessCustomProps.json'), null), 
				customPropertiesSettings: { merge: true, parent: "" }
			});
			expect(output).to.equal('next');
			expect(value.mappings.properties['customProperties.customProperty1']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty1']).to.deep.equal({type: "text", norms: false, fields: {keyword: { type: "keyword"}}});
			expect(value.mappings.properties['customProperties.customProperty2']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty2'].type).to.equal('keyword');
			expect(value.mappings.properties['customProperties.customProperty3']).to.be.an('Object');
			expect(value.mappings.properties['customProperties.customProperty3'].type).to.equal('keyword');
		});

		it('should merge into indexMappingTemplate withd a defined parent as custom properties are missing', async () => {
			const { value, output } = await flowNode.mergeCustomPropertiesIntoIndexTemplate({ 
				customProperties: JSON.parse(fs.readFileSync('./test/testInput/customPropertiesConfig.json'), null), 
				desiredIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/desiredIndexTemplate.json'), null),
				actualIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/actualIndexTemplate.json'), null), 
				customPropertiesSettings: { merge: true, parent: "transactionSummary." }
			});

			expect(output).to.equal('next');
			expect(value.mappings.properties['transactionSummary.customProperties.customProperty1']).to.be.an('Object');
			expect(value.mappings.properties['transactionSummary.customProperties.customProperty1']).to.deep.equal({type: "text", norms: false, fields: {keyword: { type: "keyword"}}});
			expect(value.mappings.properties['transactionSummary.customProperties.customProperty2']).to.be.an('Object');
			expect(value.mappings.properties['transactionSummary.customProperties.customProperty2'].type).to.equal('keyword');
			expect(value.mappings.properties['transactionSummary.customProperties.customProperty3']).to.be.an('Object');
			expect(value.mappings.properties['transactionSummary.customProperties.customProperty3'].type).to.equal('keyword');
		});

		it('should result into a noUpdate as customProperties with the the given parent already exists', async () => {
			const { value, output } = await flowNode.mergeCustomPropertiesIntoIndexTemplate({ 
				customProperties: JSON.parse(fs.readFileSync('./test/testInput/customPropertiesConfig.json'), null), 
				desiredIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/desiredIndexTemplate.json'), null),
				actualIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/actualIndexTemplateWithParentCustomProps.json'), null), 
				customPropertiesSettings: { merge: true, parent: "transactionSummary." }
			});

			expect(output).to.equal('noUpdate');
		});

		it('should merge the given eventlog custom properties into the template', async () => {
			const { value, output } = await flowNode.mergeCustomPropertiesIntoIndexTemplate({ 
				customProperties: JSON.parse(fs.readFileSync('./test/testInput/customPropertiesConfig.json'), null), 
				eventLogCustomProperties: 'myProperty1, myProperty2, myCustomProperty3:custom', 
				desiredIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/desiredIndexTemplate.json'), null),
				actualIndexTemplate: JSON.parse(fs.readFileSync('./test/testInput/actualIndexTemplateWithParentCustomProps.json'), null), 
				customPropertiesSettings: { merge: true, parent: "transactionSummary." }
			});

			expect(output).to.equal('next');

			expect(value.mappings.properties['customMsgAtts.myProperty1']).to.be.an('Object');
			expect(value.mappings.properties['customMsgAtts.myProperty2']).to.be.an('Object');
			expect(value.mappings.properties['customMsgAtts.myCustomProperty3']).to.be.an('Object');
		});
	});
	describe('#Transformation job custom properties merge tests', () => {
		it('should error when custom properties are missing', async () => {
			const { value, output } = await flowNode.mergeCustomPropertiesIntoTransform({ });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: customProperties to merge them into the transformation job.');
			expect(output).to.equal('error');
		});

		it('should error when transformBody is missing', async () => {
			const { value, output } = await flowNode.mergeCustomPropertiesIntoTransform({ customProperties: { } });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: transformBody');
			expect(output).to.equal('error');
		});

		it('should error when transformIdSuffix is missing', async () => {
			var transformBody = JSON.parse(fs.readFileSync('./test/testInput/transform_hourly.json'), null);
			const { value, output } = await flowNode.mergeCustomPropertiesIntoTransform({ 
				customProperties: { },
				transformBody: transformBody
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: transformIdSuffix');
			expect(output).to.equal('error');
		});

		it('should return noUpdate if mergeCustomProperties is false', async () => {
			var transformBody = JSON.parse(fs.readFileSync('./test/testInput/transform_hourly.json'), null);
			const { value, output } = await flowNode.mergeCustomPropertiesIntoTransform({ 
				customProperties: JSON.parse(fs.readFileSync('./test/testInput/customPropertiesConfig.json'), null), 
				transformBody: transformBody, 
				transformIdSuffix: 'V1', 
				customPropertiesSettings: { merge: false }
			});

			expect(output).to.equal('noUpdate');
			expect(value.transformBody).to.deep.equal(transformBody);
			expect(value.transformIdSuffix).to.equal('V1');
		});

		it('should return noUpdate if API-Manager and EventLog custom properties are empty', async () => {
			var transformBody = JSON.parse(fs.readFileSync('./test/testInput/transform_hourly.json'), null);
			const { value, output } = await flowNode.mergeCustomPropertiesIntoTransform({ 
				customProperties: {}, 
				transformBody: transformBody, 
				transformIdSuffix: 'V1', 
				customPropertiesSettings: { merge: true }
			});

			expect(output).to.equal('noUpdate');
			expect(value.transformBody).to.deep.equal(transformBody);
			expect(value.transformIdSuffix).to.equal('V1');
		});

		it('should return custom properties from API-Manager merged into transform job', async () => {
			var transformBody = JSON.parse(fs.readFileSync('./test/testInput/transform_hourly.json'), null);
			const { value, output } = await flowNode.mergeCustomPropertiesIntoTransform({ 
				customProperties: JSON.parse(fs.readFileSync('./test/testInput/customPropertiesConfig.json'), null), 
				transformBody: transformBody, 
				customPropertiesSettings: { merge: true },
				transformIdSuffix: 'V2'
			});

			expect(output).to.equal('next');
			expect(value.transformIdSuffix).to.equal('V2-803794971');
			expect(value.transformBody.pivot.group_by['customProperties.customProperty1']).to.be.an('Object');
			expect(value.transformBody.pivot.group_by['customProperties.customProperty1']).to.deep.equal({"terms": {"field": "finalStatus", "missing_bucket": true}});
			expect(value.transformBody.pivot.group_by['customProperties.customProperty2']).to.be.an('Object');
			expect(value.transformBody.pivot.group_by['customProperties.customProperty2']).to.deep.equal({"terms": {"field": "finalStatus", "missing_bucket": true}});
			expect(value.transformBody.pivot.group_by['customProperties.customProperty3']).to.be.an('Object');
			expect(value.transformBody.pivot.group_by['customProperties.customProperty3']).to.deep.equal({"terms": {"field": "finalStatus", "missing_bucket": true}});
		});

		it('should return custom properties from Event-Log merged into transform job', async () => {
			var transformBody = JSON.parse(fs.readFileSync('./test/testInput/transform_hourly.json'), null);
			const { value, output } = await flowNode.mergeCustomPropertiesIntoTransform({ 
				customProperties: {}, 
				eventLogCustomProperties: 'myProperty1, myProperty2, myCustomProperty3:custom', 
				transformBody: transformBody, 
				customPropertiesSettings: { merge: true },
				transformIdSuffix: 'V1'
			});

			expect(output).to.equal('next');
			expect(value.transformIdSuffix).to.equal('V1-922805401');
			expect(value.transformBody.pivot.group_by['customMsgAtts.myProperty1']).to.be.an('Object');
			expect(value.transformBody.pivot.group_by['customMsgAtts.myProperty1']).to.deep.equal({"terms": {"field": "finalStatus", "missing_bucket": true}});
			expect(value.transformBody.pivot.group_by['customMsgAtts.myProperty2']).to.be.an('Object');
			expect(value.transformBody.pivot.group_by['customMsgAtts.myProperty2']).to.deep.equal({"terms": {"field": "finalStatus", "missing_bucket": true}});
			expect(value.transformBody.pivot.group_by['customMsgAtts.myCustomProperty3']).to.be.an('Object');
			expect(value.transformBody.pivot.group_by['customMsgAtts.myCustomProperty3']).to.deep.equal({"terms": {"field": "finalStatus", "missing_bucket": true}});
		});
	});
});

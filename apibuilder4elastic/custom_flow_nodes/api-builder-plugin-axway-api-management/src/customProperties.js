/**
 * Action method.
 *
 * @param {object} params - A map of all the parameters passed from the flow.
 * @param {object} options - The additional options provided from the flow
 *	 engine.
 * @param {object} options.pluginConfig - The service configuration for this
 *	 plugin from API Builder config.pluginConfig['api-builder-plugin-pluginName']
 * @param {object} options.logger - The API Builder logger which can be used
 *	 to log messages to the console. When run in unit-tests, the messages are
 *	 not logged.  If you wish to test logging, you will need to create a
 *	 mocked logger (e.g. using `simple-mock`) and override in
 *	 `MockRuntime.loadPlugin`.  For more information about the logger, see:
 *	 https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/logging.html
 * @param {*} [options.pluginContext] - The data provided by passing the
 *	 context to `sdk.load(file, actions, { pluginContext })` in `getPlugin`
 *	 in `index.js`.
 * @return {*} The response value (resolves to "next" output, or if the method
 *	 does not define "next", the first defined output).
 */
async function mergeCustomProperties(params, options) {
	let { customProperties, desiredIndexTemplate, actualIndexTemplate, customPropertiesSettings } = params;
	const { logger } = options;
	if (!customProperties) {
		throw new Error('Missing required parameter: customProperties');
	}
	if (!desiredIndexTemplate) {
		throw new Error('Missing required parameter: desiredIndexTemplate');
	}
	if (!desiredIndexTemplate.mappings) {
		throw new Error('Missing mappings properties in desiredIndexTemplate.mappings');
	}
	if (customPropertiesSettings == undefined) {
		customPropertiesSettings = { merge: false };
	}
	if (!customPropertiesSettings.merge) {
		logger.info(`Custom properties are ignore for this template.`);
		return options.setOutput('noUpdate', desiredIndexTemplate);
	}
	if (!customPropertiesSettings.parent) {
		customPropertiesSettings.parent = ""; // Use no parent as default
	}
	
	var updateRequired = false;
	for (var prop in customProperties) {
		if (Object.prototype.hasOwnProperty.call(customProperties, prop)) {
			var customPropertyConfig = customProperties[prop];
			if(addMapping(prop, customPropertyConfig.type, actualIndexTemplate, desiredIndexTemplate, customPropertiesSettings)) {
				if(!updateRequired) updateRequired = true;
			}
		}
	}
	if(!updateRequired) {
		return options.setOutput('noUpdate', desiredIndexTemplate);
	} else {
		return desiredIndexTemplate;
	}

	function addMapping(customPropertyName, type, actualTemplate, desiredTemplate, customPropertiesSettings) {
		if(desiredTemplate == undefined) return false;

		if(actualTemplate != undefined && actualTemplate.mappings != undefined && actualTemplate.mappings.properties[`${customPropertiesSettings.parent}customProperties.${customPropertyName}`] != undefined) {
			options.logger.info(`Mapping for custom property: ${customPropertyName} with parent: "${customPropertiesSettings.parent}" already exists. No update required.`);
			// Take over the actual custom properties mapping!
			desiredTemplate.mappings.properties[`${customPropertiesSettings.parent}customProperties.${customPropertyName}`] = actualTemplate.mappings.properties[`${customPropertiesSettings.parent}customProperties.${customPropertyName}`];
			return false;
		} else {
			options.logger.info(`Update required for custom property: ${customPropertyName} with parent: "${customPropertiesSettings.parent}".`);
			if(type == "custom") {
				desiredTemplate.mappings.properties[`${customPropertiesSettings.parent}customProperties.${customPropertyName}`] = { type: "text", norms: false, fields: { "keyword":  { type: "keyword"} } }; 
			} else {
				desiredTemplate.mappings.properties[`${customPropertiesSettings.parent}customProperties.${customPropertyName}`] = { type: "keyword"};
			}
			return true;
		}
	}
}

module.exports = {
	mergeCustomProperties
};

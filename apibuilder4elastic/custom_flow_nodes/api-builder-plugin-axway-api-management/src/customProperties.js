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
	const { logger } = options;
	if (params.mergeCustomProperties != undefined && params.mergeCustomProperties == "false") {
		return options.setOutput('noUpdate', {message: 'Custom-Properties not merged as mergeCustomProperties is false'});
	}
	if (!params.customProperties) {
		throw new Error('Missing required parameter: customProperties');
	}
	if (!params.desiredIndexTemplate) {
		throw new Error('Missing required parameter: desiredIndexTemplate');
	}
	if (!params.desiredIndexTemplate.mappings) {
		throw new Error('Missing mappings properties in desiredIndexTemplate.mappings');
	}
	var updateRequired = false;
	for (var prop in params.customProperties) {
		if (Object.prototype.hasOwnProperty.call(params.customProperties, prop)) {
			var customPropertyConfig = params.customProperties[prop];
			if(addMapping(prop, customPropertyConfig.type, params.actualIndexTemplate, params.desiredIndexTemplate)) {
				if(!updateRequired) updateRequired = true;
			}
		}
	}
	if(!updateRequired) {
		return options.setOutput('noUpdate', params.desiredIndexTemplate);
	} else {
		return params.desiredIndexTemplate;
	}

	function addMapping(customPropertyName, type, actualTemplate, desiredTemplate) {
		if(desiredTemplate == undefined) return false;
		if(actualTemplate != undefined && actualTemplate.mappings != undefined && actualTemplate.mappings.properties[`custom.${customPropertyName}`] != undefined) {
			options.logger.info(`Mapping for custom property: ${customPropertyName} already exists. No update required.`);
			// Take over the actual custom properties mapping!
			desiredTemplate.mappings.properties[`custom.${customPropertyName}`] = actualTemplate.mappings.properties[`custom.${customPropertyName}`];
			return false;
		} else {
			options.logger.info(`Update required for custom property: ${customPropertyName}.`);
			if(type == "custom") {
				desiredTemplate.mappings.properties[`custom.${customPropertyName}`] = { type: "text", norms: false};
			} else {
				desiredTemplate.mappings.properties[`custom.${customPropertyName}`] = { type: "keyword"};
			}
			return true;
		}
	}
}

module.exports = {
	mergeCustomProperties
};

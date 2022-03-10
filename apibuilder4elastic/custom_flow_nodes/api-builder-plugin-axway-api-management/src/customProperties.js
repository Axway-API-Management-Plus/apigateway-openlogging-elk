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
async function mergeCustomPropertiesIntoIndexTemplate(params, options) {
	let { customProperties, eventLogCustomProperties, desiredIndexTemplate, actualIndexTemplate, customPropertiesSettings } = params;
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
		logger.info(`Custom properties are ignored for this template.`);
		return options.setOutput('noUpdate', desiredIndexTemplate);
	}
	if (!customPropertiesSettings.parent) {
		customPropertiesSettings.parent = ""; // Use no parent as default
	}

	var updateRequired = false;
	// Iterate over all custom properties loaded from API-Manager
	for (var prop in customProperties) {
		if (Object.prototype.hasOwnProperty.call(customProperties, prop)) {
			var customPropertyConfig = customProperties[prop];
			if(addMapping(prop, customPropertyConfig.type, actualIndexTemplate, desiredIndexTemplate, `${customPropertiesSettings.parent}customProperties`)) {
				if(!updateRequired) updateRequired = true;
			}
		}
	}
	// Check, if Event-Log custom properties are configured, which must be merged into the Index-Template
	if(eventLogCustomProperties) {
		// They are provided as a simple command separated string
		const props = eventLogCustomProperties.split(",");
		for (var i = 0; i < props.length; ++i) {
			var prop = props[i].trim();
			// Check, if the type is declared otherwise it will be registered as a keyword
			var type = "keyword";
			if(prop.includes(":")) { // For now, we don't even check the type, it is just custom
				type = "custom";
				prop = prop.split(":")[0];
			}
			if(addMapping(prop, type, actualIndexTemplate, desiredIndexTemplate, `customMsgAtts`)) {
				if(!updateRequired) updateRequired = true;
			}
		}
	}
	if(!updateRequired) {
		return options.setOutput('noUpdate', desiredIndexTemplate);
	} else {
		return desiredIndexTemplate;
	}

	function addMapping(customPropertyName, type, actualTemplate, desiredTemplate, parent) {
		if(desiredTemplate == undefined) return false;

		if(actualTemplate != undefined && actualTemplate.mappings != undefined && actualTemplate.mappings.properties[`${parent}.${customPropertyName}`] != undefined) {
			options.logger.info(`Mapping for custom property: ${customPropertyName} with parent: "${parent}" already exists. No update required.`);
			// Take over the actual custom properties mapping!
			desiredTemplate.mappings.properties[`${parent}.${customPropertyName}`] = actualTemplate.mappings.properties[`${parent}.${customPropertyName}`];
			return false;
		} else {
			options.logger.info(`Update required for custom property: ${customPropertyName} with parent: "${parent}".`);
			if(type == "custom") {
				desiredTemplate.mappings.properties[`${parent}.${customPropertyName}`] = { type: "text", norms: false, fields: { "keyword":  { type: "keyword"} } }; 
			} else {
				desiredTemplate.mappings.properties[`${parent}.${customPropertyName}`] = { type: "keyword"};
			}
			return true;
		}
	}
}

async function mergeCustomPropertiesIntoTransform(params, options) {

	String.prototype.hashCode = function(){
		var hash = 0;
		for (var i = 0; i < this.length; i++) {
			var character = this.charCodeAt(i);
			hash = ((hash<<5)-hash)+character;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	}

	let { customProperties, eventLogCustomProperties, transformBody, transformId, customPropertiesSettings } = params;
	const { logger } = options;
	if (!customProperties) {
		throw new Error('Missing required parameter: customProperties to merge them into the transformation job.');
	}
	if (!transformBody) {
		throw new Error('Missing required parameter: transformBody');
	}
	if (!transformId) {
		throw new Error('Missing required parameter: transformId');
	}
	if (customPropertiesSettings == undefined) {
		customPropertiesSettings = { merge: false };
	}
	if (!customPropertiesSettings.merge) {
		logger.info(`Custom properties are ignored for this transform job.`);
		return options.setOutput('noUpdate', {transformId: transformId, transformBody: transformBody});
	}
	if (!customPropertiesSettings.parent) {
		customPropertiesSettings.parent = ""; // Use no parent as default
	}
	var allCustomPropertyNames = "";
	// Handle custom properties retrieved from API-Manager
	for (var prop in customProperties) {
		transformBody.pivot.group_by[`customProperties.${prop}`] = {"terms": {"field": "finalStatus", "missing_bucket": true}};
		allCustomPropertyNames += `#${prop}`;
	}
	// Check, if Event-Log custom properties are configured, which must be merged into the Index-Template
	if(eventLogCustomProperties) {
		// They are provided as a simple command separated string
		const props = eventLogCustomProperties.split(",");
		for (var i = 0; i < props.length; ++i) {
			var prop = props[i].trim();
			// Check, if the type is declared otherwise it will be registered as a keyword
			var type = "keyword";
			if(prop.includes(":")) { // For now, we don't even check the type, it is just custom
				type = "custom";
				prop = prop.split(":")[0];
			}
			transformBody.pivot.group_by[`customMsgAtts.${prop}`] = {"terms": {"field": "finalStatus", "missing_bucket": true}};
			allCustomPropertyNames += `#${prop}`;
		}
	}
	// No props found at all
	if(allCustomPropertyNames=="") {
		return options.setOutput('noUpdate', {transformId: transformId, transformBody: transformBody});
	}
	return { transformId: createUniqueTransformID(transformId, allCustomPropertyNames), transformBody: transformBody };

	function createUniqueTransformID(transformId, allCustomPropertyNames) {
		var hash = 0;
		for (var i = 0; i < allCustomPropertyNames.length; i++) {
			var character = allCustomPropertyNames.charCodeAt(i);
			hash = ((hash<<5)-hash)+character;
			hash = hash & hash; // Convert to 32bit integer
		}
		return `${transformId}-${hash}`;
	}
}

module.exports = {
	mergeCustomPropertiesIntoIndexTemplate,
	mergeCustomPropertiesIntoTransform
};

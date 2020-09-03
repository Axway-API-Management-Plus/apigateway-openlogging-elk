const APIBuilder = require('@axway/api-builder-runtime');
const request = require('request');
const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

/**
 * Start the API Builder server.
 * @return {Object} The details for the started server.
 * @property {APIBuilder} apibuilder - The API Builder server.
 * @property {Promise} started - The promise that resolves when the server is started.
 */
function startApiBuilder() {
	var server = new APIBuilder({
		logLevel: 'FATAL',
		apikey: 'test',
		APIKeyAuthType: 'basic'
	});

	var startPromise = new Promise((resolve, reject) => {
		server.on('error', reject);
		server.on('started', resolve);
		server.start();
	});

	return {
		apibuilder: server,
		started: startPromise
	};
}

/**
 * Stop the API Builder server.
 * @param {Object} server The object returned from startApiBuilder().
 * @return {Promise} The promise that resolves when the server is stopped.
 */
function stopApiBuilder(server) {
	return new Promise((resolve, reject) => {
		server.started
			.then(() => {
				server.apibuilder.stop(() => {
					APIBuilder.resetGlobal();
					resolve();
				});
			})
			.catch(err => {
				reject(err);
			});
	});
}

function requestAsync(uri, options, cb) {
	if (!cb && options) {
		cb = options;
		options = null;
	}
	return new Promise((resolve, reject) => {
		request(uri, options, (err, response, body) => {
			if (err) {
				return reject(err);
			}
			return resolve({
				response,
				body
			});
		});
	});
}

async function sendToElasticsearch(elasticConfig, index, template, dataset) {
	console.log(`Creating connection to ElasticSearch cluster: ${elasticConfig.node}`)
	const client = new Client({
		node: elasticConfig.node
	});
	const mappingConfig = JSON.parse(fs.readFileSync(`../logstash/index_templates/${template}`)).mappings;
	const createdIndexResponse = await client.indices.create({
		index: index,
		body: {
			mappings: mappingConfig
		}
	}, { ignore: [400] });
	if (createdIndexResponse.statusCode!=200) {
		throw Error(`Error creating index: ${index} with template: ${createdIndexResponse.body.error.reason}`);
	}


	const body = dataset.flatMap(doc => [{ index: { _index: index } }, doc]);
	const { body: bulkResponse } = await client.bulk({ refresh: true, body });

	if (bulkResponse.errors) {
		bulkResponse.items.map(function(element) { 
			if(element.index.error) {
				console.log(JSON.stringify(element.index.error));
			}
		});
		throw Error(`Error inserting test document into index: ${index}.`);
	}
	console.log(`Inserted test data into index: ${index}`);
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

exports = module.exports = {
	startApiBuilder,
	stopApiBuilder,
	requestAsync,
	sendToElasticsearch,
	getRandomInt
};

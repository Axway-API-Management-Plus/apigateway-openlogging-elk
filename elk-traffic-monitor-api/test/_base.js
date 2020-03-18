const APIBuilder = require('@axway/api-builder-runtime');
const request = require('request');
const { Client } = require('@elastic/elasticsearch');

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

async function sendToElasticsearch(index, dataset) {
	const client = new Client({
		node: 'http://localhost:9200'
	});

	await client.indices.create({
		index: index,
		body: {
			mappings: {
				properties: {
					'processInfo.serviceId': { type: 'keyword' },
					'transactionElements.leg0.protocolInfo.http.remoteName': { type: 'keyword' }
				}
			}
		}
	}, { ignore: [400] });

	const body = dataset.flatMap(doc => [{ index: { _index: index } }, doc]);
	const { body: bulkResponse } = await client.bulk({ refresh: true, body });

	if (bulkResponse.errors) {
		console.log(JSON.stringify(bulkResponse.errors));
	}
	console.log(`Inserted tes data into index: ${index}`)
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

const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync, sendToElasticsearch, getRandomInt } = require('../../../_base');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const envLoader = require('dotenv');

describe('Skip Payload', function () {
	this.timeout(30000);
	let server;

	afterEach(() => {
		nock.cleanAll();
	});

	/**
	 * Start API Builder.
	 */
	before(() => {
		process.env.SKIP_PAYLOAD_HANDLING = true;
		server = startApiBuilder();
		return server.started;
	});

	/**
	 * Stop API Builder after the tests.
	 */
	after(() => {
		stopApiBuilder(server);
		delete process.env.SKIP_PAYLOAD_HANDLING;
	});

	describe('Payload handling tests', () => {
		it('[Not-Handled-Payload-0001] Should return 501 as the payload handling is skipped', () => {
			return requestAsync({
				method: 'GET',  // 
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/router/service/instance-1/ops/stream/0455ff5e82267be8182a553d/0/sent`,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(501);
			});
		});
	});
});
	

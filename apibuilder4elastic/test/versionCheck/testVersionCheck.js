const { expect } = require('chai');
const { startApiBuilder, stopApiBuilder, requestAsync } = require('../_base');

describe('Endpoints', function () {
	this.timeout(30000);
	let server;

	/**
	 * Start API Builder.
	 */
	before(() => {
		server = startApiBuilder();
		return server.started;
	});

	/**
	 * Stop API Builder after the tests.
	 */
	after(() => stopApiBuilder(server));

	describe('Check version', () => {
		it('[Check-Version-0001] Should return version issue for Filebeat', () => {
            const filebeatVersion = "1";
            const logstashVersion = "1";
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/version/check?filebeatVersion=${filebeatVersion}&logstashVersion=${logstashVersion}`,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
                expect(body.message).to.equal(`Filebeat version does not match to API-Builder release`);
                expect(body.versionStatus).to.equal(`error`);
			});
        });
        
		it('[Check-Version-0002] Should return version issue for Filebeat', () => {
            const filebeatVersion = "2";
            const logstashVersion = "1";
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/version/check?filebeatVersion=${filebeatVersion}&logstashVersion=${logstashVersion}`,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
                expect(body.message).to.equal(`Logstash version does not match to API-Builder release`);
                expect(body.versionStatus).to.equal(`error`);
			});
        });
        
		it('[Check-Version-0003] Should return version check ok', () => {
            const filebeatVersion = "2";
            const logstashVersion = "3";
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/version/check?filebeatVersion=${filebeatVersion}&logstashVersion=${logstashVersion}`,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
                expect(body.message).to.equal(`Filebeat and Logstash version okay`);
                expect(body.versionStatus).to.equal(`ok`);
			});
        });
        
		it('[Check-Version-0004] Should return 200 with an error status if parameters are missing', () => {
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/version/check`,
				json: true
			}).then(({ response, body }) => {
                expect(response.statusCode).to.equal(200);
                expect(body.message).to.equal(`Filebeat version does not match to API-Builder release`);
                expect(body.versionStatus).to.equal(`error`);
			});
        });
        
		it('[Check-Version-0005] Should return with an error status wit invalid versions', () => {
            const filebeatVersion = "something";
            const logstashVersion = "wrong";
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/elk/v1/api/version/check?filebeatVersion=${filebeatVersion}&logstashVersion=${logstashVersion}`,
				json: true
			}).then(({ response, body }) => {
                expect(response.statusCode).to.equal(200);
                expect(body.message).to.equal(`Filebeat version does not match to API-Builder release`);
                expect(body.versionStatus).to.equal(`error`);
			});
		});
	});
});
const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const fs = require('fs');
const path = require('path');
const nock = require('nock');
const envLoader = require('dotenv');

const envFilePath = path.join(__dirname, '.env-test');
if (fs.existsSync(envFilePath)) {
	envLoader.config({ path: envFilePath });
}

describe('flow-node Authorization', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		process.env.AUTHZ_CONFIG = '../test/testConfig/authorization-config-extAuthZCustom.js';
		plugin = await MockRuntime.loadPlugin(getPlugin);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('authorization');
	});

	after(async () => {
		delete process.env.AUTHZ_CONFIG;
	});

	describe('#externalHTTPAuthZFilter1WithTypeCustom', () => {
		it('should add the filter for ONE APIM-ID', async () => { 
			var user = JSON.parse(fs.readFileSync('./test/mock/noAdminUserObject.json'), null);
			var elasticQuery = JSON.parse(fs.readFileSync('./test/mock/givenElasticQuery.json'), null);
			let expectedQuery = JSON.parse(JSON.stringify(elasticQuery));
			nock('https://external-http:8180').defaultReplyHeaders({'Content-Type': 'application/json; charset=utf-8'})
				.get(`/api/v1/users/anna/groups?registry=AD&caching=false&filter=apg-t`)
				.replyWithFile(200, './test/mock/extAuthZ/response1.json');
			
			const { value, output } = await flowNode.addExternalAuthzFilter1({
				user: user, elasticQuery: elasticQuery
			});
			
			expectedQuery.bool.must.push({
				match: {  "customProperties.field1" : "DGP UIF CSPARTINT CORSOEDMS CORSOLMS TCL" }
			});

			expect(value).to.be.instanceOf(Object);
			expect(value).to.deep.equal(expectedQuery);
			expect(output).to.equal('next');
		});
	});
});

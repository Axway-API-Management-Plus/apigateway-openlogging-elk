const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const fs = require('fs');
const path = require('path');
const nock = require('nock');
const envLoader = require('dotenv');

// Loads environment variables from .env if the file exists
const envFilePath = path.join(__dirname, '.env-test');
if (fs.existsSync(envFilePath)) {
	envLoader.config({ path: envFilePath });
}

describe('flow-node Authorization - All disabled', () => {
	after(async () => {
		delete process.env.AUTHZ_CONFIG;
	});

	describe('#allDisabled', () => {
		it('should return with an error, as no authorization is enabled', async () => {
			process.env.AUTHZ_CONFIG = '../test/testConfig/allAuthZOptionsDisabled.js';
			let plugin = await MockRuntime.loadPlugin(getPlugin);
			plugin.setOptions({ validateOutputs: true });
			let flowNode = plugin.getFlowNode('authorization');

			const { value, output } = await flowNode.switchOnAuthZ({ });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'All user authorization options are disabled, but skipUserAuthorization is not set to true');
			expect(output).to.equal('error');
		});

		it('should return with an skip exit, as the authorization should be skipped', async () => {
			process.env.AUTHZ_CONFIG = '../test/testConfig/authzDisabled.js';
			let plugin = await MockRuntime.loadPlugin(getPlugin);
			plugin.setOptions({ validateOutputs: true });
			let flowNode = plugin.getFlowNode('authorization');
			
			const { value, output } = await flowNode.switchOnAuthZ({ });

			expect(value.getApiManagerUser).to.equal(false);
			expect(output).to.equal('skip');
		});
	});
});

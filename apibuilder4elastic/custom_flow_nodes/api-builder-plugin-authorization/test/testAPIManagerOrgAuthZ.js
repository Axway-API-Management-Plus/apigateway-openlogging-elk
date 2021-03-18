const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const fs = require('fs');
const path = require('path');
const envLoader = require('dotenv');

// Loads environment variables from .env if the file exists
const envFilePath = path.join(__dirname, '.env-test');
if (fs.existsSync(envFilePath)) {
	envLoader.config({ path: envFilePath });
}

describe('flow-node Authorization', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		delete process.env.AUTHZ_CONFIG;
		plugin = await MockRuntime.loadPlugin(getPlugin);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('authorization');
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(plugin).to.be.a('object');
			expect(plugin.getFlowNodeIds()).to.deep.equal([
				'authorization'
			]);
			expect(flowNode).to.be.a('object');

			expect(flowNode.name).to.equal('Authorization');
			expect(flowNode.description).to.equal('Handles the authorization part of the ELK-Based Traffic-Monitor based on different criterias.');
			expect(flowNode.icon).to.be.a('string');
		});

		it('should define valid flow-nodes', () => {
			plugin.validate();
		});
	});

	describe('#apiManagerAuthZFilter', () => {
		it('should return with API-Manager Org output', async () => {
			const { value, output } = await flowNode.switchOnAuthZ({ });

			expect(output).to.equal('org');
		});

		it('should error when missing required parameter', async () => {
			const { value, output } = await flowNode.addApiManagerOrganizationFilter({
				user: null
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: user');
			expect(output).to.equal('error');
		});

		it('should error when missing required parameter', async () => {
			const { value, output } = await flowNode.addApiManagerOrganizationFilter({
				user: { "user": "MyUser"}, elasticQuery: null
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: elasticQuery');
			expect(output).to.equal('error');
		});

		it('should error when parameter user is not an object', async () => {
			const { value, output } = await flowNode.addApiManagerOrganizationFilter({
				user: "A String", elasticQuery: {}
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Parameter: user must be an object');
			expect(output).to.equal('error');
		});

		it('should error when parameter filters is not an array', async () => {
			const { value, output } = await flowNode.addApiManagerOrganizationFilter({
				user: { user: "my user"}, elasticQuery: "A String"
			});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Parameter: elasticQuery must be an object');
			expect(output).to.equal('error');
		});

		it('should leave the query unchanged if the user is an GW-Admin user', async () => {
			var user = JSON.parse(fs.readFileSync('./test/mock/gwAdminUserObject.json'), null);
			var elasticQuery = JSON.parse(fs.readFileSync('./test/mock/givenElasticQuery.json'), null);
			let expectedQuery = JSON.parse(JSON.stringify(elasticQuery));

			const { value, output } = await flowNode.addApiManagerOrganizationFilter({
				user: user, elasticQuery: elasticQuery
			});

			expect(value).to.be.instanceOf(Object);
			expect(value).to.deep.equal(expectedQuery);
			expect(output).to.equal('next');
		});

		it('should add the organization filter for a Non-Admin user to the query', async () => { 
			var user = JSON.parse(fs.readFileSync('./test/mock/noAdminUserObject.json'), null);
			var elasticQuery = JSON.parse(fs.readFileSync('./test/mock/givenElasticQuery.json'), null);
			let expectedQuery = JSON.parse(JSON.stringify(elasticQuery));
			
			const { value, output } = await flowNode.addApiManagerOrganizationFilter({
				user: user, elasticQuery: elasticQuery
			});
			
			expectedQuery.bool.must.push({
				term: {  "serviceContext.apiOrg" : "API Development" }
			});

			expect(value).to.be.instanceOf(Object);
			expect(value).to.deep.equal(expectedQuery);
			expect(output).to.equal('next');
		});

		it('should add the transactionSummary.serviceContext filter for an API-Manager Admin-Users', async () => { 
			var adminUser = JSON.parse(fs.readFileSync('./test/mock/adminUserObject.json'), null);
			var elasticQuery = JSON.parse(fs.readFileSync('./test/mock/givenElasticQuery.json'), null);
			let expectedQuery = JSON.parse(JSON.stringify(elasticQuery));
			
			const { value, output } = await flowNode.addApiManagerOrganizationFilter({
				user: adminUser, elasticQuery: elasticQuery
			});
			
			expectedQuery.bool.must.push({
				bool: {
					should: [
						{ exists: {  "field" : "transactionSummary.serviceContext" } },
						{ exists: {  "field" : "serviceContext" } }
					]
				}
			});

			expect(value).to.be.instanceOf(Object);
			expect(value).to.deep.equal(expectedQuery);
			expect(output).to.equal('next');
		});

		it('should add the organization filter for a Non-Admin user to the query based on the given property', async () => { 
			var user = JSON.parse(fs.readFileSync('./test/mock/noAdminUserObject.json'), null);
			var elasticQuery = JSON.parse(fs.readFileSync('./test/mock/givenElasticQuery.json'), null);
			let expectedQuery = JSON.parse(JSON.stringify(elasticQuery));
			
			const { value, output } = await flowNode.addApiManagerOrganizationFilter({
				user: user, elasticQuery: elasticQuery, indexProperty: "transactionSummary.serviceContext.apiOrg"
			});
			
			expectedQuery.bool.must.push({
				term: {  "transactionSummary.serviceContext.apiOrg" : "API Development" }
			});

			expect(value).to.be.instanceOf(Object);
			expect(value).to.deep.equal(expectedQuery);
			expect(output).to.equal('next');
		});
	});
});

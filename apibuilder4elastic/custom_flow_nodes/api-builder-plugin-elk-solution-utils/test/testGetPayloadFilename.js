const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const fs = require('fs');
const path = require('path');

describe('flow-node elk-solution-utils PayloadFilename', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		process.env.ELASTICSEARCH_HOSTS = "http://any.host.com:9200";
		plugin = await MockRuntime.loadPlugin(getPlugin, {}, {appDir: path.resolve("../..")});
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('elk-solution-utils');
	});

	describe('#getPayloadFilename', () => {
		it('should error when missing required parameter: TrafficDetails', async () => {
			const { value, output } = await flowNode.getPayloadFilename({ trafficDetails: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: trafficDetails');
			expect(output).to.equal('error');
		});
		it('should error when TrafficDetails is not an object', async () => {
			const { value, output } = await flowNode.getPayloadFilename({ trafficDetails: "A string" });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'TrafficDetails must be an object');
			expect(output).to.equal('error');
		});

		it('should error when missing required parameter: correlationId', async () => {
			const { value, output } = await flowNode.getPayloadFilename({ trafficDetails: {}, correlationId: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: correlationId');
			expect(output).to.equal('error');
		});

		it('should error when: legNo is not a number', async () => {
			const { value, output } = await flowNode.getPayloadFilename({ trafficDetails: {}, correlationId: "2817987193" });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: legNo');
			expect(output).to.equal('error');
		});

		it('should error when missing required parameter: direction', async () => {
			const { value, output } = await flowNode.getPayloadFilename({ trafficDetails: {}, correlationId: "2817987193", legNo: "0" });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: direction');
			expect(output).to.equal('error');
		});

		it('should error when parameter: direction has a wrong value', async () => {
			const { value, output } = await flowNode.getPayloadFilename({ trafficDetails: {}, correlationId: "2817987193", legNo: "0", direction: "wrong" });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Parameter: direction must be either sent or received.');
			expect(output).to.equal('error');
		});

		it('should succeed with a valid index name given in params.indexName', async () => {
			var trafficDetails = JSON.parse(fs.readFileSync('./test/trafficDetails/trafficDetails-1.json'), null);
			const { value, output } = await flowNode.getPayloadFilename({ 
				trafficDetails: trafficDetails, 
				correlationId: "0455ff5e82267be8182a553d", 
				legNo: "0", 
				direction: "sent"
			});
			expect(value).to.equal("2020-07-03/08.55/0455ff5e82267be8182a553d-0-sent");
			expect(output).to.equal('next');
		});

		it('should return with not found when using received for leg 0', async () => {
			var trafficDetails = JSON.parse(fs.readFileSync('./test/trafficDetails/trafficDetails-1.json'), null);
			const { value, output } = await flowNode.getPayloadFilename({ 
				trafficDetails: trafficDetails, 
				correlationId: "0455ff5e82267be8182a553d", 
				legNo: "0", 
				direction: "received"
			});
			expect(value).to.equal("No received payload for transaction: 0455ff5e82267be8182a553d on legNo: 0");
			expect(output).to.equal('notFound');
		});

		it('should return received payload for leg 1', async () => {
			var trafficDetails = JSON.parse(fs.readFileSync('./test/trafficDetails/trafficDetails-1.json'), null);
			const { value, output } = await flowNode.getPayloadFilename({ 
				trafficDetails: trafficDetails, 
				correlationId: "0455ff5e82267be8182a553d", 
				legNo: "1", 
				direction: "received"
			});
			expect(value).to.equal("2020-07-03/08.55/0455ff5e82267be8182a553d-1-received");
			expect(output).to.equal('next');
		});

		it('should fail, if the correlationId does not match to the traffic details', async () => {
			var trafficDetails = JSON.parse(fs.readFileSync('./test/trafficDetails/trafficDetails-1.json'), null);
			const { value, output } = await flowNode.getPayloadFilename({ 
				trafficDetails: trafficDetails, 
				correlationId: "WRONG-ID", 
				legNo: "1", 
				direction: "received"
			});
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Traffic-Details correlationID: 0455ff5e82267be8182a553d does not match to correlationId: WRONG-ID');
			expect(output).to.equal('error');
		});
		it('should return received payload for leg 1 based on  the region', async () => {
			var trafficDetails = JSON.parse(fs.readFileSync('./test/trafficDetails/trafficDetails-1.json'), null);
			const { value, output } = await flowNode.getPayloadFilename({ 
				trafficDetails: trafficDetails, 
				correlationId: "0455ff5e82267be8182a553d", 
				legNo: "1", 
				direction: "received", 
				region: "US-DC"
			});
			expect(value).to.equal("us-dc/2020-07-03/08.55/0455ff5e82267be8182a553d-1-received");
			expect(output).to.equal('next');
		});
	});
});

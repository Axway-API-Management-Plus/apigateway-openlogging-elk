const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');

describe('flow-node traffic-monitor-api-utils', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('traffic-monitor-api-utils');
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(plugin).to.be.a('object');
			expect(plugin.getFlowNodeIds()).to.deep.equal([
				'traffic-monitor-api-utils'
			]);
			expect(flowNode).to.be.a('object');
			// Ensure the flow-node matches the spec
			expect(flowNode.name).to.equal('Traffic-Monitor Utils');
			expect(flowNode.icon).to.be.a('string');
		});

		it('should define valid flow-nodes', () => {
			// if this is invalid, it will throw and fail
			plugin.validate();
		});
	});

	describe('#handleFilterFields', () => {
		it('should error when missing required parameter', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: params');
			expect(output).to.equal('error');
		});

		it('should error when the serviceID is missing', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "uri", value: "/v2/pet/findByStatus" } });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: serviceID');
			expect(output).to.equal('error');
		});

		it('should error when the service ID is missing.', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "uri", value: "/v2/pet/findByStatus" }});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: serviceID');
			expect(output).to.equal('error');
		});

		// Example .../search?field=uri&value=/v2/pet/findByStatus
		it('should succeed with only one field and value given', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "uri", value: "/v2/pet/findByStatus" }, serviceID: "instance-1" });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
					  {"match": {"http.uri": { "query": "/v2/pet/findByStatus", "operator": "and" }}},
					  {"exists": {"field": "http"}},
					  {"term": {"processInfo.serviceId": "instance-1"}}
					]}});
		});

		// Example .../search?field=uri&value=/v2/pet/findByStatus&field=method&value=GET
		it('should succeed with valid argument', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: ["uri","method"], value: ["/v2/pet/findByStatus","GET"] }, serviceID: "instance-1" });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
				{"match": {"http.uri": { "query": "/v2/pet/findByStatus", "operator": "and" }}},
				{"match": {"http.method": { "query": "GET" }}},
				{"exists": {"field": "http"}},
				{"term": {"processInfo.serviceId": "instance-1"}}
			  ]}});
		});

		// Example .../search?field=duration&op=gt&value=100
		it('should handle the duration filter', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "duration", op: "gt", value: "100" }, serviceID: "instance-1" });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
				{ exists: { "field": "http"} },
				{ term: {"processInfo.serviceId": "instance-1"}},
				{ range: { "duration": { "gte": "100" } } }
			  ]}});
		});

		// Example .../search?ago=10m
		it('should succeed with an ago filter', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { ago: "10m" }, serviceID: "instance-1" });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');

			expect(value.bool.must[2].range).to.be.a('object');
		});

		// Example .../search?field=timestamp&op=gt&value=1607010000000&field=timestamp&op=lt&value=16070900000000
		it('should succeed with an ago filter', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: ["timestamp", "timestamp"], op: "gt", value: ["1607010000000", "16070900000000"] }, serviceID: "instance-1" });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');

			expect(value).to.deep.equal({ "bool": { "must": [
				{ exists: { "field": "http"} },
				{ term: {"processInfo.serviceId": "instance-1"}},
				{ range: { "@timestamp": { "gte": "1607010000000", "lte": "16070900000000" } } }
			  ]}});
		});

		// This needed, as the fileTransfor data is send different by OpenTraffic then it is required by the Traffic-Monitor
		// Example: .../search?field=servicetype&value=ftps&protocol=filetransfer
		it('should translate given filetransfer into fileTransfer for ES-Query', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "servicetype", value: "ftps", protocol: "filetransfer" }, serviceID: "instance-1" });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');

			expect(value).to.deep.equal({ "bool": { "must": [
				{"match": {"fileTransfer.serviceType": { "query": "ftps" }}},
				{"exists": {"field": "fileTransfer"}},
				{"term": {"processInfo.serviceId": "instance-1"}}
			  ]}});
		});
	});
});

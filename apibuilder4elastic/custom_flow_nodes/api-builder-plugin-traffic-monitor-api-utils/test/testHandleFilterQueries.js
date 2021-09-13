const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const fs = require('fs');

describe('flow-node traffic-monitor-api-utils', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		plugin.setOptions({ validateOutputs: true });
		flowNode = plugin.getFlowNode('traffic-monitor-api-utils');
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

		it('should error when the Gateway-Topology is missing.', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "uri", value: "/v2/pet/findByStatus" }, serviceID: "instance-1", gatewayTopology: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: gatewayTopology');
			expect(output).to.equal('error');
		});

		// Example .../search?field=uri&value=/v2/pet/findByStatus
		it('should succeed with only one field and value given', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "uri", value: "/v2/pet/findByStatus" }, serviceID: "instance-1", gatewayTopology: {} });
			
			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
					  {"match": {"http.uri": { "query": "/v2/pet/findByStatus", "operator": "and" }}},
					  {"exists": {"field": "http"}},
					  {"term": {"processInfo.serviceId": "instance-1"}}
					]}});
		});

		// Example .../search?format=json&field=sslsubject&value=/CN=*.ngrok.io
		it('should succeed with SSL-Subject field and proper value given', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "sslsubject", value: "/CN=*.ngrok.io" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
					  {"match": {"http.sslSubject": { "query": "/CN=*.ngrok.io", "operator": "and" }}},
					  {"exists": {"field": "http"}},
					  {"term": {"processInfo.serviceId": "instance-1"}}
					]}});
		});

		// Example .../search?field=uri&value=/v2/pet/findByStatus&field=method&value=GET
		it('should succeed with multiple filter fields', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { 
				field: ["uri","method", "serviceName", "vhost", "operation"], 
				value: ["/v2/pet/findByStatus","GET", "Petstore A", "api.customer.com", "Get a pet"] }, 
				serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
				{"match": {"http.uri": { "query": "/v2/pet/findByStatus", "operator": "and" }}},
				{"match": {"serviceContext.method": { "query": "Get a pet", "operator": "and" }}},
				{"match": {"http.method": { "query": "GET" }}},
				{"match": {"serviceContext.service": { "query": "Petstore A", "operator": "and" }}},
				{"match": {"http.vhost.text": { "query": "api.customer.com", "operator": "and" }}},
				{"exists": {"field": "http"}},
				{"term": {"processInfo.serviceId": "instance-1"}}
			  ]}});
		});

		// Example .../search?field=duration&op=gt&value=100
		it('should handle the duration filter', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "duration", op: "gt", value: "100" }, serviceID: "instance-1", gatewayTopology: {} });

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
			const { value, output } = await flowNode.handleFilterFields({ params: { ago: "10m" }, serviceID: "instance-1", gatewayTopology: {}, gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');

			expect(value.bool.must[2].range).to.be.a('object');
		});

		// Example .../search?field=timestamp&op=gt&value=1607010000000&field=timestamp&op=lt&value=16070900000000
		it('should succeed with an ago filter', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: ["timestamp", "timestamp"], op: "gt", value: ["1607010000000", "16070900000000"] }, serviceID: "instance-1", gatewayTopology: {} });

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
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "servicetype", value: "ftps", protocol: "filetransfer" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');

			expect(value).to.deep.equal({ "bool": { "must": [
				{"match": {"fileTransfer.serviceType": { "query": "ftps" }}},
				{"exists": {"field": "fileTransfer"}},
				{"term": {"processInfo.serviceId": "instance-1"}}
			  ]}});
		});

		it('should succeed with a direct status filter', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "status", value: "200" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');

			expect(value).to.deep.equal({ "bool": { "must": [
				{ range: {"http.status": { "gte": 200, "lte": 200 }}},
				{ exists: { "field": "http"} },
				{ term: {"processInfo.serviceId": "instance-1"}}
			  ]}});
		});

		it('should succeed with a 2xx status filter', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "status", value: "2xx" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');

			expect(value).to.deep.equal({ "bool": { "must": [
				{ range: {"http.status": { "gte": 200, "lte": 299 }}},
				{ exists: { "field": "http"} },
				{ term: {"processInfo.serviceId": "instance-1"}}
			  ]}});
		});

		it('should succeed with a negated direct 200 status filter', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "status", value: "!200" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');

			expect(value).to.deep.equal({ "bool": 
			{ "must": [
				{ exists: { "field": "http"} },
				{ term: {"processInfo.serviceId": "instance-1"}}
			],
			"must_not": [
				{ range: {"http.status": { "gte": 200, "lte": 200 }}},
			]}}
			);
		});

		it('should succeed with a negated direct 200 status filter', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "status", value: "!2xx" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');

			expect(value).to.deep.equal({ "bool": 
			{ "must": [
				{ exists: { "field": "http"} },
				{ term: {"processInfo.serviceId": "instance-1"}}
			],
			"must_not": [
				{ range: {"http.status": { "gte": 200, "lte": 299 }}}
			]}
			});
		});

		it('should fail with an invalid status code filter (too long)', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "status", value: "!2xx6" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Unsupported status code filter: !2xx6');
			expect(output).to.equal('error');
		});

		it('should fail with an invalid status code filter (invalid characters)', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "status", value: "!2ZZ" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Unsupported status code filter: !2ZZ');
			expect(output).to.equal('error');
		});

		// See issue: https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/114
		it('query should INCLUDE a wildcard for other service-IDs and an EXCLUDE for still active Service-IDs', async () => {
			var topology = JSON.parse(fs.readFileSync('./test/mockedReplies/emtTopology.json'), null);
			const { value, output } = await flowNode.handleFilterFields({ params: {}, serviceID: "traffic-7cb4f6989f-first", gatewayTopology: topology });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { 
				"must": [
					  {"exists": {"field": "http"}},
					  {"bool": {
						  "should": [ 
							{
								"term": { "processInfo.serviceId": "traffic-7cb4f6989f-first"}
							},
							{
								"match": { "processInfo.serviceId.text": "traffic-" }
							}
						 ] }
					  }
					],
				"must_not": [
					{
						"term": { "processInfo.serviceId": "traffic-7cb4f6989f-second" }
					},
					{
						"term": { "processInfo.serviceId": "traffic-7cb4f6989f-third" }
					}
				]
				}});
		});

		// See issue: https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/114
		it('query should NOT INCLUDE a wildcard for other service-IDs', async () => {
			var topology = JSON.parse(fs.readFileSync('./test/mockedReplies/emtTopology.json'), null);
			const { value, output } = await flowNode.handleFilterFields({ params: {}, serviceID: "traffic-7cb4f6989f-second", gatewayTopology: topology });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { 
				"must": [
					  {"exists": {"field": "http"}},
					  { term: {"processInfo.serviceId": "traffic-7cb4f6989f-second"}}
					]
				}});
		});

		// Test JMS - Filter fields

		// Example .../search?format=json&field=leg,jmsDeliveryMode&value=0,2&protocol=jms
		it('should succeed with a JMS-Search based on the JMS-DeliveryMode set to PERSISTENT (2)', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "jmsDeliveryMode", value: "2", protocol: "jms" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
					  {"match": {"jms.jmsDeliveryMode": { "query": "2" }}},
					  {"exists": {"field": "jms"}},
					  {"term": {"processInfo.serviceId": "instance-1"}}
					]}});
		});

		// Example .../search?format=json&field=leg,jmsDestination&value=0,6543643&count=1000&ago=24h&protocol=jms
		it('should succeed with a JMS-Search based on the JMS-Destination', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "jmsDestination", value: "6543643", protocol: "jms" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
					  {"match": {"jms.jmsDestination": { "query": "6543643" }}},
					  {"exists": {"field": "jms"}},
					  {"term": {"processInfo.serviceId": "instance-1"}}
					]}});
		});

		// Example .../search?format=json&field=leg,jmsMessageID&value=0,423423&count=1000&ago=24h&protocol=jms
		it('should succeed with a JMS-Search based on the JMS-MessageID', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "jmsMessageID", value: "Some-JMS-Message-ID", protocol: "jms" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
					  {"match": {"jms.jmsMessageID": { "query": "Some-JMS-Message-ID" }}},
					  {"exists": {"field": "jms"}},
					  {"term": {"processInfo.serviceId": "instance-1"}}
					]}});
		});

		// Example .../search?format=json&field=leg,jmsPriority&value=0,6&count=1000&ago=24h&protocol=jms
		it('should succeed with a JMS-Search based on the JMS-Priority', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "jmsPriority", value: "6", protocol: "jms" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
					  {"match": {"jms.jmsPriority": { "query": "6" }}},
					  {"exists": {"field": "jms"}},
					  {"term": {"processInfo.serviceId": "instance-1"}}
					]}});
		});
		
		// Example .../search?format=json&field=leg,jmsRedelivered&value=0,787&count=1000&ago=24h&protocol=jms
		it('should succeed with a JMS-Search based on the JMS-Redelivered value', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "jmsRedelivered", value: "99", protocol: "jms" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
					  {"match": {"jms.jmsRedelivered": { "query": "99" }}},
					  {"exists": {"field": "jms"}},
					  {"term": {"processInfo.serviceId": "instance-1"}}
					]}});
		});

		// Example .../search?format=json&field=leg,jmsReplyTojmsReplyTo&value=0,ABC&count=1000&ago=24h&protocol=jms
		it('should succeed with a JMS-Search based on the JMS-ReplyTo value', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "jmsReplyTojmsReplyTo", value: "ABC", protocol: "jms" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
					  {"match": {"jms.jmsReplyTo": { "query": "ABC" }}},
					  {"exists": {"field": "jms"}},
					  {"term": {"processInfo.serviceId": "instance-1"}}
					]}});
		});

		// Example .../search?format=json&field=leg,jmsStatus&value=0,Success&count=1000&ago=24h&protocol=jms
		it('should succeed with a JMS-Search based on the JMS-Status value', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "jmsStatus", value: "Success", protocol: "jms" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
					  {"match": {"jms.jmsStatus": { "query": "Success" }}},
					  {"exists": {"field": "jms"}},
					  {"term": {"processInfo.serviceId": "instance-1"}}
					]}});
		});

		// Example .../search?format=json&field=leg,jmsType&value=0,3312&count=1000&ago=24h&protocol=jms
		it('should succeed with a JMS-Search based on the JMS-Type value', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { field: "jmsType", value: "3312", protocol: "jms" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
					  {"match": {"jms.jmsType": { "query": "3312" }}},
					  {"exists": {"field": "jms"}},
					  {"term": {"processInfo.serviceId": "instance-1"}}
					]}});
		});

		// Example .../search?format=json&field=leg&value=0&jmsPropertyName=propertyA&jmsPropertyValue=propertyAValue&protocol=jms
		it('should succeed with a JMS-Search based on a JMS-Property', async () => {
			const { value, output } = await flowNode.handleFilterFields({ params: { jmsPropertyName: "propertyA", jmsPropertyValue: "propertyAValue", protocol: "jms" }, serviceID: "instance-1", gatewayTopology: {} });

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			expect(value).to.deep.equal({ "bool": { "must": [
				{"exists": {"field": "jms"}},
				{"term": {"processInfo.serviceId": "instance-1"}},
				{"match": {"recvHeader": { 
					"query": "propertyA propertyAValue", 
					"operator": "and" 
				}}}		
			]}});
		});
	});
});

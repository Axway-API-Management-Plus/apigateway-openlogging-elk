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

	describe('#transactionElementGetInfo', () => {
		it('should error when required parameter transactionElements is missing', async () => {
			const { value, output } = await flowNode.getTransactionElementLegInfo({ transactionElements: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: transactionElements');
			expect(output).to.equal('error');
		});

		it('should error when required parameter legIdParam is missing', async () => {
			const { value, output } = await flowNode.getTransactionElementLegInfo({ transactionElements: {}, legIdParam: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: legIdParam');
			expect(output).to.equal('error');
		});

		it('should error when required parameter detailsParam is missing', async () => {
			const { value, output } = await flowNode.getTransactionElementLegInfo({ transactionElements: {}, legIdParam: "*", detailsParam: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: detailsParam');
			expect(output).to.equal('error');
		});

		it('should error when required parameter sheadersParam is missing', async () => {
			const { value, output } = await flowNode.getTransactionElementLegInfo({ transactionElements: {}, legIdParam: "*", detailsParam: 1, sheadersParam: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: sheadersParam');
			expect(output).to.equal('error');
		});

		it('should error when required parameter rheadersParam is missing', async () => {
			const { value, output } = await flowNode.getTransactionElementLegInfo({ transactionElements: {}, legIdParam: "*", detailsParam: 1, sheadersParam: 0, rheadersParam: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: rheadersParam');
			expect(output).to.equal('error');
		});

		it('should error when required parameter correlationId is missing', async () => {
			const { value, output } = await flowNode.getTransactionElementLegInfo({ transactionElements: {}, legIdParam: "*", detailsParam: 1, sheadersParam: 0, rheadersParam: 1, correlationId: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: correlationId');
			expect(output).to.equal('error');
		});

		it('should error when required parameter timestamp is missing', async () => {
			const { value, output } = await flowNode.getTransactionElementLegInfo({ transactionElements: {}, legIdParam: "*", detailsParam: 1, sheadersParam: 0, rheadersParam: 1, correlationId: "312321312321", timestamp: null });

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: timestamp');
			expect(output).to.equal('error');
		});

		it('should succeed with a simple 2-Leg Transaction-Elements', async () => {
			var testTransactionElements = JSON.parse(fs.readFileSync('./test/documents/transactionElementTwoLegs.json'), null);
			const { value, output } = await flowNode.getTransactionElementLegInfo(
				{ transactionElements: testTransactionElements, legIdParam: "*", detailsParam: 1, sheadersParam: 1, rheadersParam: 1, correlationId: "312321312321", timestamp: "2020-07-03T15:56:11.597Z" }
			);

			expect(output).to.equal('next');
			expect(value).to.be.a('array');
			expect(value).to.have.lengthOf(2); // Two legs are expected
			// Check details of the leg: 0 (First leg)
			expect(value[0]).to.be.a('object');
			expect(value[0].details).to.be.a('object');
			expect(value[0].details.leg).to.equal(0);
			expect(value[0].details.correlationId).to.equal('312321312321');
			expect(value[0].details.uri).to.equal('/ars/api/todos');
			expect(value[0].details.status).to.equal(200);
			expect(value[0].details.statustext).to.equal('OK');
			expect(value[0].details.method).to.equal('GET');
			expect(value[0].details.vhost).to.equal(null);
			expect(value[0].details.wafStatus).to.equal(0);
			expect(value[0].details.bytesSent).to.equal(952);
			expect(value[0].details.bytesReceived).to.equal(131);
			expect(value[0].details.remoteName).to.equal('192.168.233.1');
			expect(value[0].details.remoteAddr).to.equal('192.168.233.1');
			expect(value[0].details.localAddr).to.equal('192.168.233.137');
			expect(value[0].details.remotePort).to.equal('55783');
			expect(value[0].details.localPort).to.equal('8065');
			//expect(value[0].details.sslsubject).to.equal(null);
			expect(value[0].details.timestamp).to.equal(1593791771597);
			expect(value[0].details.duration).to.equal(384);
			expect(value[0].details.subject).to.equal('Pass Through');
			expect(value[0].details.type).to.equal('http');
			expect(value[0].details.finalStatus).to.equal('Pass');
			// Check the receivedHeaders 
			expect(value[0].rheaders).to.be.a('array');
			expect(value[0].rheaders[0]).to.deep.equal({host: 'api-env.demo.axway.com:8065'});
			expect(value[0].rheaders[1]).to.deep.equal({'user-agent': 'loadtest/5.0.3'});
			expect(value[0].sheaders).to.be.a('array');
			expect(value[0].sheaders[0]).to.deep.equal({'Max-Forwards': '20'});
			expect(value[0].sheaders[1]).to.deep.equal({'Via': '1.0 api-env (Gateway)'});
			// Check a few details of the second leg
			expect(value[1].details.leg).to.equal(1);
			expect(value[1].details.correlationId).to.equal('312321312321');
			expect(value[1].rheaders).to.be.a('array');
			expect(value[1].rheaders[0]).to.deep.equal({server: 'API Builder/4.27.29'});
			expect(value[1].rheaders[1]).to.deep.equal({'request-id': 'e923342a-cf72-4c93-a774-78d1fa80c002'});
			expect(value[1].sheaders).to.be.a('array');
			expect(value[1].sheaders[0]).to.deep.equal({'Host': '79f6a7dbf03ba9dc3fcdda2486d26adfab68584e.cloudapp-enterprise.appcelerator.com'});
			expect(value[1].sheaders[1]).to.deep.equal({'Max-Forwards': "20"});
		});

		it('should return only ONE selected Leg as an Object based on a simple 2-Leg Transaction-Elements', async () => {
			var testTransactionElements = JSON.parse(fs.readFileSync('./test/documents/transactionElementTwoLegs.json'), null);
			const { value, output } = await flowNode.getTransactionElementLegInfo(
				{ transactionElements: testTransactionElements, legIdParam: "1", detailsParam: 1, sheadersParam: 1, rheadersParam: 1, correlationId: "312321312321", timestamp: "2020-07-03T15:56:11.597Z"  }
			);

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			// Check some properties of the returned object
			expect(value.details.leg).to.equal(1);
			expect(value.details.correlationId).to.equal('312321312321');
			expect(value.details.uri).to.equal('/api/todos');
		});

		it('should return only ONE selected Leg as an Object without any details', async () => {
			var testTransactionElements = JSON.parse(fs.readFileSync('./test/documents/transactionElementTwoLegs.json'), null);
			const { value, output } = await flowNode.getTransactionElementLegInfo(
				{ transactionElements: testTransactionElements, legIdParam: "1", detailsParam: 0, sheadersParam: 1, rheadersParam: 1, correlationId: "312321312321", timestamp: "2020-07-03T15:56:11.597Z"  }
			);

			expect(output).to.equal('next');
			expect(value).to.be.a('object');
			// Check some properties of the returned object
			expect(value.details).to.equal(null);
		});

		it('should return only ONE selected Leg as an Object without any details', async () => {
			var testTransactionElements = JSON.parse(fs.readFileSync('./test/documents/transactionElementThreeLegsTwoJMS.json'), null);
			const { value, output } = await flowNode.getTransactionElementLegInfo(
				{ transactionElements: testTransactionElements, legIdParam: "*", detailsParam: 1, sheadersParam: 1, rheadersParam: 1, correlationId: "312321312321", timestamp: "2020-07-03T15:56:11.597Z"  }
			);

			expect(output).to.equal('next');
			expect(value).to.be.a('array');
			expect(value).to.have.lengthOf(3); // Three legs are expected (Leg-1 and Leg-2 are the JMS-Legs)
			expect(value[0]).to.be.a('object');
			expect(value[0].details).to.be.a('object');
			expect(value[0].details.leg).to.equal(0);
			expect(value[0].details.type).to.equal('http');
			expect(value[0].details.correlationId).to.equal('312321312321');
			expect(value[0].details.uri).to.equal('/api/FreightTiger/TripStatusService/v1/tripCompleted');
			// Check the first JMS-Leg
			expect(value[1]).to.be.a('object');
			expect(value[1].details).to.be.a('object');
			expect(value[1].details.leg).to.equal(1);
			expect(value[1].details.type).to.equal('jms');
			expect(value[1].details.correlationId).to.equal('312321312321');
			expect(value[1].details.jmsDestination).to.equal('queue://com.customer.msg.ABCZZ.TEST.FreightTiger.TripStatusService_OQ');
			expect(value[1].details.jmsPriority).to.equal(4);
			expect(value[1].details.jmsRedelivered).to.equal(0);
			// Check the second JMS-Leg
			expect(value[2]).to.be.a('object');
			expect(value[2].details).to.be.a('object');
			expect(value[2].details.leg).to.equal(2);
			expect(value[2].details.type).to.equal('jms');
			expect(value[2].details.correlationId).to.equal('312321312321');
			expect(value[2].details.jmsType).to.equal('BytesMessage');
		});

		it('should return without any error, when RecvHeader is missing for the JMS legs 2 and 3', async () => {
			var testTransactionElements = JSON.parse(fs.readFileSync('./test/documents/transactionElementMissingRecvHeader.json'), null);
			const { value, output } = await flowNode.getTransactionElementLegInfo(
				{ transactionElements: testTransactionElements, legIdParam: "*", detailsParam: 1, sheadersParam: 1, rheadersParam: 1, correlationId: "312321312321", timestamp: "2020-07-03T15:56:11.597Z"  }
			);

			expect(output).to.equal('next');
			expect(value).to.be.a('array');
			expect(value).to.have.lengthOf(3); // Three legs are expected (Leg-1 and Leg-2 are the JMS-Legs)
			expect(value[0]).to.be.a('object');
			expect(value[0].rheaders).to.be.a('array');
			expect(value[0].rheaders[0]).to.deep.equal({host: 'internal.eu-central-1.elb.amazonaws.com:8080'});
			expect(value[0].rheaders[1]).to.deep.equal({BDID: '12345'});
			expect(value[0].sheaders).to.be.a('array');
			expect(value[0].sheaders[0]).to.deep.equal({'Date': 'Wed, 17 Mar 2021 14:27:52 GMT'});
			expect(value[0].sheaders[1]).to.deep.equal({'Server': ""});

			expect(value[1]).to.be.a('object');
			expect(value[1].rheaders).to.equal(null); // No headers given for the JMS-Leg
			expect(value[1].sheaders).to.be.a('array');
			expect(value[1].sheaders[0]).to.deep.equal({'Host': 'lacoste-apm-global-frc-uat.azure-api.net'});
			expect(value[1].sheaders[1]).to.deep.equal({'Max-Forwards': "20"});

			expect(value[2]).to.be.a('object');
			expect(value[2].rheaders).to.equal(null); // No headers given for the JMS-Leg
			expect(value[2].sheaders).to.be.a('array');
			expect(value[2].sheaders[0]).to.deep.equal({'Host': 'lacoste-apm-global-frc-uat.azure-api.net'});
			expect(value[2].sheaders[1]).to.deep.equal({'Max-Forwards2': "28"});
		});

		it('should return without any error, when having an unsupported protocol', async () => {
			var testTransactionElements = JSON.parse(fs.readFileSync('./test/documents/transactionElementTwoLegsUnsuppProtocol.json'), null);
			const { value, output } = await flowNode.getTransactionElementLegInfo(
				{ transactionElements: testTransactionElements, legIdParam: "*", detailsParam: 1, sheadersParam: 1, rheadersParam: 1, correlationId: "312321312321", timestamp: "2020-07-03T15:56:11.597Z"  }
			);
			expect(output).to.equal('next');
			expect(value).to.be.a('array');
			expect(value).to.have.lengthOf(2);
			expect(value[0]).to.be.a('object');
			expect(value[0].details).to.be.a('object');
			expect(value[0].details.leg).to.equal(0);
			expect(value[0].details.bytesReceived).to.equal(undefined); // Unexpected as the protocolInfo was unsupported

			expect(value[0].rheaders).to.be.a('array');
			expect(value[0].rheaders[0]).to.deep.equal({host: 'api-env.demo.axway.com:8065'});
			expect(value[0].rheaders[1]).to.deep.equal({'user-agent': 'loadtest/5.0.3'});
			expect(value[0].sheaders).to.be.a('array');
			expect(value[0].sheaders[0]).to.deep.equal({'Max-Forwards': '20'});
			expect(value[0].sheaders[1]).to.deep.equal({'Via': "1.0 api-env (Gateway)"});

			expect(value[1].details).to.be.a('object');
			expect(value[1].details.leg).to.equal(1);
			expect(value[1].details.bytesReceived).to.equal(879);
			
			expect(value[1].rheaders).to.be.a('array');
			expect(value[1].rheaders[0]).to.deep.equal({server: 'API Builder/4.27.29'});
			expect(value[1].rheaders[1]).to.deep.equal({'request-id': 'e923342a-cf72-4c93-a774-78d1fa80c002'});
			expect(value[1].sheaders).to.be.a('array');
			expect(value[1].sheaders[0]).to.deep.equal({'Host': '79f6a7dbf03ba9dc3fcdda2486d26adfab68584e.cloudapp-enterprise.appcelerator.com'});
			expect(value[1].sheaders[1]).to.deep.equal({'Max-Forwards': "20"});
		});
	});
});

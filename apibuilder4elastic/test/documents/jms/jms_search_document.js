const getDate = require('../../util');

module.exports = [
    // Two sample documents stored in the Traffic-Summary index for a JMS-Request
    {
        "@timestamp": "2021-06-30T08:11:21.215Z",
        "correlationId": "2927dc60e52ae8c48fb505da",
        "finalStatus": "Pass",
        "duration": 2296,
        "jms": {
          "jmsMessageID": "ID:interface1-36199-1623824816079-189:755:1:1:1",
          "jmsCorrelationID": "",
          "jmsDestination": "queue://com.customer.APPLIC.msg.WWSWO.PROD.P44.ShipmentService_IQ",
          "jmsProviderURL": "local",
          "jmsDeliveryMode": 2,
          "jmsPriority": 4,
          "jmsReplyTo": "",
          "jmsRedelivered": 0,
          "jmsTimestamp": 1625040681191,
          "jmsExpiration": 0,
          "jmsType": "TextMessage",
          "jmsStatus": "Success",
          "jmsStatusText": null,
          "authSubjectId": null
        },
        "processInfo": {
          "gatewayName": "API-Gateway 3",
          "gatewayRegion": "US",
          "groupId": "group-2",
          "groupName": "Back",
          "hostname": "api-back-11",
          "serviceId": "instance-1",
          "version": "7.7.20201130"
        },
        "serviceContext": {
          "method": "ShipmentService",
          "service": "ShipmentService"
        },
        "type": "summaryIndex"
      }, 
      {
        "@timestamp": "2021-06-30T08:12:21.215Z",
        "correlationId": "222222222222222222222222",
        "finalStatus": "Pass",
        "duration": 2296,
        "jms": {
          "jmsMessageID": "ID:interface1-36199-1111111111111-189:755:1:1:1",
          "jmsCorrelationID": "A-JMS-Correlation-ID",
          "jmsDestination": "queue://com.customer.APPLIC.msg.WWSWO.PROD.P44.XXX_ShipmentService",
          "jmsProviderURL": "remote",
          "jmsDeliveryMode": 185,
          "jmsPriority": 4,
          "jmsReplyTo": "A-Sample-Reply-To",
          "jmsRedelivered": 800,
          "jmsTimestamp": 1625040681291,
          "jmsExpiration": 0,
          "jmsType": "TextMessageToTestWith",
          "jmsStatus": "SuccessToTest",
          "jmsStatusText": "A great status text",
          "authSubjectId": "A test subject id"
        },
        "processInfo": {
          "gatewayName": "API-Gateway 3",
          "gatewayRegion": "US",
          "groupId": "group-2",
          "groupName": "Back",
          "hostname": "api-back-11",
          "serviceId": "instance-1",
          "version": "7.7.20201130"
        },
        "serviceContext": {
          "method": "ShipmentService",
          "service": "ShipmentService"
        },
        "type": "summaryIndex"
      }
]
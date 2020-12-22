const getDate = require('../../util');

module.exports = [
    {
        "@timestamp": getDate('120h'),
        "correlationId": "OPTIONS-CALL-EU",
        "type": "summaryIndex",
        "duration": 2,
        "processInfo": {
            "hostname": "api-env",
            "groupId": "group-2",
            "groupName": "QuickStart Group",
            "serviceId": "instance-2",
            "version": "7.7.20200730",
            "gatewayName": "API-Gateway 3",
            "gatewayRegion": "EU"
        },
        "http": {
            "status": 200,
            "statusText": "OK",
            "method": "OPTIONS",
            "uri": "/WebShop.svc",
            "vhost": null,
            "wafStatus": 0,
            "bytesSent": 212,
            "bytesReceived": 477,
            "remoteName": "192.168.65.1",
            "remoteAddr": "192.168.65.1",
            "localAddr": "192.168.65.133",
            "remotePort": "60041",
            "localPort": "8065",
            "sslSubject": null,
            "authSubjectId": null
        }
    }
];
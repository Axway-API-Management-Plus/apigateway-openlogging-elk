const getDate = require('../../util');

module.exports = [
    {
        "correlationId": "7a240f5f0e21555d2d343482",
        "processInfo": {
            "hostname": "api-env",
            "groupName": "DefaultGroup",
            "serviceName": "traffic-7cb4f6989f-bjw8n",
            "version": "7.7.20200130",
            "groupId": "DefaultGroup",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "traffic-7cb4f6989f-bjw8n"
        },
        "@timestamp": getDate('15m'),
        "logtype": "openlog",        
        "path": "/favicon.ico",
        "protocol": "https",
        "serviceContext": null,
        "duration" : 55,
        "finalStatus" : "Fail", 
        "http": {
            "protocolSrc": "8065",
            "uri": "/favicon.ico",
            "statusText": "Not Found",
            "status": 404,
            "method": "GET", 
            "bytesSent": 834, 
            "bytesReceived": 747,
            "localPort": 8065,
            "localAddr" : "192.168.65.129",
            "remoteName" : "192.168.65.1",
            "remoteAddr": "192.168.65.1",
            "remotePort" : 59641,
            "wafStatus": 1,
            "vhost": "api.customer.com:443"
        }
    },
    {
        "@timestamp": getDate('120h'),
        "correlationId": "c0df605fa2047bebbOPTIONS",
        "type": "summaryIndex",
        "duration": 2,
        "processInfo": {
            "hostname": "api-env",
            "groupName": "DefaultGroup",
            "serviceName": "traffic-7cb4f6989f-jbmf7",
            "version": "7.7.20200130",
            "groupId": "DefaultGroup",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "traffic-7cb4f6989f-jbmf7"
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
            "sslSubject": "null",
            "authSubjectId": null
        }
    },
    // Transaction from a Service already gone, should be included when using the first Service-ID
    {
        "correlationId": "19250f5f4321b5ba2a4de364",
        "processInfo": {
            "hostname": "api-env",
            "groupName": "DefaultGroup",
            "serviceName": "traffic-7cb4f6989f-GONE",
            "version": "7.7.20200130",
            "groupId": "DefaultGroup",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "traffic-7cb4f6989f-GONE"
        },
        "@timestamp": getDate('65m'),
        "logtype": "openlog",
        "path": "/healthcheck",
        "protocol": "http",
        "serviceContext": null,
        "protocolSrc": "8080",
        "status": "success",
        "finalStatus" : "Error",
        "duration" : 22,
        "http": {
            "statusText": "OK",
            "uri": "/healthcheck",
            "status": 200,
            "method": "GET", 
            "bytesSent": 661, 
            "bytesReceived": 563,
            "localPort": 8080,
            "authSubjectId" : "Chris-Test",
            "localAddr" : "1.1.1.1",
            "remoteName" : "TestHost",
            "remoteAddr": "192.168.65.1",
            "remotePort" : 78786,
            "wafStatus" : 0
        }
    }
];
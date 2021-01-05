const getDate = require('../../util');

module.exports = [
    // Sample not found request - 15 minutes
    {
        "correlationId": "7a240f5f0e21555d2d343482",
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
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
            "remotePort" : 59641,
            "wafStatus": 1,
            "vhost": "api.customer.com:443"
        },
        "customProperties": {
            "field1": "CORSOLMS"
        }
    },
    // Find Pets by status on instance-2 - OPTIONS Call - 120 hours ago - Instance-2
    {
        "@timestamp": getDate('120h'),
        "correlationId": "c0df605fa2047bebbOPTIONS",
        "type": "summaryIndex",
        "duration": 2,
        "processInfo": {
            "hostname": "api-env",
            "groupId": "group-2",
            "groupName": "QuickStart Group",
            "serviceId": "instance-2",
            "version": "7.7.20200730",
            "gatewayName": "API-Gateway 3",
            "gatewayRegion": "US"
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
    },
    // Healthcheck call - 65 minutes 
    {
        "correlationId": "19250f5f4321b5ba2a4de364",
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "serviceId": "instance-1",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "groupId": "group-2"
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
            "remotePort" : 78786,
            "wafStatus" : 0
        },
        "customProperties": {
            "field1": "DGP"
        }
    },
    // Another healthcheck - 30000 hours ago
    {
        "correlationId": "b8250f5f7a2195dc1581d52c",
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "version": "7.7.20200130",
            "serviceName": "QuickStart Server",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
        },
        "@timestamp": getDate('3000h'),
        "logtype": "openlog",
        "path": "/healthcheck",
        "protocol": "http",
        "serviceContext": null,
        "protocolSrc": "8080",
        "status": "success",
        "finalStatus" : "Pass", 
        "duration" : 11,
        "http": {
            "statusText": "OK",
            "uri": "/healthcheck",
            "status": 200,
            "method": "GET", 
            "bytesSent": 661, 
            "bytesReceived": 563,
            "localPort": 8080,
            "localAddr" : "192.168.65.129",
            "remoteName" : "192.168.65.1",
            "remotePort" : 65392,
            "wafStatus" : 0 
        },
        "customProperties": {
            "field1": "MAAS"
        }
    },
    // Get Pet by ID GET Call - 8 minutes ago
    {

        "correlationId" : "682c0f5fbe23dc8e1d80efe2",
        "processInfo" : {
            "hostname" : "api-env",
            "groupName" : "QuickStart Group",
            "serviceName" : "QuickStart Server",
            "version" : "7.7.20200130",
            "groupId" : "group-2",
            "domainId" : "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId" : "instance-1"
          },
        "@timestamp" : getDate('8m'),
        "logtype" : "openlog",
        "finalStatus" : "Pass",
        "path" : "/petstore/v2/pet/findByStatus",
        "protocol" : "https",
        "duration" : 102,
        "status" : "success",
        "serviceContext" : {
            "duration" : 897,
            "app" : "Client App",
            "method" : "findPetsByStatus",
            "org" : "API Development",
            "service" : "Petstore",
            "client" : "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
            "monitor" : true,
            "status" : "success",
            "apiOrg": "API Development", 
            "apiVersion": "1.0.5", 
            "apiDeprecated": false, 
            "apiState": "published"
        },
        "http": {
            "protocolSrc" : "8065",
            "uri" : "/petstore/v2/pet/findByStatus",
            "wafStatus" : 0,
            "authSubjectId" : "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
            "wafStatus" : 0,
            "statusText": "OK",
            "status": 200,
            "method": "GET", 
            "bytesSent": 47925, 
            "bytesReceived": 437,
            "localPort": 8065,
            "localAddr" : "192.168.65.129",
            "remoteName" : "192.168.65.1",
            "remotePort" : 50982
        }
      },
      // Slightly different API
      {

        "correlationId" : "11111111111111111111111111",
        "processInfo" : {
            "hostname" : "api-env",
            "groupName" : "QuickStart Group",
            "serviceName" : "QuickStart Server",
            "version" : "7.7.20200130",
            "groupId" : "group-2",
            "domainId" : "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId" : "instance-1"
          },
        "@timestamp" : getDate('5m'),
        "logtype" : "openlog",
        "finalStatus" : "Pass",
        "path" : "/petstore/v2/pet/findByTag",
        "protocol" : "https",
        "duration" : 102,
        "status" : "success",
        "serviceContext" : {
            "duration" : 897,
            "app" : "Client App",
            "method" : "findPetsByTag",
            "org" : "API Development",
            "service" : "Petstore",
            "client" : "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
            "monitor" : true,
            "status" : "success",
            "apiOrg": "API Development", 
            "apiVersion": "1.0.5", 
            "apiDeprecated": false, 
            "apiState": "published"
        },
        "http": {
            "protocolSrc" : "8065",
            "uri" : "/petstore/v2/pet/findByTag",
            "wafStatus" : 0,
            "authSubjectId" : "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
            "wafStatus" : 0,
            "statusText": "OK",
            "status": 200,
            "method": "GET", 
            "bytesSent": 47925, 
            "bytesReceived": 437,
            "localPort": 8065,
            "localAddr" : "192.168.65.129",
            "remoteName" : "192.168.65.1",
            "remotePort" : 50982
        }
      }
];
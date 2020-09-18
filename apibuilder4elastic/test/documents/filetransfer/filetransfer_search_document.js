const getDate = require('../../util');

module.exports = [
    // Sample File-Transfer request (serviceType: ftp)
    {
        "@timestamp": "2020-09-02T20:10:50.348Z",
        "correlationId": "4afc4f5fa70015d93db3a15c",
        "finalStatus": "Pass",
        "duration": 924,
        "path": null,
        "protocol": "ftp-local",
        "protocolSrc": "10021//opt/Axway/APIM-7.7.0/apigateway/groups/group-2/instance-1/file-transfer/in/persistent/abc",
        "serviceContext": null,
        "fileTransfer": {
            "remoteAddr": "/192.168.65.1:63026",
            "uploadFile": "/opt/Axway/APIM-7.7.0/apigateway/groups/group-2/instance-1/file-transfer/in/persistent/abc/WLAN-DUS.txt",
            "direction": "up",
            "serviceType": "ftp",
            "size": 50,
            "authSubjectId": "abc"
        },
        "processInfo": {
            "hostname": "api-env",
            "groupId": "group-2",
            "groupName": "QuickStart Group",
            "serviceId": "instance-1",
            "version": "7.7.20200730",
            "gatewayName": "API-Gateway 3",
            "gatewayRegion": "US"
        },
        "type": "summaryIndex"
    },
    {
        "@timestamp": "2020-09-02T20:10:50.348Z",
        "correlationId": "4afc4f5fa70015d93db-FTPS",
        "finalStatus": "Pass",
        "duration": 100,
        "path": null,
        "protocol": "ftp-local",
        "protocolSrc": "10021//opt/Axway/APIM-7.7.0/apigateway/groups/group-2/instance-1/file-transfer/in/persistent/abc",
        "serviceContext": null,
        "fileTransfer": {
            "remoteAddr": "/192.168.65.1:63026",
            "uploadFile": "/opt/Axway/APIM-7.7.0/apigateway/groups/group-2/instance-1/file-transfer/in/persistent/abc/WLAN-DUS.txt",
            "direction": "up",
            "serviceType": "ftps",
            "size": 50,
            "authSubjectId": "abc"
        },
        "processInfo": {
            "hostname": "api-env",
            "groupId": "group-2",
            "groupName": "QuickStart Group",
            "serviceId": "instance-1",
            "version": "7.7.20200730",
            "gatewayName": "API-Gateway 3",
            "gatewayRegion": "US"
        },
        "type": "summaryIndex"
    }
];
const getDate = require('../../util');

module.exports = [
    // Sample not found request - 15 minutes
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20836406
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "ecs": {
            "version": "1.5.0"
        },
        "correlationId": "7a240f5f0e21555d2d343482",
        "circuitPath": [
            {
                "execTime": 0,
                "policy": "API Broker",
                "filters": [
                    {
                        "type": "ApiShuntFilter",
                        "execTime": 0,
                        "name": "Not Found",
                        "class": "com.vordel.coreapireg.runtime.broker.ApiShuntFilter",
                        "filterTime": 1594827898889,
                        "status": "Fail"
                    },
                    {
                        "type": "ApiShuntFailureFilter",
                        "execTime": 0,
                        "name": "Not Found",
                        "class": "com.vordel.coreapireg.runtime.broker.ApiShuntFailureFilter",
                        "filterTime": 1594827898889,
                        "status": "Pass"
                    }
                ]
            }
        ],
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
        "transactionSummary": {
            "path": "/favicon.ico",
            "protocol": "https",
            "serviceContext": null,
            "protocolSrc": "8065",
            "status": "failure"
        },
        "transactionElements": {
            "leg0": {
                "duration": 3,
                "protocolInfo": {
                    "recvHeader": "GET /favicon.ico HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\nCookie: _ga=GA1.1.177509375.1593442001; iconSize=16x16; VIDUSR=1594804041-BIHMVFW7k1Eqzg%3d%3d; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; joomla_user_state=logged_in; layout_type=table; cookie_pressed_153=false; 6e7e1bb1dd446d4cd36889414ccb4cb7=nqnj5rrhji55natjob4bo59fi7; portal.slate.api=no; portal.slate.dev=no; APIMANAGERSTATIC=cdd41d6c-0f99-4ce7-9da5-4bdea9654923\r\nUpgrade-Insecure-Requests: 1",
                    "http": {
                        "wafStatus": 1,
                        "bytesReceived": 747,
                        "localPort": "8065",
                        "method": "GET",
                        "statusText": "Not Found",
                        "remotePort": "59641",
                        "bytesSent": 834,
                        "localAddr": "192.168.65.129",
                        "uri": "/favicon.ico",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 404
                    },
                    "sentHeader": "HTTP/1.1 404 Not Found\r\nDate: Wed, 15 Jul 2020 15:44:58 GMT\r\nServer: Gateway\r\nContent-Length: 0\r\nConnection: keep-alive\r\nX-CorrelationID: Id-7a240f5f0e21555d2d343482 0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nCookie: _ga=GA1.1.177509375.1593442001; iconSize=16x16; VIDUSR=1594804041-BIHMVFW7k1Eqzg%3d%3d; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; joomla_user_state=logged_in; layout_type=table; cookie_pressed_153=false; 6e7e1bb1dd446d4cd36889414ccb4cb7=nqnj5rrhji55natjob4bo59fi7; portal.slate.api=no; portal.slate.dev=no; APIMANAGERSTATIC=cdd41d6c-0f99-4ce7-9da5-4bdea9654923\r\nHost: api-env:8065\r\nUpgrade-Insecure-Requests: 1\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0"
                },
                "finalStatus": "Fail"
            }
        }
    },
    // Find Pets by status on instance-1 - OPTIONS Call - 120 hours ago - Instance-1
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20849808
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "ecs": {
            "version": "1.5.0"
        },
        "correlationId": "4e270f5f05224d71a5f24b78",
        "circuitPath": [
            {
                "execTime": 0,
                "policy": "API Broker",
                "filters": [
                    {
                        "type": "ApiShuntFilter",
                        "execTime": 0,
                        "name": "Options Request",
                        "class": "com.vordel.coreapireg.runtime.broker.ApiShuntFilter",
                        "filterTime": 1594828622152,
                        "status": "Pass"
                    }
                ]
            }
        ],
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
        },
        "@timestamp": getDate('120h'),
        "logtype": "openlog",
        "transactionSummary": {
            "path": "/petstore/v2/pet/findByStatus",
            "protocol": "https",
            "serviceContext": null,
            "protocolSrc": "8065",
            "status": "success"
        },
        "transactionElements": {
            "leg0": {
                "duration": 1,
                "protocolInfo": {
                    "recvHeader": "OPTIONS /petstore/v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: */*\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nAccess-Control-Request-Method: GET\r\nAccess-Control-Request-Headers: keyid,x-requested-with\r\nReferer: https://api-env:8075/home\r\nOrigin: https://api-env:8075\r\nConnection: keep-alive\r\n",
                    "http": {
                        "wafStatus": 0,
                        "bytesReceived": 441,
                        "localPort": "8065",
                        "method": "OPTIONS",
                        "statusText": "OK",
                        "remotePort": "49586",
                        "bytesSent": 357,
                        "localAddr": "192.168.65.129",
                        "uri": "/petstore/v2/pet/findByStatus",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nDate: Wed, 15 Jul 2020 15:57:02 GMT\r\nAllow: DELETE, GET, HEAD, OPTIONS, POST\r\nAccess-Control-Allow-Headers: keyid, x-requested-with\r\nAccess-Control-Allow-Methods: OPTIONS, GET\r\nAccess-Control-Allow-Origin: https://api-env:8075\r\nServer: Gateway\r\nConnection: close\r\nX-CorrelationID: Id-4e270f5f05224d71a5f24b78 0\r\nContent-Type: text/plain"
                },
                "finalStatus": "Pass"
            }
        }
    },
    // Healthcheck call - 65 minutes 
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20840109
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "ecs": {
            "version": "1.5.0"
        },
        "correlationId": "19250f5f4321b5ba2a4de364",
        "circuitPath": [
            {
                "execTime": 0,
                "filters": [
                    {
                        "type": "ChangeMessageFilter",
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-1095086795812854131",
                        "execTime": 0,
                        "name": "Set Message",
                        "class": "com.vordel.circuit.conversion.ChangeMessageFilter",
                        "filterTime": 1594828057207,
                        "status": "Pass"
                    },
                    {
                        "type": "ReflectFilter",
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-4282446533257395104",
                        "execTime": 0,
                        "name": "Reflect",
                        "class": "com.vordel.circuit.net.ReflectFilter",
                        "filterTime": 1594828057207,
                        "status": "Pass"
                    }
                ],
                "policy": "Health Check"
            }
        ],
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
        "transactionSummary": {
            "path": "/healthcheck",
            "protocol": "http",
            "serviceContext": null,
            "protocolSrc": "8080",
            "status": "success"
        },
        "transactionElements": {
            "leg0": {
                "duration": 1,
                "protocolInfo": {
                    "recvHeader": "GET /healthcheck HTTP/1.1\r\nHost: api-env:8080\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nCookie: _ga=GA1.1.177509375.1593442001; iconSize=16x16; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; layout_type=table; cookie_pressed_153=false; portal.slate.api=no; portal.slate.dev=no\r\nUpgrade-Insecure-Requests: 1",
                    "http": {
                        "wafStatus": 0,
                        "bytesReceived": 563,
                        "localPort": "8080",
                        "method": "GET",
                        "statusText": "OK",
                        "remotePort": "78786",
                        "bytesSent": 661,
                        "localAddr": "1.1.1.1",
                        "authSubjectId": "Chris-Test",
                        "uri": "/healthcheck",
                        "remoteName": "TestHost",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nDate: Wed, 15 Jul 2020 15:47:37 GMT\r\nServer: Gateway\r\nConnection: close\r\nX-CorrelationID: Id-19250f5f4321b5ba2a4de364 0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nCookie: _ga=GA1.1.177509375.1593442001; iconSize=16x16; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; layout_type=table; cookie_pressed_153=false; portal.slate.api=no; portal.slate.dev=no\r\nHost: api-env:8080\r\n\r\nUpgrade-Insecure-Requests: 1\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nContent-Type: text/xml"
                },
                "finalStatus": "Error"
            }
        }
    },
    // Another healthcheck - 30000 hours ago
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20843435
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "ecs": {
            "version": "1.5.0"
        },
        "correlationId": "b8250f5f7a2195dc1581d52c",
        "circuitPath": [
            {
                "execTime": 0,
                "filters": [
                    {
                        "type": "ChangeMessageFilter",
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-1095086795812854131",
                        "execTime": 0,
                        "name": "Set Message",
                        "class": "com.vordel.circuit.conversion.ChangeMessageFilter",
                        "filterTime": 1594828216851,
                        "status": "Pass"
                    },
                    {
                        "type": "ReflectFilter",
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-4282446533257395104",
                        "execTime": 0,
                        "name": "Reflect",
                        "class": "com.vordel.circuit.net.ReflectFilter",
                        "filterTime": 1594828216851,
                        "status": "Pass"
                    }
                ],
                "policy": "Health Check"
            }
        ],
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
        "transactionSummary": {
            "path": "/healthcheck",
            "protocol": "http",
            "serviceContext": null,
            "protocolSrc": "8080",
            "status": "success"
        },
        "transactionElements": {
            "leg0": {
                "duration": 1,
                "protocolInfo": {
                    "recvHeader": "GET /healthcheck HTTP/1.1\r\nHost: api-env:8080\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nCookie: _ga=GA1.1.177509375.1593442001; iconSize=16x16; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; layout_type=table; cookie_pressed_153=false; portal.slate.api=no; portal.slate.dev=no\r\nUpgrade-Insecure-Requests: 1",
                    "http": {
                        "wafStatus": 0,
                        "bytesReceived": 563,
                        "localPort": "8080",
                        "method": "GET",
                        "statusText": "OK",
                        "remotePort": "65392",
                        "bytesSent": 661,
                        "localAddr": "192.168.65.129",
                        "uri": "/healthcheck",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nDate: Wed, 15 Jul 2020 15:50:16 GMT\r\nServer: Gateway\r\nConnection: close\r\nX-CorrelationID: Id-b8250f5f7a2195dc1581d52c 0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nCookie: _ga=GA1.1.177509375.1593442001; iconSize=16x16; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; layout_type=table; cookie_pressed_153=false; portal.slate.api=no; portal.slate.dev=no\r\nHost: api-env:8080\r\n\r\nUpgrade-Insecure-Requests: 1\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nContent-Type: text/xml"
                },
                "finalStatus": "Pass"
            }
        }
    },
    // Get Pet by ID GET Call - 8 minutes ago
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20864105
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "ecs": {
            "version": "1.5.0"
        },
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "correlationId": "682c0f5fbe23dc8e1d80efe2",
        "transactionElements": {
            "leg1": {
                "operation": "findPetsByStatus",
                "serviceName": "Petstore",
                "protocolInfo": {
                    "http": {
                        "localAddr": "192.168.65.129",
                        "statusText": "OK",
                        "wafStatus": 0,
                        "remotePort": "80",
                        "bytesReceived": 47840,
                        "remoteName": "petstore.swagger.io",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "uri": "/v2/pet/findByStatus",
                        "remoteAddr": "52.86.190.221",
                        "localPort": "52182",
                        "status": 200,
                        "method": "GET",
                        "bytesSent": 480
                    },
                    "recvHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: application/json\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\ntransfer-encoding: chunked\r\nConnection: Close",
                    "sentHeader": "GET /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: petstore.swagger.io\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nAuthorization: Basic WlZLNTI3OWVMQWZ2VW52MmtTejNmcFlMRWtNaFNDemc6\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nReferer: https://api-env:8075/home\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nX-Requested-With: XMLHttpRequest\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 1"
                },
                "duration": 136
            },
            "leg0": {
                "duration": 898,
                "protocolInfo": {
                    "recvHeader": "GET /petstore/v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nKeyId: 6cd55c27-675a-444a-9bc7-ae9a7869184d\r\nX-Requested-With: XMLHttpRequest\r\nOrigin: https://api-env:8075\r\nConnection: keep-alive\r\nReferer: https://api-env:8075/home\r\n",
                    "http": {
                        "wafStatus": 0,
                        "localPort": "8065",
                        "method": "GET",
                        "remotePort": "50982",
                        "bytesSent": 47925,
                        "uri": "/petstore/v2/pet/findByStatus",
                        "bytesReceived": 437,
                        "statusText": "OK",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "localAddr": "192.168.65.129",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Expose-Headers: x-correlationid\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 0\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\nContent-Type: application/json"
                },
                "finalStatus": "Pass",
                "serviceName": "Petstore",
                "operation": "findPetsByStatus"
            }
        },
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
        },
        "@timestamp": getDate('8m'),
        "logtype": "openlog",
        "circuitPath": [
            {
                "execTime": 626,
                "filters": [
                    {
                        "execTime": 0,
                        "name": "Set service context",
                        "filterTime": 1594829928429,
                        "type": "VApiServiceContextFilter",
                        "class": "com.vordel.circuit.vapi.VApiServiceContextFilter",
                        "status": "Pass"
                    },
                    {
                        "execTime": 626,
                        "name": "Custom Routing",
                        "filterTime": 1594829929055,
                        "type": "VApiCircuitDelegateFilter",
                        "class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter",
                        "subPaths": [
                            {
                                "execTime": 626,
                                "filters": [
                                    {
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4323849261363416160",
                                        "execTime": 626,
                                        "name": "Default Routing",
                                        "filterTime": 1594829929055,
                                        "type": "SwitchFilter",
                                        "class": "com.vordel.circuit.switchcase.SwitchFilter",
                                        "subPaths": [
                                            {
                                                "execTime": 626,
                                                "filters": [
                                                    {
                                                        "execTime": 626,
                                                        "name": "not-required-here",
                                                        "filterTime": 1594829929055,
                                                        "type": "CircuitDelegateFilter",
                                                        "class": "com.vordel.circuit.CircuitDelegateFilter",
                                                        "subPaths": [
                                                            {
                                                                "execTime": 626,
                                                                "filters": [
                                                                    {
                                                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:5735607394361826155",
                                                                        "execTime": 626,
                                                                        "name": "Connect to URL",
                                                                        "filterTime": 1594829929055,
                                                                        "type": "ConnectToURLFilter",
                                                                        "class": "com.vordel.circuit.net.ConnectToURLFilter",
                                                                        "status": "Pass"
                                                                    }
                                                                ],
                                                                "policy": "Default Profile-based Routing"
                                                            }
                                                        ],
                                                        "status": "Pass"
                                                    }
                                                ],
                                                "policy": "Default API Proxy Routing"
                                            }
                                        ],
                                        "status": "Pass"
                                    }
                                ],
                                "policy": "Default API Proxy Routing"
                            }
                        ],
                        "status": "Pass"
                    }
                ],
                "policy": "API Broker"
            }
        ],
        "transactionSummary": {
            "path": "/petstore/v2/pet/findByStatus",
            "protocol": "https",
            "serviceContext": {
                "duration": 897,
                "app": "Client App",
                "method": "findPetsByStatus",
                "org": "API Development",
                "service": "Petstore",
                "client": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                "monitor": true,
                "status": "success"
            },
            "protocolSrc": "8065",
            "status": "success"
        }
    },
    // More unspecific calls to test count the parameter is handled
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20864105
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "ecs": {
            "version": "1.5.0"
        },
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "correlationId": "682c0f5fbe23dc8e1d80efe2",
        "transactionElements": {
            "leg1": {
                "operation": "findPetsByStatus",
                "serviceName": "Petstore",
                "protocolInfo": {
                    "http": {
                        "localAddr": "192.168.65.129",
                        "statusText": "OK",
                        "wafStatus": 0,
                        "remotePort": "80",
                        "bytesReceived": 47840,
                        "remoteName": "petstore.swagger.io",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "uri": "/v2/pet/findByStatus",
                        "remoteAddr": "52.86.190.221",
                        "localPort": "52182",
                        "status": 200,
                        "method": "GET",
                        "bytesSent": 480
                    },
                    "recvHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: application/json\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\ntransfer-encoding: chunked\r\nConnection: Close",
                    "sentHeader": "GET /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: petstore.swagger.io\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nAuthorization: Basic WlZLNTI3OWVMQWZ2VW52MmtTejNmcFlMRWtNaFNDemc6\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nReferer: https://api-env:8075/home\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nX-Requested-With: XMLHttpRequest\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 1"
                },
                "duration": 136
            },
            "leg0": {
                "duration": 898,
                "protocolInfo": {
                    "recvHeader": "GET /petstore/v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nKeyId: 6cd55c27-675a-444a-9bc7-ae9a7869184d\r\nX-Requested-With: XMLHttpRequest\r\nOrigin: https://api-env:8075\r\nConnection: keep-alive\r\nReferer: https://api-env:8075/home\r\n",
                    "http": {
                        "wafStatus": 0,
                        "localPort": "8065",
                        "method": "GET",
                        "remotePort": "50982",
                        "bytesSent": 47925,
                        "uri": "/petstore/v2/pet/findByStatus",
                        "bytesReceived": 437,
                        "statusText": "OK",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "localAddr": "192.168.65.129",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Expose-Headers: x-correlationid\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 0\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\nContent-Type: application/json"
                },
                "finalStatus": "Pass",
                "serviceName": "Petstore",
                "operation": "findPetsByStatus"
            }
        },
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
        },
        "@timestamp": getDate('8m'),
        "logtype": "openlog",
        "circuitPath": [
            {
                "execTime": 626,
                "filters": [
                    {
                        "execTime": 0,
                        "name": "Set service context",
                        "filterTime": 1594829928429,
                        "type": "VApiServiceContextFilter",
                        "class": "com.vordel.circuit.vapi.VApiServiceContextFilter",
                        "status": "Pass"
                    },
                    {
                        "execTime": 626,
                        "name": "Custom Routing",
                        "filterTime": 1594829929055,
                        "type": "VApiCircuitDelegateFilter",
                        "class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter",
                        "subPaths": [
                            {
                                "execTime": 626,
                                "filters": [
                                    {
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4323849261363416160",
                                        "execTime": 626,
                                        "name": "Default Routing",
                                        "filterTime": 1594829929055,
                                        "type": "SwitchFilter",
                                        "class": "com.vordel.circuit.switchcase.SwitchFilter",
                                        "subPaths": [
                                            {
                                                "execTime": 626,
                                                "filters": [
                                                    {
                                                        "execTime": 626,
                                                        "name": "not-required-here",
                                                        "filterTime": 1594829929055,
                                                        "type": "CircuitDelegateFilter",
                                                        "class": "com.vordel.circuit.CircuitDelegateFilter",
                                                        "subPaths": [
                                                            {
                                                                "execTime": 626,
                                                                "filters": [
                                                                    {
                                                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:5735607394361826155",
                                                                        "execTime": 626,
                                                                        "name": "Connect to URL",
                                                                        "filterTime": 1594829929055,
                                                                        "type": "ConnectToURLFilter",
                                                                        "class": "com.vordel.circuit.net.ConnectToURLFilter",
                                                                        "status": "Pass"
                                                                    }
                                                                ],
                                                                "policy": "Default Profile-based Routing"
                                                            }
                                                        ],
                                                        "status": "Pass"
                                                    }
                                                ],
                                                "policy": "Default API Proxy Routing"
                                            }
                                        ],
                                        "status": "Pass"
                                    }
                                ],
                                "policy": "Default API Proxy Routing"
                            }
                        ],
                        "status": "Pass"
                    }
                ],
                "policy": "API Broker"
            }
        ],
        "transactionSummary": {
            "path": "/petstore/v2/pet/findByStatus",
            "protocol": "https",
            "serviceContext": {
                "duration": 897,
                "app": "Client App",
                "method": "findPetsByStatus",
                "org": "API Development",
                "service": "Petstore",
                "client": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                "monitor": true,
                "status": "success"
            },
            "protocolSrc": "8065",
            "status": "success"
        }
    },
    // More unspecific calls to test count the parameter is handled
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20864105
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "ecs": {
            "version": "1.5.0"
        },
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "correlationId": "682c0f5fbe23dc8e1d80efe2",
        "transactionElements": {
            "leg1": {
                "operation": "findPetsByStatus",
                "serviceName": "Petstore",
                "protocolInfo": {
                    "http": {
                        "localAddr": "192.168.65.129",
                        "statusText": "OK",
                        "wafStatus": 0,
                        "remotePort": "80",
                        "bytesReceived": 47840,
                        "remoteName": "petstore.swagger.io",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "uri": "/v2/pet/findByStatus",
                        "remoteAddr": "52.86.190.221",
                        "localPort": "52182",
                        "status": 200,
                        "method": "GET",
                        "bytesSent": 480
                    },
                    "recvHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: application/json\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\ntransfer-encoding: chunked\r\nConnection: Close",
                    "sentHeader": "GET /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: petstore.swagger.io\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nAuthorization: Basic WlZLNTI3OWVMQWZ2VW52MmtTejNmcFlMRWtNaFNDemc6\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nReferer: https://api-env:8075/home\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nX-Requested-With: XMLHttpRequest\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 1"
                },
                "duration": 136
            },
            "leg0": {
                "duration": 898,
                "protocolInfo": {
                    "recvHeader": "GET /petstore/v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nKeyId: 6cd55c27-675a-444a-9bc7-ae9a7869184d\r\nX-Requested-With: XMLHttpRequest\r\nOrigin: https://api-env:8075\r\nConnection: keep-alive\r\nReferer: https://api-env:8075/home\r\n",
                    "http": {
                        "wafStatus": 0,
                        "localPort": "8065",
                        "method": "GET",
                        "remotePort": "50982",
                        "bytesSent": 47925,
                        "uri": "/petstore/v2/pet/findByStatus",
                        "bytesReceived": 437,
                        "statusText": "OK",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "localAddr": "192.168.65.129",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Expose-Headers: x-correlationid\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 0\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\nContent-Type: application/json"
                },
                "finalStatus": "Pass",
                "serviceName": "Petstore",
                "operation": "findPetsByStatus"
            }
        },
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
        },
        "@timestamp": getDate('8m'),
        "logtype": "openlog",
        "circuitPath": [
            {
                "execTime": 626,
                "filters": [
                    {
                        "execTime": 0,
                        "name": "Set service context",
                        "filterTime": 1594829928429,
                        "type": "VApiServiceContextFilter",
                        "class": "com.vordel.circuit.vapi.VApiServiceContextFilter",
                        "status": "Pass"
                    },
                    {
                        "execTime": 626,
                        "name": "Custom Routing",
                        "filterTime": 1594829929055,
                        "type": "VApiCircuitDelegateFilter",
                        "class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter",
                        "subPaths": [
                            {
                                "execTime": 626,
                                "filters": [
                                    {
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4323849261363416160",
                                        "execTime": 626,
                                        "name": "Default Routing",
                                        "filterTime": 1594829929055,
                                        "type": "SwitchFilter",
                                        "class": "com.vordel.circuit.switchcase.SwitchFilter",
                                        "subPaths": [
                                            {
                                                "execTime": 626,
                                                "filters": [
                                                    {
                                                        "execTime": 626,
                                                        "name": "not-required-here",
                                                        "filterTime": 1594829929055,
                                                        "type": "CircuitDelegateFilter",
                                                        "class": "com.vordel.circuit.CircuitDelegateFilter",
                                                        "subPaths": [
                                                            {
                                                                "execTime": 626,
                                                                "filters": [
                                                                    {
                                                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:5735607394361826155",
                                                                        "execTime": 626,
                                                                        "name": "Connect to URL",
                                                                        "filterTime": 1594829929055,
                                                                        "type": "ConnectToURLFilter",
                                                                        "class": "com.vordel.circuit.net.ConnectToURLFilter",
                                                                        "status": "Pass"
                                                                    }
                                                                ],
                                                                "policy": "Default Profile-based Routing"
                                                            }
                                                        ],
                                                        "status": "Pass"
                                                    }
                                                ],
                                                "policy": "Default API Proxy Routing"
                                            }
                                        ],
                                        "status": "Pass"
                                    }
                                ],
                                "policy": "Default API Proxy Routing"
                            }
                        ],
                        "status": "Pass"
                    }
                ],
                "policy": "API Broker"
            }
        ],
        "transactionSummary": {
            "path": "/petstore/v2/pet/findByStatus",
            "protocol": "https",
            "serviceContext": {
                "duration": 897,
                "app": "Client App",
                "method": "findPetsByStatus",
                "org": "API Development",
                "service": "Petstore",
                "client": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                "monitor": true,
                "status": "success"
            },
            "protocolSrc": "8065",
            "status": "success"
        }
    },
    // More unspecific calls to test count the parameter is handled
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20864105
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "ecs": {
            "version": "1.5.0"
        },
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "correlationId": "682c0f5fbe23dc8e1d80efe2",
        "transactionElements": {
            "leg1": {
                "operation": "findPetsByStatus",
                "serviceName": "Petstore",
                "protocolInfo": {
                    "http": {
                        "localAddr": "192.168.65.129",
                        "statusText": "OK",
                        "wafStatus": 0,
                        "remotePort": "80",
                        "bytesReceived": 47840,
                        "remoteName": "petstore.swagger.io",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "uri": "/v2/pet/findByStatus",
                        "remoteAddr": "52.86.190.221",
                        "localPort": "52182",
                        "status": 200,
                        "method": "GET",
                        "bytesSent": 480
                    },
                    "recvHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: application/json\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\ntransfer-encoding: chunked\r\nConnection: Close",
                    "sentHeader": "GET /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: petstore.swagger.io\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nAuthorization: Basic WlZLNTI3OWVMQWZ2VW52MmtTejNmcFlMRWtNaFNDemc6\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nReferer: https://api-env:8075/home\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nX-Requested-With: XMLHttpRequest\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 1"
                },
                "duration": 136
            },
            "leg0": {
                "duration": 898,
                "protocolInfo": {
                    "recvHeader": "GET /petstore/v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nKeyId: 6cd55c27-675a-444a-9bc7-ae9a7869184d\r\nX-Requested-With: XMLHttpRequest\r\nOrigin: https://api-env:8075\r\nConnection: keep-alive\r\nReferer: https://api-env:8075/home\r\n",
                    "http": {
                        "wafStatus": 0,
                        "localPort": "8065",
                        "method": "GET",
                        "remotePort": "50982",
                        "bytesSent": 47925,
                        "uri": "/petstore/v2/pet/findByStatus",
                        "bytesReceived": 437,
                        "statusText": "OK",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "localAddr": "192.168.65.129",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Expose-Headers: x-correlationid\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 0\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\nContent-Type: application/json"
                },
                "finalStatus": "Pass",
                "serviceName": "Petstore",
                "operation": "findPetsByStatus"
            }
        },
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
        },
        "@timestamp": getDate('8m'),
        "logtype": "openlog",
        "circuitPath": [
            {
                "execTime": 626,
                "filters": [
                    {
                        "execTime": 0,
                        "name": "Set service context",
                        "filterTime": 1594829928429,
                        "type": "VApiServiceContextFilter",
                        "class": "com.vordel.circuit.vapi.VApiServiceContextFilter",
                        "status": "Pass"
                    },
                    {
                        "execTime": 626,
                        "name": "Custom Routing",
                        "filterTime": 1594829929055,
                        "type": "VApiCircuitDelegateFilter",
                        "class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter",
                        "subPaths": [
                            {
                                "execTime": 626,
                                "filters": [
                                    {
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4323849261363416160",
                                        "execTime": 626,
                                        "name": "Default Routing",
                                        "filterTime": 1594829929055,
                                        "type": "SwitchFilter",
                                        "class": "com.vordel.circuit.switchcase.SwitchFilter",
                                        "subPaths": [
                                            {
                                                "execTime": 626,
                                                "filters": [
                                                    {
                                                        "execTime": 626,
                                                        "name": "not-required-here",
                                                        "filterTime": 1594829929055,
                                                        "type": "CircuitDelegateFilter",
                                                        "class": "com.vordel.circuit.CircuitDelegateFilter",
                                                        "subPaths": [
                                                            {
                                                                "execTime": 626,
                                                                "filters": [
                                                                    {
                                                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:5735607394361826155",
                                                                        "execTime": 626,
                                                                        "name": "Connect to URL",
                                                                        "filterTime": 1594829929055,
                                                                        "type": "ConnectToURLFilter",
                                                                        "class": "com.vordel.circuit.net.ConnectToURLFilter",
                                                                        "status": "Pass"
                                                                    }
                                                                ],
                                                                "policy": "Default Profile-based Routing"
                                                            }
                                                        ],
                                                        "status": "Pass"
                                                    }
                                                ],
                                                "policy": "Default API Proxy Routing"
                                            }
                                        ],
                                        "status": "Pass"
                                    }
                                ],
                                "policy": "Default API Proxy Routing"
                            }
                        ],
                        "status": "Pass"
                    }
                ],
                "policy": "API Broker"
            }
        ],
        "transactionSummary": {
            "path": "/petstore/v2/pet/findByStatus",
            "protocol": "https",
            "serviceContext": {
                "duration": 897,
                "app": "Client App",
                "method": "findPetsByStatus",
                "org": "API Development",
                "service": "Petstore",
                "client": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                "monitor": true,
                "status": "success"
            },
            "protocolSrc": "8065",
            "status": "success"
        }
    },
    // More unspecific calls to test count the parameter is handled
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20864105
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "ecs": {
            "version": "1.5.0"
        },
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "correlationId": "682c0f5fbe23dc8e1d80efe2",
        "transactionElements": {
            "leg1": {
                "operation": "findPetsByStatus",
                "serviceName": "Petstore",
                "protocolInfo": {
                    "http": {
                        "localAddr": "192.168.65.129",
                        "statusText": "OK",
                        "wafStatus": 0,
                        "remotePort": "80",
                        "bytesReceived": 47840,
                        "remoteName": "petstore.swagger.io",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "uri": "/v2/pet/findByStatus",
                        "remoteAddr": "52.86.190.221",
                        "localPort": "52182",
                        "status": 200,
                        "method": "GET",
                        "bytesSent": 480
                    },
                    "recvHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: application/json\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\ntransfer-encoding: chunked\r\nConnection: Close",
                    "sentHeader": "GET /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: petstore.swagger.io\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nAuthorization: Basic WlZLNTI3OWVMQWZ2VW52MmtTejNmcFlMRWtNaFNDemc6\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nReferer: https://api-env:8075/home\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nX-Requested-With: XMLHttpRequest\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 1"
                },
                "duration": 136
            },
            "leg0": {
                "duration": 898,
                "protocolInfo": {
                    "recvHeader": "GET /petstore/v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nKeyId: 6cd55c27-675a-444a-9bc7-ae9a7869184d\r\nX-Requested-With: XMLHttpRequest\r\nOrigin: https://api-env:8075\r\nConnection: keep-alive\r\nReferer: https://api-env:8075/home\r\n",
                    "http": {
                        "wafStatus": 0,
                        "localPort": "8065",
                        "method": "GET",
                        "remotePort": "50982",
                        "bytesSent": 47925,
                        "uri": "/petstore/v2/pet/findByStatus",
                        "bytesReceived": 437,
                        "statusText": "OK",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "localAddr": "192.168.65.129",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Expose-Headers: x-correlationid\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 0\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\nContent-Type: application/json"
                },
                "finalStatus": "Pass",
                "serviceName": "Petstore",
                "operation": "findPetsByStatus"
            }
        },
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
        },
        "@timestamp": getDate('8m'),
        "logtype": "openlog",
        "circuitPath": [
            {
                "execTime": 626,
                "filters": [
                    {
                        "execTime": 0,
                        "name": "Set service context",
                        "filterTime": 1594829928429,
                        "type": "VApiServiceContextFilter",
                        "class": "com.vordel.circuit.vapi.VApiServiceContextFilter",
                        "status": "Pass"
                    },
                    {
                        "execTime": 626,
                        "name": "Custom Routing",
                        "filterTime": 1594829929055,
                        "type": "VApiCircuitDelegateFilter",
                        "class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter",
                        "subPaths": [
                            {
                                "execTime": 626,
                                "filters": [
                                    {
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4323849261363416160",
                                        "execTime": 626,
                                        "name": "Default Routing",
                                        "filterTime": 1594829929055,
                                        "type": "SwitchFilter",
                                        "class": "com.vordel.circuit.switchcase.SwitchFilter",
                                        "subPaths": [
                                            {
                                                "execTime": 626,
                                                "filters": [
                                                    {
                                                        "execTime": 626,
                                                        "name": "not-required-here",
                                                        "filterTime": 1594829929055,
                                                        "type": "CircuitDelegateFilter",
                                                        "class": "com.vordel.circuit.CircuitDelegateFilter",
                                                        "subPaths": [
                                                            {
                                                                "execTime": 626,
                                                                "filters": [
                                                                    {
                                                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:5735607394361826155",
                                                                        "execTime": 626,
                                                                        "name": "Connect to URL",
                                                                        "filterTime": 1594829929055,
                                                                        "type": "ConnectToURLFilter",
                                                                        "class": "com.vordel.circuit.net.ConnectToURLFilter",
                                                                        "status": "Pass"
                                                                    }
                                                                ],
                                                                "policy": "Default Profile-based Routing"
                                                            }
                                                        ],
                                                        "status": "Pass"
                                                    }
                                                ],
                                                "policy": "Default API Proxy Routing"
                                            }
                                        ],
                                        "status": "Pass"
                                    }
                                ],
                                "policy": "Default API Proxy Routing"
                            }
                        ],
                        "status": "Pass"
                    }
                ],
                "policy": "API Broker"
            }
        ],
        "transactionSummary": {
            "path": "/petstore/v2/pet/findByStatus",
            "protocol": "https",
            "serviceContext": {
                "duration": 897,
                "app": "Client App",
                "method": "findPetsByStatus",
                "org": "API Development",
                "service": "Petstore",
                "client": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                "monitor": true,
                "status": "success"
            },
            "protocolSrc": "8065",
            "status": "success"
        }
    },
    // More unspecific calls to test count the parameter is handled
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20864105
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "ecs": {
            "version": "1.5.0"
        },
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "correlationId": "682c0f5fbe23dc8e1d80efe2",
        "transactionElements": {
            "leg1": {
                "operation": "findPetsByStatus",
                "serviceName": "Petstore",
                "protocolInfo": {
                    "http": {
                        "localAddr": "192.168.65.129",
                        "statusText": "OK",
                        "wafStatus": 0,
                        "remotePort": "80",
                        "bytesReceived": 47840,
                        "remoteName": "petstore.swagger.io",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "uri": "/v2/pet/findByStatus",
                        "remoteAddr": "52.86.190.221",
                        "localPort": "52182",
                        "status": 200,
                        "method": "GET",
                        "bytesSent": 480
                    },
                    "recvHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: application/json\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\ntransfer-encoding: chunked\r\nConnection: Close",
                    "sentHeader": "GET /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: petstore.swagger.io\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nAuthorization: Basic WlZLNTI3OWVMQWZ2VW52MmtTejNmcFlMRWtNaFNDemc6\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nReferer: https://api-env:8075/home\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nX-Requested-With: XMLHttpRequest\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 1"
                },
                "duration": 136
            },
            "leg0": {
                "duration": 898,
                "protocolInfo": {
                    "recvHeader": "GET /petstore/v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nKeyId: 6cd55c27-675a-444a-9bc7-ae9a7869184d\r\nX-Requested-With: XMLHttpRequest\r\nOrigin: https://api-env:8075\r\nConnection: keep-alive\r\nReferer: https://api-env:8075/home\r\n",
                    "http": {
                        "wafStatus": 0,
                        "localPort": "8065",
                        "method": "GET",
                        "remotePort": "50982",
                        "bytesSent": 47925,
                        "uri": "/petstore/v2/pet/findByStatus",
                        "bytesReceived": 437,
                        "statusText": "OK",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "localAddr": "192.168.65.129",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Expose-Headers: x-correlationid\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 0\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\nContent-Type: application/json"
                },
                "finalStatus": "Pass",
                "serviceName": "Petstore",
                "operation": "findPetsByStatus"
            }
        },
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
        },
        "@timestamp": getDate('8m'),
        "logtype": "openlog",
        "circuitPath": [
            {
                "execTime": 626,
                "filters": [
                    {
                        "execTime": 0,
                        "name": "Set service context",
                        "filterTime": 1594829928429,
                        "type": "VApiServiceContextFilter",
                        "class": "com.vordel.circuit.vapi.VApiServiceContextFilter",
                        "status": "Pass"
                    },
                    {
                        "execTime": 626,
                        "name": "Custom Routing",
                        "filterTime": 1594829929055,
                        "type": "VApiCircuitDelegateFilter",
                        "class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter",
                        "subPaths": [
                            {
                                "execTime": 626,
                                "filters": [
                                    {
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4323849261363416160",
                                        "execTime": 626,
                                        "name": "Default Routing",
                                        "filterTime": 1594829929055,
                                        "type": "SwitchFilter",
                                        "class": "com.vordel.circuit.switchcase.SwitchFilter",
                                        "subPaths": [
                                            {
                                                "execTime": 626,
                                                "filters": [
                                                    {
                                                        "execTime": 626,
                                                        "name": "not-required-here",
                                                        "filterTime": 1594829929055,
                                                        "type": "CircuitDelegateFilter",
                                                        "class": "com.vordel.circuit.CircuitDelegateFilter",
                                                        "subPaths": [
                                                            {
                                                                "execTime": 626,
                                                                "filters": [
                                                                    {
                                                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:5735607394361826155",
                                                                        "execTime": 626,
                                                                        "name": "Connect to URL",
                                                                        "filterTime": 1594829929055,
                                                                        "type": "ConnectToURLFilter",
                                                                        "class": "com.vordel.circuit.net.ConnectToURLFilter",
                                                                        "status": "Pass"
                                                                    }
                                                                ],
                                                                "policy": "Default Profile-based Routing"
                                                            }
                                                        ],
                                                        "status": "Pass"
                                                    }
                                                ],
                                                "policy": "Default API Proxy Routing"
                                            }
                                        ],
                                        "status": "Pass"
                                    }
                                ],
                                "policy": "Default API Proxy Routing"
                            }
                        ],
                        "status": "Pass"
                    }
                ],
                "policy": "API Broker"
            }
        ],
        "transactionSummary": {
            "path": "/petstore/v2/pet/findByStatus",
            "protocol": "https",
            "serviceContext": {
                "duration": 897,
                "app": "Client App",
                "method": "findPetsByStatus",
                "org": "API Development",
                "service": "Petstore",
                "client": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                "monitor": true,
                "status": "success"
            },
            "protocolSrc": "8065",
            "status": "success"
        }
    },
    // More unspecific calls to test count the parameter is handled
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20864105
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "ecs": {
            "version": "1.5.0"
        },
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "correlationId": "682c0f5fbe23dc8e1d80efe2",
        "transactionElements": {
            "leg1": {
                "operation": "findPetsByStatus",
                "serviceName": "Petstore",
                "protocolInfo": {
                    "http": {
                        "localAddr": "192.168.65.129",
                        "statusText": "OK",
                        "wafStatus": 0,
                        "remotePort": "80",
                        "bytesReceived": 47840,
                        "remoteName": "petstore.swagger.io",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "uri": "/v2/pet/findByStatus",
                        "remoteAddr": "52.86.190.221",
                        "localPort": "52182",
                        "status": 200,
                        "method": "GET",
                        "bytesSent": 480
                    },
                    "recvHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: application/json\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\ntransfer-encoding: chunked\r\nConnection: Close",
                    "sentHeader": "GET /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: petstore.swagger.io\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nAuthorization: Basic WlZLNTI3OWVMQWZ2VW52MmtTejNmcFlMRWtNaFNDemc6\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nReferer: https://api-env:8075/home\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nX-Requested-With: XMLHttpRequest\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 1"
                },
                "duration": 136
            },
            "leg0": {
                "duration": 898,
                "protocolInfo": {
                    "recvHeader": "GET /petstore/v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nKeyId: 6cd55c27-675a-444a-9bc7-ae9a7869184d\r\nX-Requested-With: XMLHttpRequest\r\nOrigin: https://api-env:8075\r\nConnection: keep-alive\r\nReferer: https://api-env:8075/home\r\n",
                    "http": {
                        "wafStatus": 0,
                        "localPort": "8065",
                        "method": "GET",
                        "remotePort": "50982",
                        "bytesSent": 47925,
                        "uri": "/petstore/v2/pet/findByStatus",
                        "bytesReceived": 437,
                        "statusText": "OK",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "localAddr": "192.168.65.129",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Expose-Headers: x-correlationid\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 0\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\nContent-Type: application/json"
                },
                "finalStatus": "Pass",
                "serviceName": "Petstore",
                "operation": "findPetsByStatus"
            }
        },
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
        },
        "@timestamp": getDate('8m'),
        "logtype": "openlog",
        "circuitPath": [
            {
                "execTime": 626,
                "filters": [
                    {
                        "execTime": 0,
                        "name": "Set service context",
                        "filterTime": 1594829928429,
                        "type": "VApiServiceContextFilter",
                        "class": "com.vordel.circuit.vapi.VApiServiceContextFilter",
                        "status": "Pass"
                    },
                    {
                        "execTime": 626,
                        "name": "Custom Routing",
                        "filterTime": 1594829929055,
                        "type": "VApiCircuitDelegateFilter",
                        "class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter",
                        "subPaths": [
                            {
                                "execTime": 626,
                                "filters": [
                                    {
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4323849261363416160",
                                        "execTime": 626,
                                        "name": "Default Routing",
                                        "filterTime": 1594829929055,
                                        "type": "SwitchFilter",
                                        "class": "com.vordel.circuit.switchcase.SwitchFilter",
                                        "subPaths": [
                                            {
                                                "execTime": 626,
                                                "filters": [
                                                    {
                                                        "execTime": 626,
                                                        "name": "not-required-here",
                                                        "filterTime": 1594829929055,
                                                        "type": "CircuitDelegateFilter",
                                                        "class": "com.vordel.circuit.CircuitDelegateFilter",
                                                        "subPaths": [
                                                            {
                                                                "execTime": 626,
                                                                "filters": [
                                                                    {
                                                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:5735607394361826155",
                                                                        "execTime": 626,
                                                                        "name": "Connect to URL",
                                                                        "filterTime": 1594829929055,
                                                                        "type": "ConnectToURLFilter",
                                                                        "class": "com.vordel.circuit.net.ConnectToURLFilter",
                                                                        "status": "Pass"
                                                                    }
                                                                ],
                                                                "policy": "Default Profile-based Routing"
                                                            }
                                                        ],
                                                        "status": "Pass"
                                                    }
                                                ],
                                                "policy": "Default API Proxy Routing"
                                            }
                                        ],
                                        "status": "Pass"
                                    }
                                ],
                                "policy": "Default API Proxy Routing"
                            }
                        ],
                        "status": "Pass"
                    }
                ],
                "policy": "API Broker"
            }
        ],
        "transactionSummary": {
            "path": "/petstore/v2/pet/findByStatus",
            "protocol": "https",
            "serviceContext": {
                "duration": 897,
                "app": "Client App",
                "method": "findPetsByStatus",
                "org": "API Development",
                "service": "Petstore",
                "client": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                "monitor": true,
                "status": "success"
            },
            "protocolSrc": "8065",
            "status": "success"
        }
    },
    // More unspecific calls to test count the parameter is handled
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20864105
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "ecs": {
            "version": "1.5.0"
        },
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "correlationId": "682c0f5fbe23dc8e1d80efe2",
        "transactionElements": {
            "leg1": {
                "operation": "findPetsByStatus",
                "serviceName": "Petstore",
                "protocolInfo": {
                    "http": {
                        "localAddr": "192.168.65.129",
                        "statusText": "OK",
                        "wafStatus": 0,
                        "remotePort": "80",
                        "bytesReceived": 47840,
                        "remoteName": "petstore.swagger.io",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "uri": "/v2/pet/findByStatus",
                        "remoteAddr": "52.86.190.221",
                        "localPort": "52182",
                        "status": 200,
                        "method": "GET",
                        "bytesSent": 480
                    },
                    "recvHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: application/json\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\ntransfer-encoding: chunked\r\nConnection: Close",
                    "sentHeader": "GET /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: petstore.swagger.io\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nAuthorization: Basic WlZLNTI3OWVMQWZ2VW52MmtTejNmcFlMRWtNaFNDemc6\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nReferer: https://api-env:8075/home\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nX-Requested-With: XMLHttpRequest\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 1"
                },
                "duration": 136
            },
            "leg0": {
                "duration": 898,
                "protocolInfo": {
                    "recvHeader": "GET /petstore/v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nKeyId: 6cd55c27-675a-444a-9bc7-ae9a7869184d\r\nX-Requested-With: XMLHttpRequest\r\nOrigin: https://api-env:8075\r\nConnection: keep-alive\r\nReferer: https://api-env:8075/home\r\n",
                    "http": {
                        "wafStatus": 0,
                        "localPort": "8065",
                        "method": "GET",
                        "remotePort": "50982",
                        "bytesSent": 47925,
                        "uri": "/petstore/v2/pet/findByStatus",
                        "bytesReceived": 437,
                        "statusText": "OK",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "localAddr": "192.168.65.129",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Expose-Headers: x-correlationid\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 0\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\nContent-Type: application/json"
                },
                "finalStatus": "Pass",
                "serviceName": "Petstore",
                "operation": "findPetsByStatus"
            }
        },
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
        },
        "@timestamp": getDate('8m'),
        "logtype": "openlog",
        "circuitPath": [
            {
                "execTime": 626,
                "filters": [
                    {
                        "execTime": 0,
                        "name": "Set service context",
                        "filterTime": 1594829928429,
                        "type": "VApiServiceContextFilter",
                        "class": "com.vordel.circuit.vapi.VApiServiceContextFilter",
                        "status": "Pass"
                    },
                    {
                        "execTime": 626,
                        "name": "Custom Routing",
                        "filterTime": 1594829929055,
                        "type": "VApiCircuitDelegateFilter",
                        "class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter",
                        "subPaths": [
                            {
                                "execTime": 626,
                                "filters": [
                                    {
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4323849261363416160",
                                        "execTime": 626,
                                        "name": "Default Routing",
                                        "filterTime": 1594829929055,
                                        "type": "SwitchFilter",
                                        "class": "com.vordel.circuit.switchcase.SwitchFilter",
                                        "subPaths": [
                                            {
                                                "execTime": 626,
                                                "filters": [
                                                    {
                                                        "execTime": 626,
                                                        "name": "not-required-here",
                                                        "filterTime": 1594829929055,
                                                        "type": "CircuitDelegateFilter",
                                                        "class": "com.vordel.circuit.CircuitDelegateFilter",
                                                        "subPaths": [
                                                            {
                                                                "execTime": 626,
                                                                "filters": [
                                                                    {
                                                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:5735607394361826155",
                                                                        "execTime": 626,
                                                                        "name": "Connect to URL",
                                                                        "filterTime": 1594829929055,
                                                                        "type": "ConnectToURLFilter",
                                                                        "class": "com.vordel.circuit.net.ConnectToURLFilter",
                                                                        "status": "Pass"
                                                                    }
                                                                ],
                                                                "policy": "Default Profile-based Routing"
                                                            }
                                                        ],
                                                        "status": "Pass"
                                                    }
                                                ],
                                                "policy": "Default API Proxy Routing"
                                            }
                                        ],
                                        "status": "Pass"
                                    }
                                ],
                                "policy": "Default API Proxy Routing"
                            }
                        ],
                        "status": "Pass"
                    }
                ],
                "policy": "API Broker"
            }
        ],
        "transactionSummary": {
            "path": "/petstore/v2/pet/findByStatus",
            "protocol": "https",
            "serviceContext": {
                "duration": 897,
                "app": "Client App",
                "method": "findPetsByStatus",
                "org": "API Development",
                "service": "Petstore",
                "client": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                "monitor": true,
                "status": "success"
            },
            "protocolSrc": "8065",
            "status": "success"
        }
    },
    // More unspecific calls to test count the parameter is handled
    {
        "log": {
            "file": {
                "path": "/var/log/work/group-2_instance-1_traffic.log"
            },
            "offset": 20864105
        },
        "tags": [
            "beats_input_raw_event"
        ],
        "ecs": {
            "version": "1.5.0"
        },
        "agent": {
            "type": "filebeat",
            "hostname": "b16e7c6b2be4",
            "name": "Filebeat Gateway",
            "id": "e1b8bbae-78b8-43ef-9b91-647a9ca1e424",
            "version": "7.8.0",
            "ephemeral_id": "6d5aa448-a23c-4ad6-a136-a0ca0daa07d7"
        },
        "correlationId": "682c0f5fbe23dc8e1d80efe2",
        "transactionElements": {
            "leg1": {
                "operation": "findPetsByStatus",
                "serviceName": "Petstore",
                "protocolInfo": {
                    "http": {
                        "localAddr": "192.168.65.129",
                        "statusText": "OK",
                        "wafStatus": 0,
                        "remotePort": "80",
                        "bytesReceived": 47840,
                        "remoteName": "petstore.swagger.io",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "uri": "/v2/pet/findByStatus",
                        "remoteAddr": "52.86.190.221",
                        "localPort": "52182",
                        "status": 200,
                        "method": "GET",
                        "bytesSent": 480
                    },
                    "recvHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: application/json\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\ntransfer-encoding: chunked\r\nConnection: Close",
                    "sentHeader": "GET /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: petstore.swagger.io\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nAuthorization: Basic WlZLNTI3OWVMQWZ2VW52MmtTejNmcFlMRWtNaFNDemc6\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nReferer: https://api-env:8075/home\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nX-Requested-With: XMLHttpRequest\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 1"
                },
                "duration": 136
            },
            "leg0": {
                "duration": 898,
                "protocolInfo": {
                    "recvHeader": "GET /petstore/v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0\r\nAccept: application/json\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nKeyId: 6cd55c27-675a-444a-9bc7-ae9a7869184d\r\nX-Requested-With: XMLHttpRequest\r\nOrigin: https://api-env:8075\r\nConnection: keep-alive\r\nReferer: https://api-env:8075/home\r\n",
                    "http": {
                        "wafStatus": 0,
                        "localPort": "8065",
                        "method": "GET",
                        "remotePort": "50982",
                        "bytesSent": 47925,
                        "uri": "/petstore/v2/pet/findByStatus",
                        "bytesReceived": 437,
                        "statusText": "OK",
                        "authSubjectId": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                        "localAddr": "192.168.65.129",
                        "remoteName": "192.168.65.1",
                        "remoteAddr": "192.168.65.1",
                        "status": 200
                    },
                    "sentHeader": "HTTP/1.1 200 OK\r\nAccess-Control-Expose-Headers: x-correlationid\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-682c0f5fbe23dc8e1d80efe2 0\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nDate: Wed, 15 Jul 2020 16:18:48 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\nContent-Type: application/json"
                },
                "finalStatus": "Pass",
                "serviceName": "Petstore",
                "operation": "findPetsByStatus"
            }
        },
        "processInfo": {
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "groupId": "group-2",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "serviceId": "instance-1"
        },
        "@timestamp": getDate('8m'),
        "logtype": "openlog",
        "circuitPath": [
            {
                "execTime": 626,
                "filters": [
                    {
                        "execTime": 0,
                        "name": "Set service context",
                        "filterTime": 1594829928429,
                        "type": "VApiServiceContextFilter",
                        "class": "com.vordel.circuit.vapi.VApiServiceContextFilter",
                        "status": "Pass"
                    },
                    {
                        "execTime": 626,
                        "name": "Custom Routing",
                        "filterTime": 1594829929055,
                        "type": "VApiCircuitDelegateFilter",
                        "class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter",
                        "subPaths": [
                            {
                                "execTime": 626,
                                "filters": [
                                    {
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4323849261363416160",
                                        "execTime": 626,
                                        "name": "Default Routing",
                                        "filterTime": 1594829929055,
                                        "type": "SwitchFilter",
                                        "class": "com.vordel.circuit.switchcase.SwitchFilter",
                                        "subPaths": [
                                            {
                                                "execTime": 626,
                                                "filters": [
                                                    {
                                                        "execTime": 626,
                                                        "name": "not-required-here",
                                                        "filterTime": 1594829929055,
                                                        "type": "CircuitDelegateFilter",
                                                        "class": "com.vordel.circuit.CircuitDelegateFilter",
                                                        "subPaths": [
                                                            {
                                                                "execTime": 626,
                                                                "filters": [
                                                                    {
                                                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:5735607394361826155",
                                                                        "execTime": 626,
                                                                        "name": "Connect to URL",
                                                                        "filterTime": 1594829929055,
                                                                        "type": "ConnectToURLFilter",
                                                                        "class": "com.vordel.circuit.net.ConnectToURLFilter",
                                                                        "status": "Pass"
                                                                    }
                                                                ],
                                                                "policy": "Default Profile-based Routing"
                                                            }
                                                        ],
                                                        "status": "Pass"
                                                    }
                                                ],
                                                "policy": "Default API Proxy Routing"
                                            }
                                        ],
                                        "status": "Pass"
                                    }
                                ],
                                "policy": "Default API Proxy Routing"
                            }
                        ],
                        "status": "Pass"
                    }
                ],
                "policy": "API Broker"
            }
        ],
        "transactionSummary": {
            "path": "/petstore/v2/pet/findByStatus",
            "protocol": "https",
            "serviceContext": {
                "duration": 897,
                "app": "Client App",
                "method": "findPetsByStatus",
                "org": "API Development",
                "service": "Petstore",
                "client": "4e8634ba-6762-45ca-bbe5-7ca4e99192ac",
                "monitor": true,
                "status": "success"
            },
            "protocolSrc": "8065",
            "status": "success"
        }
    }
];
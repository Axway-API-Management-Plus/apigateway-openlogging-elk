module.exports = [
    {
        "processInfo": {
            "groupName": "QuickStart Group",
            "hostname": "api-env",
            "version": "7.7.20200130",
            "domainId": "8064faa2-54d2-42aa-b549-af5a0b289284",
            "serviceId": "instance-1",
            "groupId": "group-2",
            "serviceName": "QuickStart Server"
        },
        "transactionSummaryContext": {
            "monitor": true,
            "service": "Petstore HTTP",
            "method": "findPetsByStatus",
            "status": "success",
            "duration": 775,
            "client": "Pass Through"
        },
        "@version": "1",
        "@timestamp": "2020-03-03T14:59:31.540Z",
        "tags": [
            "openlog"
        ],
        "circuitPath": [
            {
                "filters": [
                    {
                        "execTime": 3,
                        "type": "VApiServiceContextFilter",
                        "filterTime": 1583247560270,
                        "name": "Set service context",
                        "status": "Pass",
                        "class": "com.vordel.circuit.vapi.VApiServiceContextFilter"
                    },
                    {
                        "execTime": 327,
                        "type": "VApiCircuitDelegateFilter",
                        "subPaths": [
                            {
                                "filters": [
                                    {
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-4352034672061115765",
                                        "execTime": 326,
                                        "type": "SwitchFilter",
                                        "subPaths": [
                                            {
                                                "filters": [
                                                    {
                                                        "execTime": 314,
                                                        "type": "CircuitDelegateFilter",
                                                        "subPaths": [
                                                            {
                                                                "policy": "Default Profile-based Routing",
                                                                "execTime": 313,
                                                                "filters": [
                                                                    {
                                                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:2309038116292894114",
                                                                        "execTime": 313,
                                                                        "type": "ConnectToURLFilter",
                                                                        "filterTime": 1583247560597,
                                                                        "status": "Pass",
                                                                        "name": "Connect to URL",
                                                                        "class": "com.vordel.circuit.net.ConnectToURLFilter"
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        "filterTime": 1583247560598,
                                                        "status": "Pass",
                                                        "name": "not-required-here",
                                                        "class": "com.vordel.circuit.CircuitDelegateFilter"
                                                    }
                                                ],
                                                "execTime": 314,
                                                "policy": "Default API Proxy Routing"
                                            }
                                        ],
                                        "filterTime": 1583247560598,
                                        "name": "Default Routing",
                                        "status": "Pass",
                                        "class": "com.vordel.circuit.switchcase.SwitchFilter"
                                    }
                                ],
                                "execTime": 326,
                                "policy": "Default API Proxy Routing"
                            }
                        ],
                        "filterTime": 1583247560598,
                        "status": "Pass",
                        "name": "Custom Routing",
                        "class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter"
                    }
                ],
                "execTime": 330,
                "policy": "API Broker"
            }
        ],
        "transactionElements": {
            "leg0": {
                "finalStatus": "Pass",
                "protocolInfo": {
                    "http": {
                        "method": "GET",
                        "remoteAddr": "192.168.65.1",
                        "localAddr": "192.168.65.145",
                        "wafStatus": 0,
                        "bytesSent": 202845,
                        "statusText": "OK",
                        "status": 200,
                        "authSubjectId": "Pass Through",
                        "bytesReceived": 624,
                        "remotePort": "59639",
                        "localPort": "8065",
                        "remoteName": "192.168.65.1",
                        "uri": "/v2/pet/123"
                    },
                    "recvHeader": "GET /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\nCookie: cookie_pressed_153=false; t3-admin-tour-firstshow=1; APIMANAGERSTATIC=6e3ac7af-54dd-44f9-a28b-969180e45914; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; 6e7e1bb1dd446d4cd36889414ccb4cb7=ssrtpsa3ncgqso4peoscloc79t\r\nUpgrade-Insecure-Requests: 1\r\n\r\n",
                    "sentHeader": "HTTP/1.1 200 OK\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-c8705e5ecc00adca32be7472 0\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Origin: *\r\nDate: Tue, 03 Mar 2020 14:59:20 GMT\r\nServer: Jetty(9.2.9.v20150224)\r\nContent-Type: application/xml\r\n\r\n"
                },
                "operation": "findPetsByStatus",
                "duration": 827,
                "leg": 0,
                "serviceName": "Petstore HTTP"
            },
            "leg1": {
                "operation": "findPetsByStatus",
                "protocolInfo": {
                    "http": {
                        "localAddr": "192.168.65.145",
                        "remoteAddr": "23.22.16.221",
                        "bytesSent": 684,
                        "statusText": "OK",
                        "method": "GET",
                        "wafStatus": 0,
                        "status": 200,
                        "authSubjectId": "Pass Through",
                        "bytesReceived": 202751,
                        "remotePort": "80",
                        "remoteName": "petstore.swagger.io",
                        "localPort": "39450",
                        "uri": "/v2/pet/findByStatus"
                    },
                    "recvHeader": "HTTP/1.1 200 OK\r\nDate: Tue, 03 Mar 2020 14:59:20 GMT\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, PUT\r\nAccess-Control-Allow-Headers: Content-Type, api_key, Authorization\r\nContent-Type: application/xml\r\nConnection: close\r\nServer: Jetty(9.2.9.v20150224)\r\n\r\n",
                    "sentHeader": "GET /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: petstore.swagger.io\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nCookie: cookie_pressed_153=false; t3-admin-tour-firstshow=1; APIMANAGERSTATIC=6e3ac7af-54dd-44f9-a28b-969180e45914; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; 6e7e1bb1dd446d4cd36889414ccb4cb7=ssrtpsa3ncgqso4peoscloc79t\r\nUpgrade-Insecure-Requests: 1\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0\r\nConnection: close\r\nX-CorrelationID: Id-c8705e5ecc00adca32be7472 1\r\n\r\n"
                },
                "duration": 130,
                "serviceName": "Petstore HTTP",
                "leg": 1
            }
        },
        "correlationId": "c8705e5ecc00adca32be7472",
        "timestampOriginal": "2020-03-03T14:59:20.467Z",
        "transactionSummary": {
            "serviceContexts": [
                {
                    "monitor": true,
                    "service": "Petstore HTTP",
                    "method": "findPetsByStatus",
                    "status": "success",
                    "duration": 775,
                    "client": "Pass Through"
                }
            ],
            "path": "/v2/pet/findByStatus",
            "protocolSrc": "8065",
            "status": "success",
            "protocol": "https"
        }
    },
    {
        "processInfo": {
            "groupName": "QuickStart Group",
            "hostname": "api-env",
            "version": "7.7.20200130",
            "domainId": "8064faa2-54d2-42aa-b549-af5a0b289284",
            "serviceId": "instance-1",
            "groupId": "group-2",
            "serviceName": "QuickStart Server"
        },
        "transactionSummaryContext": null,
        "@version": "1",
        "@timestamp": "2020-03-03T14:59:31.540Z",
        "tags": [
            "openlog"
        ],
        "circuitPath": [
            {
                "policy": "API Broker",
                "execTime": 1,
                "filters": [
                    {
                        "execTime": 0,
                        "type": "ApiShuntFilter",
                        "filterTime": 1583247561271,
                        "status": "Fail",
                        "name": "Not Found",
                        "class": "com.vordel.coreapireg.runtime.broker.ApiShuntFilter"
                    },
                    {
                        "execTime": 1,
                        "type": "ApiShuntFailureFilter",
                        "filterTime": 1583247561273,
                        "name": "Not Found",
                        "status": "Pass",
                        "class": "com.vordel.coreapireg.runtime.broker.ApiShuntFailureFilter"
                    }
                ]
            }
        ],
        "transactionElements": {
            "leg0": {
                "protocolInfo": {
                    "http": {
                        "bytesSent": 593,
                        "method": "GET",
                        "remoteAddr": "192.168.65.1",
                        "statusText": "Not Found",
                        "wafStatus": 1,
                        "localAddr": "192.168.65.145",
                        "status": 404,
                        "bytesReceived": 511,
                        "remotePort": "59641",
                        "remoteName": "192.168.65.1",
                        "localPort": "8065",
                        "uri": "/favicon.ico"
                    },
                    "recvHeader": "GET /favicon.ico HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0\r\nAccept: image/webp,*/*\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\nCookie: cookie_pressed_153=false; t3-admin-tour-firstshow=1; APIMANAGERSTATIC=6e3ac7af-54dd-44f9-a28b-969180e45914; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; 6e7e1bb1dd446d4cd36889414ccb4cb7=ssrtpsa3ncgqso4peoscloc79t\r\n\r\n",
                    "sentHeader": "HTTP/1.1 404 Not Found\r\nDate: Tue, 03 Mar 2020 14:59:21 GMT\r\nServer: Gateway\r\nContent-Length: 0\r\nConnection: keep-alive\r\nX-CorrelationID: Id-c9705e5ecd000322778d2ec4 0\r\nAccept: image/webp,*/*\r\nAccept-Language: en-US,en;q=0.5\r\nCookie: cookie_pressed_153=false; t3-admin-tour-firstshow=1; APIMANAGERSTATIC=6e3ac7af-54dd-44f9-a28b-969180e45914; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; 6e7e1bb1dd446d4cd36889414ccb4cb7=ssrtpsa3ncgqso4peoscloc79t\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0\r\n\r\n"
                },
                "finalStatus": "Fail",
                "duration": 6,
                "leg": 0
            }
        },
        "correlationId": "c9705e5ecd000322778d2ec4",
        "timestampOriginal": "2020-03-03T14:59:21.273Z",
        "transactionSummary": {
            "serviceContexts": [],
            "path": "/favicon.ico",
            "protocolSrc": "8065",
            "status": "failure",
            "protocol": "https"
        }
    },
    {
        "processInfo": {
            "groupName": "QuickStart Group",
            "hostname": "api-env",
            "version": "7.7.20200130",
            "serviceId": "instance-2",
            "domainId": "8064faa2-54d2-42aa-b549-af5a0b289284",
            "groupId": "group-2",
            "serviceName": "QuickStart Server"
        },
        "transactionSummaryContext": null,
        "@version": "1",
        "@timestamp": "2020-03-03T15:00:21.583Z",
        "tags": [
            "openlog"
        ],
        "circuitPath": [
            {
                "filters": [
                    {
                        "type": "ApiShuntFilter",
                        "execTime": 0,
                        "filterTime": 1583247612175,
                        "name": "Options Request",
                        "status": "Pass",
                        "class": "com.vordel.coreapireg.runtime.broker.ApiShuntFilter"
                    }
                ],
                "execTime": 0,
                "policy": "API Broker"
            }
        ],
        "transactionElements": {
            "leg0": {
                "protocolInfo": {
                    "http": {
                        "localAddr": "192.168.65.145",
                        "method": "OPTIONS",
                        "remoteAddr": "192.168.65.1",
                        "statusText": "OK",
                        "wafStatus": 0,
                        "bytesSent": 350,
                        "status": 200,
                        "bytesReceived": 426,
                        "remotePort": "59668",
                        "remoteName": "192.168.65.1",
                        "localPort": "8065",
                        "uri": "/v2/pet/findByStatus"
                    },
                    "recvHeader": "OPTIONS /v2/pet/findByStatus?status=pending HTTP/1.1\r\nHost: api-env:8065\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0\r\nAccept: */*\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nAccess-Control-Request-Method: GET\r\nAccess-Control-Request-Headers: x-requested-with\r\nReferer: https://api-env:8075/home\r\nOrigin: https://api-env:8075\r\nConnection: keep-alive\r\n\r\n",
                    "sentHeader": "HTTP/1.1 200 OK\r\nDate: Tue, 03 Mar 2020 15:00:12 GMT\r\nAllow: DELETE, GET, HEAD, OPTIONS, POST\r\nAccess-Control-Allow-Headers: x-requested-with\r\nAccess-Control-Allow-Methods: OPTIONS, GET\r\nAccess-Control-Allow-Origin: https://api-env:8075\r\nServer: Gateway\r\nConnection: close\r\nX-CorrelationID: Id-fc705e5ede00654de6d15daf 0\r\nContent-Type: text/plain\r\n\r\n"
                },
                "finalStatus": "Pass",
                "duration": 2,
                "leg": 0
            }
        },
        "correlationId": "fc705e5ede00654de6d15daf",
        "timestampOriginal": "2020-03-03T15:00:12.175Z",
        "transactionSummary": {
            "serviceContexts": [],
            "path": "/v2/pet/findByStatus",
            "protocolSrc": "8065",
            "status": "success",
            "protocol": "https"
        }
    },
    {
        "transactionSummaryContext": null,
        "correlationId": "4e645e5e4600bb590c881179",
        "circuitPath": [
            {
                "policy": "Health Check",
                "execTime": 0,
                "filters": [
                    {
                        "execTime": 0,
                        "status": "Pass",
                        "class": "com.vordel.circuit.conversion.ChangeMessageFilter",
                        "name": "Set Message",
                        "filterTime": 1583244366351,
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:3321373268751955789",
                        "type": "ChangeMessageFilter"
                    },
                    {
                        "execTime": 0,
                        "status": "Pass",
                        "type": "ReflectFilter",
                        "class": "com.vordel.circuit.net.ReflectFilter",
                        "filterTime": 1583244366351,
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4710537086861623998",
                        "name": "Reflect"
                    }
                ]
            }
        ],
        "@version": "1",
        "tags": [
            "openlog"
        ],
        "transactionSummary": {
            "serviceContexts": [],
            "path": "/healthcheck",
            "protocolSrc": "8080",
            "status": "success",
            "protocol": "http"
        },
        "transactionElements": {
            "leg0": {
                "duration": 3,
                "finalStatus": "Pass",
                "protocolInfo": {
                    "recvHeader": "GET /healthcheck HTTP/1.1\r\nHost: api-env:8080\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nUpgrade-Insecure-Requests: 1\r\nPragma: no-cache\r\nCache-Control: no-cache\r\n\r\n",
                    "sentHeader": "HTTP/1.1 200 OK\r\nDate: Tue, 03 Mar 2020 14:06:06 GMT\r\nServer: Gateway\r\nConnection: close\r\nX-CorrelationID: Id-4e645e5e4600bb590c881179 0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nCache-Control: no-cache\r\nHost: api-env:8080\r\nPragma: no-cache\r\nUpgrade-Insecure-Requests: 1\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0\r\nContent-Type: text/xml\r\n\r\n",
                    "http": {
                        "statusText": "OK",
                        "status": 200,
                        "method": "GET",
                        "bytesReceived": 366,
                        "wafStatus": 0,
                        "bytesSent": 464,
                        "localPort": "8080",
                        "remoteName": "192.168.65.145",
                        "uri": "/healthcheck",
                        "remotePort": "40578",
                        "remoteAddr": "192.168.65.145",
                        "localAddr": "192.168.65.145"
                    }
                },
                "leg": 0
            }
        },
        "timestampOriginal": "2020-03-03T14:06:06.351Z",
        "processInfo": {
            "groupName": "QuickStart Group",
            "hostname": "api-env",
            "serviceName": "QuickStart Server",
            "groupId": "group-2",
            "version": "7.7.20200130",
            "serviceId": "instance-1",
            "domainId": "8064faa2-54d2-42aa-b549-af5a0b289284"
        },
        "@timestamp": "2020-03-03T14:16:56.280Z"
    },
    {
        "transactionElements": {
            "leg0": {
                "duration": 35,
                "protocolInfo": {
                    "sentHeader": "HTTP/1.1 200 OK\r\nDate: Tue, 17 Mar 2020 20:19:07 GMT\r\nServer: Gateway\r\nConnection: close\r\nX-CorrelationID: Id-bb30715e5300e189d1da43fc 0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nCookie: cookie_pressed_153=false; t3-admin-tour-firstshow=1; layout_type=table; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on\r\nHost: api-env:8080\r\nUpgrade-Insecure-Requests: 1\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0\r\nContent-Type: text/xml\r\n\r\n",
                    "recvHeader": "GET /healthcheck HTTP/1.1\r\nHost: api-env:8080\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nCookie: cookie_pressed_153=false; t3-admin-tour-firstshow=1; layout_type=table; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on\r\nUpgrade-Insecure-Requests: 1\r\n\r\n",
                    "http": {
                        "localAddr": "1.1.1.1",
                        "uri": "/healthcheck",
                        "authSubjectId": "Chris-Test",
                        "remoteName": "TestHost",
                        "wafStatus": 0,
                        "localPort": "8080",
                        "method": "GET",
                        "statusText": "OK",
                        "remotePort": "53476",
                        "status": 200,
                        "bytesReceived": 500,
                        "remoteAddr": "192.168.65.1",
                        "bytesSent": 598
                    }
                },
                "leg": 0,
                "finalStatus": "Error"
            }
        },
        "@version": "1",
        "transactionSummaryContext": null,
        "correlationId": "bb30715e5300e189d1da43fc",
        "timestampOriginal": "2020-03-17T20:19:07.812Z",
        "circuitPath": [
            {
                "execTime": 1,
                "policy": "Health Check",
                "filters": [
                    {
                        "type": "ChangeMessageFilter",
                        "filterTime": 1584476347799,
                        "status": "Pass",
                        "name": "Set Message",
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:3321373268751955789",
                        "class": "com.vordel.circuit.conversion.ChangeMessageFilter",
                        "execTime": 1
                    },
                    {
                        "type": "SetAttributeFilter",
                        "filterTime": 1584476347799,
                        "status": "Pass",
                        "name": "Set Attribute Filter",
                        "class": "com.vordel.circuit.attribute.SetAttributeFilter",
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:1800719002431272561",
                        "execTime": 0
                    },
                    {
                        "type": "ReflectFilter",
                        "filterTime": 1584476347799,
                        "status": "Pass",
                        "name": "Reflect",
                        "class": "com.vordel.circuit.net.ReflectFilter",
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4710537086861623998",
                        "execTime": 0
                    }
                ]
            }
        ],
        "transactionSummary": {
            "path": "/healthcheck",
            "status": "success",
            "protocol": "http",
            "serviceContexts": [],
            "protocolSrc": "8080"
        },
        "@timestamp": "2020-03-17T20:19:20.945Z",
        "tags": [
            "openlog"
        ],
        "processInfo": {
            "groupId": "group-2",
            "serviceId": "instance-1",
            "hostname": "api-env",
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "version": "7.7.20200130",
            "domainId": "8064faa2-54d2-42aa-b549-af5a0b289284"
        }
    }
];
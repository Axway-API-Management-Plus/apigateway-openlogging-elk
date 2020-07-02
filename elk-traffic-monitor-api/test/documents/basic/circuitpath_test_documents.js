const getDate = require('../../util');

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
        "timestampOriginal": getDate('8m'),
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
        "timestampOriginal": getDate('65m'),
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
        "timestampOriginal": getDate('30000h'),
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
    },
    {
        "transactionElements": {
            "leg0": {
                "leg": 0,
                "protocolInfo": {
                    "recvHeader": "GET /api/portal/v1.3/appinfo HTTP/1.1\r\nHost: 127.0.0.1:8075\r\nAccept: */*\r\nIsApiPortalRequest: true\r\nConnection: close\r\n\r\n",
                    "sentHeader": "HTTP/1.1 200 OK\r\nDate: Tue, 17 Mar 2020 11:18:05 GMT\r\nContent-Type: application/json\r\nCache-Control: no-cache, no-store, must-revalidate\r\nPragma: no-cache\r\nExpires: 0\r\nX-Frame-Options: DENY\r\nX-Content-Type-Options: nosniff\r\nX-XSS-Protection: 0\r\nServer: Gateway\r\nConnection: close\r\nX-CorrelationID: Id-edb1705e7d0168a34d74bfba 0\r\n\r\n",
                    "http": {
                        "localPort": "8075",
                        "method": "GET",
                        "status": 200,
                        "wafStatus": 0,
                        "remoteAddr": "127.0.0.1",
                        "bytesSent": 735,
                        "remotePort": "53514",
                        "uri": "/api/portal/v1.3/appinfo",
                        "localAddr": "127.0.0.1",
                        "statusText": "OK",
                        "bytesReceived": 121,
                        "remoteName": "127.0.0.1"
                    }
                },
                "duration": 12
            }
        },
        "correlationId": "edb1705e7d0168a34d74bfba",
        "@version": "1",
        "circuitPath": [],
        "tags": [
            "openlog"
        ],
        "timestampOriginal": "2020-03-17T11:18:05.378Z",
        "processInfo": {
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "groupId": "group-2",
            "version": "7.7.20200130",
            "serviceId": "instance-1",
            "hostname": "api-env"
        }
    },
    {
        "transactionElements": {
            "leg0": {
                "leg": 0,
                "finalStatus": "Pass",
                "protocolInfo": {
                    "recvHeader": "GET / HTTP/1.1\r\nHost: api-env.demo.axway.com:8075\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nReferer: https://api-env.demo.axway.com:8075/home\r\nConnection: keep-alive\r\nCookie: 6e7e1bb1dd446d4cd36889414ccb4cb7=cakooto11btta81joumss3hnka; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; roundcube_sessid=3qqh3mp9qnrqq0hfrmdvac73sc\r\nUpgrade-Insecure-Requests: 1\r\n\r\n",
                    "sentHeader": "HTTP/1.1 200 OK\r\nDate: Tue, 17 Mar 2020 11:23:06 GMT\r\nServer: Gateway\r\nConnection: close\r\nX-CorrelationID: Id-1ab3705e920284217e6aae73 0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nCache-Control: no-cache, no-store, must-revalidate\r\nContent-Security-Policy: frame-ancestors 'none'\r\nCookie: 6e7e1bb1dd446d4cd36889414ccb4cb7=cakooto11btta81joumss3hnka; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; roundcube_sessid=3qqh3mp9qnrqq0hfrmdvac73sc\r\nExpires: 0\r\nHost: api-env.demo.axway.com:8075\r\nPragma: no-cache\r\nReferer: https://api-env.demo.axway.com:8075/home\r\nUpgrade-Insecure-Requests: 1\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0\r\nX-Content-Type-Options: nosniff\r\nX-Frame-Options: DENY\r\nX-XSS-Protection: 0\r\nContent-Type: text/html\r\n\r\n",
                    "http": {
                        "localPort": "8075",
                        "method": "GET",
                        "status": 200,
                        "wafStatus": 0,
                        "remoteAddr": "10.128.58.136",
                        "bytesSent": 2855,
                        "bytesReceived": 572,
                        "remotePort": "45412",
                        "localAddr": "10.128.58.136",
                        "statusText": "OK",
                        "uri": "/",
                        "remoteName": "10.128.58.136"
                    }
                },
                "duration": 2
            }
        },
        "correlationId": "1ab3705e920284217e6aae73",
        "@version": "1",
        "circuitPath": [
            {
                "execTime": 1,
                "policy": "API Manager Protection Policy",
                "filters": [
                    {
                        "class": "com.vordel.circuit.attribute.SetAttributeFilter",
                        "status": "Pass",
                        "filterTime": 1584444186836,
                        "execTime": 0,
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:3563372240640736537",
                        "name": "Disable Monitoring",
                        "type": "SetAttributeFilter"
                    },
                    {
                        "class": "com.vordel.circuit.CircuitDelegateFilter",
                        "status": "Pass",
                        "filterTime": 1584444186837,
                        "execTime": 1,
                        "subPaths": [
                            {
                                "execTime": 0,
                                "policy": "Secure Headers",
                                "filters": [
                                    {
                                        "class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
                                        "status": "Pass",
                                        "filterTime": 1584444186836,
                                        "execTime": 0,
                                        "type": "AddHTTPHeaderFilter",
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:1018430481999133398",
                                        "name": "Add X-Frame-Options"
                                    },
                                    {
                                        "status": "Pass",
                                        "class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
                                        "filterTime": 1584444186836,
                                        "execTime": 0,
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:2425540468063109194",
                                        "name": "Add X-Content-Type-Options",
                                        "type": "AddHTTPHeaderFilter"
                                    },
                                    {
                                        "class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
                                        "status": "Pass",
                                        "filterTime": 1584444186836,
                                        "execTime": 0,
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-5444113616489599230",
                                        "name": "Add X-XSS-Protection",
                                        "type": "AddHTTPHeaderFilter"
                                    },
                                    {
                                        "class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
                                        "status": "Pass",
                                        "filterTime": 1584444186836,
                                        "execTime": 0,
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:7081893704511792953",
                                        "name": "Add Content-Security-Policy",
                                        "type": "AddHTTPHeaderFilter"
                                    },
                                    {
                                        "class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
                                        "status": "Pass",
                                        "filterTime": 1584444186837,
                                        "execTime": 0,
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-2212651968248743366",
                                        "name": "Add Expires",
                                        "type": "AddHTTPHeaderFilter"
                                    },
                                    {
                                        "class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
                                        "status": "Pass",
                                        "filterTime": 1584444186837,
                                        "execTime": 0,
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:1947547883410725837",
                                        "name": "Add Pragma",
                                        "type": "AddHTTPHeaderFilter"
                                    },
                                    {
                                        "class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
                                        "status": "Pass",
                                        "filterTime": 1584444186837,
                                        "execTime": 0,
                                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:1213862525432630139",
                                        "name": "Add Cache-Control",
                                        "type": "AddHTTPHeaderFilter"
                                    }
                                ]
                            }
                        ],
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-7310008129630418788",
                        "name": "Add Secure Headers",
                        "type": "CircuitDelegateFilter"
                    },
                    {
                        "status": "Fail",
                        "class": "com.vordel.circuit.authn.CheckSessionFilter",
                        "filterTime": 1584444186837,
                        "execTime": 0,
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:1617103538881458172",
                        "name": "Check Session",
                        "type": "CheckSessionFilter"
                    },
                    {
                        "class": "com.vordel.circuit.attribute.CompareAttributeFilter",
                        "status": "Pass",
                        "filterTime": 1584444186837,
                        "execTime": 0,
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:1444681803898426806",
                        "name": "Is This Root or Home?",
                        "type": "CompareAttributeFilter"
                    },
                    {
                        "class": "com.vordel.circuit.attribute.CompareAttributeFilter",
                        "status": "Fail",
                        "filterMessage": "Filter failed",
                        "filterTime": 1584444186837,
                        "execTime": 0,
                        "type": "CompareAttributeFilter",
                        "name": "Query String Exists?",
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-3576911551036060428"
                    },
                    {
                        "status": "Pass",
                        "class": "com.vordel.circuit.file.LoadFileFilter",
                        "filterTime": 1584444186837,
                        "execTime": 0,
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:644437044284765021",
                        "name": "Load API Manager Login Page",
                        "type": "LoadFileFilter"
                    },
                    {
                        "status": "Pass",
                        "class": "com.vordel.circuit.net.ReflectFilter",
                        "filterTime": 1584444186837,
                        "execTime": 0,
                        "espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-3977244110355365495",
                        "name": "Send Login Page",
                        "type": "ReflectFilter"
                    }
                ]
            }
        ],
        "tags": [
            "openlog"
        ],
        "timestampOriginal": "2020-03-17T11:23:06.838Z",
        "processInfo": {
            "groupName": "QuickStart Group",
            "serviceName": "QuickStart Server",
            "domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
            "groupId": "group-2",
            "version": "7.7.20200130",
            "serviceId": "instance-1",
            "hostname": "api-env"
        }
    }
];
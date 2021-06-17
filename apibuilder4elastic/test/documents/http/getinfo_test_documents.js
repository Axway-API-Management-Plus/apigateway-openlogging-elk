const getDate = require('../../util');

module.exports = [
	{
		"@timestamp": "2020-07-03T15:56:11.597Z",
		"transactionElements": {
			"leg1": {
				"duration": 176,
				"operation": "Get-all-todo-items",
				"protocolInfo": {
					"recvHeader": "HTTP/1.1 200 OK\r\nserver: API Builder/4.27.29\r\nrequest-id: e923342a-cf72-4c93-a774-78d1fa80c002\r\nx-xss-protection: 1; mode=block\r\nx-frame-options: DENY\r\nsurrogate-control: no-store\r\ncache-control: no-store, no-cache, must-revalidate, proxy-revalidate\r\npragma: no-cache\r\nexpires: 0\r\nx-content-type-options: nosniff\r\nstart-time: 1593791748423\r\ncontent-type: application/json; charset=utf-8\r\nresponse-time: 1\r\ncontent-md5: 0c682d056c69de8e90bbdf0a677891d8\r\ncontent-length: 281\r\netag: W/\"119-iMSR0WMPy7z6deRjls2eUuMCX5I\"\r\nVary: Accept-Encoding\r\nDate: Fri, 03 Jul 2020 15:55:48 GMT\r\nConnection: close\r\n\r\n",
					"sentHeader": "GET /api/todos HTTP/1.1\r\nHost: 79f6a7dbf03ba9dc3fcdda2486d26adfab68584e.cloudapp-enterprise.appcelerator.com\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\naccept: */*\r\nuser-agent: loadtest/5.0.3\r\nConnection: close\r\nX-CorrelationID: Id-0455ff5e82267be8182a553d 1\r\n\r\n",
					"http": {
						"bytesReceived": 879,
						"uri": "/api/todos",
						"remoteAddr": "52.43.33.149",
						"authSubjectId": "Pass Through",
						"localAddr": "192.168.233.137",
						"remotePort": "80",
						"bytesSent": 266,
						"wafStatus": 0,
						"status": 200,
						"localPort": "43580",
						"statusText": "OK",
						"method": "GET",
						"remoteName": "79f6a7dbf03ba9dc3fcdda2486d26adfab68584e.cloudapp-enterprise.appcelerator.com"
					},
					"recvPayload": "file:///opt/Axway/APIM/apigateway/logs/payloads/2020-07-03/08.55/0455ff5e82267be8182a553d-1-received"
				},
				"leg": 1,
				"serviceName": "ARS ToDo API"
			},
			"leg0": {
				"finalStatus": "Pass",
				"operation": "Get-all-todo-items",
				"protocolInfo": {
					"recvHeader": "GET /ars/api/todos HTTP/1.1\r\nhost: api-env.demo.axway.com:8065\r\nuser-agent: loadtest/5.0.3\r\naccept: */*\r\nConnection: keep-alive\r\n\r\n",
					"sentHeader": "HTTP/1.1 200 OK\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-0455ff5e82267be8182a553d 0\r\ncache-control: no-store, no-cache, must-revalidate, proxy-revalidate\r\nDate: Fri, 03 Jul 2020 15:55:48 GMT\r\netag: W/\"119-iMSR0WMPy7z6deRjls2eUuMCX5I\"\r\nexpires: 0\r\npragma: no-cache\r\nrequest-id: e923342a-cf72-4c93-a774-78d1fa80c002\r\nresponse-time: 1\r\nserver: API Builder/4.27.29\r\nstart-time: 1593791748423\r\nsurrogate-control: no-store\r\nVary: Accept-Encoding\r\nx-content-type-options: nosniff\r\nx-frame-options: DENY\r\nx-xss-protection: 1; mode=block\r\ncontent-md5: 0c682d056c69de8e90bbdf0a677891d8\r\ncontent-type: application/json; charset=utf-8\r\n\r\n",
					"http": {
						"bytesReceived": 131,
						"uri": "/ars/api/todos",
						"remoteAddr": "192.168.233.1",
						"authSubjectId": "Pass Through",
						"localAddr": "192.168.233.137",
						"remotePort": "55783",
						"bytesSent": 952,
						"wafStatus": 0,
						"status": 200,
						"localPort": "8065",
						"statusText": "OK",
						"method": "GET",
						"remoteName": "192.168.233.1"
					},
					"sentPayload": "file:///opt/Axway/APIM/apigateway/logs/payloads/2020-07-03/08.55/0455ff5e82267be8182a553d-0-sent"
				},
				"serviceName": "ARS ToDo API",
				"duration": 384,
				"leg": 0
			}
		},
		"circuitPath": [
			{
				"filters": [
					{
						"class": "com.vordel.circuit.vapi.VApiServiceContextFilter",
						"type": "VApiServiceContextFilter",
						"name": "Set service context",
						"filterTime": 1593791748127,
						"status": "Pass",
						"execTime": 0
					},
					{
						"class": "com.vordel.circuit.CircuitDelegateFilter",
						"status": "Pass",
						"name": "Global Request Policy",
						"filterTime": 1593791748141,
						"type": "CircuitDelegateFilter",
						"subPaths": [
							{
								"filters": [
									{
										"class": "com.vordel.circuit.basic.TraceFilter",
										"type": "TraceFilter",
										"name": "Trace Filter",
										"filterTime": 1593791748141,
										"status": "Pass",
										"espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-2330724604838128298",
										"execTime": 14
									}
								],
								"policy": "Trace",
								"execTime": 14
							}
						],
						"execTime": 14
					},
					{
						"class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter",
						"type": "VApiCircuitDelegateFilter",
						"status": "Pass",
						"filterTime": 1593791748510,
						"name": "Custom Routing",
						"subPaths": [
							{
								"filters": [
									{
										"execTime": 369,
										"class": "com.vordel.circuit.switchcase.SwitchFilter",
										"type": "SwitchFilter",
										"name": "Default Routing",
										"filterTime": 1593791748510,
										"status": "Pass",
										"espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4323849261363416160",
										"subPaths": [
											{
												"filters": [
													{
														"class": "com.vordel.circuit.CircuitDelegateFilter",
														"type": "CircuitDelegateFilter",
														"name": "not-required-here",
														"status": "Pass",
														"filterTime": 1593791748510,
														"subPaths": [
															{
																"filters": [
																	{
																		"class": "com.vordel.circuit.net.ConnectToURLFilter",
																		"type": "ConnectToURLFilter",
																		"name": "Connect to URL",
																		"status": "Pass",
																		"filterTime": 1593791748510,
																		"espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:5735607394361826155",
																		"execTime": 369
																	}
																],
																"policy": "Default Profile-based Routing",
																"execTime": 369
															}
														],
														"execTime": 369
													}
												],
												"policy": "Default API Proxy Routing",
												"execTime": 369
											}
										]
									}
								],
								"policy": "Default API Proxy Routing",
								"execTime": 369
							}
						],
						"execTime": 369
					}
				],
				"policy": "API Broker",
				"execTime": 383
			}
		],
		"transactionSummary": {
			"status": "success",
			"protocol": "https",
			"serviceContext":
			{
				"monitor": true,
				"service": "ARS ToDo API",
				"client": "Pass Through",
				"status": "success",
				"duration": 383,
				"method": "Get-all-todo-items",
				"apiOrg": "Chris Org",
				"apiVersion": "1.0.5",
				"apiDeprecated": false,
				"apiState": "published"
			}
			,
			"protocolSrc": "8065",
			"path": "/ars/api/todos",
            "customProperties": {
                "field1": "DGP"
            },
		},
		"correlationId": "0455ff5e82267be8182a553d",
		"processInfo": {
			"hostname": "api-env",
			"serviceId": "instance-1",
			"groupId": "group-2",
			"serviceName": "QuickStart Server",
			"version": "7.7.20200130",
			"domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
			"groupName": "QuickStart Group"
		}
	},
	// Second document, which is referencing a larger payload
	{
		"@timestamp": "2020-07-03T15:56:11.597Z",
		"transactionElements": {
			"leg1": {
				"duration": 176,
				"operation": "Get-all-todo-items",
				"protocolInfo": {
					"recvHeader": "HTTP/1.1 200 OK\r\nserver: API Builder/4.27.29\r\nrequest-id: e923342a-cf72-4c93-a774-78d1fa80c002\r\nx-xss-protection: 1; mode=block\r\nx-frame-options: DENY\r\nsurrogate-control: no-store\r\ncache-control: no-store, no-cache, must-revalidate, proxy-revalidate\r\npragma: no-cache\r\nexpires: 0\r\nx-content-type-options: nosniff\r\nstart-time: 1593791748423\r\ncontent-type: application/json; charset=utf-8\r\nresponse-time: 1\r\ncontent-md5: 0c682d056c69de8e90bbdf0a677891d8\r\ncontent-length: 281\r\netag: W/\"119-iMSR0WMPy7z6deRjls2eUuMCX5I\"\r\nVary: Accept-Encoding\r\nDate: Fri, 03 Jul 2020 15:55:48 GMT\r\nConnection: close\r\n\r\n",
					"sentHeader": "GET /api/todos HTTP/1.1\r\nHost: 79f6a7dbf03ba9dc3fcdda2486d26adfab68584e.cloudapp-enterprise.appcelerator.com\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\naccept: */*\r\nuser-agent: loadtest/5.0.3\r\nConnection: close\r\nX-CorrelationID: Id-LargePayloadTest 1\r\n\r\n",
					"http": {
						"bytesReceived": 879,
						"uri": "/api/todos",
						"remoteAddr": "52.43.33.149",
						"authSubjectId": "Pass Through",
						"localAddr": "192.168.233.137",
						"remotePort": "80",
						"bytesSent": 266,
						"wafStatus": 0,
						"status": 200,
						"localPort": "43580",
						"statusText": "OK",
						"method": "GET",
						"remoteName": "79f6a7dbf03ba9dc3fcdda2486d26adfab68584e.cloudapp-enterprise.appcelerator.com"
					},
					"recvPayload": "file:///opt/Axway/APIM/apigateway/logs/payloads/2021-01-09/10.00/LargePayloadTest-1-received"
				},
				"leg": 1,
				"serviceName": "ARS ToDo API"
			},
			"leg0": {
				"finalStatus": "Pass",
				"operation": "Get-all-todo-items",
				"protocolInfo": {
					"recvHeader": "GET /ars/api/todos HTTP/1.1\r\nhost: api-env.demo.axway.com:8065\r\nuser-agent: loadtest/5.0.3\r\naccept: */*\r\nConnection: keep-alive\r\n\r\n",
					"sentHeader": "HTTP/1.1 200 OK\r\nMax-Forwards: 20\r\nVia: 1.0 api-env (Gateway)\r\nConnection: close\r\nX-CorrelationID: Id-LargePayloadTest 0\r\ncache-control: no-store, no-cache, must-revalidate, proxy-revalidate\r\nDate: Fri, 03 Jul 2020 15:55:48 GMT\r\netag: W/\"119-iMSR0WMPy7z6deRjls2eUuMCX5I\"\r\nexpires: 0\r\npragma: no-cache\r\nrequest-id: e923342a-cf72-4c93-a774-78d1fa80c002\r\nresponse-time: 1\r\nserver: API Builder/4.27.29\r\nstart-time: 1593791748423\r\nsurrogate-control: no-store\r\nVary: Accept-Encoding\r\nx-content-type-options: nosniff\r\nx-frame-options: DENY\r\nx-xss-protection: 1; mode=block\r\ncontent-md5: 0c682d056c69de8e90bbdf0a677891d8\r\ncontent-type: application/json; charset=utf-8\r\n\r\n",
					"http": {
						"bytesReceived": 131,
						"uri": "/ars/api/todos",
						"remoteAddr": "192.168.233.1",
						"authSubjectId": "Pass Through",
						"localAddr": "192.168.233.137",
						"remotePort": "55783",
						"bytesSent": 952,
						"wafStatus": 0,
						"status": 200,
						"localPort": "8065",
						"statusText": "OK",
						"method": "GET",
						"remoteName": "192.168.233.1"
					},
					"sentPayload": "file:///opt/Axway/APIM/apigateway/logs/payloads/2020-07-03/08.55/0455ff5e82267be8182a553d-0-sent"
				},
				"serviceName": "ARS ToDo API",
				"duration": 384,
				"leg": 0
			}
		},
		"circuitPath": [
			{
				"filters": [
					{
						"class": "com.vordel.circuit.vapi.VApiServiceContextFilter",
						"type": "VApiServiceContextFilter",
						"name": "Set service context",
						"filterTime": 1593791748127,
						"status": "Pass",
						"execTime": 0
					},
					{
						"class": "com.vordel.circuit.CircuitDelegateFilter",
						"status": "Pass",
						"name": "Global Request Policy",
						"filterTime": 1593791748141,
						"type": "CircuitDelegateFilter",
						"subPaths": [
							{
								"filters": [
									{
										"class": "com.vordel.circuit.basic.TraceFilter",
										"type": "TraceFilter",
										"name": "Trace Filter",
										"filterTime": 1593791748141,
										"status": "Pass",
										"espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:-2330724604838128298",
										"execTime": 14
									}
								],
								"policy": "Trace",
								"execTime": 14
							}
						],
						"execTime": 14
					},
					{
						"class": "com.vordel.apiportal.runtime.virtualized.VApiCircuitDelegateFilter",
						"type": "VApiCircuitDelegateFilter",
						"status": "Pass",
						"filterTime": 1593791748510,
						"name": "Custom Routing",
						"subPaths": [
							{
								"filters": [
									{
										"execTime": 369,
										"class": "com.vordel.circuit.switchcase.SwitchFilter",
										"type": "SwitchFilter",
										"name": "Default Routing",
										"filterTime": 1593791748510,
										"status": "Pass",
										"espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:4323849261363416160",
										"subPaths": [
											{
												"filters": [
													{
														"class": "com.vordel.circuit.CircuitDelegateFilter",
														"type": "CircuitDelegateFilter",
														"name": "not-required-here",
														"status": "Pass",
														"filterTime": 1593791748510,
														"subPaths": [
															{
																"filters": [
																	{
																		"class": "com.vordel.circuit.net.ConnectToURLFilter",
																		"type": "ConnectToURLFilter",
																		"name": "Connect to URL",
																		"status": "Pass",
																		"filterTime": 1593791748510,
																		"espk": "DEFAULT_PRIMARY_VordelGateway_7.7.0:5735607394361826155",
																		"execTime": 369
																	}
																],
																"policy": "Default Profile-based Routing",
																"execTime": 369
															}
														],
														"execTime": 369
													}
												],
												"policy": "Default API Proxy Routing",
												"execTime": 369
											}
										]
									}
								],
								"policy": "Default API Proxy Routing",
								"execTime": 369
							}
						],
						"execTime": 369
					}
				],
				"policy": "API Broker",
				"execTime": 383
			}
		],
		"transactionSummary": {
			"status": "success",
			"protocol": "https",
			"serviceContext":
			{
				"monitor": true,
				"service": "ARS ToDo API",
				"client": "Pass Through",
				"status": "success",
				"duration": 383,
				"method": "Get-all-todo-items",
				"apiOrg": "Chris Org",
				"apiVersion": "1.0.5",
				"apiDeprecated": false,
				"apiState": "published"
			}
			,
			"protocolSrc": "8065",
			"path": "/ars/api/todos"
		},
		"correlationId": "LargePayloadTest",
		"processInfo": {
			"hostname": "api-env",
			"serviceId": "instance-1",
			"groupId": "group-2",
			"serviceName": "QuickStart Server",
			"version": "7.7.20200130",
			"domainId": "ed992442-c363-4d36-963a-9e6314b0f421",
			"groupName": "QuickStart Group"
		}
	},
	// HTTP-Request that contains a JMS-Leg
	{
		"correlationId": "28b951603d5a734bcd27c5ce",
		"processInfo": {
			"groupName": "Back",
			"hostname": "api-back-11",
			"version": "7.7.20201130",
			"serviceId": "instance-3",
			"gatewayName": "API-Gateway 1",
			"groupId": "group-3",
			"gatewayRegion": "US"
		},
		"logtype": "openlog",
		"@timestamp": "2021-03-18T07:45:01.000Z",
		"@version": "1",
		"input": {
			"type": "log"
		},
		"tags": [
			"beats_input_raw_event"
		],
		"transactionElements": {
			"leg2": {
				"duration": 0,
				"protocolInfo": {
					"jms": {
						"jmsType": "BytesMessage",
						"jmsDeliveryMode": 2,
						"jmsTimestamp": 1615968552500,
						"jmsPriority": 4,
						"jmsRedelivered": 0,
						"jmsExpiration": 0,
						"jmsProviderURL": "local",
						"jmsReplyTo": "",
						"jmsCorrelationID": "Id-28b951603d5a734bcd27c5ce",
						"jmsStatus": "Success",
						"jmsMessageID": "ID:0180255ae31a25b22.ppr.cloud-37877-1615931207546-677:1:105:42:1",
						"jmsDestination": "queue://com.customer.msg.ABCYY.TEST.XYZEvent_OQ"
					},
					"sentPayload": "file:///Cloud/shared/Openlogs/2021-03-17/09.09/28b951603d5a734bcd27c5ce-2-sent",
					"sentHeader": "{ \"process_id\": \"FRTIAICOMP\", \"status_code\": \"200\", \"receiver\": \"SWORD\", \"partner_info\": \"FreightTiger\", \"sender\": \"FreightTiger\", \"web_service_name\": \"TripStatusService\", \"transfer_id\": \"Id-28b951603d5a734bcd27c5ce\", \"contentType\": \"application\\/json\", \"direction\": \"API2SWORD\", \"timestamp\": \"1615968552465\" }"
				},
				"leg": 2
			},
			"leg1": {
				"duration": 0,
				"protocolInfo": {
					"jms": {
						"jmsTimestamp": 1615968552481,
						"jmsDestination": "queue://com.customer.msg.ABCZZ.TEST.FreightTiger.TripStatusService_OQ",
						"jmsPriority": 4,
						"jmsRedelivered": 0,
						"jmsDeliveryMode": 2,
						"jmsCorrelationID": "Id-28b951603d5a734bcd27c5ce",
						"jmsStatus": "Success",
						"jmsExpiration": 0,
						"jmsProviderURL": "local",
						"jmsType": "BytesMessage",
						"jmsMessageID": "ID:0180255ae31a25b22.ppr.cloud-37877-1615931207546-677:1:105:41:1",
						"jmsReplyTo": ""
					},
					"sentPayload": "file:///Cloud/shared/Openlogs/2021-03-17/09.09/28b951603d5a734bcd27c5ce-1-sent",
					"sentHeader": "{ \"status_code\": \"200\", \"partner_info\": \"FreightTiger\", \"receiver\": \"SWORD\", \"detect1\": \"FRTIAICOMP\", \"sender\": \"FreightTiger\", \"web_service_name\": \"TripStatusService\", \"ProcessID\": \"FRTIAICOMP\", \"transfer_id\": \"Id-28b951603d5a734bcd27c5ce\", \"contentType\": \"application\\/json\", \"direction\": \"API2SWORD\", \"timestamp\": \"1615968552465\" }"
				},
				"leg": 1
			},
			"leg0": {
				"duration": 48,
				"protocolInfo": {
					"recvHeader": "POST /api/FreightTiger/TripStatusService/v1/tripCompleted HTTP/1.1\r\nhost: internal-ppr.eu-central-1.elb.amazonaws.com:8080\r\nAccept: text/plain, application/xml, text/xml, application/json, application/x-jackson-smile, application/cbor, application/*+xml, application/*+json, */*\r\nAccept-Charset: big5, big5-hkscs, cesu-8, euc-jp, euc-kr, gb18030, gb2312, gbk, ibm-thai, ibm00858, ibm01140, ibm01141, ibm01142, ibm01143, ibm01144, ibm01145, ibm01146, ibm01147, ibm01148, ibm01149, ibm037, ibm1026, ibm1047, ibm273, ibm277, ibm278, ibm280, ibm284, ibm285, ibm290, ibm297, ibm420, ibm424, ibm437, ibm500, ibm775, ibm850, ibm852, ibm855, ibm857, ibm860, ibm861, ibm862, ibm863, ibm864, ibm865, ibm866, ibm868, ibm869, ibm870, ibm871, ibm918, iso-2022-cn, iso-2022-jp, iso-2022-jp-2, iso-2022-kr, iso-8859-1, iso-8859-13, iso-8859-15, iso-8859-2, iso-8859-3, iso-8859-4, iso-8859-5, iso-8859-6, iso-8859-7, iso-8859-8, iso-8859-9, jis_x0201, jis_x0212-1990, koi8-r, koi8-u, shift_jis, tis-620, us-ascii, utf-16, utf-16be, utf-16le, utf-32, utf-32be, utf-32le, utf-8, windows-1250, windows-1251, windows-1252, windows-1253, windows-1254, windows-1255, windows-1256, windows-1257, windows-1258, windows-31j, x-big5-hkscs-2001, x-big5-solaris, x-compound_text, x-euc-jp-linux, x-euc-tw, x-eucjp-open, x-ibm1006, x-ibm1025, x-ibm1046, x-ibm1097, x-ibm1098, x-ibm1112, x-ibm1122, x-ibm1123, x-ibm1124, x-ibm1166, x-ibm1364, x-ibm1381, x-ibm1383, x-ibm300, x-ibm33722, x-ibm737, x-ibm833, x-ibm834, x-ibm856, x-ibm874, x-ibm875, x-ibm921, x-ibm922, x-ibm930, x-ibm933, x-ibm935, x-ibm937, x-ibm939, x-ibm942, x-ibm942c, x-ibm943, x-ibm943c, x-ibm948, x-ibm949, x-ibm949c, x-ibm950, x-ibm964, x-ibm970, x-iscii91, x-iso-2022-cn-cns, x-iso-2022-cn-gb, x-iso-8859-11, x-jis0208, x-jisautodetect, x-johab, x-macarabic, x-maccentraleurope, x-maccroatian, x-maccyrillic, x-macdingbat, x-macgreek, x-machebrew, x-maciceland, x-macroman, x-macromania, x-macsymbol, x-macthai, x-macturkish, x-macukraine, x-ms932_0213, x-ms950-hkscs, x-ms950-hkscs-xp, x-mswin-936, x-pck, x-sjis_0213, x-utf-16le-bom, x-utf-32be-bom, x-utf-32le-bom, x-windows-50220, x-windows-50221, x-windows-874, x-windows-949, x-windows-950, x-windows-iso2022jp\r\nContent-Type: application/json\r\nMax-Forwards: 19\r\nUser-Agent: Apache-HttpClient/4.5.6 (Java/1.8.0_212)\r\nVia: 1.0 api-front-21 (), 1.0 api-front-11-i-02daa041429daa2e8 ()\r\nVia: 1.0 api-front-21 ()\r\nX-NewRelic-ID: VgQBU1FVDhAFVFFQBQkFXlI=\r\nX-NewRelic-Transaction: PxQCAFECD1FSV1UHVggHAlJTFB8EBw8RVU4aV1kPVQVRBwpVVAAKUgAAVUNKQQ8HVFNQBwIJFTs=\r\nX-Forwarded-For: 13.234.139.9, 172.27.145.116, 172.27.145.90\r\nX-Forwarded-Port: 8080\r\nX-Forwarded-Proto: http\r\nContent-Length: 1919\r\nConnection: keep-alive\r\n\r\n",
					"http": {
						"wafStatus": 0,
						"localPort": "8080",
						"method": "POST",
						"remotePort": "34478",
						"bytesSent": 2792,
						"uri": "/api/FreightTiger/TripStatusService/v1/tripCompleted",
						"bytesReceived": 4668,
						"authSubjectId": "TripStatusService",
						"statusText": "OK",
						"localAddr": "172.27.145.138",
						"remoteName": "172.27.145.132",
						"remoteAddr": "172.27.145.132",
						"status": 200
					},
					"sentPayload": "file:///Cloud/shared/Openlogs/2021-03-17/09.09/28b951603d5a734bcd27c5ce-0-sent",
					"sentHeader": "HTTP/1.1 200 OK\r\nDate: Wed, 17 Mar 2021 08:09:12 GMT\r\nServer: \r\nConnection: close\r\nX-CorrelationID: Id-28b951603d5a734bcd27c5ce 0\r\nAccept: text/plain, application/xml, text/xml, application/json, application/x-jackson-smile, application/cbor, application/*+xml, application/*+json, */*\r\nAccept-Charset: big5, big5-hkscs, cesu-8, euc-jp, euc-kr, gb18030, gb2312, gbk, ibm-thai, ibm00858, ibm01140, ibm01141, ibm01142, ibm01143, ibm01144, ibm01145, ibm01146, ibm01147, ibm01148, ibm01149, ibm037, ibm1026, ibm1047, ibm273, ibm277, ibm278, ibm280, ibm284, ibm285, ibm290, ibm297, ibm420, ibm424, ibm437, ibm500, ibm775, ibm850, ibm852, ibm855, ibm857, ibm860, ibm861, ibm862, ibm863, ibm864, ibm865, ibm866, ibm868, ibm869, ibm870, ibm871, ibm918, iso-2022-cn, iso-2022-jp, iso-2022-jp-2, iso-2022-kr, iso-8859-1, iso-8859-13, iso-8859-15, iso-8859-2, iso-8859-3, iso-8859-4, iso-8859-5, iso-8859-6, iso-8859-7, iso-8859-8, iso-8859-9, jis_x0201, jis_x0212-1990, koi8-r, koi8-u, shift_jis, tis-620, us-ascii, utf-16, utf-16be, utf-16le, utf-32, utf-32be, utf-32le, utf-8, windows-1250, windows-1251, windows-1252, windows-1253, windows-1254, windows-1255, windows-1256, windows-1257, windows-1258, windows-31j, x-big5-hkscs-2001, x-big5-solaris, x-compound_text, x-euc-jp-linux, x-euc-tw, x-eucjp-open, x-ibm1006, x-ibm1025, x-ibm1046, x-ibm1097, x-ibm1098, x-ibm1112, x-ibm1122, x-ibm1123, x-ibm1124, x-ibm1166, x-ibm1364, x-ibm1381, x-ibm1383, x-ibm300, x-ibm33722, x-ibm737, x-ibm833, x-ibm834, x-ibm856, x-ibm874, x-ibm875, x-ibm921, x-ibm922, x-ibm930, x-ibm933, x-ibm935, x-ibm937, x-ibm939, x-ibm942, x-ibm942c, x-ibm943, x-ibm943c, x-ibm948, x-ibm949, x-ibm949c, x-ibm950, x-ibm964, x-ibm970, x-iscii91, x-iso-2022-cn-cns, x-iso-2022-cn-gb, x-iso-8859-11, x-jis0208, x-jisautodetect, x-johab, x-macarabic, x-maccentraleurope, x-maccroatian, x-maccyrillic, x-macdingbat, x-macgreek, x-machebrew, x-maciceland, x-macroman, x-macromania, x-macsymbol, x-macthai, x-macturkish, x-macukraine, x-ms932_0213, x-ms950-hkscs, x-ms950-hkscs-xp, x-mswin-936, x-pck, x-sjis_0213, x-utf-16le-bom, x-utf-32be-bom, x-utf-32le-bom, x-windows-50220, x-windows-50221, x-windows-874, x-windows-949, x-windows-950, x-windows-iso2022jp\r\nhost: internal-ppr-1756186690.eu-central-1.elb.amazonaws.com:8080\r\nUser-Agent: Apache-HttpClient/4.5.6 (Java/1.8.0_212)\r\nVia: 1.0 api-front-21 (), 1.0 api-front-11-i-02daa041429daa2e8 ()\r\nVia: 1.0 api-front-21 ()\r\nX-Forwarded-For: 13.234.139.9, 172.27.145.116, 172.27.145.90\r\nX-Forwarded-Port: 8080\r\nX-Forwarded-Proto: http\r\nX-NewRelic-ID: VgQBU1FVDhAFVFFQBQkFXlI=\r\nX-NewRelic-Transaction: PxQCAFECD1FSV1UHVggHAlJTFB8EBw8RVU4aV1kPVQVRBwpVVAAKUgAAVUNKQQ8HVFNQBwIJFTs=\r\nContent-Type: text/xml\r\n\r\n",
					"recvPayload": "file:///Cloud/shared/Openlogs/2021-03-17/09.09/28b951603d5a734bcd27c5ce-0-received"
				},
				"finalStatus": "Pass",
				"leg": 0
			}
		},
		"circuitPath": [
			{
				"execTime": 44,
				"filters": [
					{
						"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:-2528794902860473255",
						"name": "Set - key",
						"execTime": 1,
						"filterTime": 1615968552466,
						"type": "SetAttributeFilter",
						"class": "com.vordel.circuit.attribute.SetAttributeFilter",
						"status": "Pass"
					},
					{
						"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:-4549118651442945453",
						"name": "Switch on Attribute Value",
						"execTime": 0,
						"filterTime": 1615968552466,
						"type": "SwitchFilter",
						"class": "com.vordel.circuit.switchcase.SwitchFilter",
						"subPaths": [
							{
								"execTime": 0,
								"filters": [
									{
										"name": "Id-0001606217912475-00000000458465b0-1",
										"execTime": 0,
										"filterTime": 1615968552466,
										"type": "CircuitDelegateFilter",
										"class": "com.vordel.circuit.CircuitDelegateFilter",
										"subPaths": [
											{
												"execTime": 0,
												"filters": [
													{
														"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:1836882866939254745",
														"name": "Set Attribute Filter",
														"execTime": 0,
														"filterTime": 1615968552466,
														"type": "SetAttributeFilter",
														"class": "com.vordel.circuit.attribute.SetAttributeFilter",
														"status": "Pass"
													}
												],
												"policy": "01_tripCompleted"
											}
										],
										"status": "Pass"
									}
								],
								"policy": "00_TripStatusService"
							}
						],
						"status": "Pass"
					},
					{
						"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:-7271086408737941010",
						"name": "Set - Basic Attributes",
						"execTime": 11,
						"filterTime": 1615968552477,
						"type": "CopyAttributeFilter",
						"class": "com.vordel.circuit.attribute.CopyAttributeFilter",
						"status": "Pass"
					},
					{
						"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:3187301204983644793",
						"name": "Set Message",
						"execTime": 1,
						"filterTime": 1615968552478,
						"type": "ChangeMessageFilter",
						"class": "com.vordel.circuit.conversion.ChangeMessageFilter",
						"status": "Pass"
					},
					{
						"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:1475508051071118687",
						"name": "Call '01_SendToSword'{2}",
						"execTime": 18,
						"filterTime": 1615968552496,
						"type": "CircuitDelegateFilter",
						"class": "com.vordel.circuit.CircuitDelegateFilter",
						"subPaths": [
							{
								"execTime": 18,
								"filters": [
									{
										"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:3665205810772220321",
										"name": "Send to JMS SWORD",
										"execTime": 18,
										"filterTime": 1615968552496,
										"type": "JMSFilter",
										"class": "com.vordel.circuit.jms.JMSFilter",
										"status": "Pass"
									},
									{
										"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:-4191996697101265639",
										"name": "Set - Reverse parameters",
										"execTime": 0,
										"filterTime": 1615968552496,
										"type": "CopyAttributeFilter",
										"class": "com.vordel.circuit.attribute.CopyAttributeFilter",
										"status": "Pass"
									},
									{
										"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:-8942093770676368474",
										"name": "Send to Sword Successful",
										"execTime": 0,
										"filterTime": 1615968552496,
										"type": "True",
										"class": "com.vordel.circuit.basic.True",
										"status": "Pass"
									}
								],
								"policy": "01_SendToSword"
							}
						],
						"status": "Pass"
					},
					{
						"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:-5804402612880494120",
						"name": "Call 'Shared_SwingEvents'{4}",
						"execTime": 13,
						"filterTime": 1615968552509,
						"type": "CircuitDelegateFilter",
						"class": "com.vordel.circuit.CircuitDelegateFilter",
						"subPaths": [
							{
								"execTime": 13,
								"filters": [
									{
										"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:1700065433238460290",
										"name": "Validate Swing Flag value",
										"execTime": 0,
										"filterTime": 1615968552496,
										"type": "MessageAttrContentFilter",
										"class": "com.vordel.circuit.attribute.MessageAttrContentFilter",
										"status": "Pass"
									},
									{
										"filterMessage": "Filter failed",
										"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:-2998240472390002075",
										"name": "'Check - If Swing Event is required?'",
										"execTime": 1,
										"filterTime": 1615968552497,
										"type": "CompareAttributeFilter",
										"class": "com.vordel.circuit.attribute.CompareAttributeFilter",
										"status": "Fail"
									},
									{
										"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:8679185627111039572",
										"name": "Scripting Language",
										"execTime": 0,
										"filterTime": 1615968552497,
										"type": "ScriptFilter",
										"class": "com.vordel.circuit.script.ScriptFilter",
										"status": "Pass"
									},
									{
										"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:6704148179040445575",
										"name": "Set Message JSON",
										"execTime": 0,
										"filterTime": 1615968552497,
										"type": "ChangeMessageFilter",
										"class": "com.vordel.circuit.conversion.ChangeMessageFilter",
										"status": "Pass"
									},
									{
										"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:6165462328813719044",
										"name": "Send to JMS SWING",
										"execTime": 12,
										"filterTime": 1615968552509,
										"type": "JMSFilter",
										"class": "com.vordel.circuit.jms.JMSFilter",
										"status": "Pass"
									},
									{
										"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:1380466265606762342",
										"name": "Set - swing_flag",
										"execTime": 0,
										"filterTime": 1615968552509,
										"type": "SetAttributeFilter",
										"class": "com.vordel.circuit.attribute.SetAttributeFilter",
										"status": "Pass"
									}
								],
								"policy": "Shared_SwingEvents"
							}
						],
						"status": "Pass"
					},
					{
						"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:744502124428196374",
						"name": "Set Message back to client",
						"execTime": 0,
						"filterTime": 1615968552509,
						"type": "ChangeMessageFilter",
						"class": "com.vordel.circuit.conversion.ChangeMessageFilter",
						"status": "Pass"
					},
					{
						"espk": "PrimaryStore-a86e9698-9e6f-4a75-a624-5ef21d5a2da1:-3224409535626984015",
						"name": "Reflect Message",
						"execTime": 0,
						"filterTime": 1615968552509,
						"type": "ReflectFilter",
						"class": "com.vordel.circuit.net.ReflectFilter",
						"status": "Pass"
					}
				],
				"policy": "00_TripStatusService"
			}
		],
		"transactionSummary": {
			"path": "/api/FreightTiger/TripStatusService/v1/tripCompleted",
			"protocol": "http",
			"protocolSrc": "8080",
			"status": "success"
		}
	},
	// Reuqest that has not received headers object for one of the legs
	{
		"correlationId": "e81152604ee92d2f0c0ca11b",
		"processInfo": {
			"version": "7.7.20201130",
			"groupId": "group-2",
			"gatewayName": "API-Gateway-Front21",
			"hostname": "api-front-21",
			"groupName": "Front",
			"gatewayRegion": "DE",
			"serviceId": "instance-2"
		},
		"input": {
			"type": "log"
		},
		"logtype": "openlog",
		"@timestamp": "2021-03-17T14:28:52.742Z",
		"circuitPath": [
			{
				"policy": "00_GenericOutbound",
				"execTime": 60597,
				"filters": [
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-6569525906258205296",
						"type": "CircuitDelegateFilter",
						"execTime": 0,
						"filterTime": 1615991272137,
						"class": "com.vordel.circuit.CircuitDelegateFilter",
						"subPaths": [
							{
								"policy": "01_RetreiveHeaders",
								"execTime": 0,
								"filters": [
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:4864177144322103811",
										"type": "CopyAttributeFilter",
										"execTime": 0,
										"filterTime": 1615991272137,
										"class": "com.vordel.circuit.attribute.CopyAttributeFilter",
										"status": "Pass",
										"name": "Set - \"Neccessary Headers\" from Back"
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-6299349265234391439",
										"type": "AttributeExtractHTTPHeaderFilter",
										"execTime": 0,
										"filterTime": 1615991272137,
										"class": "com.vordel.circuit.attribute.AttributeExtractHTTPHeaderFilter",
										"status": "Pass",
										"name": "Retrieve \"Content-Type\" header"
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:4440615232383330440",
										"filterMessage": "Failed to extract attribute HTTP header",
										"execTime": 0,
										"filterTime": 1615991272137,
										"type": "AttributeExtractHTTPHeaderFilter",
										"class": "com.vordel.circuit.attribute.AttributeExtractHTTPHeaderFilter",
										"status": "Fail",
										"name": "Retrieve \"x-sdf-ver\" Header"
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-4477847884769636538",
										"type": "True",
										"execTime": 0,
										"filterTime": 1615991272137,
										"class": "com.vordel.circuit.basic.True",
										"status": "Pass",
										"name": "True Filter"
									}
								]
							}
						],
						"status": "Pass",
						"name": "Call '01_RetreiveHeaders'"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:6833257701005894241",
						"type": "StoreContentBodyToAttributeFilter",
						"execTime": 0,
						"filterTime": 1615991272137,
						"class": "com.vordel.circuit.body.StoreContentBodyToAttributeFilter",
						"status": "Pass",
						"name": "Store - \"Outgoing Payload\""
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-4622368153250437037",
						"type": "CircuitDelegateFilter",
						"execTime": 1,
						"filterTime": 1615991272138,
						"class": "com.vordel.circuit.CircuitDelegateFilter",
						"subPaths": [
							{
								"policy": "01_SetServiceName_&_OperationName",
								"execTime": 0,
								"filters": [
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-7106377242368231966",
										"filterMessage": "Message attribute content check failed",
										"execTime": 0,
										"filterTime": 1615991272137,
										"type": "MessageAttrContentFilter",
										"class": "com.vordel.circuit.attribute.MessageAttrContentFilter",
										"status": "Fail",
										"name": "Check - If Service.name is not null"
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-2438626908822728162",
										"type": "CopyAttributeFilter",
										"execTime": 0,
										"filterTime": 1615991272138,
										"class": "com.vordel.circuit.attribute.CopyAttributeFilter",
										"status": "Pass",
										"name": "Copy / Modify Service name Attributes"
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-8575408364680704078",
										"filterMessage": "Message attribute content check failed",
										"execTime": 0,
										"filterTime": 1615991272138,
										"type": "MessageAttrContentFilter",
										"class": "com.vordel.circuit.attribute.MessageAttrContentFilter",
										"status": "Fail",
										"name": "Check - If Service.name is Set Properly"
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-4565095464170517525",
										"type": "ScriptFilter",
										"execTime": 0,
										"filterTime": 1615991272138,
										"class": "com.vordel.circuit.script.ScriptFilter",
										"status": "Pass",
										"name": "Set - Service Name using Request Path"
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-6398090722716053464",
										"filterMessage": "Message attribute content check failed",
										"execTime": 0,
										"filterTime": 1615991272138,
										"type": "MessageAttrContentFilter",
										"class": "com.vordel.circuit.attribute.MessageAttrContentFilter",
										"status": "Fail",
										"name": "Check - If soap.request.method is not null"
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:7220717848688415498",
										"type": "CopyAttributeFilter",
										"execTime": 0,
										"filterTime": 1615991272138,
										"class": "com.vordel.circuit.attribute.CopyAttributeFilter",
										"status": "Pass",
										"name": "Copy / Modify soap.request.method Attributes "
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:6381865622475643559",
										"type": "RemoveHTTPHeaderFilter",
										"execTime": 0,
										"filterTime": 1615991272138,
										"class": "com.vordel.circuit.conversion.RemoveHTTPHeaderFilter",
										"status": "Pass",
										"name": "Remove HTTP Header service.name"
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-517530580436795312",
										"type": "RemoveHTTPHeaderFilter",
										"execTime": 0,
										"filterTime": 1615991272138,
										"class": "com.vordel.circuit.conversion.RemoveHTTPHeaderFilter",
										"status": "Pass",
										"name": "Remove HTTP Header soap.request.method"
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:7903323124682599754",
										"type": "True",
										"execTime": 0,
										"filterTime": 1615991272138,
										"class": "com.vordel.circuit.basic.True",
										"status": "Pass",
										"name": "True Filter"
									}
								]
							}
						],
						"status": "Pass",
						"name": "01_SetServiceName_&_OperationName"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-8133705022478726654",
						"type": "AttributeExtractHTTPHeaderFilter",
						"execTime": 0,
						"filterTime": 1615991272138,
						"class": "com.vordel.circuit.attribute.AttributeExtractHTTPHeaderFilter",
						"status": "Pass",
						"name": "Retrieve from HTTP header"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-3297587292369633154",
						"type": "RemoveHTTPHeaderFilter",
						"execTime": 0,
						"filterTime": 1615991272138,
						"class": "com.vordel.circuit.conversion.RemoveHTTPHeaderFilter",
						"status": "Pass",
						"name": "Remove - \"partner_info\" HTTP Header"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:240670495870847246",
						"filterMessage": "Filter failed",
						"execTime": 0,
						"filterTime": 1615991272138,
						"type": "SwitchFilter",
						"class": "com.vordel.circuit.switchcase.SwitchFilter",
						"status": "Fail",
						"name": "Check - If Specific Headers need to be removed"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-850382263300599090",
						"type": "CircuitDelegateFilter",
						"execTime": 0,
						"filterTime": 1615991272138,
						"class": "com.vordel.circuit.CircuitDelegateFilter",
						"subPaths": [
							{
								"policy": "01_RemoveHeaders",
								"execTime": 0,
								"filters": [
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-3960281080517734431",
										"type": "RemoveAttributeFilter",
										"execTime": 0,
										"filterTime": 1615991272138,
										"class": "com.vordel.circuit.attribute.RemoveAttributeFilter",
										"status": "Pass",
										"name": "Remove - \"http.headers\""
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:2746295539582074962",
										"filterMessage": "Message attribute content check failed",
										"execTime": 0,
										"filterTime": 1615991272138,
										"type": "MessageAttrContentFilter",
										"class": "com.vordel.circuit.attribute.MessageAttrContentFilter",
										"status": "Fail",
										"name": "Check - If \"SOAPAction\" is not null"
									},
									{
										"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-4200348145945695873",
										"type": "True",
										"execTime": 0,
										"filterTime": 1615991272138,
										"class": "com.vordel.circuit.basic.True",
										"status": "Pass",
										"name": "True Filter"
									}
								]
							}
						],
						"status": "Pass",
						"name": "Call '01_RemoveHeaders'"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-9176117735939388579",
						"filterMessage": "Filter failed",
						"execTime": 3,
						"filterTime": 1615991272141,
						"type": "CompareAttributeFilter",
						"class": "com.vordel.circuit.attribute.CompareAttributeFilter",
						"status": "Fail",
						"name": "Check - If Token Required?"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:7690324826878677749",
						"filterMessage": "Filter failed",
						"execTime": 30167,
						"filterTime": 1615991302308,
						"type": "SwitchFilter",
						"class": "com.vordel.circuit.switchcase.SwitchFilter",
						"subPaths": [
							{
								"policy": "00_GenericOutbound",
								"execTime": 30166,
								"filters": [
									{
										"filterMessage": "Filter failed",
										"execTime": 30166,
										"filterTime": 1615991302308,
										"type": "CircuitDelegateFilter",
										"class": "com.vordel.circuit.CircuitDelegateFilter",
										"subPaths": [
											{
												"policy": "01_RouteToPartner",
												"execTime": 30164,
												"filters": [
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:9197129635495993702",
														"type": "CompareAttributeFilter",
														"execTime": 3,
														"filterTime": 1615991272145,
														"class": "com.vordel.circuit.attribute.CompareAttributeFilter",
														"status": "Pass",
														"name": "Check - If authorization required?"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-264861282795464944",
														"type": "CircuitDelegateFilter",
														"execTime": 12,
														"filterTime": 1615991272157,
														"class": "com.vordel.circuit.CircuitDelegateFilter",
														"subPaths": [
															{
																"policy": "02_CreateAuthorizatonHeader",
																"execTime": 11,
																"filters": [
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:1932490413141985559",
																		"type": "SetAttributeFilter",
																		"execTime": 1,
																		"filterTime": 1615991272146,
																		"class": "com.vordel.circuit.attribute.SetAttributeFilter",
																		"status": "Pass",
																		"name": "Set Attribute Filter"
																	},
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-6541011607030469001",
																		"type": "ScriptFilter",
																		"execTime": 10,
																		"filterTime": 1615991272157,
																		"class": "com.vordel.circuit.script.ScriptFilter",
																		"status": "Pass",
																		"name": "Scripting Language"
																	},
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:758913653687025574",
																		"type": "AddHTTPHeaderFilter",
																		"execTime": 0,
																		"filterTime": 1615991272157,
																		"class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
																		"status": "Pass",
																		"name": "Add HTTP Header"
																	}
																]
															}
														],
														"status": "Pass",
														"name": "Call '02-CreateAuthorizatonHeader'"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:3278395621464818608",
														"type": "MessageAttrContentFilter",
														"execTime": 1,
														"filterTime": 1615991272159,
														"class": "com.vordel.circuit.attribute.MessageAttrContentFilter",
														"status": "Pass",
														"name": "Check - If Endpoint URL is not null"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-8596765099612630214",
														"type": "SetAttributeFilter",
														"execTime": 2,
														"filterTime": 1615991272161,
														"class": "com.vordel.circuit.attribute.SetAttributeFilter",
														"status": "Pass",
														"name": "Store - Endpoint Target"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-5154678206495356745",
														"type": "SwitchFilter",
														"execTime": 1,
														"filterTime": 1615991272162,
														"class": "com.vordel.circuit.switchcase.SwitchFilter",
														"status": "Pass",
														"name": "Switch on Attribute Value put/post/get/delete HTTP method"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:1995464856511813892",
														"type": "SwitchFilter",
														"execTime": 15,
														"filterTime": 1615991272177,
														"class": "com.vordel.circuit.switchcase.SwitchFilter",
														"subPaths": [
															{
																"policy": "01_RouteToPartner",
																"execTime": 14,
																"filters": [
																	{
																		"type": "CircuitDelegateFilter",
																		"execTime": 14,
																		"filterTime": 1615991272177,
																		"class": "com.vordel.circuit.CircuitDelegateFilter",
																		"subPaths": [
																			{
																				"policy": "01_Lacoste_SubscriptionKey",
																				"execTime": 10,
																				"filters": [
																					{
																						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:4593905108142691557",
																						"type": "AddHTTPHeaderFilter",
																						"execTime": 10,
																						"filterTime": 1615991272173,
																						"class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
																						"status": "Pass",
																						"name": "Add \"Subscription Key\" Header"
																					}
																				]
																			}
																		],
																		"status": "Pass",
																		"name": "Id-0001615988280245-000000005c08f493-1"
																	}
																]
															}
														],
														"status": "Pass",
														"name": "Switch Policy - Set HTTP Header or Endpoint URL"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:6455492802561871712",
														"type": "SwitchFilter",
														"execTime": 30130,
														"filterTime": 1615991302307,
														"class": "com.vordel.circuit.switchcase.SwitchFilter",
														"subPaths": [
															{
																"policy": "01_RouteToPartner",
																"execTime": 30130,
																"filters": [
																	{
																		"type": "CircuitDelegateFilter",
																		"execTime": 30130,
																		"filterTime": 1615991302307,
																		"class": "com.vordel.circuit.CircuitDelegateFilter",
																		"subPaths": [
																			{
																				"policy": "02_ConnectToPartner",
																				"execTime": 30129,
																				"filters": [
																					{
																						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-6752274985880204321",
																						"type": "ConnectToURLFilter",
																						"execTime": 30129,
																						"filterTime": 1615991302306,
																						"class": "com.vordel.circuit.net.ConnectToURLFilter",
																						"status": "Error",
																						"name": "Connect to URL"
																					}
																				]
																			}
																		],
																		"status": "Error",
																		"name": "not-required-here"
																	}
																]
															}
														],
														"status": "Error",
														"name": "Switch on Attribute Value - ConnectToPartner"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:2967655146840946840",
														"filterMessage": "Failed in calling policy shortcut",
														"execTime": 0,
														"filterTime": 1615991302307,
														"type": "CircuitDelegateFilter",
														"class": "com.vordel.circuit.CircuitDelegateFilter",
														"subPaths": [
															{
																"policy": "02_CustomerHandler",
																"execTime": 0,
																"filters": [
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-5673860211365946904",
																		"type": "RestoreContentBodyFromAttributeFilter",
																		"execTime": 0,
																		"filterTime": 1615991302307,
																		"class": "com.vordel.circuit.body.RestoreContentBodyFromAttributeFilter",
																		"status": "Pass",
																		"name": "Restore Message"
																	},
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:7924052247136304185",
																		"type": "CompareAttributeFilter",
																		"execTime": 0,
																		"filterTime": 1615991302307,
																		"class": "com.vordel.circuit.attribute.CompareAttributeFilter",
																		"status": "Pass",
																		"name": "Check -\"disconnected while reading\" Error"
																	},
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-5318784556105309949",
																		"type": "SetAttributeFilter",
																		"execTime": 0,
																		"filterTime": 1615991302307,
																		"class": "com.vordel.circuit.attribute.SetAttributeFilter",
																		"status": "Pass",
																		"name": "Set - Time Error"
																	},
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:8179589603182747925",
																		"filterMessage": "Filter failed",
																		"execTime": 0,
																		"filterTime": 1615991302307,
																		"type": "False",
																		"class": "com.vordel.circuit.basic.False",
																		"status": "Fail",
																		"name": "Disconnected While Reading"
																	}
																]
															}
														],
														"status": "Fail",
														"name": "Call 'Disconnected While Reading'"
													}
												]
											}
										],
										"status": "Fail",
										"name": "not-required-here"
									}
								]
							}
						],
						"status": "Fail",
						"name": "Switch - Route To Partner"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-7256964829853286748",
						"filterMessage": "Filter failed",
						"execTime": 0,
						"filterTime": 1615991302308,
						"type": "CompareAttributeFilter",
						"class": "com.vordel.circuit.attribute.CompareAttributeFilter",
						"status": "Fail",
						"name": "Check - If retry is disabled?"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-1468079461725583619",
						"type": "CompareAttributeFilter",
						"execTime": 0,
						"filterTime": 1615991302308,
						"class": "com.vordel.circuit.attribute.CompareAttributeFilter",
						"status": "Pass",
						"name": "Check - If \"disconnected while reading\" Error for \"Route to Partner\""
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-7745865643218397303",
						"type": "RestoreContentBodyFromAttributeFilter",
						"execTime": 0,
						"filterTime": 1615991302308,
						"class": "com.vordel.circuit.body.RestoreContentBodyFromAttributeFilter",
						"status": "Pass",
						"name": "Restore Message - \"Outgoing Payload\""
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-7158714286934396538",
						"filterMessage": "Filter failed",
						"execTime": 30426,
						"filterTime": 1615991332734,
						"type": "SwitchFilter",
						"class": "com.vordel.circuit.switchcase.SwitchFilter",
						"subPaths": [
							{
								"policy": "00_GenericOutbound",
								"execTime": 30426,
								"filters": [
									{
										"filterMessage": "Filter failed",
										"execTime": 30426,
										"filterTime": 1615991332734,
										"type": "CircuitDelegateFilter",
										"class": "com.vordel.circuit.CircuitDelegateFilter",
										"subPaths": [
											{
												"policy": "01_RouteToPartner",
												"execTime": 30426,
												"filters": [
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:9197129635495993702",
														"type": "CompareAttributeFilter",
														"execTime": 4,
														"filterTime": 1615991302312,
														"class": "com.vordel.circuit.attribute.CompareAttributeFilter",
														"status": "Pass",
														"name": "Check - If authorization required?"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-264861282795464944",
														"type": "CircuitDelegateFilter",
														"execTime": 3,
														"filterTime": 1615991302315,
														"class": "com.vordel.circuit.CircuitDelegateFilter",
														"subPaths": [
															{
																"policy": "02_CreateAuthorizatonHeader",
																"execTime": 3,
																"filters": [
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:1932490413141985559",
																		"type": "SetAttributeFilter",
																		"execTime": 3,
																		"filterTime": 1615991302315,
																		"class": "com.vordel.circuit.attribute.SetAttributeFilter",
																		"status": "Pass",
																		"name": "Set Attribute Filter"
																	},
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-6541011607030469001",
																		"type": "ScriptFilter",
																		"execTime": 0,
																		"filterTime": 1615991302315,
																		"class": "com.vordel.circuit.script.ScriptFilter",
																		"status": "Pass",
																		"name": "Scripting Language"
																	},
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:758913653687025574",
																		"type": "AddHTTPHeaderFilter",
																		"execTime": 0,
																		"filterTime": 1615991302315,
																		"class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
																		"status": "Pass",
																		"name": "Add HTTP Header"
																	}
																]
															}
														],
														"status": "Pass",
														"name": "Call '02-CreateAuthorizatonHeader'"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:3278395621464818608",
														"type": "MessageAttrContentFilter",
														"execTime": 1,
														"filterTime": 1615991302316,
														"class": "com.vordel.circuit.attribute.MessageAttrContentFilter",
														"status": "Pass",
														"name": "Check - If Endpoint URL is not null"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-8596765099612630214",
														"type": "SetAttributeFilter",
														"execTime": 2,
														"filterTime": 1615991302318,
														"class": "com.vordel.circuit.attribute.SetAttributeFilter",
														"status": "Pass",
														"name": "Store - Endpoint Target"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-5154678206495356745",
														"type": "SwitchFilter",
														"execTime": 0,
														"filterTime": 1615991302318,
														"class": "com.vordel.circuit.switchcase.SwitchFilter",
														"status": "Pass",
														"name": "Switch on Attribute Value put/post/get/delete HTTP method"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:1995464856511813892",
														"type": "SwitchFilter",
														"execTime": 2,
														"filterTime": 1615991302320,
														"class": "com.vordel.circuit.switchcase.SwitchFilter",
														"subPaths": [
															{
																"policy": "01_RouteToPartner",
																"execTime": 1,
																"filters": [
																	{
																		"type": "CircuitDelegateFilter",
																		"execTime": 1,
																		"filterTime": 1615991302320,
																		"class": "com.vordel.circuit.CircuitDelegateFilter",
																		"subPaths": [
																			{
																				"policy": "01_Lacoste_SubscriptionKey",
																				"execTime": 1,
																				"filters": [
																					{
																						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:4593905108142691557",
																						"type": "AddHTTPHeaderFilter",
																						"execTime": 1,
																						"filterTime": 1615991302320,
																						"class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
																						"status": "Pass",
																						"name": "Add \"Subscription Key\" Header"
																					}
																				]
																			}
																		],
																		"status": "Pass",
																		"name": "Id-0001615988280245-000000005c08f493-1"
																	}
																]
															}
														],
														"status": "Pass",
														"name": "Switch Policy - Set HTTP Header or Endpoint URL"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:6455492802561871712",
														"type": "SwitchFilter",
														"execTime": 30413,
														"filterTime": 1615991332733,
														"class": "com.vordel.circuit.switchcase.SwitchFilter",
														"subPaths": [
															{
																"policy": "01_RouteToPartner",
																"execTime": 30412,
																"filters": [
																	{
																		"type": "CircuitDelegateFilter",
																		"execTime": 30412,
																		"filterTime": 1615991332733,
																		"class": "com.vordel.circuit.CircuitDelegateFilter",
																		"subPaths": [
																			{
																				"policy": "02_ConnectToPartner",
																				"execTime": 30412,
																				"filters": [
																					{
																						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-6752274985880204321",
																						"type": "ConnectToURLFilter",
																						"execTime": 30412,
																						"filterTime": 1615991332733,
																						"class": "com.vordel.circuit.net.ConnectToURLFilter",
																						"status": "Error",
																						"name": "Connect to URL"
																					}
																				]
																			}
																		],
																		"status": "Error",
																		"name": "not-required-here"
																	}
																]
															}
														],
														"status": "Error",
														"name": "Switch on Attribute Value - ConnectToPartner"
													},
													{
														"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:2967655146840946840",
														"filterMessage": "Failed in calling policy shortcut",
														"execTime": 1,
														"filterTime": 1615991332734,
														"type": "CircuitDelegateFilter",
														"class": "com.vordel.circuit.CircuitDelegateFilter",
														"subPaths": [
															{
																"policy": "02_CustomerHandler",
																"execTime": 1,
																"filters": [
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-5673860211365946904",
																		"type": "RestoreContentBodyFromAttributeFilter",
																		"execTime": 1,
																		"filterTime": 1615991332734,
																		"class": "com.vordel.circuit.body.RestoreContentBodyFromAttributeFilter",
																		"status": "Pass",
																		"name": "Restore Message"
																	},
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:7924052247136304185",
																		"type": "CompareAttributeFilter",
																		"execTime": 0,
																		"filterTime": 1615991332734,
																		"class": "com.vordel.circuit.attribute.CompareAttributeFilter",
																		"status": "Pass",
																		"name": "Check -\"disconnected while reading\" Error"
																	},
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-5318784556105309949",
																		"type": "SetAttributeFilter",
																		"execTime": 0,
																		"filterTime": 1615991332734,
																		"class": "com.vordel.circuit.attribute.SetAttributeFilter",
																		"status": "Pass",
																		"name": "Set - Time Error"
																	},
																	{
																		"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:8179589603182747925",
																		"filterMessage": "Filter failed",
																		"execTime": 0,
																		"filterTime": 1615991332734,
																		"type": "False",
																		"class": "com.vordel.circuit.basic.False",
																		"status": "Fail",
																		"name": "Disconnected While Reading"
																	}
																]
															}
														],
														"status": "Fail",
														"name": "Call 'Disconnected While Reading'"
													}
												]
											}
										],
										"status": "Fail",
										"name": "not-required-here"
									}
								]
							}
						],
						"status": "Fail",
						"name": "Switch - Route To Partner - retry"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:7748848491937190812",
						"type": "ChangeMessageFilter",
						"execTime": 0,
						"filterTime": 1615991332734,
						"class": "com.vordel.circuit.conversion.ChangeMessageFilter",
						"status": "Pass",
						"name": "Set - 'Network Error'"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:-2621224816789736192",
						"type": "AddHTTPHeaderFilter",
						"execTime": 0,
						"filterTime": 1615991332734,
						"class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
						"status": "Pass",
						"name": "Add HTTP Header - status code"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:4016478799288367361",
						"type": "AddHTTPHeaderFilter",
						"execTime": 0,
						"filterTime": 1615991332734,
						"class": "com.vordel.circuit.conversion.AddHTTPHeaderFilter",
						"status": "Pass",
						"name": "Add HTTP Header event code"
					},
					{
						"espk": "PrimaryStore-51a968ee-482b-44e7-bd6a-a270afc0365f:5682613315966275271",
						"type": "ReflectFilter",
						"execTime": 0,
						"filterTime": 1615991332734,
						"class": "com.vordel.circuit.net.ReflectFilter",
						"status": "Pass",
						"name": "Reflect Message and failed status "
					}
				]
			}
		],
		"tags": [
			"beats_input_raw_event",
			"_httprequestfailure"
		],
		"@version": "1",
		"transactionElements": {
			"leg0": {
				"duration": 60607,
				"protocolInfo": {
					"recvHeader": "POST /api/Lacoste/BookingService/v1 HTTP/1.1\r\nhost: internal.eu-central-1.elb.amazonaws.com:8080\r\nBDID: 12345\r\nContent-Type: application/xml\r\nfile_name: STS_12345_67890.xml\r\njms.header.JMSCorrelationID: Unknown JMS Correlation ID: Wed Mar 17 15:27:52 CET 2021\r\njms.header.JMSDeliveryMode: 2\r\njms.header.JMSMessageID: ID:0180255ae31a25b22.ppr.de.customer-37877-1615931207546-948:1:1:1:1\r\njms.header.JMSPriority: 4\r\njms.header.JMSTimestamp: 1615991272111\r\njms.header.JMSType: TextMessage\r\npartner_info: Lacoste_BookingService_booking\r\nprocess_id: LACOWSO2XM\r\nUser-Agent: \r\nX-CorrelationID: Id-e8115260f70ab7251e4fa48a 1\r\nX-Forwarded-For: 172.27.145.175\r\nX-Forwarded-Port: 8080\r\nX-Forwarded-Proto: http\r\nContent-Length: 568\r\nConnection: keep-alive\r\n\r\n",
					"http": {
						"wafStatus": 0,
						"bytesReceived": 1386,
						"localPort": "8080",
						"method": "POST",
						"statusText": "Internal Server Error",
						"remotePort": "45494",
						"bytesSent": 473,
						"localAddr": "172.27.145.116",
						"uri": "/api/Lacoste/BookingService/v1",
						"remoteName": "172.27.145.72",
						"remoteAddr": "172.27.145.72",
						"status": 500
					},
					"sentPayload": "file:///Cloud/shared/Openlogs/2021-03-17/15.28/e81152604ee92d2f0c0ca11b-0-sent",
					"sentHeader": "HTTP/1.1 500 Internal Server Error\r\nDate: Wed, 17 Mar 2021 14:27:52 GMT\r\nServer: \r\nConnection: close\r\nX-CorrelationID: Id-e81152604ee92d2f0c0ca11b 0\r\nAuthorization: Basic NTQ1OTJiNjMtNmIzMi00YjA5LWE2MmQtZjljYmNlZDJiYjU4Om9Xa0dneUYzZWpFMVdnNmJpRC9DQ2xhUU9ZL2ZTeWFUbmpMTyswYm1Bb2c9\r\nOcp-Apim-Subscription-Key: 0d33ee1519224f66aa50b37033cd14fe\r\event.eventcode: E2130\r\nstatus.code: 500\r\nContent-Type: application/xml\r\n\r\n",
					"recvPayload": "file:///Cloud/shared/Openlogs/2021-03-17/15.27/e81152604ee92d2f0c0ca11b-0-received"
				},
				"finalStatus": "Pass",
				"leg": 0
			},
			"leg2": {
				"duration": 0,
				"protocolInfo": {
					"http": {
						"wafStatus": 0,
						"localPort": "59552",
						"method": "POST",
						"remotePort": "443",
						"bytesSent": 1014,
						"uri": "/Overseas/booking-process",
						"bytesReceived": 0,
						"statusText": "OK",
						"localAddr": "172.27.145.116",
						"sslSubject": "/C=US/ST=WA/L=Redmond/O=Microsoft Corporation/CN=*.azure-api.net",
						"remoteName": "lacoste-apm-global-frc-uat.azure-api.net",
						"remoteAddr": "51.103.43.155",
						"status": 200
					},
					"sentPayload": "file:///Cloud/shared/Openlogs/2021-03-17/15.28/e81152604ee92d2f0c0ca11b-2-sent",
					"sentHeader": "POST /Overseas/booking-process HTTP/1.1\r\nHost: lacoste-apm-global-frc-uat.azure-api.net\r\nMax-Forwards: 20\r\nVia: 1.0 api-front-21 ()\r\nAuthorization: Basic NTQ1OTJiNjMtNmIzMi00YjA5LWE2MmQtZjljYmNlZDJiYjU4Om9Xa0dneUYzZWpFMVdnNmJpRC9DQ2xhUU9ZL2ZTeWFUbmpMTyswYm1Bb2c9\r\nOcp-Apim-Subscription-Key: 0d33ee1519224f66aa50b37033cd14fe\r\nContent-Length: 568\r\nConnection: close\r\nX-CorrelationID: Id-e81152604ee92d2f0c0ca11b 2\r\nContent-Type: application/xml\r\n\r\n"
				},
				"leg": 2
			},
			"leg1": {
				"duration": 0,
				"protocolInfo": {
					"http": {
						"wafStatus": 0,
						"localPort": "59348",
						"method": "POST",
						"remotePort": "443",
						"bytesSent": 1014,
						"uri": "/Overseas/booking-process",
						"bytesReceived": 0,
						"statusText": "OK",
						"localAddr": "172.27.145.116",
						"sslSubject": "/C=US/ST=WA/L=Redmond/O=Microsoft Corporation/CN=*.azure-api.net",
						"remoteName": "lacoste-apm-global-frc-uat.azure-api.net",
						"remoteAddr": "51.103.43.155",
						"status": 200
					},
					"sentPayload": "file:///Cloud/shared/Openlogs/2021-03-17/15.27/e81152604ee92d2f0c0ca11b-1-sent",
					"sentHeader": "POST /Overseas/booking-process HTTP/1.1\r\nHost: lacoste-apm-global-frc-uat.azure-api.net\r\nMax-Forwards: 20\r\nVia: 1.0 api-front-21 ()\r\nAuthorization: Basic NTQ1OTJiNjMtNmIzMi00YjA5LWE2MmQtZjljYmNlZDJiYjU4Om9Xa0dneUYzZWpFMVdnNmJpRC9DQ2xhUU9ZL2ZTeWFUbmpMTyswYm1Bb2c9\r\nOcp-Apim-Subscription-Key: 0d33ee1519224f66aa50b37033cd14fe\r\nContent-Length: 568\r\nConnection: close\r\nX-CorrelationID: Id-e81152604ee92d2f0c0ca11b 1\r\nContent-Type: application/xml\r\n\r\n"
				},
				"leg": 1
			}
		},
		"transactionSummary": {
			"path": "/api/Lacoste/BookingService/v1",
			"protocol": "http",
			"protocolSrc": "8080",
			"status": "success"
		}
	}
]
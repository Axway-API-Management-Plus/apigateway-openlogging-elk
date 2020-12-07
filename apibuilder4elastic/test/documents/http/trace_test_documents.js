const getDate = require('../../util');

module.exports = [
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 80,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "TRACE-TEST-DEPTH",
		"message": "             Trace Filter {",
		"@timestamp": "2020-07-02T10:37:55.790Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 10,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "TRACE-TEST-DEPTH",
		"message": "                     Value:     {customProperty3=false}",
		"@timestamp": "2020-07-02T10:37:55.790Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "WARN",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 30,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "TRACE-TEST-DEPTH",
		"message": "No leading spaces for this message",
		"@timestamp": "2020-07-02T10:37:55.790Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "ERROR",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 150,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "TRACE-TEST-DEPTH",
		"message": "        connection timed out after 30000ms",
		"@timestamp": "2020-07-02T10:37:55.790Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 713446,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "             Trace Filter {",
		"@timestamp": "2020-07-02T10:37:49.790Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 713538,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 api.application.quota.warn.percent {",
		"@timestamp": "2020-07-02T10:37:49.790Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 713656
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     80",
		"@timestamp": "2020-07-02T10:37:49.790Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 713755
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:49.790Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 713868,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:49.790Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 713951,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 api.custom.properties {",

		"@timestamp": "2020-07-02T10:37:49.794Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 714056,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     (not set)",

		"@timestamp": "2020-07-02T10:37:49.794Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 714162,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      (unknown)",

		"@timestamp": "2020-07-02T10:37:49.794Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 714268,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:49.798Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 714351,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 api.id {",

		"@timestamp": "2020-07-02T10:37:49.814Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 714441,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     3cdd611b-b433-49b9-b65a-f21bd3c3ddbb",

		"@timestamp": "2020-07-02T10:37:49.814Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 714574,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:49.814Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 714687,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 714770,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 api.method.id {",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 714867,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     a49c8c50-a70c-44af-b63a-3bef6a5d6325",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 715000
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 715113,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 715196,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 api.method.name {",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 715295,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     Get-all-todo-items",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 715410,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 715523,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 715606
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 api.method.path {",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 715705,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     /todos",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 715808
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 715921
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.413Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 716004,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 api.name {",

		"@timestamp": "2020-07-02T10:37:55.414Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 716096,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     ARS ToDo API",

		"@timestamp": "2020-07-02T10:37:55.414Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 716205,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.414Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 716318,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.414Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 716401,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 api.path {",

		"@timestamp": "2020-07-02T10:37:55.414Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 716493,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     /ars/pups",

		"@timestamp": "2020-07-02T10:37:55.414Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 716599
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.414Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 716712
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.414Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 716795,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 api.system.quota.warn.percent {",

		"@timestamp": "2020-07-02T10:37:55.414Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 716908,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     80",

		"@timestamp": "2020-07-02T10:37:55.415Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 717007,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.415Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 717120,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.415Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 717203,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 apigw.maintenance.ongoing {",

		"@timestamp": "2020-07-02T10:37:55.428Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 717312,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     false",

		"@timestamp": "2020-07-02T10:37:55.428Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 717414,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.428Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 717527,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.429Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 717610
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 apiruntime.apiproxy {",

		"@timestamp": "2020-07-02T10:37:55.429Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 717713,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "\", discriminator: \"null\", oneOf: \"null\", allOf: \"null\", anyOf: \"null\"}",

		"@timestamp": "2020-07-02T10:37:55.429Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 718618,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.apiportal.api.portal.model.swagger.v11ex.Swagger",

		"@timestamp": "2020-07-02T10:37:55.429Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 718774,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.429Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 718857,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 apiruntime.apiproxy.method {",

		"@timestamp": "2020-07-02T10:37:55.429Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 718967,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     com.vordel.apiportal.api.portal.model.proxy.VirtualizedAPIMethod@28d7f311",

		"@timestamp": "2020-07-02T10:37:55.429Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 719137,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.apiportal.api.portal.model.proxy.VirtualizedAPIMethod",

		"@timestamp": "2020-07-02T10:37:55.429Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 719298
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.429Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 719381,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 apiruntime.authN {",

		"@timestamp": "2020-07-02T10:37:55.430Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 719481,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "",

		"@timestamp": "2020-07-02T10:37:55.430Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 719685,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.coreapireg.runtime.AuthResult",

		"@timestamp": "2020-07-02T10:37:55.430Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 719822
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.430Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 719905,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 authentication.subject.id {",

		"@timestamp": "2020-07-02T10:37:55.430Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 720014,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     Pass Through",

		"@timestamp": "2020-07-02T10:37:55.430Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 720123,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.432Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 720236
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.432Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 720319
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 content.body {",

		"@timestamp": "2020-07-02T10:37:55.432Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 720415
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     (not set)",

		"@timestamp": "2020-07-02T10:37:55.433Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 720521,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      (unknown)",

		"@timestamp": "2020-07-02T10:37:55.433Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 720627,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.433Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 720710,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 destinationURL {",

		"@timestamp": "2020-07-02T10:37:55.433Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 720808,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     http://79f6a7dbf03ba9dc3fcdda2486d26adfab68584e.cloudapp-enterprise.appcelerator.com/api/todos",

		"@timestamp": "2020-07-02T10:37:55.433Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 720999,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.433Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 721112,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.434Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 721195,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 dwe.protocol {",

		"@timestamp": "2020-07-02T10:37:55.434Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 721291,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     com.vordel.dwe.http.HTTPProtocol@63708e4",

		"@timestamp": "2020-07-02T10:37:55.434Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 721428,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.dwe.http.HTTPProtocol",

		"@timestamp": "2020-07-02T10:37:55.434Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 721557,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.434Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 721640
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.client {",

		"@timestamp": "2020-07-02T10:37:55.434Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 721735
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     com.vordel.dwe.http.ServerTransaction@7e8df70f",

		"@timestamp": "2020-07-02T10:37:55.434Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 721878,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.dwe.http.ServerTransaction",

		"@timestamp": "2020-07-02T10:37:55.434Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 722012
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.434Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 722095,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.content.headers {",

		"@timestamp": "2020-07-02T10:37:55.436Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 722199
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     {}",

		"@timestamp": "2020-07-02T10:37:55.436Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 722298,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.mime.HeaderSet",

		"@timestamp": "2020-07-02T10:37:55.436Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 722420
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.448Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 722503,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.headers {",

		"@timestamp": "2020-07-02T10:37:55.448Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 722599,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     com.vordel.common.util.BinaryEscapeFilter@5ffbb220",

		"@timestamp": "2020-07-02T10:37:55.448Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 722746,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.mime.HeaderSet",

		"@timestamp": "2020-07-02T10:37:55.448Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 722868
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.448Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 722951,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.querystring {",

		"@timestamp": "2020-07-02T10:37:55.448Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 723051,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     com.vordel.mime.QueryStringHeaderSet@48238db5",

		"@timestamp": "2020-07-02T10:37:55.448Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 723193
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.mime.QueryStringHeaderSet",

		"@timestamp": "2020-07-02T10:37:55.448Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 723326,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.448Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 723409
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.raw.querystring {",

		"@timestamp": "2020-07-02T10:37:55.449Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 723513,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     (not set)",

		"@timestamp": "2020-07-02T10:37:55.449Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 723619,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      (unknown)",

		"@timestamp": "2020-07-02T10:37:55.449Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 723725
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.449Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 723808,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.cipher {",

		"@timestamp": "2020-07-02T10:37:55.449Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 723911,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     ECDHE-RSA-AES128-GCM-SHA256",

		"@timestamp": "2020-07-02T10:37:55.449Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 724035
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.449Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 724148
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.449Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 724231,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.clientaddr {",

		"@timestamp": "2020-07-02T10:37:55.449Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 724338
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     192.168.233.1",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 724448,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.net.InetSocketAddress",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 724571,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 724654
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.clientcert {",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 724761,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     (not set)",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 724867,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      (unknown)",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 724973,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 725056,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.hostname {",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 725161
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     192.168.233.1",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 725271
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 725384,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 725467,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.incoming.path {",

		"@timestamp": "2020-07-02T10:37:55.450Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 725577,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     /ars/pups/todos",

		"@timestamp": "2020-07-02T10:37:55.451Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 725689
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.451Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 725802
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.451Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 725885,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.ip {",

		"@timestamp": "2020-07-02T10:37:55.451Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 725984,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     192.168.233.137",

		"@timestamp": "2020-07-02T10:37:55.451Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 726096,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.451Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 726209,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.451Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 726292,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.localaddr {",

		"@timestamp": "2020-07-02T10:37:55.451Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 726398,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     /192.168.233.137:8065",

		"@timestamp": "2020-07-02T10:37:55.451Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 726516,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.net.InetSocketAddress",

		"@timestamp": "2020-07-02T10:37:55.452Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 726639,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.452Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 726722,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.method {",

		"@timestamp": "2020-07-02T10:37:55.452Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 726825,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     GET",

		"@timestamp": "2020-07-02T10:37:55.464Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 726925,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.464Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 727038,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.464Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 727121,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.path {",

		"@timestamp": "2020-07-02T10:37:55.464Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 727222
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     /ars/pups/todos",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 727334
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 727447,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 727530,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.protocol {",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 727635,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     https",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 727737,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 727850
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 727933,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.rawURI {",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 728036,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     /ars/pups/todos",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 728148,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 728261
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 728344,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.rawURI.fragment {",

		"@timestamp": "2020-07-02T10:37:55.465Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 728456,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     (not set)",

		"@timestamp": "2020-07-02T10:37:55.466Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 728562
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      (unknown)",

		"@timestamp": "2020-07-02T10:37:55.466Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 728668,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.466Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 728751,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.rawURI.path {",

		"@timestamp": "2020-07-02T10:37:55.466Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 728859
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     /ars/pups/todos",

		"@timestamp": "2020-07-02T10:37:55.466Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 728971,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:37:55.466Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 729084,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.467Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 729167,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.rawURI.query {",

		"@timestamp": "2020-07-02T10:37:55.467Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 729276,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     (not set)",

		"@timestamp": "2020-07-02T10:37:55.467Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 729382,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      (unknown)",

		"@timestamp": "2020-07-02T10:37:55.468Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 729488,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:37:55.468Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 729571,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.sni {",

		"@timestamp": "2020-07-02T10:37:55.468Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 729671,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     api-env.demo.axway.com",

		"@timestamp": "2020-07-02T10:37:55.485Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 729790
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:38:00.335Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 729903,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.335Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 729986,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.uri {",

		"@timestamp": "2020-07-02T10:38:00.335Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 730086
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     /ars/pups/todos",

		"@timestamp": "2020-07-02T10:38:00.335Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 730198,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.net.URI",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 730307,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 730390,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.url {",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 730490,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     https://api-env.demo.axway.com:8065/ars/pups/todos",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 730637,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.net.URL",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 730746
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 730829
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.verb {",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 730930,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     GET",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 731030,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 731143,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 731226,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 http.request.version {",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 731330,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     1.0",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 731430,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 731543
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 731626,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 id {",

		"@timestamp": "2020-07-02T10:38:00.336Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 731712,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     Id-f1aefd5e3501dd00a16eebc0",

		"@timestamp": "2020-07-02T10:38:00.338Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 731836,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:38:00.338Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 731949,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.338Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 732032
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 leg0 {",

		"@timestamp": "2020-07-02T10:38:00.341Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 732120
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "",

		"@timestamp": "2020-07-02T10:38:00.341Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 732412,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.vary.VariantObject",

		"@timestamp": "2020-07-02T10:38:00.341Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 732538,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.342Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 732621,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 message.client.name {",

		"@timestamp": "2020-07-02T10:38:00.342Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 732724,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     192.168.233.1",

		"@timestamp": "2020-07-02T10:38:00.342Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 732834,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:38:00.343Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 732947,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.343Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 733030,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 message.local.address {",

		"@timestamp": "2020-07-02T10:38:00.343Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 733135,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     /192.168.233.137:8065",

		"@timestamp": "2020-07-02T10:38:00.362Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 733253,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.net.InetSocketAddress",

		"@timestamp": "2020-07-02T10:38:00.362Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 733376,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.362Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 733459
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 message.metrics.transaction {",

		"@timestamp": "2020-07-02T10:38:00.362Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 733570,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     com.vordel.dwe.http.ServerTransaction@7e8df70f",

		"@timestamp": "2020-07-02T10:38:00.362Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 733713
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.dwe.http.ServerTransaction",

		"@timestamp": "2020-07-02T10:38:00.362Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 733847,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.373Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 733930
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 message.protocol.type {",

		"@timestamp": "2020-07-02T10:38:00.373Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 734035
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     http",

		"@timestamp": "2020-07-02T10:38:00.373Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 734136,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:38:00.373Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 734249
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.373Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 734332,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 message.reception_date {",

		"@timestamp": "2020-07-02T10:38:00.373Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 734438
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     Thu Jul 02 02:54:57 MST 2020",

		"@timestamp": "2020-07-02T10:38:00.374Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 734563,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.util.Date",

		"@timestamp": "2020-07-02T10:38:00.374Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 734674,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.374Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 734757,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 message.reception_time {",

		"@timestamp": "2020-07-02T10:38:00.374Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 734863,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     1593683697922",

		"@timestamp": "2020-07-02T10:38:00.374Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 734973,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.Long",

		"@timestamp": "2020-07-02T10:38:00.374Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 735084,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.374Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 735167,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 message.source {",

		"@timestamp": "2020-07-02T10:38:00.374Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 735265,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     8065",

		"@timestamp": "2020-07-02T10:38:00.374Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 735366,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:38:00.375Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 735479,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.375Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 735562,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 message.uri {",

		"@timestamp": "2020-07-02T10:38:00.375Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 735657
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     /ars/pups/todos",

		"@timestamp": "2020-07-02T10:38:00.378Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 735769,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.net.URI",

		"@timestamp": "2020-07-02T10:38:00.378Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 735878
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.378Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 735961,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 monitoring.enabled {",

		"@timestamp": "2020-07-02T10:38:00.378Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 736063,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     true",

		"@timestamp": "2020-07-02T10:38:00.378Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 736164,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.Boolean",

		"@timestamp": "2020-07-02T10:38:00.378Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 736278,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 736361,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 params.form {",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 736456,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     com.vordel.mime.QueryStringHeaderSet@76edcc7d",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 736598
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.mime.QueryStringHeaderSet",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 736731,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 736814,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 params.header {",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 736911,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     {}",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 737010,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.mime.HeaderSet",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 737132
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 737215,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 params.in.header {",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 737315,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "}",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 737868,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.mime.HeaderSet",

		"@timestamp": "2020-07-02T10:38:00.379Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 737990,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.380Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 738073,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 params.path {",

		"@timestamp": "2020-07-02T10:38:00.380Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 738168,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     {}",

		"@timestamp": "2020-07-02T10:38:00.380Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 738267
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.util.HashMap",

		"@timestamp": "2020-07-02T10:38:00.380Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 738381,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.380Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 738464,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 params.query {",

		"@timestamp": "2020-07-02T10:38:00.380Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 738560
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     com.vordel.mime.QueryStringHeaderSet@67497820",

		"@timestamp": "2020-07-02T10:38:00.381Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 738702,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.mime.QueryStringHeaderSet",

		"@timestamp": "2020-07-02T10:38:00.381Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 738835,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:00.381Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 738918,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 resolved.to.path {",

		"@timestamp": "2020-07-02T10:38:00.431Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 739018,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     /",

		"@timestamp": "2020-07-02T10:38:00.431Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 739116,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:38:00.431Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 739229,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:09.569Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 739312,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 rest {",

		"@timestamp": "2020-07-02T10:38:09.590Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 739400
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "",

		"@timestamp": "2020-07-02T10:38:09.590Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 739604
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.coreapireg.runtime.AuthResult",

		"@timestamp": "2020-07-02T10:38:09.590Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 739741
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 739824,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 service.name {",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 739920,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     ARS ToDo API",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 740029,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 740142,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 740225,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 soap.request.method {",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 740328,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     Get-all-todo-items",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 740443,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      java.lang.String",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 740556,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"offset": 740639,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 statistics {",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"offset": 740733,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			}
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Value:     com.vordel.statistics.MessageMetrics@65a1bc5b",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 740875
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                     Type:      com.vordel.statistics.MessageMetrics",

		"@timestamp": "2020-07-02T10:38:09.591Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"host": {
			"name": "b16ac40a6c8b"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 741008
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "                 }",

		"@timestamp": "2020-07-02T10:38:09.592Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"ecs": {
			"version": "1.1.0"
		}
	},
	{
		"level": "INFO",
		"ecs": {
			"version": "1.1.0"
		},
		"log": {
			"file": {
				"path": "/var/log/trace/quickstartserver_20200702015317.trc"
			},
			"offset": 741091
		},
		"fields": {
			"logtype": "trace"
		},
		"agent": {
			"hostname": "b16ac40a6c8b",
			"id": "9b133606-9164-4459-96fb-396e632ed36b",
			"version": "7.4.0",
			"ephemeral_id": "70fd7d93-b4cc-4b3c-aa61-070326cd5008",
			"type": "filebeat"
		},
		"month_field": "7",
		"correlationId": "f1aefd5e3501dd00a16eebc0",
		"message": "             }",

		"@timestamp": "2020-07-02T10:38:09.592Z",

		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],
		"host": {
			"name": "b16ac40a6c8b"
		}
	},
	{

		"month_field": "6",
		"level": "ERROR",
		"@timestamp": "2020-06-29T13:26:43.687Z",
		"fields": {
			"logtype": "trace"
		},
		"ecs": {
			"version": "1.1.0"
		},
		"correlationId": "5bb7e85e940e4dcca856cd26",
		"log": {
			"offset": 1506224,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200616020614.trc"
			}
		},
		"message": "ERROR   16/Jun/2020:05:13:15.414 [2ab4:5bb7e85e940e4dcca856cd26]     Authz request was invalid redirect_uri found in the message does not match any redirect_uri(s) registered for this client.",
		"host": {
			"name": "345c5895f393"
		},
		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],

		"agent": {
			"id": "ac847a41-9cce-406e-94e0-4a0efc90d749",
			"version": "7.4.0",
			"type": "filebeat",
			"ephemeral_id": "9737ae36-dc56-4936-970a-465139166046",
			"hostname": "345c5895f393"
		}
	},
	{

		"month_field": "6",
		"level": "ERROR",
		"@timestamp": "2020-06-29T13:26:43.687Z",
		"fields": {
			"logtype": "trace"
		},
		"ecs": {
			"version": "1.1.0"
		},
		"correlationId": "5bb7e85e940e4dcca856cd26",
		"log": {
			"offset": 1506416,
			"file": {
				"path": "/var/log/trace/quickstartserver_20200616020614.trc"
			}
		},
		"message": "ERROR   16/Jun/2020:05:13:15.414 [2ab4:5bb7e85e940e4dcca856cd26] The message [Id-5bb7e85e940e4dcca856cd26] logged Fehler at 06.16.2020 05:13:15,414 with log description: Filter failed",
		"host": {
			"name": "345c5895f393"
		},
		"tags": [
			"beats_input_codec_plain_applied",
			"trace"
		],

		"agent": {
			"id": "ac847a41-9cce-406e-94e0-4a0efc90d749",
			"version": "7.4.0",
			"type": "filebeat",
			"ephemeral_id": "9737ae36-dc56-4936-970a-465139166046",
			"hostname": "345c5895f393"
		}
	}
];
# API-Management Traffic-Monitor based ELK stack

This project has 3 main objectives in relation to the Axway API management solution.

### Performance

When having many API-Gateway instances with millions of requests the API-Gateway Traffic Monitor can become slow and the observation period quite short. The purpose of this project is to solve that performance issue, make it possible to observe a long time-frame and get other benefits by using a standard external datastore: [Elasticsearch](https://www.elastic.co/elasticsearch).  

Watch this video to see a side by side compare betwen the classical and ElasticSearch based Traffic-Monitor:  
[![Traffic-Monitor for API-Manager users](https://img.youtube.com/vi/MUbx4m9EtpY/0.jpg)](https://youtu.be/MUbx4m9EtpY)

### Visibility 

The solution allows API Manager users to use the standard traffic monitor and see only the traffic of their own APIs. This allows API service providers who have registered their APIs to monitor and troubleshoot their own traffic without the need for a central team.  

This video shows how API-Manager users can access the traffic monitor to see their data:  
[![Traffic-Monitor for API-Manager users](https://img.youtube.com/vi/rlzi2kAXD4M/0.jpg)](https://youtu.be/rlzi2kAXD4M)

### Analytics

With the help of Kibana, the goal of the project is to deliver standard dashboards that provide analysis capabilities across multiple perspectives.  
It should still be possible to add your own dashboards as you wish.  
This shows a sample dashboard created in Kibana based on the indexed documents:  
<p align="center">
<img src="https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/raw/develop/imgs/sample-apim-overview-dashboard.png"
  alt="Sample Kibana dashboard"
  width="686" height="289">
</p>


## Table of content

- [Overview](#overview)
    - [Architecture](#architecture)
    - [How it works](#how-it-works)
    - [The Traffic-Monitor](#the-traffic-monitor)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Basic setup](#basic-setup)
- [Configure Axway API-Management](#configure-axway-api-management)
- [Production Setup](#production-setup)
- [Infrastructure sizing](#infrastructure-sizing)
- [Updates](#updates)
- [Troubleshooting](#troubleshooting)
- [Known issues](#known-issues)

## Overview

### Architecture

The overall architecture this project provides looks like this:  
![Architecture][img1]   

With that architecture it is possible to collect data from API-Gateways running all over the world into a centralized Elasticsearch instance to have it available with the best possible performance indendent from the network performance.  
It also helps, when running the Axway API-Gateway in Docker-Orchestration-Environment where containers are started and stopped as it avoids to loose data, when an API-Gateway container is stopped.  

### How it works  
Each API-Gateway instance is writing, [if configured](#enable-open-traffic-event-log), Open-Traffic Event-Log-Files, which are streamed by [Filebeat](https://www.elastic.co/beats/filebeat) into a Logstash-Instance. [Logstash](https://www.elastic.co/logstash) performs data pre-processing, combines different events and finally forwards these so called documents into an Elasticsearch cluster.  

Once the data is indexed by Elasticsearch it can be used by different clients. This process allows almost realtime monitoring of incoming requests. It takes around 5 seconds until a request is available in Elasticsearch.

#### The Traffic-Monitor

The standard API-Gateway Traffic-Monitor which is shipped with the solution is __based on a REST-API__ that is provided by the Admin-Node-Manager. By default the Traffic-Information is loaded from the OBSDB running on each API-Gateway instance. This project is partly __re-implementing this REST-API__, which makes it possible, that the standard Traffic-Monitor is using data from ElasticSearch instead of the internal OBSDB.  
That means, you can use the same tooling as of today, but the underlying implementation of the Traffic-Monitor is now pointing to Elasticsearch instead of the internal OPSDB hosted by each API-Gateway instance. This improves performance damatically, as Elasticsearch can scale across multiple machines if required and other dashboards can be created for instance with Kibana.  
The glue between Elasticsearch and the API-Gateway Traffic-Monitor is an [API-Builder project](./apibuilder4elastic), that is exposing the same Traffic-Monitor API, but it is implemented using Elasticsearch instead of the OPSDB. The API-Builder is available as a ready to use Docker-Image and preconfigured in the docker-compose file.  

## Prerequisites

### Docker

Components such as the API-Builder project are supposed to run as a Docker-Container. The Elasticsearch stack is using standard Docker-Images which are configured with environment variables and some mount points. With that, you are pretty flexible. You can run them with the provided docker-compose or with a Docker Orchestration platform such a Kubernetes or OpenShift to get elastic scaling & self-healing.  

### API-Gateway/API-Management

The solution is designed to work with _Classical_ and the _EMT_ deployment model. As it is mainly based on events given in the Open-Traffic-Event log, these must be enabled. Also Events-Logs are indexed and stored in Elasticsearch. This is used for System-Monitoring information and to highlight annotations based on Governance-Alerts in API-Manager.    
Versin 7.7-20200130 is required due to some Dateformat changes in the Open-Traffic-Format. With older versions of the API-Gateway you will get an error in Logstash processing.

### Elastic stack

The solution is based on the Elastic-Stack (Elasticsearch, Logstash, Beats and Kibana). It can run completely in docker containers, which for example are started on the basis of docker-compose.yaml or run in a Docker Orchestration Framework.  
It is also possible to use existing components such as an Elasticsearch cluster or a Kibana instance. With that you have the flexiblity to used for instance an Elasticsearch service at AWS or Azure or use Filebeat manually installed on the API-Gateway machines. The solution has been tested with Elasticsearch 7.x version.

## Getting started

## Basic setup

The basic setup explains the individual components, how they can be played and started together. After completing the basic setup you will have a single node Elasticsearch cluster including a Kibana instance running. This cluster receives data from 1 to N API gateways via Filebeat, Logstash, API-Builder and is accessible via the Traffic Monitor. You can also use the sample Kibana Dashboard or create your own visualizations.  
You can extend this setup, then expand it to a production cluster.
It is possible to deploy all components on a single machine, which should then have at least 16 GB RAM available. _(For instance like the Axway internal API-Management reference environment.)_

### Preparations

#### Enable Open-Traffic Event Log
Obviously, you have to enable Open-Traffic-Event log for your API-Gateway instance(s). [Read here][1] how to enable the Open-Traffic Event-Log.  
After this configuration has been done, Open-Traffic log-files will be created by default in this location: `apigateway/logs/opentraffic`. This location becomes relevant when configuring Filebeat.

#### Download and extract the release package

Please download and extract the release package from the GitHub project onto your machine(s):  
```
wget --no-check-certificate https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v1.0.0-RC4/axway-apim-elk-v1.0.0-RC4.tar.gz -O - | tar -xvz
```
To simplify updates it is recommended to create a Symlink-Folder and finally rename the provided file `env-sample` to `.env`.  
```
ln -s axway-apim-elk-v1.0.0-RC4 axway-apim-elk
cd axway-apim-elk-v1.0.0-RC4
mv env-sample .env
```

From this point on it is assumed that all commands are executed within the unpacked release folder. As it is important that the `.env' can be found by Docker-Compose. 
If, as recommended, you run the solution on different machines, it is also assumed that you download and unpack the release package on each machine. And then provide the `.env` file.  
Furthermore, it is recommended to store the .env as central configuration file in a version management system.

Even if otherwise possible, it is recommended to deploy the individual components in the following order. For each component you can then check if it is functional.

#### Elasticsearch

Open the `.env` file and configure the ELASTICSEARCH_HOSTS. At this point please configure only one Elasticsearch node. You can start with a single node and add more nodes later. More about this topic [Multi-Node Deployment](#setup-elasticsearch-multi-node) later in the documenation.
This URL is used by all Elasticsearch clients (Logstash, API-Builder, Filebeat) of the solution to establish communication.
If you use an external Elasticsearch cluster, please specify which node(s) that are given to you.  
Please keep in mind that the hostnames must be resolvable within the docker containers. You can also assign the cluster name here if the default: `axway-apim-elasticsearch` is not appropriate. Example:  
```
ELASTICSEARCH_HOSTS=https://my-elasticsearch-host.com:9200
ELASTICSEARCH_CLUSTERNAME=axway-apim-elasticsearch-prod
```
With the following command you initialize a new Elasticsearch Cluster which is going through an appropriate bootstrapping. Later you can add more nodes to this single node cluster. Please do not use the init extension when restarting the node:  
```
docker-compose -f elasticsearch/docker-compose.es01.yml -f elasticsearch/docker-compose.es01init.yml up -d
```
Wait until the cluster has started and then call the following URL:
```
GET https://my-elasticsearch-host.com:9200
{
  "name" : "elasticsearch1",
  "cluster_name" : "axway-apim-elasticsearch",
  "cluster_uuid" : "nCFt9WhpQr6JSOVY_h48gg",
  "version" : {
    "number" : "7.9.2",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "d34da0ea4a966c4e49417f2da2f244e3e97b4e6e",
    "build_date" : "2020-09-23T00:45:33.626720Z",
    "build_snapshot" : false,
    "lucene_version" : "8.6.2",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```
At this point you can already add the cluster UUID to the `.env` (`ELASTICSEARCH_CLUSTER_UUID`) file. With that, the Single-Node Elasticsearch Cluster is up & running.

#### Kibana

For Kibana all parameters are already stored in the .env file. Start Kibana with the following command:
```
docker-compose -f kibana/docker-compose.kibana.yml up -d
```
You can address Kibana at the following URL Currently no user login is required.
```
https://my-kibana-host:5601
```
If Kibana doesn't start (>3-4 minutes) or doesn't report to be ready, please use docker logs Kibana to check for errors.  

At this point you can already import the sample dashboard: `kibana/Axway-APIM-Daschboards.ndjson` into Kibana. Menu --> Stack Management --> Saved Objects.  

:exclamation: You are welcome to create additional visualizations and dashboards, but do not adapt the existing ones, as they will be overwritten with the next update.

#### Logstash / API-Builder / Memcached

It is recommended to deploy these components on one machine, so they are in a common Docker-Compose file and share the same network. Furthermore, a low latency between these components is beneficial. This allows you to use the default values for Memcached and API Builder. Therefore you only need to specify where the Admin-Node-Manager or the API manager can be found for this step. If necessary you have to specify an API-Manager admin user.  
```
ADMIN_NODE_MANAGER=https://my-admin-node-manager:8090
API_MANAGER_USERNAME=elkAdmin
API_MANAGER_PASSWORD=elastic
```
Check that the docker containers for Logstash, API Builder and Memached are running.  
```
[ec2-user@ip-172-31-61-59 axway-apim-elk-v1.0.0-RC4]$ docker ps
CONTAINER ID        IMAGE                                       COMMAND                  CREATED             STATUS                 PORTS                              NAMES
d1fcd2eeab4e        docker.elastic.co/logstash/logstash:7.9.2   "/usr/share/logstash…"   4 hours ago         Up 4 hours             0.0.0.0:5044->5044/tcp, 9600/tcp   logstash
4ce446cafda1        cwiechmann/apibuilder4elastic:v1.0.0-RC4    "docker-entrypoint.s…"   4 hours ago         Up 4 hours (healthy)   0.0.0.0:8443->8443/tcp             apibuilder4elastic
d672f2983c86        memcached:1.6.6-alpine                      "docker-entrypoint.s…"   4 hours ago         Up 4 hours             11211/tcp                          memcached
```
It may take some time (2-3 minutes) until Logstash is finally started. 
```
docker logs logstash
Pipelines running {:count=>6, :running_pipelines=>[:".monitoring-logstash", :BeatsInput, :Events, :DomainAudit, :TraceMessages, :OpenTraffic], :non_running_pipelines=>[]}
Successfully started Logstash API endpoint {:port=>9600}
```
Please note that the Logstash API endpoint (9600) is not exposed outside of the docker container.  

At startup Logstash installs Index-Templates and creates indexes in Elasticsearch. Please check that they exits with either Kibana or REST API calls. Using Kibana: Menu --> Stack Management --> Index Management. Check apigw-* indices (7x apigw-*) and index templates (apigw-domainaudit, apigw-monitoring, apigw-traffic-scheduled, trace-messages, traffic-details and traffic-summary) exists.  

### Filebeat

Finally Filebeat must be configured and started. You can start Filebeat as Docker-Container using the Docker-Compose files and mount the corresponding directories into the container. 
Alternatively you can install Filebeat natively on the API gateway and configure it accordingly. It is important that the filebeat/filebeat.yml file is used as base. This file contains instructions which control the logstash pipelines.

The following instructions assume that you set up Filebeat based on filebeat/docker-compose.filebeat.yml. 

:exclamation: __This is an important step, as otherwise Filebeat will not see and send any Event data!__  
Please add the following configuration. At this point you can already configure the filebeat instances with a name/region if you like.
```
APIGATEWAY_LOGS_FOLDER=/opt/Axway/APIM/apigateway/logs/opentraffic
APIGATEWAY_TRACES_FOLDER=/opt/Axway/APIM/apigateway/groups/group-2/instance-1/trace
APIGATEWAY_EVENTS_FOLDER=/home/localuser/Axway-x.y.z/apigateway/events
APIGATEWAY_AUDITLOGS_FOLDER=/home/localuser/Axway-x.y.z/apigateway/logs
GATEWAY_NAME=API-Gateway 3
GATEWAY_REGION=US
```
Audit-Logs are optional. If you don't want them indexed just point to an invalid folder.  

To start Filebeat: 
```
docker-compose -f filebeat/docker-compose.filebeat.yml up -d
```
Use docker logs filebeat to check that no error is displayed. If everything is ok, you should not see anything.  
Check in Kibana (Menu --> Management --> Stack Management --> Index Management) that the indexes are filled with data.

If you encounter issues please see the [Troubleshooting](#troubleshooting) section for help or create an [issue](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues). 

## Configure Axway API-Management

### Admin-Node-Manager
As the idea of this project is to use the existing API-Gateway Manager UI (short: ANM) to render log data now provided by Elasticsearch instead of the individual API-Gateway instances before (the build in behavior), it is required to change the ANM configuration to make use of Elasticsearch instead of the API-Gateway instances (default setup). By default, ANM is listening on port 8090 for administrative traffic. This API is responsible to serve the Traffic-Monitor and needs to be configured to use the API-Builder REST-API instead.

1. Open the ANM configuration in Policy-Studio. 
You can read [here](https://docs.axway.com/bundle/axway-open-docs/page/docs/apim_administration/apigtw_admin/general_rbac_ad_ldap/index.html#use-the-ldap-policy-to-protect-management-services) how to do that.  

2. Import the provided Policy-Fragement (Ver. 7.7.0) `nodemanager/policy-use-elasticsearch-api-7.7.0.xml` from the release package you have downloaded. This imports the policy: "Use Elasticsearch API".  
:point_right: Don't use the XML-File from the GitHub Project as it may contain a different certificates.  
The imported policy looks like this:  
<p align="center"><img src="imgs/node-manager-use-es-api.png" alt="Use Elasticsearch API" width="350" height="237"></p>

3. Update main policy  
Insert the "Use Elasticsearch API" policy as a callback policy (filter: Shortcut filter)  
into the main policy: `Protect Management Interfaces` and wire it like shown here:  
<p align="center"><img src="imgs/node-manager-policies-use-elasticsearch-api.png" alt="Use Elasticsearch API"></p>

It is recommended to disable the audit log for Failure transactions to avoid not needed log messages in the ANM trace file:  
<p align="center"><img src="imgs/policy-shortcut-disable-failure.png" alt="Use Elasticsearch API" width="300" height="123"></p>

- :point_right: Before you restart the Admin-Node-Manager process, please open the file: `<apigateway-install-dir>/apigateway/conf/envSettings.props` and add the following new environment variable: `API_BUILDER_URL=https://apibuilder4elastic:8443`. 
- :point_right: Please remember to copy the changed Admin-Node-Manager configuration from the Policy-Studio project folder (path on Linux: `/home/<user>/apiprojects/\<project-name\>`) back to the ANM folder (`\<install-dir\>/apigateway/conf/fed`). Then restart the ANM.

### Traffic-Monitor for API-Manager Users

In larger companies hundreds of API service providers are using the API Manager or the [APIM-CLI](https://github.com/Axway-API-Management-Plus/apim-cli) to register their own services/APIs. And the service providers require access to the traffic monitor to monitor their own APIs independently. During registration, the corresponding APIs are assigned to API Manager organizations, which logically split them up. But, the standard traffic monitor does not know the organization concept and therefore cannot restrict the view for a user based on the organization of an API.  
This project solves the problem by storing the API transactions in Elasticsearch with the appropriate organization. Then the API organization is used when reading the traffic data from Elasticsearch according to the following rules.

| API-Gateway Manager  | API-Manager   | Restriction | Comment | 
| :---          | :---                 | :---  | :---  |
| **Administrator**    | N/A           | Unrestricted access | A GW-Manager user is considered as an Admin, when is owns the permission: `adminusers_modify` |
| **Operator**         | API-Admin     | All APIs having a Service-Context | By default each API processed by the API-Manager has a Service-Context. Pure Gateway APIs (e.g. /healthcheck) will not be visible.|
| **Operator**         | Org-Admin     | APIs of its own organization | Such a user will only see the APIs that belong to the same organization as himself. |
| **Operator**         | User          | APIs of its own organization | The same rules apply as for the Org-Admin |

### Setup API-Manager user in API-Gateway Manager

To give API-Manager users a limited access to the API Traffic Monitor, the user must be configured in the API-Gateway manager with the same login name as in the API Manager. Here, for example, an LDAP connection can be a simplification.  
None of his roles must contain the permission: `adminusers_modify`. A suitable standard role is the `API Gateway Operator role`. 
You can, of course, create additional roles in the API Gateway Manager to adjust the user's rights according to your needs.

## Production Setup

This section covers advanced configuration topics that are required for a production environment. It is assumed that you have already familiarized yourself with the solution using the Basic setup.  

### Setup Elasticsearch Multi-Node

For a production environment Elasticsearch should run a multi-node Elasticsearch cluster environment. Indexes are configured so that available nodes are automatically used for primary and replica shards. 
If you are using an external Elasticsearch cluster, you can skip the following instructions, besides step number 4 to configure your available Elasticsearch cluster nodes.

#### General remarks

The setup of a Multi-Node Elasticsearch Cluster can be done with default settings via the parameter: ELASTICSEARCH_HOSTS. Some hints for this:  
- The default ports are 9200, 9201, 9202 and 9300, 9301, 9302 for the Elasticsearch instances elasticsearch1, elasticsearch2 and elasticsearch3. 
  - these ports are exposed by Docker-Compose through the docker containers
  - please configure ELASTICSEARCH_HOSTS accordingly with 9200, 9201, 9202
  - based on the HTTP ports, the transport port is derived. (9201 --> 9301, ...)
  - other ports are possible and can be configured
- Based on the specified URLs, the necessary Elasticsearch parameters are set when creating or starting the Elasticsearch Docker containers.
- Multiple Elasticsearch Nodes are only really useful if they actually run on different hosts.
  - Again, it is assumed that the release package is downloaded on the individual hosts and the `.env` file is provided. 
- You can always add more nodes to the Elasticsearch cluster to provide additional disk space and computing power.
  - You can start with two nodes today and add another cluster node in 6 months if needed.

__1. Setup Cluster-Nodes__

The solution is prepared for 3 nodes but can easily be extended to 5 nodes for example. To configure multiple hosts in the `.env`file: 
```
ELASTICSEARCH_HOSTS=https://ip-172-31-61-143.ec2.internal:9200,https://ip-172-31-57-105.ec2.internal:9201
```
If you need special configuration please use the parameters `ELASTICSEARCH_PUBLISH_HOST<n>`, `ELASTICSEARCH_HOST<n>_HTTP` and `ELASTICSEARCH_HOST<n>_TRANSPORT`

You may also change the cluster name if you prefer: `ELASTICSEARCH_CLUSTERNAME=axway-apim-elasticsearch`

__2. Bootstrap the cluster__

You can skip this step if you want to extend the cluster from the basic setup, since the basic setup has already initialized a cluster.

We recommend starting one node after the next. The first node will initially set up the cluster and bootstrap it.
Start the first cluster node with the following statement:  
```
docker-compose -f elasticsearch/docker-compose.es01.yml -f elasticsearch/docker-compose.es01init.yml up -d
```
This node automatically becomes the master node.

__3. Add additional nodes__

You can add cluster nodes at any time to increase available disk space or CPU performance. 
To achieve resilience, you should set up at least 2 cluster nodes.  
To add a cluster node, execute the following command:
```
docker-compose -f elasticsearch/docker-compose.es02.yml up -d
```
If a node has successfully joined the cluster you see the following log message logged in the master node:  
```
{"ty...": "INFO", "component": "o.e.c.s.MasterService", "cluster.name": "axway-apim-elasticsearch", "node.name": "elasticsearch1", "message": "node-join[{elasticsearch3}{eQaH...w"  }
```

__4. Restart clients__

Do you have changed the list of available Elasticsearch Nodes via the parameter: ELASTICSEARCH_HOSTS. For example from a single-node to a multi-node cluster, then it is strongly recommended to restart the corresponding clients (Kibana, Filebeat, Logstash, API-Builder). Via docker-compose, so that the containers are created with the new ELASTICSEARCH_HOSTS parameter. 
This ensures that clients can use the available Elasticsearch nodes for a fail-over in case of a node downtime.

### Activate user authentication

__1. Generate Built-In user passwords__

_This step can be ignored, when you are using an existing Elasticsearch cluster._
Elasticsearch is initially configured with a number of built-in users, that don't have a password by default. So, the first step is to generate passwords for these users. It is assumed that the following command is executed on the first elasticsearch1 node:  
```
docker exec elasticsearch1 /bin/bash -c "bin/elasticsearch-setup-passwords auto --batch --url https://localhost:9200"
```
As a result you will see the randomly generated passwords for the users: `apm_system`, `kibana_system`, `kibana`, `logstash_system`, `beats_system`, `remote_monitoring_user` and `elastic`. These passwords needs to be configured in the provided `.env`. 

__2. Setup passwords__

Please update the `.env` and setup all passwords as shown above. If you are using an existing Elasticsearch please use the passwords provided to you. The `.env` contains information about each password and for what it is used:  
```
FILEBEAT_MONITORING_USERNAME=beats_system
FILEBEAT_MONITORING_PASSWORD=DyxUva2a6CwedZUhcpFH

KIBANA_USERNAME=kibana_system
KIBANA_PASSWORD=qJdDRYyL97lP5ERkHHrj

LOGSTASH_MONITORING_USERNAME=logstash_system
LOGSTASH_MONITORING_PASSWORD=Y6J6vgw9Z0RTPcFR8Qp3

LOGSTASH_USERNAME=elastic
LOGSTASH_PASSWORD=2x8vxZrvXX9a3KdGuA26

API_BUILDER_USERNAME=elastic
API_BUILDER_PASSWORD=2x8vxZrvXX9a3KdGuA26
```

__3. Disable anonymous user__

In the `.env` file uncomment the following line:  
```
ELASTICSEARCH_ANONYMOUS_ENABLED=false
```
With that, anonymous access to the Elasticsearch cluster is not possible anymore, which also includes Kibana.  

__4. Enable user autentication in Kibana__
In the `.env` file also uncomment the following line to enable user authentication in Kibana:  
```
KIBANA_SECURITY_ENABLED=true
```
After restart, Kibana will prompt to login before continue. Intially you may use the `elastic` user account to login and then create individual users and permissions.  

__5. Restart services__

After you have configured all passwords and configured security, please restart all services.  
- Filebeat    - It is now using the beats_system user to send monitoring information
- Logstash    - Using the logstash_system to send monitoring data and logstash user to insert documents
- Kibana      - Is using the kibana_system to send monitoring data
- API-Builder - Is using the API-Builder user to query Elasticsearch
  
It's very likely that you don't use the super-user `elastic` for `API_BUILDER_USERNAME`. It's recommended to create dedicated account.  
The monitoring users are used to send metric information to Elasticsearch to enable stack monitoring, which gives you insight about event processing of the complete platform.

### Configure cluster UUID

This step is optional, but required to monitor your Filebeat instances as part of the stack monitoring. To obtain the Cluster UUID run the following in your browser:  
`https://elasticsearch1:9200/` (if you have already activated authentication you can use the elastic user here)  

Take over the UUID into the .env file:  
`ELASTICSEARCH_CLUSTER_UUID=XBmL4QynThmwg0X0YN-ONA` 

You may also configure the following parameters: `GATEWAY_NAME` & `GATEWAY_REGION` to make you Filebeat instances unique.  

![Monitoring-Overview][Monitoring-Overview]  

To activate these changes the Filebeat service must be restarted. 

### Custom certificates

_If you are using an existing Elasticsearch cluster, you have to provide the required CA to the solution to allow certificate validation._

The project is shipped with long running certificates/keys that should help you to get started with the solution. For a production environment these certificates and keys should be replaced with custom certificates.  

After you have created the corresponding certificates and keys based on your CA, you must save them in the folder: `certificates`. 
Afterwards these certificates must be configured in the `.env` file.  
```
API_BUILDER_SSL_KEY=config/certificates/corporate-certificate.key
API_BUILDER_SSL_CERT=config/certificates/corporate-certificate.crt
API_BUILDER_SSL_KEY_PASSWORD=dfslkjaskljdklasjdlas
ELASTICSEARCH_KEY=config/certificates/corporate-elasticsearch.key
ELASTICSEARCH_CRT=config/certificates/corporate-elasticsearch.crt
ELASTICSEARCH_CA=config/certificates/corp-ca.crt
KIBANA_KEY=config/certificates/corporate-kibana.key
KIBANA_CRT=config/certificates/corporate-kibana.crt
```
You can find more information about the individual certificates in the `.env` file.

### Multiple API-Manager

During Logstash event processing, additional information is loaded from the API Manager through an API lookup. This lookup is performed by the API builder against the API Manager.  
By default the configured Admin Node Manager host is used or the configured API Manager URL:
```
API_MANAGER=http://my.apimanager.com:443
```
If you have several API Managers within your domain, you have to configure a mapping which group (groupId) belongs to which API Manager. The following syntax is used for this:  
```
API_MANAGER=group-2#https://api-manager-1:8075, group-5#https://api-manager-2:8275
```
When the API Builder is started, to validate the configuration, a login to each API-Manager is performed. Currently the same 
API manager user (API_MANAGER_USERNAME/API_MANAGER_PASSWORD) is used for each API Manager. 

### Secure API-Builder Traffic-Monitor API
The API-Builder project for providing access to Elasticsearch data has no access restrictions right now. To ensure only API-Gateway Manager users (topology administrators with proper RBAC role) or other users with appropriate access rights can query the log data, one can expose this API via API-Manager and add security here.

To import the API Builder project REST-API into your API-Manager, you can access the Swagger/OpenAPI definition here (replace docker-host and port appropriately for the container that is hosting the API-Builder project):  
https://docker-host:8443/apidoc/swagger.json?endpoints/trafficMonitorApi

## Sizing your infrastructure

The solution is designed to process and store millions of transactions per day and make them quickly available for traffic monitoring and analytics. 
This advantage of being able to access millions of transactions is not free of charge with Elasticsearch, but is available in the size of the disc space provided.
The solution has been extensively tested, especially for high-volume requirements. It processed 900 transactions per second, up to 55 million transactions per day on the following infrastructure.

### Sizing recommendations
The most important key figure for sizing is the number of transactions per day or per month. The sizing of the platform depends on this and how long the data should be available in real-time. To store around 10 Millionen transactions with all details and trace-messages ap. 6,5 GB disc space is required.
The following recommendations are based on our tests and is splitted by the desired rentention period.

#### 7 Days rentention period

Please note the following:
The Standard Index Lifecycle Policy defines that an index can grow to 50 GB and rolls into a new after 30 days. For __7 days__, the indexes should be rolled after __2 days__ instead of 30 days.
The recommendation contains only one ElasticSearch node, which provides no data redundancy if this node fails. If you need data redundancy, another ElasticSearch node must be added. After adding another node the data is automatically distributed between them.

| Volume                  | Components           | Nodes | Shards  | Comment |
| :---                    | :---                 | :---  | :---    | :---    | 
| up to 1 Mio  (~15 TPS)  | All                  | 4 CPU-Cores, 16 GB RAM, 15 GB HDD  || One node for all components, Filebeat is running close to the API-Gateway    |
| up to 5 Mio  (~60 TPS)  | All                  | 4 CPU-Cores, 16 GB RAM, 50 GB HDD  || One node for all components, Filebeat is running close to the API-Gateway    |
| up to 10 Mio (~120 TPS) | Logstash/API-Builder | 2 CPU-Cores, 1 GB RAM, 10 GB HDD   || Dedicated Logstash processing node    |
|                         | Others               | 4 CPU-Cores, 16 GB RAM, 80 GB HDD  || ElasticSearch, Kibana node    |
| up to 25 Mio (~300 TPS) | Logstash/API-Builder | 2 CPU-Cores, 1 GB RAM, 10 GB HDD   || Dedicated Logstash processing node    |
|                         | Others               | 4 CPU-Cores, 16 GB RAM, 150 GB HDD || ElasticSearch, Kibana node    |
| up to 50 Mio (~600 TPS) | Logstash/API-Builder | 4 CPU-Cores, 1 GB RAM, 10 GB HDD   || Dedicated Logstash processing node    |
|                         | ElasticSearch 1      | 4 CPU-Cores, 32 GB RAM, 300 GB HDD || ElasticSearch, Kibana node    |

#### 14 Days rentention period

Please note the following:
The Standard Index Lifecycle Policy defines that an index can grow to 50 GB and rolls into a new after 30 days. For __14 days__, the indexes should be rolled after __4 days__ instead of 30 days.
The recommendation contains only one ElasticSearch node up to a volume of max. 25 million transactions. This means no data redundancy if this node fails. If you need data redundancy, another ElasticSearch node must be added. After adding another node the data is automatically distributed between them.

| Volume                  | Components           | Nodes | Shards  | Comment |
| :---                    | :---                 | :---  | :---    | :---    | 
| up to 1 Mio  (~15 TPS)  | All                  | 4 CPU-Cores, 16 GB RAM, 30 GB HDD  || One node for all components, Filebeat is running close to the API-Gateway    |
| up to 5 Mio  (~60 TPS)  | All                  | 4 CPU-Cores, 16 GB RAM, 100 GB HDD || One node for all components, Filebeat is running close to the API-Gateway    |
| up to 10 Mio (~120 TPS) | Logstash/API-Builder | 2 CPU-Cores, 1 GB RAM, 10 GB HDD   || Dedicated Logstash processing node    |
|                         | Others               | 4 CPU-Cores, 16 GB RAM, 160 GB HDD || ElasticSearch, Kibana node    |
| up to 25 Mio (~300 TPS) | Logstash/API-Builder | 2 CPU-Cores, 1 GB RAM, 10 GB HDD   || Dedicated Logstash processing node    |
|                         | Others               | 4 CPU-Cores, 16 GB RAM, 300 GB HDD || ElasticSearch, Kibana node    |
| up to 50 Mio (~600 TPS) | Logstash/API-Builder | 4 CPU-Cores, 1 GB RAM, 10 GB HDD   || Dedicated Logstash processing node    |
|                         | ElasticSearch 1      | 4 CPU-Cores, 32 GB RAM, 300 GB HDD || ElasticSearch, Kibana node    |
|                         | ElasticSearch 2      | 4 CPU-Cores, 32 GB RAM, 300 GB HDD || ElasticSearch node    |

#### 30 Days rentention period

The Standard Index Lifecycle Policy is sufficient for 30 days data retention.
The recommendation contains only one ElasticSearch node up to a volume of max. 10 million transactions. This means no data redundancy if this node fails. If you need data redundancy, another ElasticSearch node must be added. After adding another node the data is automatically distributed between them.

| Volume                  | Components           | Nodes | Comment |
| :---                    | :---                 | :---  | :---    | 
| up to 1 Mio  (~15 TPS)  | All                  | 4 CPU-Cores, 16 GB RAM, 60 GB HDD  | One node for all components, Filebeat is running close to the API-Gateway    |
| up to 5 Mio  (~60 TPS)  | All                  | 4 CPU-Cores, 16 GB RAM, 200 GB HDD | One node for all components, Filebeat is running close to the API-Gateway    |
| up to 10 Mio (~120 TPS) | Logstash/API-Builder | 2 CPU-Cores, 1 GB RAM, 10 GB HDD   | Dedicated Logstash processing node    |
|                         | Others               | 4 CPU-Cores, 16 GB RAM, 320 GB HDD | ElasticSearch, Kibana node    |
| up to 25 Mio (~300 TPS) | Logstash/API-Builder | 2 CPU-Cores, 1 GB RAM, 10 GB HDD   | Dedicated Logstash processing node    |
|                         | ElasticSearch 1      | 4 CPU-Cores, 16 GB RAM, 300 GB HDD | ElasticSearch, Kibana node    |
|                         | ElasticSearch 2      | 4 CPU-Cores, 16 GB RAM, 300 GB HDD | ElasticSearch, Kibana node    |
| up to 50 Mio (~600 TPS) | Logstash/API-Builder | 4 CPU-Cores, 1 GB RAM, 10 GB HDD   | Dedicated Logstash processing node    |
|                         | ElasticSearch 1      | 4 CPU-Cores, 32 GB RAM, 750 GB HDD | ElasticSearch, Kibana node    |
|                         | ElasticSearch 2      | 4 CPU-Cores, 32 GB RAM, 750 GB HDD | ElasticSearch node    |

### Test infrastructure

| Node/Instance              |CPUS    |RAM   |Disc  | Component      | Version | Comment | 
| :---                       | :---   | :--- | :--- | :---           | :---    | :---    |
| AWS EC2 t2.xlarge instance | 4 vCPUS|16GB  |30GB  | API-Management | 7.7-July| Classical deployment |
|                            |        |      |      | Filebeat       | 7.9.0   | Docker-Container running on API-Gateway Host |
| AWS EC2 t2.xlarge instance | 4 vCPUS|16GB  |30GB  | API-Management | 7.7-July| Classical deployment |
|                            |        |      |      | Filebeat       | 7.9.0   | Docker-Container running on API-Gateway Host |
| AWS EC2 t2.xlarge instance | 4 vCPUS|16GB  |30GB  | API-Management | 7.7-July| Classical deployment |
|                            |        |      |      | Filebeat       | 7.9.0   | Docker-Container running on API-Gateway Host |
| AWS EC2 t2.xlarge instance | 4 vCPUS|16GB  |30GB  | API-Management | 7.7-July| Classical deployment |
|                            |        |      |      | Filebeat       | 7.9.0   | Docker-Container running on API-Gateway Host |
| AWS EC2 t2.xlarge instance | 4 vCPUS|16GB  |30GB  | API-Management | 7.7-July| Classical deployment |
|                            |        |      |      | Filebeat       | 7.9.0   | Docker-Container running on API-Gateway Host |
| AWS EC2 t2.xlarge instance | 4 vCPUS|16GB  |30GB  | API-Management | 7.7-July| Classical deployment |
|                            |        |      |      | Filebeat       | 7.9.0   | Docker-Container running on API-Gateway Host |
| AWS EC2 t2.xlarge instance | 4 vCPUS|16GB  |30GB  | Logstash       | 7.9.0   | Standard Logstash Docker-Container |
|                            |        |      |      | API-Builder    | 0.0.10  | API-Builder proving Traffic-Monitor & Lookup API |
| AWS EC2 t2.xlarge instance | 4 vCPUS|16GB  |80GB  | Elasticsearch  | 7.9.0   | Standard Elasticsearch Docker-Container |
|                            |        |      |      | Kibana         | 7.9.0   | Standard Kibana Docker-Container |

## Updates

It is planned that this solution will be further developed and therefore further releases will be published. 
With each release the following artifacts may change:  

- All Docker-Compose files
- Elasticstack Version
- Logstash Pipelines
- Elasticsearch Index Templates
- Filebeat Configuration
- API Builder Docker Container Version
- Kibana Dashboards, Config (e.g. ILM-Policies, Roll-Up Jobs)
- Scripts, etc. 

All components of this solution play together and only work if they are from the same release. The solution will check if for example the index templates have the required version. 
With each update there will be a changelog, release notes and instructions for the update. For each component it will be explained whether there have been changes and how to apply them if necessary.  

:exclamation: It is strongly discouraged to make changes in any files of the project, except the `.env` file. These will be overwritten with the next release. This is the only way to easily update from one version to the next.
If you encounter a problem or need a feature, please open an issue that can be integrated directly into the solution.  
Of course you are welcome to create your own Kibana dashboards or clone and customize existing ones.  
However, if you need to change files, it is recommended to make this change automatically and repeatable (e.g. https://www.ansible.com). 

## Troubleshooting

### Check processes/containers are running
From within the folder where the docker-compose.yml file is located (git project folder) execute: 
```
docker-compose inspect
                              Name                                             Command                  State                           Ports                     
------------------------------------------------------------------------------------------------------------------------------------------------------------------
apigateway-openlogging-elk_elk-traffic-monitor-api_1_3fbba4deea37   docker-entrypoint.sh node .      Up (healthy)   0.0.0.0:8889->8080/tcp                        
apigateway-openlogging-elk_filebeat_1_3ad3117a1312                  /usr/local/bin/docker-entr ...   Up             0.0.0.0:9000->9000/tcp                        
apigateway-openlogging-elk_logstash_1_c6227859a9a4                  /usr/local/bin/docker-entr ...   Up             0.0.0.0:5044->5044/tcp, 9600/tcp              
elasticsearch1                                                      /usr/local/bin/docker-entr ...   Up             0.0.0.0:9200->9200/tcp, 0.0.0.0:9300->9300/tcp
```
Depending on the services you enabled/disbaled you see the status of each container.

### Check Filebeat is picking up data
You need to check the filebeat Log-File within the running docker container.   
`docker exec -it apigateway-openlogging-elk_filebeat_1_3ad3117a1312 bash`  
`cd logs`  
`tail -f filebeat`  
Make sure, the Filebeat Harvester is started on the Open-Traffic-Files:
```
INFO	log/harvester.go:251	Harvester started for file: /var/log/work/group-2_instance-1_traffic.log
```
The following error means, Logstash is not running or reachable (Or just not yet fully started):
```
ERROR	pipeline/output.go:100	Failed to connect to backoff(async(tcp://logstash:5044)): lookup logstash on 127.0.0.11:53: no such host
```
General note: You don't see Filebeat telling you, when it is successfully processing your log-files. When the Harvester process is started and you don't see any errors, you can assume your files are processed. 
If the Filebeat-Harvester doesn't start, you may validate that the Open-Traffic-Event log files are visible by checking the following directory within the running container:
```
ls -l /var/log/work
-rw-rw-r--. 1 filebeat filebeat  2941509 Aug 13 12:38 group-2_instance-1_traffic.log
-rw-rw-r--. 1 filebeat filebeat 20972249 Jul  7 19:32 group-2_instance-1_traffic_2020-07-07-1.log
-rw-rw-r--. 1 filebeat filebeat 20972436 Jul  8 18:08 group-2_instance-1_traffic_2020-07-08-1.log
-rw-rw-r--. 1 filebeat filebeat 20972005 Jul 17 07:32 group-2_instance-1_traffic_2020-07-17-1.log

```

### Check Logstash processing
Logstash writes to Stdout, hence you can view information just with:
```
docker logs logstash -f
```
When Logstash is successfully started you should see the following:
```
docker logs logstash
Pipelines running {:count=>6, :running_pipelines=>[:".monitoring-logstash", :BeatsInput, :Events, :DomainAudit, :TraceMessages, :OpenTraffic], :non_running_pipelines=>[]}
Successfully started Logstash API endpoint {:port=>9600}
```
If you see the following or similar error message during processing of events the API-Builder Lookup-API cannot be reached. In case, please make sure the environment variable: `API_BUILDER_URL`is set correctly.
```
[2020-08-19T10:51:05,671][ERROR][logstash.filters.http    ][main][......] error during HTTP request {:url=>"/api/elk/v1/api/lookup/api", :body=>nil, :client_error=>"Target host is not specified"}
```

### Check Elasticsearch processing
It takes a while until Elasticsearch is finally started and reports it with the following line: 
```
docker logs elasticsearch1 --follow
```
When Elasticsearch is finally started:
```
"level": "INFO", "component": "o.e.c.r.a.AllocationService", "cluster.name": "elasticsearch", "node.name": "elasticsearch1", "message": "Cluster health status changed from [RED] to [YELLOW] (reason: [shards started [[.kibana_1][0]]]).", "cluster.uuid": "k22kMiq4R12I7BSTD87n5Q", "node.id": "6TVkdA-YR7epgV39dZNG2g"  }
```
Status YELLOW is expected when running Elasticsearch on a single node, as it can achieve the desired replicas. You may use Kibana Development tools or curl to get additional information.

### vm.max_map_count is too low
```
ERROR: [1] bootstrap checks failed
[1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
```
Run the following to set it temporarly:
`sudo sysctl -w vm.max_map_count=262144`
Or the following:
```
1. sudo vi /etc/sysctl.conf
2. add vm.max_map_count=262144
3. sudo service sysctl restart
```

#### No results from Elasticsearch
If you don't get any results from ElasticSearch for valid queries it might be a missing template configuration for the logstash-openlog index. Elastic-Search is doing by default a dynamic template mapping that is trying to figure out field types. However, for some of the fields the mapping must be overwritten. Therefore make sure so to include the sample mapping file: `configs/openlog_index_template.json` is used by your Logstash process. See `configs/logstash.conf` as an example.  
The template mapping is pre-configured when using the docker-compose configuration. 

### Check API-Builder processing
The API-Builder docker container is running 
```
docker logs apigateway-openlogging-elk_elk-traffic-monitor-api_1_3fbba4deea37 --follow
```
```
server started on port 8080
```
#### Check requests from Admin-Node-Manager
When using the API-Gateway Traffic-Monitor to monitor requests and having the Admin-Node-Manager re-configured you should see how API-Builder is processing the requests:
```
Request {"method":"GET","url":"/api/elk/v1/api/router/service/instance-1/ops/search?format=json&field=leg&value=0&count=1000&ago=10m&protocol=http","headers":{"host":"localhost:8889","max-forwards":"20","via":"1.0 api-env (Gateway)","accept":"application/json","accept-language":"en-US,en;q=0.5","cookie":"cookie_pressed_153=false; t3-admin-tour-firstshow=1; VIDUSR=1584691147-TE1M3vI9BFWgkA%3d%3d; layout_type=table; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; 6e7e1bb1dd446d4cd36889414ccb4cb7=8g9p3kh27t1se22lu6avkmu0a1; joomla_user_state=logged_in; 220b750abfbc8d2f2f878161bab0ab65=62gr71dkre858nc0gjldri18gt","csrf-token":"8E96374767C47BFADC9C606FF969D7CF56FB3F9523E41B34F3B3B269F7302646","referer":"https://api-env:8090/","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0","x-requested-with":"XMLHttpRequest","connection":"close","x-correlationid":"Id-fd7c745ebfaed039b2155481 1"},"remoteAddress":"::ffff:172.25.0.1","remotePort":55916}
Response {"statusCode":200,"headers":{"server":"API Builder/4.25.0","request-id":"35fb859d-00b0-404b-97e6-b549db17f84c","x-xss-protection":"1; mode=block","x-frame-options":"DENY","surrogate-control":"no-store","cache-control":"no-store, no-cache, must-revalidate, proxy-revalidate","pragma":"no-cache","expires":"0","x-content-type-options":"nosniff","start-time":"1584692477587","content-type":"application/json; charset=utf-8","response-time":"408","content-md5":"e306ea2d930a3b80f0e91a29131d520b","content-length":"267","etag":"W/\"10b-2N+JsHuxDxMVKhJR1A8GuNGnKDQ\"","vary":"Accept-Encoding"}}
```

If you do not see any requests arriving in the API builder, the ANM may not be able to reach the API builder listen socket.
It is important to know that traffic information will still appear in this case, because in this case the OPSDB will be used. You should therefore check the ANM trace log.
```
tail -f /opt/Axway/APIM/apigateway/trace/nodemanageronapi-env_20200813000000.trc
```

#### Check queries send to ElasticSearch
In oder to see queries that are send to ElasticSearch by API-Builder you need to run the Docker-Container with `LOG_LEVEL=debug`. You can activate debug in the docker-compose.yml. This gives you in the console of the API-Builder the following output:  
```
Using elastic search query body: {"index":"logstash-openlog","body":{"query":{"bool":{"must":[{"range":{"timestampOriginal":{"gt":1587541496568}}},{"term":{"processInfo.serviceId":"instance-1"}}]}}},"size":"1000","sort":""}
```
This helps you to further analyze if ElasticSearch is returning the correct information for instance using the Kibana development console. Example sending the same request using the Kibana Development console:  
![Kibana Dev-Console][img8]

## Known issues

- __Trace messages not shown in correct order__  
  See issue https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/37


[img1]: imgs/component-overview.png
[img2]: imgs/node-manager-policies.png
[img3]: imgs/node-manager-use-es-api.png
[img4]: imgs/node-manager-policies-use-elasticsearch-api.png
[img5]: imgs/Logspector.png
[img6]: imgs/IsmanagedbyElasticsearchAPI.png
[img7]: imgs/connect-to-elasticsearch-api.png
[img8]: imgs/kibana-dev-tool-sample-query.png
[img9]: imgs/policy-shortcut-disable-failure.png
[img10]: imgs/sample-apim-overview-dashboard.png
[Monitoring-Overview]: imgs/stack-monitoring-overview.png
[Monitoring-Logstash]: imgs/stack-monitoring-logstash.png


[1]: https://docs.axway.com/bundle/axway-open-docs/page/docs/apim_administration/apigtw_admin/admin_open_logging/index.html#configure-open-traffic-event-logging

Build status API-Builder Traffic-Monitor API:  
[![Traffic-Monitor API](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/workflows/Traffic-Monitor%20API/badge.svg)](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/actions)

# API-Management Traffic-Monitor based ELK stack

This project has 3 main objectives in relation to the Axway API management solution.

### Performance

When having many API-Gateway instances with millions of requests the API-Gateway Traffic Monitor can become slow and the observation period quite short. The purpose of this project is to solve that performance issue, make it possible to observe a long time-frame and get other benefits by using a standard external datastore: [Elasticsearch](https://www.elastic.co/elasticsearch).  

Watch this video to see a side by side compare betwen the classical and ElasticSearch based Traffic-Monitor:  
<p align="center">
  [![Traffic-Monitor performance](https://img.youtube.com/vi/MUbx4m9EtpY/0.jpg)](https://youtu.be/MUbx4m9EtpY)
</p>

### Visibility 

This solution allows API service providers to give access to the Standard Traffic Monitor so that they only see the API traffic of their own organization. This allows API service providers to analyze their own traffic using the extensive information in the traffic monitor.  

This video shows how API-Manager users can access the traffic monitor to see their data:  
<p align="center">
  [![Traffic-Monitor for API-Manager users](https://img.youtube.com/vi/rlzi2kAXD4M/0.jpg)](https://youtu.be/rlzi2kAXD4M)
</p>

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
- [Preparations](#preparations)
- [Basic setup](#basic-setup)
    - [Filebeat](#filebeat)
    - [Logstash](#logstash)
    - [API-Builder](#api-builder)
    - [Elasticsearch](#elasticsearch)
    - [Kibana](#kibana)
- [Manage the environment](#manage-the-environment)
    - [Using docker-compose](#using-docker-compose)
    - [Acccess components](#acccess-components)
- [Advanced setup](#advanced-setup)
    - [Activate user authentication](#activate-user-authentication)
    - [Configure cluster UUID](#configure-cluster-uuid)
    - [Securing API-Builder Traffic-Monitor API](#configure-cluster-uuid)
- [Infrastructure sizing](#infrastructure-sizing)
    - [Sizing recommendations](#sizing-recommendations)
    - [Test infrastructure](#test-infrastructure)
- [Troubleshooting](#troubleshooting)
    - [Check processes/containers are running](#test-infrastructure)
    - [Check Filebeat is picking up data](#test-infrastructure)
    - [Check Logstash processing](#test-infrastructure)
    - [Check Elasticsearch processing](#test-infrastructure)
    - [Check API-Builder processing](#test-infrastructure)
- [License](#license)
- [Links](#links)

## Overview

### Architecture

The overall architecture this project provides looks like this:  
![Architecture][img1]   

This also makes it possible to collect data from API-Gateways running all over the world into a centralized Elasticsearch instance to have it available with the best possible performance indendent from the network performance.  
It also helps, when running the Axway API-Gateway in Docker-Orchestration-Environment where containers are started and stopped as it avoids to loose data, when an API-Gateway container is stopped.  

### How it works  
Each API-Gateway instance is writing, [if configured](#enable-open-traffic-event-log), Open-Traffic Event-Log-Files, which are streamed by [Filebeat](https://www.elastic.co/beats/filebeat) into a Logstash-Instance. [Logstash](https://www.elastic.co/logstash) performs data pre-processing, combines different events and finally forwards these so called documents into an Elasticsearch cluster.  

Once the data is indexed by Elasticsearch it can be used by different clients. This process allows almost realtime monitoring of incoming requests. It takes around 5 seconds until a request is available in Elasticsearch.

### The Traffic-Monitor

The standard API-Gateway Traffic-Monitor which is shipped with the solution is based on a REST-API that is provided by the Admin-Node-Manager. By default the Traffic-Information is loaded from the OBSDB running on each API-Gateway instance. This project is partly re-implementing this REST-API, which makes it possible, that the Traffic-Monitor is using data from ElasticSearch instead of the internal OBSDB.  
That means, you can use the same tooling as of today, but the underlying implementation of the Traffic-Monitor is now pointing to Elasticsearch instead of the internal OPSDB hosted by each API-Gateway instance. This improves performance damatically, as Elasticsearch can scale across multiple machines if required and other dashboards can be created for instance with Kibana.  
The glue between Elasticsearch and the API-Gateway Traffic-Monitor is an [API-Builder project](./elk-traffic-monitor-api), that is exposing the same Traffic-Monitor API, but it is implemented using Elasticsearch instead of the OPSDB. The API-Builder is available as a ready to use Docker-Image and preconfigured in the docker-compose file.  
Optionally you can import the API-Builder API into your API-Management system to apply additional security and by that secure access to your Elasticsearch instance.  

## Prerequisites

### Docker

Components such as the API-Builder project are supposed to run as a Docker-Container. You can run them with the provided docker-compose or with a Docker Orchestration platform such a Kubernetes or OpenShift.

### API-Gateway/API-Management

As the solution is mainly based on events given in the Open-Traffic-Event log, Open-Traffic Log enabled must be enabled. Versin 7.7-20200130 is required due to some Dateformat changes in the Open-Traffic-Format. With older versions of the API-Gateway you will get an error in Logstash processing.

### Elastic stack

The solution is based on the Elastic-Stack (Elasticsearch, Logstash, Beats and Kibana). The individual components can be deployed in separate environments depending on existing architectural requirements.  
The solution can run completely based on docker containers, which for example are started on the basis of docker-compose.yaml or run in a Docker Orchestration Framework. 
Of course you can also use existing components and install them manually. For example an Elasticsearch service at AWS or Azure. The solution has been tested with Elasticsearch 7.x version.

## Preparations

### Enable Open-Traffic Event Log
Obviously, you have to enable Open-Traffic-Event log for your API-Gateway instance(s). [Read here][1] how to enable the Open-Traffic Event-Log.  
After this configuration has been done, Open-Traffic log-files will be created by default in this location: `apigateway/logs/opentraffic`. This location becomes relevant when configuring Filebeat.

### Configure the Admin-Node-Manager
As the idea of this project is to use the existing API-Gateway Manager UI (short: ANM) to render log data now provided by Elasticsearch instead of the individual API-Gateway instances before (the build in behavior), it is required to patch the ANM configuration to make use of Elasticsearch instead of the API-Gateway instances (default setup). By default, ANM is listening on port 8090 for administrative traffic. This API is responsible to serve the Traffic-Monitor and needs to be configured to use the API-Builder REST-API instead.

For the following steps, please open the ANM configuration in Policy-Studio. You can read [here](https://docs.axway.com/bundle/axway-open-docs/page/docs/apim_administration/apigtw_admin/general_rbac_ad_ldap/index.html#use-the-ldap-policy-to-protect-management-services) how to do that.  
- Create a new policy and name it `Use Elasticsearch API` - *This Policy will decide on what API calls can be routed to Elasticsearch*
- The configured Policy should look like this:

  ![use ES API][img3]  

    - The `Compare Attribute` filter named `Is managed by Elasticsearch API?` checks for each endpoint based on the attribute: `http.request.path` if the requested API can be handled by the API-Builder ElasticSearch-Traffic-Monitor API.    
    As a basis for decision-making a criteria for each endpoint needs to be added to the filter configuration.  
    _The following endpoints are currently supported by the API Builder based Traffic-Monitor API._  

| Endpoint       | Expression               | Comment | 
| :---          | :---                 | :---  |
| **Search**     | `^\/api\/router\/service\/[A-Za-z0-9-.]+\/ops\/search$` | This endpoint which provides the data for the HTTP Traffic overview and all filtering capabilities|
| **Circuitpath**     | `^\/api\/router\/service\/[A-Za-z0-9-.]+\/ops\/stream\/[A-Za-z0-9]+\/[^\/]+\/circuitpath$` | Endpoint which provides the data for the Filter Execution Path as part of the detailed view of a transaction|
| **Trace**     | `^\/api\/router\/service\/[A-Za-z0-9-.]+\/ops\/trace\/[A-Za-z0-9]+[\?]?.*$` | Endpoint which returns the trace information and the **getinfo** endpoint which returns the request detail information including the http header of each leg|
| **GetInfo**     | `^\/api\/router\/service\/[A-Za-z0-9-.]+\/ops\/[A-Za-z0-9]+\/[A-Za-z0-9]+\/[\*0-9]{1}\/getinfo[\?]?.*$` |Endpoint provides information for the Requesr- Response-Details|

The compare attribute filter should look like this:   
![Is API Managed][img6]  
- Adjust the URL of the Connect to URL filter to your running API-Builder docker container and port - **default is 8889**. Sample: `https://api-env:8443/api/elk/v1${http.request.rawURI}`  
![Connect to ES API][img7]
- Insert the created policy as a callback policy (filter: Shortcut filter) into the main policy: `Protect Management Interfaces` and wire it like shown here:  
  ![Use Callback][img4]  

It is recommended to disable the audit log for Failure transactions to avoid not needed log messages in the ANM trace file:  
![Use Callback][img9]  
You may add a custom success message (e.g. `Used ElasticSearch API`) if you like.

Before you restart the Admin-Node-Manager process, please open the file: `<apigateway-install-dir>/apigateway/conf/envSettings.props` and add the following new environment variable: `API_BUILDER_URL=https://elk-traffic-monitor-api:8443`. 

:point_right:    
Please remember to copy the changed Admin-Node-Manager configuration from the Policy-Studio project folder (path on Linux: `/home/<user>/apiprojects/\<project-name\>`) back to the ANM folder (`\<install-dir\>/apigateway/conf/fed`). Afterwards the ANM  must be restarted.

### Restrict the Traffic-Monitor

In larger companies hundreds of API service providers are using the API Manager to register their own services/APIs and want or should be able to monitor their own API independently. During registration, the corresponding APIs are assigned to API Manager organizations. However, the standard traffic monitor does not know the organization concept and therefore cannot restrict the view for a user based on the organization of an API.  
This project solves the problem by storing the API transactions in Elasticsearch with the appropriate organization. This API organization is used when reading the traffic data from Elasticsearch according to the following rules.

| API-Gateway Manager  | API-Manager   | Restriction | Comment | 
| :---          | :---                 | :---  | :---  |
| **Administrator**    | N/A           | Unrestricted access | A GW-Manager user is considered as an Admin, when is owns the permission: `adminusers_modify` |
| **Operator**         | API-Admin     | All APIs having a Service-Context | By default each API processed by the API-Manager has a Service-Context. Pure Gateway APIs (e.g. /healthcheck) will not be visible.|
| **Operator**         | Org-Admin     | APIs of its own organization | Such a user will only see the APIs that belong to the same organization as himself. |
| **Operator**         | User          | APIs of its own organization | The same rules apply as for the Org-Admin |

### Setup Restricted user

To give a user limited access to the API Traffic Monitor, the user must use the same login name in the API Manager and API Gateway Manager. Here, for example, an LDAP connection can be a simplification.
In order to give the user a restricted view in the API Gateway Manager, none of his roles must contain the permission: `adminusers_modify`. A suitable standard role is the `API Gateway Operator role`. 
You can, of course, create additional roles in the API Gateway Manager to adjust the user's rights according to your needs.

## Basic setup

### Getting started

To get started please download the release package from the GitHub project onto your machine:  
`wget --no-check-certificate --content-disposition https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/tarball/v0.0.11 -O - | tar -xvz`

The basic setup assumes you are running the individual components based on the provided docker-compose file, which is using the `.env` to read the required configuration parameters.  
For the basic setup the following describes what needs to be changed in the provided `.env` file. This file populates a number of environment variables, that are used by one or more components. For advanced configuration topics you can study the environment file as each parameter is explained. 

### Filebeat
:exclamation: __This is an important step, as otherwise Filebeat will not see and send any Open-Traffic Event data!__  
Setup the paths in the project `*.env` file. The variables must point to your running API-Gateway instance. These parameters are used to mount the Open-Traffic-Folder into the Filebeat container. For a typical Linux installation it looks like this (APIM being a symlink to current software version):
```
APIGATEWAY_LOGS_FOLDER=/opt/Axway/APIM/apigateway/logs/opentraffic
APIGATEWAY_TRACES_FOLDER=/opt/Axway/APIM/apigateway/groups/group-2/instance-1/trace
APIGATEWAY_EVENTS_FOLDER=/home/localuser/Axway-x.y.z/apigateway/events
```

### Logstash

Logstash receives the different events from Filebeat and processes them. Among other things, an HTTP lookup is performed on an API detail lookup REST-API to enrich the API information. Therefore Logstash must know under which URL the API builder can be reached.  
This parameter is optional if you use the default docker-compose.yml file.
```
API_BUILDER_URL=https://my-api-builder:8443
```

### API-Builder
As the API-Builder container needs to communicate with Elasticsearch it needs to know where Elasticsearch is running:
Please note, when using the default docker-compose.yaml the default setting is sufficient, as it's using the internal Docker-Network `elastic`.  
```
ELASTICSEARCH_HOST=https://elasticsearch1:9200
```
Furthermore, the API Builder communicates with the Admin Node Manager and API Manager. Therefore the following parameters must be configured in the `.env` file.  
```
ADMIN_NODE_MANAGER=https://api-env:8090
API_MANAGER_USERNAME=<admin-user>
API_MANAGER_PASSWORD=<admin-password>
```

### Elasticsearch

For the basic setup there is no need to configured anything for Elasticsearch.

### Kibana

For the basic setup there is no need to configured anything for Kibana.

## Manage the environment

###  Using docker-compose

To bring up the components you have configured use docker-compose:
````
docker-compose up -d
````
With that, the environment is started with the basic setup.  
````
docker-compose down 
````

### Acccess components

Elasticsearch and Kibana is started with HTTPS enabled. User-Authentication is disabled by default. The required ports are exposed by the docker-compose.yml:

Access Kibana: `https://your.host.com:5601/`

Access Elasticsearch: `https://your.host.com:9200`

## Advanced Setup

With the basic setup everything is using HTTPS but with an anonyomus user. Also the default setup is using dummy certificates which you should not use in a production environment. Therefore it's strongly recommended to replace the certificates and activate user authentication.  

### Activate user authentication

#### Generate Built-In user passwords

_This step can be ignored, when it's planned to use an existing Elasticsearch cluster._
Elasticsearch is initially configured with a number of built-in users, that don't have a password by default. So, the first step is to generate passwords for there users
```
docker exec elasticsearch1 /bin/bash -c "bin/elasticsearch-setup-passwords auto --batch --url https://localhost:9200"
Changed password for user apm_system
PASSWORD apm_system = MpYBNJZjyHSL3PoRyjKU

Changed password for user kibana_system
PASSWORD kibana_system = qJdDRYyL97lP5ERkHHrj

Changed password for user kibana
PASSWORD kibana = qJdDRYyL97lP5ERkHHrj

Changed password for user logstash_system
PASSWORD logstash_system = Y6J6vgw9Z0RTPcFR8Qp3

Changed password for user beats_system
PASSWORD beats_system = DyxUva2a6CwedZUhcpFH

Changed password for user remote_monitoring_user
PASSWORD remote_monitoring_user = tMF7X0UUv16hgHFllEjZ

Changed password for user elastic
PASSWORD elastic = 2x8vxZrvXX9a3KdGuA26
```

#### Update the .env with the passwords

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

After you have configured everything, please restart all services.  
  
It's very likely that you don't use the super-user `elastic` for `LOGSTASH_USERNAME` and `API_BUILDER_USERNAME`. It's recommended to create dedicated accounts for these two users.  
The monitoring users are used to send metric information to Elasticsearch to enable stack monitoring, which gives you insight about event processing of the complete platform:  

![Monitoring-Overview][Monitoring-Overview]  

### Configure cluster UUID

This step is optional, but required to monitor your Filebeat instances as part of the stack monitoring. To obtain the Cluster UUID run the following in your browser:  
`https://elasticsearch1:9200/` (if you have already activated authentication you can use the elastic user here)  

Take over the UUID into the .env file:  
`ELASTICSEARCH_CLUSTER_UUID=XBmL4QynThmwg0X0YN-ONA` 

You may also configure the following parameters: `GATEWAY_NAME` & `GATEWAY_REGION` to make you Filebeat instances unique.  

To activate these changes the Filebeat service must be restarted. 

### Securing API-Builder Traffic-Monitor API
The API-Builder project for providing access to Elasticsearch data has no access restrictions right now. To ensure only API-Gateway Manager users (topology administrators with proper RBAC role) or other users with appropriate access rights can query the log data, one can expose this API via API-Manager and add security here.

To import the API Builder project REST-API into your API-Manager, you can access the Swagger/OpenAPI definition here (replace docker-host and port appropriately for the container that is hosting the API-Builder project):  
https://docker-host:8443/apidoc/swagger.json?endpoints/trafficMonitorApi

## Sizing your infrastructure

The solution is designed to process and store millions of transactions per day and make them quickly available for traffic monitoring and analytics. 
This advantage of being able to access millions of transactions is not free of charge with Elasticsearch, but is available in the size of the disc space provided.
The solution has been extensively tested, especially for high-volume requirements. It processed 900 transactions per second, up to 55 million transactions per day on the following infrastructure.

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
Logstash write to Stdout, hence you can view information just with:
```
docker logs apigateway-openlogging-elk_logstash_1_c6227859a9a4 --follow
```
When Logstash is successfully started you should see the following:
```
[INFO ][logstash.javapipeline    ] Starting pipeline {:pipeline_id=>"main", "pipeline.workers"=>1, "pipeline.batch.size"=>20, "pipeline.batch.delay"=>50, "pipeline.max_inflight"=>20, :thread=>"#<Thread:0x7d34e839 run>"}
[INFO ][logstash.inputs.beats    ] Beats inputs: Starting input listener {:address=>"0.0.0.0:5044"}
[INFO ][logstash.javapipeline    ] Pipeline started {"pipeline.id"=>"main"}
[INFO ][org.logstash.beats.Server] Starting server on port: 5044
[INFO ][logstash.agent           ] Pipelines running {:count=>1, :running_pipelines=>[:main], :non_running_pipelines=>[]}
...
......
...
[INFO ][logstash.outputs.elasticsearch] Elasticsearch pool URLs updated {:changes=>{:removed=>[], :added=>[https://elasticsearch1:9200/]}}
[INFO ][logstash.outputs.elasticsearch] ES Output version determined {:es_version=>7}
[INFO ][logstash.outputs.elasticsearch] New Elasticsearch output {:class=>"LogStash::Outputs::ElasticSearch", :hosts=>["//elasticsearch1:9200"]}
[INFO ][logstash.javapipeline    ] Starting pipeline {:pipeline_id=>".monitoring-logstash", "pipeline.workers"=>1, "pipeline.batch.size"=>2, "pipeline.batch.delay"=>50, "pipeline.max_inflight"=>2, :thread=>"#<Thread:0x147f9919 run>"}
[INFO ][logstash.javapipeline    ] Pipeline started {"pipeline.id"=>".monitoring-logstash"}
[INFO ][logstash.agent           ] Pipelines running {:count=>2, :running_pipelines=>[:main, :".monitoring-logstash"], :non_running_pipelines=>[]}
[INFO ][logstash.agent           ] Successfully started Logstash API endpoint {:port=>9600}
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

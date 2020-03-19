# API-Management Traffic-Monitor based ELK stack

When having many API-Gateway instances with millions of requests the API-Gateway Traffic Monitor can become slow. The purpose of this project is to solve that performance issue and get other benefits by using a standard external datastore: Elasticsearch.  

The overall architecture this project provides looks like this:  
![Architecture][img1]   

### How it works  
Each API-Gateway instance is writing, [if configured](#enable-open-traffic-event-log), Open-Traffic Event-Log-Files, which are streamed by [Filebeat](https://www.elastic.co/beats/filebeat) into a Logstash-Instance. [Logstash](https://www.elastic.co/logstash) performs data pre-processing, combines different events and finally forwards the document into an [Elasticsearch](https://www.elastic.co/elasticsearch) cluster.  

Once the data is indexed by Elasticsearch it can be used by different clients. This process allows almost realtime monitoring of incoming requests. It takes around 5 seconds until a request is available in Elasticsearch.

## Option 1 - Using the existing Traffic-Monitor
One option is to use the existing API-Gateway Traffic-Monitor. That means, you use the same tooling as of today, but the underlying implementation of the Traffic-Monitor API is now pointing to Elasticsearch instead of the internal OPSDB hosted by each API-Gateway instance. This improves performance damatically, as Elasticsearch can scale across multiple machines if required and other dashboards can be created for instance with Kibana.  
The glue between Elasticsearch and the API-Gateway Traffic-Monitor is an API-Builder project, that is exposing the same Traffic-Monitor API, but it is implemented using Elasticsearch instead of the OPSDB. The API-Builder is available as a ready to use Docker-Image and preconfigured in the docker-compose file.  
Finally, the Admin-Node-Manager has to be configured to use the API-Builder API instead of the internal implementation.

API-Builder status:  
![Test Traffic-Monitor API](https://github.com/cwiechmann/apigateway-openlogging-elk/workflows/Test%20Traffic-Monitor%20API/badge.svg)

## Option 2 - Logspector
The Logspecotr is a new separated user-interface with very basic set of functionilties. As part of the project the Logspector is activated by default when using `docker-compose up -d`. If you don't wanna use it, it can be disabled by commenting out the following lines in the docker-compose.yml file:
```yaml
  nginx:
    image: nginx:1.17.6
    ports:
      - 8888:90
    volumes:
      - ${PWD}/nginx/www:/usr/share/nginx/html
      - ${PWD}/nginx/conf:/etc/nginx
    depends_on:
      - elasticsearch1
    networks:
      - elastic
      - ingress
```
The Log-Inspector is accessible on the following URL: `http://hostname-to-your-docker-machine:8888/logspector.html`

![Log-Spector][img5]  


## Prerequisites
For a simple deployment the prerequisites are very simple as all services can be started as a Docker-Container. In order to start all components in PoC-Like-Mode you just need:

1. A Docker engine
2. docker-compose installed
3. An API-Management Version >7.7-20200130  
   - Versin 7.7-20200130 is required due to some Dateform changes in the Open-Traffic-Format. With older versions of the API-Gateway you will get an error in Logstash processing.

Using the provided docker-compose is good to play with, however this approach is not recommended for production environments. Depending the load a dedicated machine (node) for Elasticsearch is recommended. The default configuration is prepared to scale up to five Elasticsearch nodes, which can handle millions of requests. To run Logstash and the API-Builder service a Docker-Orchestration framework is recommended as you get monitoring, self-healing, elasticity.

## Installation / Configuration
To run the components in a PoC-Like mode, the recommended way is to clone this project onto a machine having docker and docker-compose installed. Also this machine must have file-based access to the running API-Gateway instance, as the Filebeat docker container will mount the open-traffic folder into the docker-container.

`git clone https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk.git`  

This creates a local copy of the repository and you can start from there.

### Enable Open-Traffic Event Log
Obviously you have to enable Open-Traffic-Event log for your API-Gateway instances. [Read here][1] how to enable the Open-Traffic Event-Log.  
After this configuration has been done, Open-Traffic log-files will created by default in this location: `apigateway/logs/opentraffic`. This location becomes relevant in the next step, when configuring Filebeat.

### Configure the Admin-Node-Manager
This step is required if you would like to use the existing Traffic-Monitor in combination Elasticsearch.  
The Admin-Node-Manager (listening by default on port 8090) is responsible to server the API-Manager Traffic-Monitor and needs to be configured to use the API-Builder API instead.  
For the following steps, please open the Admin-Node-Manager configuration in Policy-Studio. You can [here](https://docs.axway.com/bundle/axway-open-docs/page/docs/apim_administration/apigtw_admin/general_rbac_ad_ldap/index.html#use-the-ldap-policy-to-protect-management-services) how to do that.  
- Create a new policy called: `Use Elasticsearch API`
- Configure this policy like so:  
  ![use ES API][img3]  
  The `Compare Attribute` filter checks if the requested API is already handled by the API-Builder project.  
  _As of today, only the Traffic-Overview is handled by the API-Builder. This will be changed soon._
  ![Is API Managed][img6] 
  Add the following: `http.request.path` is `/api/router/service/instance-1/ops/search`  
  The list of requests will be extended once the API-Builder project can serve more (e.g. the Request-Detail view)
  ![Connect to ES API][img7]  
  Adjust the URL of the Connect to URL filter to your running API-Builder docker container and port (default is 8889).  
- Insert the created policy as a callback policy into the main policy: `Protect Management Interfaces` like so:  
  ![Use Callback][img4]  
  With that, the Admin-Node-Manager will use the API-Builder API (Elasticsearch) to serve requests from the client.  

### Setup filebeat
:exclamation: __This is an important step, as otherwise Filebeat will not see and send any Open-Traffic Event data!__  
In the cloned project open the file .env file and setup the paths to your running API-Gateway instance. 
```
APIGATEWAY_LOGS_FOLDER=/home/localuser/Axway-x.y.z/apigateway/logs/opentraffic
APIGATEWAY_TRACES_FOLDER=/home/localuser/Axway-x.y.z/apigateway/groups/group-1/instance-1/trace
```

### Setup API-Builder
As the API-Builder container needs to communicate with Elasticsearch it needs to know where Elasticsearch is running. Use this environment variable to configure it:
```
ELASTIC_NODE=http://elasticsearch1:9200
```
Please note, when using the default docker-compose.yaml the default setting is sufficient, as it's using the internal Docker-Network `elastic`.

### Update vm.max_map_count kernel setting to at least 262144

See https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-prod-prerequisites

###  Start local elasticsearch cluster
Bring the cluster up using docker-compose:
````
docker-compose up -d
````
Of course, the components can also run on different machines or on a Docker-Orchestration framework such as Kubernetes.

## Stop cluster
````
docker-compose down
````

[img1]: imgs/component-overview.png
[img2]: imgs/node-manager-policies.png
[img3]: imgs/node-manager-use-es-api.png
[img4]: imgs/node-manager-policies-use-elasticsearch-api.png
[img5]: imgs/Logspector.png
[img6]: imgs/IsmanagedbyElasticsearchAPI.png
[img7]: imgs/connect-to-elasticsearch-api.png

[1]: https://docs.axway.com/bundle/axway-open-docs/page/docs/apim_administration/apigtw_admin/admin_open_logging/index.html#configure-open-traffic-event-logging

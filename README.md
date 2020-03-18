# API-Management Traffic-Monitor based ELK stack

When having many API-Gateway instances with a millions of requests the API-Gateway Traffic Monitor can become slow. The purpose of this project is to solve that performance issue and get other benefits by using a standard external datastore: Elasticsearch.  

The overall architecture this project provides looks like this:  
![Architecture][img1]   

### How it works  
Each API-Gateway instance is writing, if configured, Open-Traffic Log-Files, which are streamed by Beats into a Logstash-Instance. Logstash is performing data pre-processing, combining different events and finally forwards the document into an Elasticsearch cluster.  

Once the data is indexed in Elasticsearch it can be used by different clients. 

## Option 1 - Using the existing Traffic-Monitor
One option is to use the existing API-Gateway Traffic-Monitor. That means, you use the same tooling as of today, but the underlying implementation of the Traffic-Monitor API is now pointing to Elasticsearch instead of the internal OPSDB hosted by each API-Gateway instance. This improves performance damatically, as Elasticsearch can scale across multiple machines if required and other dashboards can be created for instance with Kibana.  
The glue between Elasticsearch and the API-Gateway Traffic-Monitor is an API-Builder project, that is exposing the same Traffic-Monitor API, but it is implemented using Elasticsearch instead of the OPSDB. The API-Builder is available as a ready to use Docker-Image and preconfigured in the docker-compose file.  
Finally, the Admin-Node-Manager has to be configured to use the API-Builder API instead of the internal implementation.

API-Builder status:  
![Test Traffic-Monitor API](https://github.com/cwiechmann/apigateway-openlogging-elk/workflows/Test%20Traffic-Monitor%20API/badge.svg)

## Option 2 - Log-Inspector
This a new separated user-interface with very basic set of functionilties. The Log-Inspector can be enabled by activating the following lines in the docker-compose.yml file:
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
Once, you activate those lines in the docker-compose.yaml and run `docker-compose up -d` you can access the Log-Inspector with: `http://localhot:8888/logspector.html`  

![Log-Spector][img5]  


## Prerequisites
For a simple deployment the prerequisites are very simple as all services can be started as a Docker-Container. In order to start all required components in PoC-Mode you just need:

1. A Docker engine
2. docker-compose installed
3. An API-Management Version >7.7-20200130 (this is required due to Open-Traffic-Format)

This approach is not recommended for production environments. Depending the load a dedicated machine (node) for Elasticsearch is recommended. With the default configuration it is prepared to scale up to five Elasticsearch nodes. To run Logstash and the API-Builder service a Docker-Orchestration framework is recommended.

## Installation / Configuration
To run the components in a PoC-Like mode, the recommended way is to clone this project onto a machine having docker and docker-compose installed plus access to a running API-Gateway instance.  

`git clone https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk.git`  

This creates a local copy of the repository and you can start from there.

### Enable Open-Traffic Event Log
Obviously you have to enable Open-Traffic-Event log for your API-Gateway instances. [Read here][1] how to enable the Open-Traffic Event-Log.  
After this configuration has been done, Open-Traffic log-files will created by default in this location: `apigateway/logs/opentraffic`. This location becomes relevant in the next step, when configuring Filebeat.

### Configure the Admin-Node-Manager
This step is required if you would like to use the existing Traffic-Monitor in combination Elasticsearch. The Admin-Node-Manager (listing by default on port 8090) is responsible to drive the API-Manager Traffic-Monitor and needs to configured to use the API-Builder API instead.  
For that, please open Admin-Node-Manager in Policy-Studio. The Admin-Node-Manager config is located here. `apigateway/conf/fed` and can be opended by creating a new project from a existing configuration.  
- Create a new policy for instance called: `Use Elasticsearch API`
- Configure this policy like so:  
  ![use ES API][img3]  
  The `Compare Attribute` filter checks if the requested API is already handled by the API-Builder project.  
  _As of today, only the Traffic-Overview is handled by the API-Builder. This will be changed soon._
  ![Is API Managed][img6] 
  Add the following: `http.request.path` is `/api/router/service/instance-1/ops/search`  
  ![Connect to ES API][img7]  
  Adjust the URL of the Connect to URL filter to your running API-Builder docker container and port.  
- Insert the created policy as a callback policy into the main policy: `Protect Management Interfaces` like so:  
  ![Use Callback][img4]  
  With that, the Admin-Node-Manager will use the API-Builder API (Elasticsearch) to serve the request from the client.  

### Setup filebeat
In the cloned project open the file .env file and setup the paths to your running API-Gateway instance. 
```
APIGATEWAY_LOGS_FOLDER=/home/localuser/Axway-x.y.z/apigateway/logs/opentraffic
APIGATEWAY_TRACES_FOLDER=/home/localuser/Axway-x.y.z/apigateway/groups/group-1/instance-1/trace
```
This is important, as otherwise Filebeat will not see and send any data!

### Setup API-Builder
As the API-Builder container needs to communicate with Elasticsearch it needs to know where Elasticsearch is running. Use this environment variable to configure it:
```
ELASTIC_NODE=http://elasticsearch1:9200
```
Please note, when using the default docker-compose.yaml the default setting is sufficient.

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

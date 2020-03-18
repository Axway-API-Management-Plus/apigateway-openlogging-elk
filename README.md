# API-Management Traffic-Monitor based ELK stack

When having many API-Gateway instances with a millions of requests the API-Gateway Traffic Monitor can become slow. The purpose of this project is to solve that performance issue and get other benefits by using a standard external datastore: Elasticsearch.  

The overall architecture this project provides looks like this:  
![Architecture][img1]   

### How it works  
Each API-Gateway instance is writing, if configured, Open-Traffic Log-Files, which are streamed by Beats into a Logstash-Instance. Logstash is performing data pre-processing, combining different events and finally forwards the document into an Elasticsearch cluster.  

Once the data is indexed in Elasticsearch it can be used by different clients. 

## Option 1 - Using the existing Traffic-Monitor
One option is using the existing API-Gateway Traffic-Monitor. That means, you can use the same tooling as of today, but the underlying implementation of the Traffic-Monitor API is now point to Elasticsearch. This improves performance damatically, as Elasticsearch can scale across multiple machines if required.  
The glue between Elasticsearch and the API-Gateway Traffic-Monitor is an API-Builder project, that is exposing the same API, but to implement this interface it queries Elasticsearch instead of the OPSDB hosted by the individual API-Gateways.  Finally, the Admin-Node-Manager has to be configured to use the API-Builder API instead of the internal implementation.

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

1. docker
2. docker-compose
3. API-Management Version >7.7-20200130

## Installation / Configuration


### Update vm.max_map_count kernel setting to at least 262144

See https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-prod-prerequisites

## Start local elasticsearch cluster

1.  Edit the .env file and configure both APIGATEWAY_LOGS_FOLDER and APIGATEWAY_TRACES_FOLDER environment variables to point to your open traffic and trace folders respectively.
2.  Bring the cluster up using docker-compose:
````
docker-compose up -d
````

## Stop cluster
````
docker-compose down
````

[img1]: imgs/component-overview.png
[img2]: imgs/node-manager-policies.png
[img3]: imgs/node-manager-use-es-api.png
[img4]: imgs/node-manager-policies-use-elasticsearch-api.png
[img5]: imgs/Logspector.png

# API-Management Traffic-Monitor based ELK stack

When having many API-Gateway instances with millions of requests the API-Gateway Traffic Monitor can become slow and the observation period quite short. The purpose of this project is to solve that performance issue, make it possible to observe a long time-frame and get other benefits by using a standard external datastore: [Elasticsearch](https://www.elastic.co/elasticsearch).  

The overall architecture this project provides looks like this:  
![Architecture][img1]   

This also makes it possible to collect data from API-Gateways running all over the world into a centralized Elasticsearch instance to have it available with the best possible performance independing from the network performance.  
It also helps, when running the Axway API-Gateway in Docker-Orchestration-Environment where containers are started and stopped as it avoids to loose data, when an API-Gateway container is stopped.  

### How it works  
Each API-Gateway instance is writing, [if configured](#enable-open-traffic-event-log), Open-Traffic Event-Log-Files, which are streamed by [Filebeat](https://www.elastic.co/beats/filebeat) into a Logstash-Instance. [Logstash](https://www.elastic.co/logstash) performs data pre-processing, combines different events and finally forwards these so called documents into an Elasticsearch cluster.  

Once the data is indexed by Elasticsearch it can be used by different clients. This process allows almost realtime monitoring of incoming requests. It takes around 5 seconds until a request is available in Elasticsearch.

## Option 1 - Using the existing Traffic-Monitor
One option is to use the existing API-Gateway Traffic-Monitor. That means, you use the same tooling as of today, but the underlying implementation of the Traffic-Monitor API is now pointing to Elasticsearch instead of the internal OPSDB hosted by each API-Gateway instance. This improves performance damatically, as Elasticsearch can scale across multiple machines if required and other dashboards can be created for instance with Kibana.  
The glue between Elasticsearch and the API-Gateway Traffic-Monitor is an [API-Builder project](./elk-traffic-monitor-api), that is exposing the same Traffic-Monitor API, but it is implemented using Elasticsearch instead of the OPSDB. The API-Builder is available as a ready to use Docker-Image and preconfigured in the docker-compose file.  
Optionally you can import the API-Builder API into your API-Management system to apply additional security and by that secure access to your Elasticsearch instance.  

Finally, the Admin-Node-Manager has to be [configured](#configure-the-admin-node-manager) to use the API-Builder API instead of the internal implementation.

API-Builder exposing Traffic-Monitor API:  
![Traffic-Monitor API](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/workflows/Test%20Traffic-Monitor%20API/badge.svg)

## Option 2 - Loginspector
The Loginspector is a new separated user-interface with very basic set of functionalities. As part of the project the Loginspector is activated by default when using `docker-compose up -d`. If you don't wanna use it, it can be disabled by commenting out the following lines in the docker-compose.yml file:
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

![Log-Inspector][img5]  


## Prerequisites
For a simple deployment the prerequisites are very simple as all services can be started as a Docker-Container. In order to start all components in PoC-Like-Mode you just need:

1. A Docker engine
2. Docker-compose
3. An API-Management Version >7.7-20200130  
   - Versin 7.7-20200130 is required due to some Dateformat changes in the Open-Traffic-Format. With older versions of the API-Gateway you will get an error in Logstash processing.

Using the provided docker-compose is good to play with, however this approach is not recommended for production environments. Depending on the load, a dedicated machine (node) for Elasticsearch is recommended. The default configuration is prepared to scale up to five Elasticsearch nodes, which can handle millions of requests. To run Logstash and the API-Builder service a Docker-Orchestration framework is recommended as you get monitoring, self-healing, elasticity and more.

## Installation / Configuration
To run the components in a PoC-Like mode, the recommended way is to clone this project onto a machine having docker and docker-compose installed. Also this machine must have file-based access to the running API-Gateway instance, as the Filebeat docker container will mount the open-traffic folder into the container.

`git clone https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk.git`  

This creates a local copy of the repository and you can start from there.

### Enable Open-Traffic Event Log
Obviously, you have to enable Open-Traffic-Event log for your API-Gateway instance(s). [Read here][1] how to enable the Open-Traffic Event-Log.  
After this configuration has been done, Open-Traffic log-files will be created by default in this location: `apigateway/logs/opentraffic`. This location becomes relevant when configuring Filebeat.

### Configure the Admin-Node-Manager
As the idea of this project is to use the existing API-Gateway Manager UI (short: ANM) to render log data now provided by Elasticsearch instead of the individual API-Gateway instances before (the build in behavior), it is required to patch the ANM configuration to make use of Elasticsearch instead of the API-Gateway instances (default setup). By default, ANM is listening on port 8090 for administrative traffic. This API is responsible to serve the Traffic-Monitor and needs to be configured to use the API-Builder REST-API instead.

For the following steps, please open the ANM configuration in Policy-Studio. You can read [here](https://docs.axway.com/bundle/axway-open-docs/page/docs/apim_administration/apigtw_admin/general_rbac_ad_ldap/index.html#use-the-ldap-policy-to-protect-management-services) how to do that.  
- Create a new policy and name it `Use Elasticsearch API` - *This Policy will decide on what API calls can be routed to Elasticsearch*
- The configured Policy should look like this:

  ![use ES API][img3]  

    - The `Compare Attribute` filter checks if the requested API can be handled by the API-Builder project.    
    As a basis for decision-making a criteria for each endpoint needs to be added to the filter configuration.  
    _At this point in time only two endpoints are supported by the API Builder based Traffic-Monitor API.  
    The **search** endpoint which provides the data for the HTTP Traffic overview and the **circuitpath** endpoint which provides the data for the Filter Execution Path as part of the detailed view of a transaction. Currently the API Builder Project does not cover all endpoints to completely replace the existing Traffic Monitor API yet, but more endpoints will be added soon!_    
    For search endpoint add: `http.request.path` matches regular expression `^\/api\/router\/service\/[A-Za-z0-9-.]+\/ops\/search$`  
    For circuitpath endpoint add: `http.request.path` matches regular expression `^\/api\/router\/service\/[A-Za-z0-9-.]+\/ops\/stream\/[A-Za-z0-9]+\/[^\/]+\/circuitpath$`  
    _The list of requests will be extended once the API-Builder project can serve more (e.g. the Request-Detail view)._  
    ![Is API Managed][img6]  
    - Adjust the URL of the Connect to URL filter to your running API-Builder docker container and port - **default is 8889**. Sample: `http://api-env:8889/api/elk/v1${http.request.rawURI}`  
    ![Connect to ES API][img7]
- Insert the created policy as a callback policy (filter: Shortcut filter) into the main policy: `Protect Management Interfaces` and wire it like shown here:  
  ![Use Callback][img4]  
  
After you have saved, copy the configuration files from your local *Policy Studio* project (path on Linux: `/home/<user>/apiprojects/\<project-name\>`) back the configuration to the Admin-Node-Manager configuration (`\<install-dir\>/apigateway/conf/fed`) and restarted it. The Admin-Node-Manager will use the API provided by API-Builder to query the Elasticsearch API to serve the specified request-types.  

### Setup filebeat
:exclamation: __This is an important step, as otherwise Filebeat will not see and send any Open-Traffic Event data!__  
Before starting the container using docker-compose, make sure to setup the paths in the project `*.env` file. The variables must point to your running API-Gateway instance. These parameters are used to mount the Open-Traffic-Folder into the Filebeat container. For a typical Linux installation it looks like this (APIM beeing a symlink to current software version):
```
APIGATEWAY_LOGS_FOLDER=/opt/Axway/APIM/apigateway/logs/opentraffic
APIGATEWAY_TRACES_FOLDER=/opt/Axway/APIM/apigateway/groups/group-2/instance-1/trace
```

### Setup API-Builder
As the API-Builder container needs to communicate with Elasticsearch it needs to know where Elasticsearch is running. Again, this environment variable must be configured within `.env`:
```
ELASTIC_NODE=http://elasticsearch1:9200
```
Please note, when using the default docker-compose.yaml the default setting is sufficient, as it's using the internal Docker-Network `elastic`.

### Update vm.max_map_count kernel setting to at least 262144

See https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-prod-prerequisites

###  Start local Elasticsearch cluster
Bring the cluster up using docker-compose:
````
docker-compose up -d
````
Of course, the components can also run on different machines or on a Docker-Orchestration framework such as Kubernetes.

### Stop local Elasticsearch cluster
````
docker-compose down
````

### Securing API-Builder Traffic-Monitor API
The API-Builder project for providing access to Elasticsearch data has no access restrictions right now. To ensure only API-Gateway Manager users (topology administrators with proper RBAC role) or other users with appropriate access rights can query the log data, one can expose this API via API-Manager and add security here.

To import the API Builder project REST-API into your API-Manager, you can access the Swagger/OpenAPI definition here (replace docker-host and port appropriately for the container that is hosting the API-Builder project):  
http://docker-host:8889/apidoc/swagger.json?endpoints/trafficMonitorApi

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
The following error means, Logstash is not running or reachable:
```
ERROR	pipeline/output.go:100	Failed to connect to backoff(async(tcp://logstash:5044)): lookup logstash on 127.0.0.11:53: no such host
```
General note: You don't see Filebeat telling you, when it is successfully processing your log-files. When the Harvester process is started and you don't see any errors, you can assume your files are processed.

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
[INFO ][logstash.outputs.elasticsearch] Elasticsearch pool URLs updated {:changes=>{:removed=>[], :added=>[http://elasticsearch1:9200/]}}
[INFO ][logstash.outputs.elasticsearch] ES Output version determined {:es_version=>7}
[INFO ][logstash.outputs.elasticsearch] New Elasticsearch output {:class=>"LogStash::Outputs::ElasticSearch", :hosts=>["//elasticsearch1:9200"]}
[INFO ][logstash.javapipeline    ] Starting pipeline {:pipeline_id=>".monitoring-logstash", "pipeline.workers"=>1, "pipeline.batch.size"=>2, "pipeline.batch.delay"=>50, "pipeline.max_inflight"=>2, :thread=>"#<Thread:0x147f9919 run>"}
[INFO ][logstash.javapipeline    ] Pipeline started {"pipeline.id"=>".monitoring-logstash"}
[INFO ][logstash.agent           ] Pipelines running {:count=>2, :running_pipelines=>[:main, :".monitoring-logstash"], :non_running_pipelines=>[]}
[INFO ][logstash.agent           ] Successfully started Logstash API endpoint {:port=>9600}
```
Once, Logstash is successfully processing data, you see them flying by as JSON-Payload in the log output.

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
When using the API-Gateway Traffic-Monitor and having the Admin-Node-Manager re-configured you see how API-Builder is processing the requests:
```
Request {"method":"GET","url":"/api/elk/v1/api/router/service/instance-1/ops/search?format=json&field=leg&value=0&count=1000&ago=10m&protocol=http","headers":{"host":"localhost:8889","max-forwards":"20","via":"1.0 api-env (Gateway)","accept":"application/json","accept-language":"en-US,en;q=0.5","cookie":"cookie_pressed_153=false; t3-admin-tour-firstshow=1; VIDUSR=1584691147-TE1M3vI9BFWgkA%3d%3d; layout_type=table; portal.logintypesso=false; portal.demo=off; portal.isgridSortIgnoreCase=on; 6e7e1bb1dd446d4cd36889414ccb4cb7=8g9p3kh27t1se22lu6avkmu0a1; joomla_user_state=logged_in; 220b750abfbc8d2f2f878161bab0ab65=62gr71dkre858nc0gjldri18gt","csrf-token":"8E96374767C47BFADC9C606FF969D7CF56FB3F9523E41B34F3B3B269F7302646","referer":"https://api-env:8090/","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0","x-requested-with":"XMLHttpRequest","connection":"close","x-correlationid":"Id-fd7c745ebfaed039b2155481 1"},"remoteAddress":"::ffff:172.25.0.1","remotePort":55916}
Response {"statusCode":200,"headers":{"server":"API Builder/4.25.0","request-id":"35fb859d-00b0-404b-97e6-b549db17f84c","x-xss-protection":"1; mode=block","x-frame-options":"DENY","surrogate-control":"no-store","cache-control":"no-store, no-cache, must-revalidate, proxy-revalidate","pragma":"no-cache","expires":"0","x-content-type-options":"nosniff","start-time":"1584692477587","content-type":"application/json; charset=utf-8","response-time":"408","content-md5":"e306ea2d930a3b80f0e91a29131d520b","content-length":"267","etag":"W/\"10b-2N+JsHuxDxMVKhJR1A8GuNGnKDQ\"","vary":"Accept-Encoding"}}
```
#### Check queries send to ElasticSearch
In oder to see the queries that are send to ElasticSearch by API-Builder you need to run the Docker-Container with `LOG_LEVEL=debug`. This gives you in the console of the API-Builder the following output:  
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

[1]: https://docs.axway.com/bundle/axway-open-docs/page/docs/apim_administration/apigtw_admin/admin_open_logging/index.html#configure-open-traffic-event-logging

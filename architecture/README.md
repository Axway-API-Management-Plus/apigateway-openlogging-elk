# Architecture overview

The solution was designed to scale with growing requirements. Therefore, each component (Logstash, API-Builder4Elastic, etc.) can be scaled in isolation. For example, if more Logstash capacity is needed, but no additional API-Builder4Elastic, Logstash can be scaled individually. This is the main reason why the solution is deployed based on Docker containers.
Another reason is to make setup and update as easy as possible. In the medium term, this should also be possible based on HELM charts for Kubernetes & OpenShift.

# Architecture examples

On this page, which is currently under construction, we will present various architecture deployment options in detail. 
These should help to embed the solution into an existing infrastructure. 


For each architecture example there will be corresponding detailed information. We will start with an AWS deployment based on EC2 machines.

| Name       | Description               |  
| :---          | :---                 | 
| [AWS EC2 HA-Setup 1 Region / 2 Zones](aws-ec2-ha-one-region-2-zones)|Example deployment architecture based on classic AWS-EC2 instances for a high availability solution in an AWS region with 2 availability zones.|
| [Classic-Setup with native Filebeat](classic-simple-filebeat-native)|Very simple example of a classically deployed API gateway (3 nodes).|
| [Kubernetes/OpenShift deployment](kubernetes)|Deployment in a Docker-Orchestration framework such as Kubernetes|

# Architecture FAQ

## Can we support the solution in non-docker mode? 

No, the solution is designed to run based on Docker containers. It is also planned that the solution can be deployed on Kubernetes/OpenShift using HELM charts. A non-Docker mode would be the opposite direction.

## Can we get rid of API Builder and instead leverage policies in API Gateway/Manager for API detail lookup and other requirements?

No, a large part of the logic of the solution is in the API Builder application. Implementing this in policies might be possible, but managing & updating the individual customer installations would be very time-consuming and error-prone. So the customer has to reference the appropriate API-Builder image and you know by version exactly what code base the customer is running.

## Can we minimize the number of dependencies? Elastic Search, Logstash, Kibana and FileBeat agents are mandatory. Can API Builder and MemCache be made optional?

No, API-Builder is a substantial part of the solution. It’s exposing the fully tested Traffic-Monitor API, manages Elasticsearch, provides Lookup-APIs. Everything fully automated tested.

## Is it possible to use another caching solution than Memcached?

No, that is not possible. Logstash uses a filter to communicate with Memcached and is integrated into the Logstash pipelines. Only the interaction of the pipelines & Memcached has been tested and is thus supported.
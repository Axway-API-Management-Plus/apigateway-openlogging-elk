# How to update

This document contains information on how to upgrade the solution from one version to the next. It is also possible to skip multiple versions.  

The basic principle of the solution is that no files delivered with a release are changed. This is the best way to ensure that the solution can be updated without any problems. Only your .env file(s) must be carried over from one release to the next. It is not planned to backport bugfixes or enhancements in older releases.  

Currently, we describe how to update based on Docker Compose. As soon as a deployment via HELM charts on a Kubernetes cluster is supported, that will also be documented here.

## Zero-downtime upgrade

With the following steps you can update the solution without downtime. Of course, this requires that all components (Logstash, API Builder, Memcached) are running at least 2x and configured accordingly. So all filebeats have to communicate with all logstash hosts.

### General overview

The core component is the API Builder project which provides the information about the necessary configuration. In principle, it contains the desired or necessary state suitable for the version, especially about the Elasticsearch configuration, such as index templates, ILM policies, etc. If the version is updated, the API builder checks the current configuration in Elasticsearch and adjusts it if necessary to fit the corresponding version. This includes necessary changes for bug fixes or enhancements.  

#### Upgrade steps overview

- load and unpack the current or desired release
   - it is recommended to unpack it next to the existing release
- copy your existing `.env` file from the current installation
  - recommended is to use a sym-link to a central `.env` file, which should also be versioned if necessary
  - it is pointed out in this document, if parameters have changed or new ones have been added.
- please make sure that you carry over your own certificates into the new release
- depending on which components have changed
  - these containers must be stopped and then restarted based on the new release with `docker-compose up -d`
  - e.g. if no change is noted in logstash, then this component can continue to run
- the API builder delivers the configuration for Elasticsearch as well
  - If the API builder is updated, then it checks on restart and periodically if the Elasticsearch configuration is correct.
  - In addition, the API builder checks whether the filebeat and logstash configuration corresponds to the expected version.

## Release history - Changed components

This table should help you to understand which components have changed with which version. For example, it is not always or very rarely necessary to update Filebeat.  

On the other hand, the API builder Docker image, as a central component of the solution, will most likely change with each release.  

| Ver   | API-Builder                        | Logstash                           | Memcached                          | Filebeat      | ANM-Config      | Dashboards      | Params          |Elastic-Config      | ELK-Ver.| Notes      |
| :---  | :---:                              | :---:                              | :---:                              | :---:         | :---:           | :---:           | :---:           |:---:               | :---:   | :---       |
| 1.0.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | [X](#filebeat)| [X](#anm-config)| [X](#dashboards)| [X](#parameters)|[X](#elastic-config)| 7.9.2   |            |
| 2.0.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | [X](#filebeat)| [X](#anm-config)| [X](#dashboards)| [X](#parameters)|[X](#elastic-config)| 7.10.0  |            |
| 2.0.1 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               | -                  | 7.10.0  |            |
| 2.0.2 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               | -                  | 7.10.0  |            |
| 2.1.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | -                                  | -             | -               | -               | [X](#parameters)|[X](#elastic-config)| 7.10.0  |            |
| 2.1.1 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |-                   | 7.10.0  |            |
| 2.1.2 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |-                   | 7.10.0  |            |
| 2.2.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | -                                  | -             | -               | -               | -               |-                   | 7.10.0  |            |
| 2.3.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |-                   | 7.10.0  |            |
| 2.4.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | -                                  | -             | -               | -               | [X](#parameters)|-                   | 7.10.0  |            |
| 2.4.1 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |-                   | 7.10.0  |            |
| 2.4.2 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |[X](#elastic-config)| 7.10.0  |            |
| 3.0.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | [X](#parameters)|-                   | 7.12.1  |            |
| 3.1.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |-                   | 7.12.1  |            |
| 3.2.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |[X](#elastic-config)| 7.12.1  |            |
| 3.3.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | -                                  | -             | -               | -               | [X](#parameters)|-                   | 7.12.1  |            |

### Update from Version 1.0.0

If you are upgrading from Release 1.0.0 and encounter problems, please open an issue.

## Upgrade components

### Filebeat

If Filebeat changes with a version, you must update the corresponding configuration on all your API Gateway instances. It is recommended to update Filebeat as the first component, because the Filebeat configuration version is checked by the API builder process. If it does not match, Logstash will exit with an error message.
Even if you run Filebeat as a native service, you have to copy the configuration (`filebeat/filebeat.yml`) from the release into your configuration.

The following steps illustrates an update to version 3.2.0 using the docker-compose approach:  
```
wget --no-check-certificate https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v3.2.0/axway-apim-elk-v3.2.0.tar.gz -O - | tar -xvz
cd axway-apim-elk-v3.2.0
cp ~/axway-apim-elk-v3.1.0/.env .
cp ~/axway-apim-elk-v3.1.0/config/all-my-custom-certificates ./config
docker-compose -f filebeat/docker-compose.filebeat.yml stop
docker-compose -f filebeat/docker-compose.filebeat.yml up -d
```

If you have deployed the solution on a Kubernetes-Cluster using Helm read [here](helm/README.md) for more information.

### API-Builder/Logstash/Memcached

If Filebeat should be updated with one of the releases that are between the current one and the new one, then please [update Filebeat](#filebeat) in advance.

API Builder, Logstash and Memcache work as a tight unit and should be stopped, updated together if possible. Please note, that changes to Logstash do not mean that the Logstash version has changed, but that the Logstash pipeline configuration has changed. To activate these changes the new release must be used to start Logstash.  

The following steps illustrates an update to version 3.2.0:
```
wget --no-check-certificate https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v3.2.0/axway-apim-elk-v3.2.0.tar.gz -O - | tar -xvz
cd axway-apim-elk-v3.2.0
cp ~/axway-apim-elk-v3.1.0/.env .
cp ~/axway-apim-elk-v3.1.0/config/all-my-custom-certificates ./config
docker-compose stop
docker-compose up -d
```
Repeat these steps on all machines running Logstash/API-Builder/Memcache.  

If you have deployed the solution on a Kubernetes-Cluster using Helm read [here](helm/README.md) for more information.

### ANM config

Please follow the instructions to [setup the Admin-Node-Manager](README.md#setup-admin-node-manager) based on the most recent Policy-Fragment shipped with the release. Please make sure that they take their own certificates with them.

### Dashboards

Please follow the instructions to [import Kibana-Dashboards](README.md#kibana) based on the most recent Dashboards shipped with the release. Select that existing objects are overwritten.

### Parameters

Sometimes it may be necessary to include newly introduced parameters in your `.env` file or you may want to use optional parameters. To do this, use the supplied `env-sample` as a reference and copy the desired parameters. Please check the [changelog](CHANGELOG.md) which new parameters have been added.

### Elastic-Stack version

If the Elasticsearch version needs to be updated, for example because a problem has been fixed, please follow these steps:
- Open your `.env` file and change the parameter: `ELASTIC_VERSION` to the necessary version as specified in the release or the version you would like to use
  - Make sure that the `.env` file contains the correct/same version on all machines
- To avoid any downtime, double check all Elasticsearch clients have multiple or all Elasticsearch nodes configured so that they can fail over  

__1. Update Elasticsearch cluster__   

Updating the Elasticsearch cluster happens one node after next. Before updating the next node it's strongly recommended that the cluster state is green and remaining nodes have enough disk space to take over the shards from the node to be upgraded.
```
wget --no-check-certificate https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v2.0.2/axway-apim-elk-v2.0.2.tar.gz -O - | tar -xvz
cd axway-apim-elk-v2.0.2
cp ~/axway-apim-elk-v2.0.0/.env .
cp ~/axway-apim-elk-v2.0.0/config/all-my-custom-certificates ./config
docker-compose -f elasticsearch/docker-compose.es01.yml stop
docker-compose -f elasticsearch/docker-compose.es01.yml up -d
```
Repeat these steps on the remaining Eleasticsearch nodes, but only after the Elasticsearch cluster has returned to Green status.   

__2. Update Kibana__   

To update Kibana you need to perform the following steps after adjusting the `ELASTIC_VERSION` accordingly.

```
wget --no-check-certificate https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v2.0.2/axway-apim-elk-v2.0.2.tar.gz -O - | tar -xvz
cd axway-apim-elk-v2.0.2
cp ~/axway-apim-elk-v2.0.0/.env .
cp ~/axway-apim-elk-v2.0.0/config/all-my-custom-certificates ./config
docker-compose -f kibana/docker-compose.kibana.yml stop
docker-compose -f kibana/docker-compose.kibana.yml up -d
```

__3. Update Logstash__   

Same procedure as for Kibana but repeat this on all Logstash nodes.
```
wget --no-check-certificate https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v2.0.2/axway-apim-elk-v2.0.2.tar.gz -O - | tar -xvz
cd axway-apim-elk-v2.0.2
cp ~/axway-apim-elk-v2.0.0/.env .
docker-compose stop
docker-compose up -d
```

__4. Update Filebeat__   

Same procedure as for Kibana and Logstash but repeat this on all Filebeat nodes.
```
wget --no-check-certificate https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v2.0.2/axway-apim-elk-v2.0.2.tar.gz -O - | tar -xvz
cd axway-apim-elk-v2.0.2
cp ~/axway-apim-elk-v2.0.0/.env .
cp ~/axway-apim-elk-v2.0.0/config/all-my-custom-certificates ./config
docker-compose -f filebeat/docker-compose.filebeat.yml stop
docker-compose -f filebeat/docker-compose.filebeat.yml up -d
```

### Elastic Config

Whether the Elastic configuration has changed is for information only and does not require any steps during the update.  
The required Elasticsearch configuration is built into the API Builder image and Elasticsearch will be updated accordingly if necessary.  
This includes the following components:  

- Index configuration
- Index templates
- Index lifecycle policies
- Rollup jobs  

You can find the current configuration here: [elasticsearch_config](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/tree/develop/apibuilder4elastic/elasticsearch_config)

## Update FAQ

### Do I need to update the Elasticsearch version?

The solution ships a defined Elasticsearch version with each release, which is used by all components of the Elastic stack (Filebeat, Kibana, ...). If nothing else is specified, then you can stay on the Elastic Stack version defined in your `.env` file.

### Can I skip several versions for an upgrade?

Yes, you can. Please note which components have been updated between the current and the new version.

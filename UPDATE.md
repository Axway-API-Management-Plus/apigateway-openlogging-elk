# How to update

This document contains information on how to upgrade the solution from one version to the next. It is also possible to skip multiple versions.  

The basic principle of the solution is that no files delivered with a release are changed. This is the best way to ensure that the solution can be updated without any problems. Only your .env file(s) must be carried over from one release to the next. It is not planned to backport bugfixes or enhancements in older releases.  

Currently, we describe how to update based on Docker Compose. As soon as a deployment via HELM charts on a Kubernetes cluster is supported, that will also be documented here.

## Zero-downtime upgrade

With the following steps you can update the solution without downtime. Of course, this requires that all components (Logstash, API Builder, Memcached) are running at least 2x and configured accordingly. So all filebeats have to communicate with all logstash hosts.

### General overview

The core component is the API Builder project which provides the information about the necessary configuration. In principle, it contains the desired or necessary state suitable for the version, especially about the Elasticsearch configuration, such as index templates, ILM policies, etc. If the version is updated, the API builder checks the current configuration in Elasticsearch and adjusts it if necessary to fit the corresponding version. This includes necessary changes for bug fixes or enhancements.  

#### Upgrade steps overview

- Load and unpack the current or desired release
   - it is recommended to unpack it next to the existing release
   - `wget --no-check-certificate https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v2.0.2/axway-apim-elk-v2.0.2.tar.gz -O - | tar -xvz`
- Copy your `.env` file from the existing installation
  - recommended is to use a sym-link to a central `.env` file, which should also be versioned if necessary
  - it is pointed out in this document, if parameters have changed or new ones have been added.
- depending on which components have changed
  - these containers must be stopped and then restarted based on the new release with `docker-compose up -d`
  - e.g. if no change is noted in logstash, then this component can continue to run
- the API builder delivers the configuration for Elasticsearch as well
  - If the API builder is updated, then it checks on restart and periodically if the Elasticsearch configuration is correct.
  - In addition, the API builder checks whether the filebeat and logstash configuration corresponds to the expected version.

## Release history - Changed components

| Ver   | API-Builder                        | Logstash                           | Memcached                          | Filebeat      | ANM-Config      | Dashboards      | Params          | ELK-Ver.| Notes |
| :---  | :---:                              | :---:                              | :---:                              | :---:         | :---:           | :---:           | :---:           | :---:   | :---  |
| 1.0.0 | N/A                                | N/A                                | N/A                                | N/A           | N/A             | N/A             | N/A             | 7.9.2   |       |
| 2.0.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | [X](#filebeat)| [X](#anm-config)| [X](#dashboards)| [X](#parameters)| 7.10.0  |       |
| 2.0.1 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               | 7.10.0  |       |
| 2.0.2 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               | 7.10.0  |       |

### Update from Version 1.0.0

If you are upgrading from Release 1.0.0 and encounter problems, please open an issue.

### Upgrade components

#### Filebeat

The following steps illustrates an update to version 2.0.2:
```
wget --no-check-certificate https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v2.0.2/axway-apim-elk-v2.0.2.tar.gz -O - | tar -xvz
cd axway-apim-elk-v2.0.2
cp ~/axway-apim-elk-v2.0.0/.env .
docker-compose -f filebeat/docker-compose.filebeat.yml stop
docker-compose -f filebeat/docker-compose.filebeat.yml up -d
```

#### API-Builder/Logstash/Memcached

If Filebeat should be updated with one of the releases that are between the current one and the new one, then please [update Filebeat](#filebeat) in advance.

API Builder, Logstash and Memcache work as a tight unit and should be stopped, updated together if possible. The following steps illustrates an update to version 2.0.2:
```
wget --no-check-certificate https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v2.0.2/axway-apim-elk-v2.0.2.tar.gz -O - | tar -xvz
cd axway-apim-elk-v2.0.2
cp ~/axway-apim-elk-v2.0.0/.env .
docker-compose stop
docker-compose up -d
```
Repeat these steps on all machines running Logstash/API-Builder/Memcache.

#### ANM config

Please follow the instructions to [setup the Admin-Node-Manager](README.md#setup-admin-node-manager) based on the most recent Policy-Fragment shipped with the release.

#### Dashboards

Please follow the instructions to [import Kibana-Dashboards](README.mb#kibana) based on the most recent Dashboards shipped with the release.

#### Parameters

Sometimes it may be necessary to include newly introduced parameters in your `.env` file or you may want to use optional parameters. To do this, use the supplied `env-sample` as a reference and copy the desired parameters.

#### Elastic-Stack version

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
docker-compose -f filebeat/docker-compose.filebeat.yml stop
docker-compose -f filebeat/docker-compose.filebeat.yml up -d
```

## Update FAQ

### Do I need to update the Elasticsearch version?

The solution ships a defined Elasticsearch version with each release, which is used by all components of the Elastic stack (Filebeat, Kibana, ...). If nothing else is specified, then you can stay on the Elastic Stack version defined in your `.env` file.

### Can I skip several versions for an upgrade?

Yes, you can. Please note which components have been updated between the current and the new version.
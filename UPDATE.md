# How to update

This document contains information on how to upgrade the solution from one version to the next. It is also possible to skip multiple versions.  

The basic principle of the solution is that no files delivered with a release are changed. This is the best way to ensure that the solution can be updated without any problems. Only your .env file must be carried over from one release to the next. It is not planned to backport bugfixes (besides for the Axway Supported version) or enhancements in older releases.  

This documents describes how to update based on Docker Compose deployment. If you have deployed the solution on a Kubernetes-Cluster using Helm, please follow the instructions here: [Upgrade a Helm-Deployment](helm#upgrade-the-release)

## Zero-downtime upgrade

With the following steps you can update the solution without downtime. Of course, this requires that all components (Logstash, API Builder, Memcached) are running at least 2x and configured accordingly. So all filebeats have to communicate with all logstash hosts.

## General overview

The core component is the API Builder application which provides the information about the necessary configuration. In principle, it contains the desired or necessary state suitable for the version, especially about the Elasticsearch configuration, such as index templates, ILM policies, etc. If the version is updated, the API builder checks the current configuration in Elasticsearch and adjusts it if necessary to fit the corresponding version. This includes necessary changes for bug fixes or enhancements.  

### Upgrade approach

- load and unpack the current or desired release
   - it is recommended to unpack it next to the existing release
- copy your existing `.env` file from the current installation
  - recommended is to use a sym-link to a central `.env` file, which should also be versioned if necessary
  - it is pointed out in this document, if parameters have changed or new ones have been added.
- please make sure that you carry over your own certificates into the new release
- depending on which components have changed
  - these containers must be stopped and then restarted based on the new release with `docker-compose up -d`
  - e.g. if no change is noted in logstash, then this component can continue to run
- the API-Builder delivers the configuration for Elasticsearch as well
  - if the API-Builder is updated, then it checks on restart and periodically if the Elasticsearch configuration is correct.
  - in addition, the API builder checks whether the filebeat and logstash configuration corresponds to the expected version.

## Release history - Changed components

This table should help you to understand which components have changed with which version. For example, it is not always or very rarely necessary to update Filebeat.  If the Elastic version has changed between the some releases, you do not necessarily have to follow it. Of course it is recommended to be on a recent Elastic stack version, because only for this version bugfixes are released by Elastic. [Learn here](#update-elastic-stack-version) how to update the Elastic stack.

On the other hand, the API builder Docker image, as a central component of the solution, will most likely change with each release.  

| Ver   | API-Builder                        | Logstash                           | Memcached                          | Filebeat      | ANM-Config      | Dashboards      | Params          |Elastic-Config      | ELK-Ver.| Notes      |
| :---  | :---:                              | :---:                              | :---:                              | :---:         | :---:           | :---:           | :---:           |:---:               | :---:   | :---       |
| 4.1.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | [X](#parameters)|-                   | [7.16.2](#update-elastic-stack-version)  | Unreleased |
| 4.0.3 | -                                  | -                                  | -                                  | -             | -               | -               | -               |-                   | [7.16.2](#update-elastic-stack-version)  |            |
| 4.0.2 | -                                  | -                                  | -                                  | -             | -               | -               | -               |-                   | [7.16.1](#update-elastic-stack-version)  | See #154   |
| 4.0.1 | -                                  | -                                  | -                                  | -             | -               | -               | -               |-                   | [7.16.1](#update-elastic-stack-version)  |            |
| 4.0.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | [X](#dashboards)| -               |-                   | [7.15.2](#update-elastic-stack-version)  |            |
| 3.6.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | [X](#parameters)|-                   | [7.14.0](#update-elastic-stack-version)  |            |
| 3.5.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | [X](#parameters)|-                   | [7.14.0](#update-elastic-stack-version)  |            |
| 3.4.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | -                                  | -             | -               | [X](#dashboards)| [X](#parameters)|[X](#elastic-config)| [7.14.0](#update-elastic-stack-version)  |            |
| 3.3.2 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |-                   | [7.12.1](#update-elastic-stack-version)  |            |
| 3.3.1 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | [X](#parameters)|-                   | [7.12.1](#update-elastic-stack-version)  |            |
| 3.3.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | -                                  | -             | -               | -               | [X](#parameters)|-                   | [7.12.1](#update-elastic-stack-version)  |            |
| 3.2.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |[X](#elastic-config)| [7.12.1](#update-elastic-stack-version)  |            |
| 3.1.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |-                   | [7.12.1](#update-elastic-stack-version)  |            |
| 3.0.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | [X](#parameters)|-                   | [7.12.1](#update-elastic-stack-version)  |            |
| 2.4.2 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |[X](#elastic-config)| [7.10.0](#update-elastic-stack-version)  |            |
| 2.4.1 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |-                   | [7.10.0](#update-elastic-stack-version)  |            |
| 2.4.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | -                                  | -             | -               | -               | [X](#parameters)|-                   | [7.10.0](#update-elastic-stack-version)  |            |
| 2.3.0 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |-                   | [7.10.0](#update-elastic-stack-version)  |            |
| 2.2.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | -                                  | -             | -               | -               | -               |-                   | [7.10.0](#update-elastic-stack-version)  |            |
| 2.1.2 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |-                   | [7.10.0](#update-elastic-stack-version)  |            |
| 2.1.1 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               |-                   | [7.10.0](#update-elastic-stack-version)  |            |
| 2.1.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | -                                  | -             | -               | -               | [X](#parameters)|[X](#elastic-config)| [7.10.0](#update-elastic-stack-version)  |            |
| 2.0.2 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               | -                  | [7.10.0](#update-elastic-stack-version)  |            |
| 2.0.1 | [X](#api-builderlogstashmemcached) | -                                  | -                                  | -             | -               | -               | -               | -                  | [7.10.0](#update-elastic-stack-version)  |            |
| 2.0.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | [X](#filebeat)| [X](#anm-config)| [X](#dashboards)| [X](#parameters)|[X](#elastic-config)| [7.10.0](#update-elastic-stack-version)  |            |
| 1.0.0 | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | [X](#api-builderlogstashmemcached) | [X](#filebeat)| [X](#anm-config)| [X](#dashboards)| [X](#parameters)|[X](#elastic-config)| [7.9.2](#update-elastic-stack-version)   |            |


## Upgrade components

The following example shows how to load/unpack release 4.0.3 and apply your current configuration from, for example, version 3.2.0. Regardless of which components have changed, you should install the same release package and take over your configuration on all machines to avoid confusion.  

```
# Perform these steps on all belonging machines
# Get and extract the release package
wget --no-check-certificate https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/releases/download/v4.0.3/axway-apim-elk-v4.0.3.tar.gz -O - | tar -xvz
# The following directory has been created
cd axway-apim-elk-v4.0.3
# Take over existing configuration from the previous version
cp ~/axway-apim-elk-v3.2.0/.env .
# Also copy existing certificates, scripts, extra config-files from the previous version
cp ~/axway-apim-elk-v3.2.0/config/all-my-custom-certificates ./config
```

You can then update each component as described below.

### API-Builder/Logstash/Memcached

If Filebeat should be updated with one of the releases that are between the current one and the new one, then please [update Filebeat](#filebeat) in advance.

API Builder, Logstash and Memcache work as a tight unit and should be stopped, updated together if possible. Please note, that changes to Logstash do not mean that the Logstash version has changed, but that the Logstash pipeline configuration has changed. To activate these changes the new release must be used to start Logstash.  

The following steps illustrates an update to version 3.2.0:
```
docker-compose stop
docker-compose up -d
```
Repeat these steps on all machines running Logstash/API-Builder/Memcache.  

If you have deployed the solution on a Kubernetes-Cluster using Helm read [here](helm/README.md) for more information.

### Filebeat

If Filebeat changes with a version, you must update the corresponding configuration on all your API Gateway instances. It is recommended to update Filebeat as the first component, because the Filebeat configuration version is checked by the API-Builder application. If it does not match, Logstash will exit with an error message.
Even if you run Filebeat as a native service, you have to copy the configuration (`filebeat/filebeat.yml`) from the release into your configuration.

The following steps illustrates an update to version 3.2.0 using the docker-compose approach:  
```
docker stop filebeat
docker-compose -f filebeat/docker-compose.filebeat.yml up -d
```

If you have deployed the solution on a Kubernetes-Cluster using Helm read [here](helm/README.md) for more information.

### ANM config

Please follow the instructions to [setup the Admin-Node-Manager](README.md#setup-admin-node-manager) based on the most recent Policy-Fragment shipped with the release. Please make sure that they take their own certificates with them.

### Dashboards

Please follow the instructions to [import Kibana-Dashboards](README.md#kibana-dashboards) based on the most recent Dashboards shipped with the release. Select that existing objects are overwritten.

### Parameters

Sometimes it may be necessary to include newly introduced parameters in your `.env` file or you may want to use optional parameters. To do this, use the supplied `env-sample` as a reference and copy the desired parameters. Please check the [changelog](CHANGELOG.md) which new parameters have been added.

### Elastic Config

Whether the Elastic configuration has changed is for information only and does not require any steps during the update.  
The required Elasticsearch configuration is built into the API Builder application and Elasticsearch will be updated accordingly if necessary.  
This includes the following components:  

- Index configuration
- Index templates
- Index lifecycle policies
- Transform jobs  

FYI. You can find the current configuration here: [elasticsearch_config](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/tree/develop/apibuilder4elastic/elasticsearch_config)

## Update Elastic-Stack version

The solution ships the latest available Elastic version with new releases. However, this does not force you to update to the appropriate Elastic version with each update. So, for example, if version 3.4.0 ships with Elastic version 7.14.0, you can still stay on version 7.12.1. Thus, it can be concluded that the update of the Elastic stack can be done independently of the releases. You can find the minimum required Elastic version [here](README.md#requirements).  

### 3 Elasticsearch nodes required

:exclamation: Before proceeding with the upgrade, make sure that your Elasticsearch cluster consists of __at least 3 nodes with the same version__. For example 3 Elasticsearch nodes running on two machines is perfectly fine for this.  
There are 3 Elasticsearch nodes required, as there must always be a master node in the cluster. If this master node is stopped, a quorum of remaining cluster nodes must still be running to elect a new master, otherwise an upgraded Elasticsearch node cannot join the cluster. [Learn more](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-discovery-quorums.html)  

[Read more](README.md#general-remarks) information about adding additional cluster nodes. After the upgrade, you can remove the third cluster node if necessary. Before proceeding, make sure that Elasticsearch is in the Green state.

Watch this video to see a demonstration how to update the Elastic-Stack:  
[![Update Elastic-Stack](https://img.youtube.com/vi/Oht_Xnzurok/0.jpg)](https://youtu.be/Oht_Xnzurok)

### Elastic stack upgrade steps

When you have a three node Elasticsearch-Cluster up and running, please follow these steps to update the Elastic version.

__1. Update .env file__

- Open your `.env` file and change the parameter: `ELASTIC_VERSION` to the version as specified in the release or the version you would like to use
  - Make sure that the `.env` file contains the correct/same version on all machines
- To avoid any downtime, double check all Elasticsearch clients (API-Builder, Logstash, Filebeat) using the `ELASTICSEARCH_HOSTS` have multiple or all Elasticsearch nodes configured so that they can fail over  

__2. Update Elasticsearch cluster__   

Updating the Elasticsearch cluster happens one node after next. Make sure:
- You have three Elasticsearch-Nodes
- Before proceeding with the next node it's strongly recommended to validate a new master has been elected
- and remaining nodes have enough disk space to take over the shards from the node to be upgraded  

```
# On the Elasticsearch node you would like to update, navigate into your ELK-Solution directory
cd axway-apim-elk-v4.0.3
# Stop the existing Elasticsearch container you would like to update
docker stop elasticsearch1
# Start a new Elasticsearch node (in this case Elasticsearch-Node-1), which will 
# create a new container based on the version you configured in your .env file
docker-compose -f elasticsearch/docker-compose.es01.yml up -d
```

Repeat these steps on the remaining Eleasticsearch nodes, but make sure a new Elasticsearch-Master has been elected.   

__3. Update Kibana__   

It is recommended to run the entire Elastic stack with the same version, so Kibana should/must be updated as well. To update Kibana you need to perform the following steps after adjusting the `ELASTIC_VERSION` accordingly. Kibana must be updated as it otherwise is no longer compatible with the Elasticsearch version.  

```
# On the Kibana node you would like to update, navigate into your ELK-Solution directory
cd axway-apim-elk-v4.0.3
# Stop the existing Kibana container
docker stop kibana
# Start a new Kibana-Container with the configured ELASTIC_VERSION in your .env file
docker-compose -f kibana/docker-compose.kibana.yml up -d
```

__4. Update Logstash__   

It is recommended to run the entire Elastic stack with the same version, so Logstash should/must be updated as well. Same procedure as for Kibana but repeat this on all Logstash nodes.
```
# On the Logstash node you would like to update, navigate into your ELK-Solution directory
cd axway-apim-elk-v4.0.3
# Stop the existing Logstash container
docker stop logstash
# Start a new Logstash with the configured ELASTIC_VERSION in your .env file
docker-compose up -d
```

__5. Update Filebeat__   

It is recommended to run the entire Elastic stack with the same version, so Filebeat should/must be updated as well. Same procedure as for Kibana and Logstash but repeat this on all Filebeat nodes. Of course, these steps are only valid if you run Filebeat as part of the Docker-Compose approach.  

```
# On the Filebeat node you would like to update, navigate into your ELK-Solution directory
cd axway-apim-elk-v4.0.3
# Stop existing filebeat container
docker stop filebeat
# Start a new Filebeat with the configured ELASTIC_VERSION in your .env file
docker-compose -f filebeat/docker-compose.filebeat.yml up -d
```

## Update FAQ

### Do I need to update the Elasticsearch version?

The solution ships a defined Elasticsearch version with each release, which is used by all components of the Elastic stack (Filebeat, Kibana, ...). If nothing else is specified, then you can stay on the Elastic Stack version defined in your `.env` file.

### Can I skip several versions for an upgrade?

Yes, you can. Please note which components have been updated between the current and the new version.


### Can I downgrade back to a previous version?

No, you cannot downgrade from a newer version to an older one. You will see the following error message:  
`cannot downgrade a node from version [7.16.1] to version [7.15.2]`  
Please note that as soon as a newer Elasticsearch node was started, the data stored on the volume is already updated, which makes it impossible to start an older version. 

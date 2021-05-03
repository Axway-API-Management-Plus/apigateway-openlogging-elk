# Helm-Chart - Axway APIM-Manager for Elastic

This page provides information on how to deploy the Axway API Management for Elastic solution on a Kubernetes or 
OpenShift cluster using Helm.  
The Helm chart provided is extremely flexible and configurable. All or only the desired components can be deployed. 
For example, you can use an existing Elasticsearch cluster + Kibana, deploy Logstash, API-Builder4Elastic & Memcached 
in Kubernetes and run Filebeat native to the API-Gateways.

## Requirements

- Kubernetes >= 1.19
- Helm >= 3.3.0
- OpenShift (not yet tested (Please create an issue if you need help))
- See [required resources](#required-resources)

Even though this HELM chart makes deploying the solution on Kubernetes/OpenShift much easier, extensive knowledge 
about Kubernetes/OpenShift and Helm is mandatory.  
You must be familiar with:  
- Concepts of Helm, How to create a Helm-Chart, Install & Upgrade
- Kubernetes resources such as ConfigMaps, Secrets
- Kubernetes networking, Ingress, Services and Load-Balancing
- Kubernetes Persistent Volumes, Volumes, Volume-Mounts

We try to help to the best of our knowledge within the framework of this project, but we cannot cover every environment and its specifics.

## Installation

The following explains how to deploy the solution on your Kubernetes/OpenShift using the provided HELM chart. We start with a simple deployment 
that includes all components except Filebeat. This deployment is useful if there is no existing Elasticsearch cluster + Kibana and 
API-Management is running on classic virtual machines externally to the Kubernetes.  

The resources are deployed in Kubernetes as follows:  
![Kubernetes architecture all components](../imgs/kubernetes/all_components_overview_ext_api-management.png)

### Configuration

Create your own `myValues.yaml` based on the standard `[values.yaml](values.yaml)` and configure required parameters. All of the parameters are 
explained in details in the provided `[values.yaml](values.yaml)`.  
The following contains a list of parameters that needs to be set very likely for each deployment: 

| Parameter                                   | Description                                                                                                                                                             
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `global.elasticsearchHosts`                 | The Elasticsearch Host Service, Elasticsearch should be running in K8S/OpenShift. For an external Elasticsearch service, specify the Elasticsearch host addresses.      |
| `apibuilder4elastic`                        | __Parameters used by API-Builder4Elastic__                                                                                                                              |
| `apibuilder4elastic.anmUrl`                 | The URL of the Axway API Gateway admin node manager. Please note that the address must be reachable from the API Builder.                                               |
| `apibuilder4elastic.apimgrUrl`              | The URL of the Axway API Gateway admin node manager. Please note that the address must be reachable from the API Builder.                                               |
| `apibuilder4elastic.secrets.apimgrUsername` | Username used by API-Builder to authenticate at the API-Manager. Must be an Admin-User. Default is set to apiadmin                                                      |
| `apibuilder4elastic.secrets.apimgrPassword` | Password used by API-Builder to authenticate at the API-Manager. Default is set to changeme                                                                             |
| `elasticsearch.enabled`                     | Controls if [Elasticsearch should be provisioned](#provision-elasticsearch). Defaults to true. Disable it if you plan to use an external Elasticsearch cluster          |
| `elasticsearch.replicas`                    | Number of Elasticsearch nodes to provision. Defaults to 2 nodes.                                                                                                        |
| `kibana.enabled`                            | Controls if Kibana should be provisioned as part of Helm-Install. Defaults to true. Disable it if you plan to use an external Kibana application                        |
| `filebeat.enabled`                          | Controls if Filebeat should be provisioned as part of Helm-Install. Defaults to false. Enable it if the API-Management solution runs in your Kubernetes                 |

Depending on the desired deployment model, additional parameters must be set in your myValues.yaml. Some of the deployment options are explained below.

### Installation

__Please note__ that the release name must be currently: `axway-elk`, because some resources, like Services, ConfigMaps or Secrets 
are created with it and referenced in the standard values.yaml. An example is the Elasticsearch-Service: `axway-elk-apim4elastic-elasticsearch` This may be changed in a later release to get more flexibility.

```
helm install -n apim-elk -f myvalues.yaml axway-elk apim4elastic-3.0.0.tgz
```

### Upgrade

Example to upgrade an existing deployment:
```
helm upgrade -n apim-elk -f myvalues.yaml axway-elk apim4elastic-3.1.0.tgz
```

## Provision Elasticsearch

To provision Elasticsearch you need to create persistent volumes for each replica and the configured `elasticsearch.volumeClaimTemplate`.  
Furthermore, each replica must have a worker node available, since one Elasticsearch node is deployed per worker node.  

![Elasticsearch PVC and PV](../imgs/kubernetes/elastichsearch_pvc_and_pv.png)  

For testing purposes, you can create a [hostpath volume](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath). For production, you should provision an appropriate [persistent volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).

Example hostpath volume you may create for testing:  
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  labels:
    app: elasticsearch-master
  name: pv-vol1
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 1Gi
  hostPath:
    path: /tmp/data
    type: ""
  persistentVolumeReclaimPolicy: Retain
  volumeMode: Filesystem
```

Create the volume:
```
kubectl apply -n apim-elk -f pv-vol1.yaml
```

This volume will bound to the following example `elasticsearch.volumeClaimTemplate`:  
```yaml 
  volumeClaimTemplate:
    accessModes: [ "ReadWriteOnce" ]
    resources:
      requests:
        storage: 1Gi
```

## API-Management running in Kubernetes

If you are already running the Axway API management solution in a Kubernetes environment, then it makes sense to also run Filebeat in Kubernetes.

The following shows Filebeat and API-Management in a Kubernetes cluster:  
![Kubernetes architecture all components](../imgs/kubernetes/all_components_incl_filebeat.png)  

One way to provide Filebeat with the necessary log files of the API gateway is a central volume. The API gateways write to this volume and Filebeat reads & streams the corresponding documents/events.  

Mount the log volume in the filebeat container using `extraVolumes` and mount it in the correct location using `extraVolumeMounts`. You can find sample configuration in Values.yaml.

Other variants are possible, but have not yet been tested.

## Logstash and Filebeat

The communication between Filebeat and Logstash is a TCP based connection which is sticky. In the classic deployment, you would configure the available Logstash instances in Filebeat and Filebeat performs the load balancing on its own.
In the case of Kubernetes, there are basically two ways to make the Logstash service available externally:

1. Node Port
Here the administrative effort is higher, but it can be worthwhile from the throughput to set up the logstash service as a node port and to configure Filebeat accordingly on all nodes. 
Per default Logstash Node-Affinity only 1 Logstash is deployed per node. This is the recommended approach.
2. Load Balancer.
In the case of the load balancer, care must be taken to ensure that Filebeat is set with an appropriate TTL to ensure that the load is evenly 
distributed between the logstash instances. (See https://github.com/elastic/beats/issues/661)

## Use externally provided Secrets & ConfigMaps

It is recommended to use externally provided Secrets and ConfigMaps especially for Secrets like passwords or certificates. 
All components offer the possibility to use own ConfigMaps and Secretes. These can then be used to make passwords, etc. from 
your own secrets available in containers or to integrate certificates via volume mounts.

For this purpose, it is recommended to deploy a separate Helm chart with the necessary resources before deploying the 
APIM4Elastic solution. After your resources ared create reference these in the APIM4Elastic values.yaml. 

### Example Custom ConfigMap

Create a ConfigMap for the APIBuilder4Elastic:  

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-extra-api-builder-config
data:
  ADMIN_NODE_MANAGER: https://my-admin-node:8090
  API_BUILDER_SSL_CERT: "config/certificates/myCustomSSL.crt"
  API_BUILDER_SSL_KEY: "config/certificates/myCustomSSL.key"
  API_MANAGER: https://my-api-manager:8075
  API_BUILDER_LOCAL_API_LOOKUP_FILE: "config/myLocalLookupFile.json"
  AUTHZ_CONFIG: "config/myAuthZConfig.json"
  ELASTICSEARCH_HOSTS: https://my-elasticsearch-host:9200
```

In reality you should create your resources with HELM, but this is out of scope for this documentation:

```
kubectl apply -n apim-elk -f myAPIBuilder.yaml
```

In the values.yaml reference your ConfigMap: 

```yaml
apibuilder4elastic:
  # Injects the environment variables from the ConfigMaps and Secrets into the 
  # APIBuilder4Elastic pod. Specify your own ConfigMaps or Secrets if you don't
  # provide Configuration and Secrets as part of this values.yaml.
  envFrom: 
    - configMapRef:
        name: my-extra-api-builder-config
    - secretRef:
        name: axway-elk-apim4elastic-apibuilder4elastic-secret
```

Analogously, of course, you have the same option for Secrets, Volumes, VolumeMounts to include the necessary resources in the containers.

### Example Custom-API-Builder Configuration

Create a ConfigMap that contains your custom configuration file: 

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: apibuilder4elastic-authz-config
data:
  myAuthzConfig.js: |
    const path = require('path');
    const fs = require('fs');

    /*
        By default, the solution uses user's API Manager organization to determine which 
        API-Requests they are allowed to see in the API Gateway Traffic-Monitor. 
        This behavior can be customized. 
    */

    var authorizationConfig = {
        // For how long should the information cached by the API-Builder process
        cacheTTL: parseInt(process.env.EXT_AUTHZ_CACHE_TTL) ? process.env.EXT_AUTHZ_CACHE_TTL : 300,
        // If you would like to disable user authorization completely, set this flag to false
        enableUserAuthorization: true,
        // Authorize users based on their API-Manager organization (this is the default)
        apimanagerOrganization: {
            enabled: true
        },
    ....
    ..
    .
```

Tip: When using HELM use `.Files.get.`. Example: [templates/elasticApimLogstash/logstash-pipelines.yaml]

```
kubectl apply -n apim-elk -f myAPIBuilderAuthZConfig.yaml
```

Now mount this ConfigMap into the API-Builder container and reference it in the configuration using the `values.yaml`:

```yaml
apibuilder4elastic:
  extraVolumes:
  - name: my-authz-config
    mountPath: /app/config
    subPath: myAuthzConfig.js
    
  extraVolumeMounts:
    - name: my-authz-config
      configMap:
        name: apibuilder4elastic-authz-config
```

Finally, tell API-Builder4Elastic to use your custom configuration:

```yaml
apibuilder4elastic:
  authzConfig: "./config/myAuthzConfig.js"
```

## Required resources

### API-Builder4Elastic

Memory: 50Mi - 80Mi
CPU: 100m - 200m

### Memcached

Memory: 32Mi - 64Mi
CPU: 50m - 100m

### Logstash

Memory: 6Gi - 6Gi
CPU: 1000m - 1000m

### Elasticsearch

Memory: 2Gi - 2Gi
CPU: 1000m - 1000m

### Kibana

Memory: 500m - 500m
CPU: 500m - 500m
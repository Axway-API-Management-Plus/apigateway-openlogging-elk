# Axway APIM-Management4Elastic - Helm-Chart

This page provides information on how to deploy the Axway API Management for Elastic solution on a Kubernetes or 
OpenShift cluster using Helm.  
The provided Helm chart is extremely flexible and configurable. You can decide which components to deploy, 
use your own labels, annotations, secrets, and volumes to customize the deployment to your needs.

## Requirements

- Kubernetes >= 1.19
- Helm >= 3.3.0
- OpenShift (not yet tested (Please create an issue if you need help))
- See [required resources](#required-resources)

Even though this Helm chart makes deploying the solution on Kubernetes/OpenShift much easier, extensive knowledge 
about Kubernetes/OpenShift and Helm is mandatory.  
You must be familiar with:  
- Concepts of Helm, How to create a Helm-Chart, Install & Upgrade
- Kubernetes resources such as ConfigMaps, Secrets
- Kubernetes networking, Ingress, Services and Load-Balancing
- Kubernetes Persistent Volumes, Volumes, Volume-Mounts

We try to help to the best of our knowledge within the framework of this project, but we cannot cover every environment and its specifics.

## Usage notes

The following explains how to deploy the solution on your Kubernetes/OpenShift using the provided Helm chart. We start with a simple deployment 
that includes all components except Filebeat. This deployment is useful if there is no existing Elasticsearch cluster + Kibana and 
API-Management is running on classic virtual machines externally to the Kubernetes.  

The resources are deployed in Kubernetes as follows:  
![Kubernetes architecture all components](../imgs/kubernetes/all_components_overview_ext_api-management.png)

### Configuration

Create your own `myvalues.yaml` based on the standard [`values.yaml`](values.yaml) and configure required parameters. All of the parameters are 
explained in details in the charts [`values.yaml`](values.yaml).  
The following contains a list of parameters that needs to be set very likely for each deployment: 

| Parameter                                   | Description                                                                                                                                                             
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `global.elasticsearchHosts`                 | The Elasticsearch Host Service, Elasticsearch should be running in K8S/OpenShift. For an external Elasticsearch service, specify the Elasticsearch host addresses.      |                                                                                                  |
| `apibuilder4elastic.enabled`                | Controls if API-Buider4Elastic should be deployed. Defaults to true. Required component along with Logstash and Memcached                              |
| `apibuilder4elastic.anmUrl`                 | The URL of the Axway API Gateway admin node manager. Please note that the address must be reachable from the API Builder.                                               |
| `apibuilder4elastic.apimgrUrl`              | The URL of the Axway API Gateway admin node manager. Please note that the address must be reachable from the API Builder.                                               |
| `apibuilder4elastic.secrets.apimgrUsername` | Username used by API-Builder to authenticate at the API-Manager. Must be an Admin-User. Default is set to apiadmin                                                      |
| `apibuilder4elastic.secrets.apimgrPassword` | Password used by API-Builder to authenticate at the API-Manager. Default is set to changeme                                                                             |
| `logstash.enabled`                          | Controls if Logstash should be deployed. Defaults to true. Required component along with API-Builder4Elastic and Memcached                              |
| `memached.enabled`                          | Controls if Memcached should be deployed. Defaults to true. Required component along with API-Builder4Elastic and Logstash                               |
| `elasticsearch.enabled`                     | Controls if [Elasticsearch should be provisioned](#provision-elasticsearch). Defaults to false. Enable it if you plan to use an external Elasticsearch cluster          |
| `elasticsearch.replicas`                    | Number of Elasticsearch nodes to provision. Defaults to 2 nodes.                                                                                                        |
| `kibana.enabled`                            | Controls if Kibana should be provisioned as part of Helm-Install. Defaults to false. Enable it if you plan to use an external Kibana application                      |
| `filebeat.enabled`                          | Controls if Filebeat should be provisioned as part of Helm-Install. Defaults to false. Enable it if the API-Management solution runs in your Kubernetes                 |

Depending on the desired deployment options, additional parameters must be set in your myValues.yaml. Some of the deployment options are explained below.

## Prepare Elasticsearch

If you have `elasticseach.enabled` set to true, you need to create for each Elasticsearch node (number of `elasticsearch.replicas`) a persistent volume. The persisent volume must match to the configured `elasticsearch.volumeClaimTemplate`.  
Furthermore, each replica must have a worker node available, since one Elasticsearch node is deployed per worker node.  

![Elasticsearch PVC and PV](../imgs/kubernetes/elastichsearch_pvc_and_pv.png)  

For a production environment, you should provision an appropriate [persistent volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) 
depending on your environment.

For testing purposes, you can create simple a [hostpath volume](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath). 

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

### Install the Helm-Chart

__Please note__ that the release name must currently: `axway-elk`, because many resources, like Services, ConfigMaps or Secrets 
are created with it and referenced in the standard `values.yaml`. An example is the Elasticsearch-Service: `axway-elk-apim4elastic-elasticsearch`, 
which is for instance used for the standard `elasticsearchHosts: "https://axway-elk-apim4elastic-elasticsearch:9200"`. This restriction may 
be changed in a later release to get more flexibility.  

To deploy the solution execute the following command:
```
helm install -n apim-elk -f myvalues.yaml axway-elk apim4elastic-3.0.0.tgz

// Check the installed release
helm list -n apim-elk
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION   
axway-elk       apim-elk        1               2021-05-03 14:22:08.9325287 +0200 CEST  deployed        apim4elastic-3.0.0              3.0.0

// Check the pods, with Elasticsearch and Kibana enabled
kubectl get pods -n apim-elk
NAME                                                         READY   STATUS    RESTARTS   AGE 
axway-elk-apim4elastic-apibuilder4elastic-65b5d56d77-5hv9z   1/1     Running   1          7h2m
axway-elk-apim4elastic-elasticsearch-0                       1/1     Running   0          7h2m
axway-elk-apim4elastic-elasticsearch-1                       1/1     Running   0          7h2m
axway-elk-apim4elastic-kibana-7c6d4b675f-dnxj7               1/1     Running   0          7h2m
axway-elk-apim4elastic-logstash-0                            1/1     Running   0          7h2m
axway-elk-apim4elastic-memcached-56b7447d9-25xwb             1/1     Running   0          7h2m

// Check deployed services
kubectl -n apim-elk get service
NAME                                                TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
axway-elk-apim4elastic-apibuilder4elastic           ClusterIP   None            <none>        8443/TCP            7h7m
axway-elk-apim4elastic-elasticsearch                ClusterIP   10.100.85.132   <none>        9200/TCP,9300/TCP   7h7m
axway-elk-apim4elastic-elasticsearch-headless       ClusterIP   None            <none>        9200/TCP,9300/TCP   7h4m
axway-elk-apim4elastic-kibana                       ClusterIP   10.105.84.214   <none>        5601/TCP            7h7m
axway-elk-apim4elastic-logstash                     NodePort    10.103.53.111   <none>        5044:32001/TCP      7h7m
axway-elk-apim4elastic-logstash-headless            ClusterIP   None            <none>        9600/TCP            7h7m
axway-elk-apim4elastic-memcached                    ClusterIP   10.108.48.131   <none>        11211/TCP           7h7m
```

### Upgrade the release

Example how to upgrade an existing Helm release:  
```
helm upgrade -n apim-elk -f myvalues.yaml axway-elk apim4elastic-3.1.0.tgz
```

## API-Management running in Kubernetes

If you are already running the Axway API management solution in a Kubernetes environment, then it makes sense to also run Filebeat in Kubernetes.

The following shows Filebeat and API-Management in a Kubernetes cluster:  
![Kubernetes architecture all components](../imgs/kubernetes/all_components_incl_filebeat.png)  

One way to provide Filebeat with the necessary log files of the API gateway is a central volume. All API-Gateways write to this volume and Filebeat reads & streams the corresponding documents/events.  

Add the log volume into the Filebeat container using `extraVolumes` and mount it in the correct location using `extraVolumeMounts`. You can find sample configuration in values.yaml.

Other options are possible, but have not yet been tested.

## Logstash and Filebeat

The communication between Filebeat and Logstash is a maintained TCP connection which is sticky. In the classic deployment using for instance Docker-Compose, you would configure 
the available Logstash instances as a list in Filebeat. With that Filebeat performs the load balancing on its own.  
In the case of Kubernetes things are a bit different, there are basically two ways to make the Logstash service externally available:

1. __Node Port__  
Here the administrative effort is higher, but it can be worthwhile from the throughput to set up the Logstash service as a node port and to configure Filebeat accordingly on all nodes. 
You need to know, that per default the Logstash Node-Affinity makes sure, that only 1 Logstash is deployed per Kubernetes worker node. 
Of course, you can connect an appropriate external load balancer in front of the exposed node port. Please note also in this case to set a TTL value for filebeat. See further below. 
Type NodePort is enabled by default and exposes Logstash on port: 32001 on each Node.

2. __Load Balancer__  

If you run the platform in a cloud environment, such as GCP, AWS, etc., you can use Cloud Load-Balancers to automatically provision an IP address for Logstash. However, care must be taken to 
ensure that Filebeat is set with an appropriate [TTL](https://www.elastic.co/guide/en/beats/filebeat/7.12/logstash-output.html#_ttl) to ensure that the load is evenly 
distributed between the available Logstash instances. (See here for more details https://github.com/elastic/beats/issues/661)

## Customize the setup

To customize the solution according to your needs, you can configure it using your own Secrets, ConfigMaps, etc.

We recommend that you create your own Helm chart that contains all the necessary resources. 
You then link your custom resources in your `myvalues.yaml` for the final deployment of the solution. The following illustration the approach we recommend:  

![Customized deployment with Helm](../imgs/kubernetes/customized_deployment_with_helm.png)

### Create your own Helm-Chart
```
helm create axway-elk-setup
cd axway-elk-setup
```
Customize the generated Helm chart according to your needs and remove stuff that is not needed. Based on a few examples it's explained below how to customize the solution.  

### Use a Secret for API-Manager Username & Password

The following example explains how you can create a secret, that keeps the API-Manager username and password and use it with API-Builder. The same procedure applies for all confidential information.  

__1. Create a secret__  
Use for instance the following command to create a secret that contains the API-Manager Username and Password and store the result in Helm-Chart template folder.
```
kubectl create secret generic api-builder-secrets --from-literal=API_MANAGER_PASSWORD=change --from-literal=API_MANAGER_USERNAME=apiadmin --dry-run -o yaml > templates/api-builder-secret.yaml
```
__2. Template it__  

Optionally you may change the generated Yaml file to really become a more flexible Helm-Template.

__3. Install or upgrade your setup chart__  
```
helm install -n apim-elk axway-elk-setup .
NAME: axway-elk-setup
LAST DEPLOYED: Tue May  4 14:17:49 2021
NAMESPACE: apim-elk
STATUS: deployed
REVISION: 1
TEST SUITE: None
```
__4. Reference the secret__   
Adjust your `myvalues.yaml` to reference the created secret. Additionally you have to declare the default ConfigMap, if you don't want to manage that ConfigMap yourself.

```yaml
apibuilder4elastic:
  envFrom:
    - configMapRef:
        name: axway-elk-apim4elastic-apibuilder4elastic-config
    - secretRef:
        name: api-builder-secrets
  # Optionally you can disable the secrets driven by the values.yaml
  secrets: 
    enabled: false
```

__5. Install or Upgrade the APIM4Elastic solution__  

Now you can install or upgrade the solution and in the process your Secret will inject the API Manager username and password into the API Builder container:
```
helm install -n apim-elk -f myvalues.yaml axway-elk apim4elastic-3.0.0.tgz
```

### Custom certificates

By default, necessary keys and certificates are automatically generated in a Secret: `axway-elk-apim4elastic-certificates` and included in the corresponding containers. 
There are a number of keys and certificates all issued by a single CA. All components trust certificates of this CA, which is especially necessary for the communication with Elasticsearch.
If you use an external Elasticsearch cluster, then the corresponding CA of this cluster must be included in the environment.  

This is how you include an external Elasticsearch certificate into the solution. It is also assumed here that the resources, i.e. certificates and keys, are managed via the `axway-elk-setup` Helm chart. 

__1. Create a secret containing your CA__  
```
kubectl create secret generic apim4elastic-elastic-ca --from-file=myElasticsearchCa.crt=myElasticsearchCa.crt --dry-run -o yaml > templates/elasticsearch-certificate.yaml
```

__2. Template it__  

Optionally you may change the generated Yaml file to really become a more flexible Helm-Template.

__3. Install or upgrade your setup chart__  
```
helm upgrade -n apim-elk axway-elk-setup .
Release "axway-elk-setup" has been upgraded. Happy Helming!
NAME: axway-elk-setup
LAST DEPLOYED: Tue May  4 15:06:30 2021
NAMESPACE: apim-elk
STATUS: deployed
REVISION: 2
TEST SUITE: None
```
__4. Reference the CA__  

To use the custom CA, it must be included appropriately in all containers. To do this, modify your `myvalues.yaml` as shown here in the Logstash example. 
If you do not control all keys and certificates yourself, you must continue to reference the secret: axway-elk-apim4elastic-certificates, otherwise it 
will not be included by the new declaration.

```yaml
logstash:
  secretMounts: 
    - name: certificates
      secretName: axway-elk-apim4elastic-certificates
      path: /usr/share/logstash/config/certificates
    - name: myCustomCA
      secretName: apim4elastic-elastic-ca
      path: /usr/share/logstash/customConfig/certificates
      # The subPath is not really needed, when mounting into a different folder
      subPath: myElasticsearchCa.crt
```
You can declare secret mounts in the same way for each component. After you provide each component with the additional secret, you can store the path to its CA in its myvalues.yaml.

```yaml
global:
  elasticsearchCa: "customConfig/certificates/myElasticsearchCa.crt"
```

__5. Install or Upgrade the APIM4Elastic solution__  

```
helm upgrade -n apim-elk -f myvalues.yaml axway-elk apim4elastic-3.0.0.tgz
```

### Example Custom-API-Builder Configuration

__1. Create ConfigFile configMap__  

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

__2. Template it__  

Optionally you may change the generated Yaml file to really become a more flexible Helm-Template.  

Tip: When using Helm use `.Files.get.` to include your custom configuration file. See here for an example: [templates/elasticApimLogstash/logstash-pipelines.yaml](templates/elasticApimLogstash/logstash-pipelines.yaml)

__3. Install or upgrade your setup chart__  
```
helm upgrade -n apim-elk axway-elk-setup .
Release "axway-elk-setup" has been upgraded. Happy Helming!
NAME: axway-elk-setup
LAST DEPLOYED: Tue May  4 15:06:30 2021
NAMESPACE: apim-elk
STATUS: deployed
REVISION: 2
TEST SUITE: None
```

__4. Mount the ConfigFile__  

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

__5. Install or Upgrade the APIM4Elastic solution__  
```
helm upgrade -n apim-elk -f myvalues.yaml axway-elk apim4elastic-3.0.0.tgz
```

## Required resources

The following resources are preliminary and have yet to be verified through load and performance testing.

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

Memory: 8Gi - 8Gi  
CPU: 1000m - 1000m

### Kibana

Memory: 500m - 500m  
CPU: 500m - 500m

## Enable User-Authentication

Enabling user authentication in Elasticsearch is quite analogous to the Docker Compose variant. For a newly created Elasticsearch cluster, 
you generate passwords for the default users and then store them in your myvalues.yaml or in your own secrets.  

Run the following command to generate the passwords for the default users.

```
kubectl -n apim-elk exec axway-elk-apim4elastic-elasticsearch-0 -- bin/elasticsearch-setup-passwords auto --batch --url https://localhost:9200
```

This shows structure how to setup the Elasticsearch users in your `myvalues.yaml` and disable anonymous access.

```yaml
apibuilder4elastic:
  secrets:
    elasticsearchUsername: "elastic"
    elasticsearchPassword: "TGSOaIKtajLtAEdPupSS"
logstash:
  logstashSecrets:
    logstashSystemUsername: "logstash_system"
    logstashSystemPassword: "sXGdK8PHYeaX4CKBtB93"
kibana:
  kibanaSecrets:
    username: "kibana_system"
    password: "0uOtilmJEIdMHyljdqvd"
filebeatSecrets: 
  beatsSystemUsername: "beats_system"
  beatsSystemPassword: "MZjgrc84LlkEUSYWHvGm"
  elasticsearchClusterUUID: "iMXdceqVRt61HX2HHVAGjQ"
elasticsearch:
  anonymous: 
    enabled: false
```
# Axway APIM-Management4Elastic - Helm-Chart

This page provides information on how to deploy the Axway API Management for Elastic solution on a Kubernetes or 
OpenShift cluster using Helm.  
The provided Helm chart is extremely flexible and configurable. You can decide which components to deploy, 
use your own labels, annotations, secrets, and volumes to customize the deployment to your needs.

## Requirements

- Kubernetes >= 1.19
  - At least two dedicated woker nodes for two Elasticsearch instances
- Helm >= 3.3.0
- kubectl installed and configured
- OpenShift (not yet tested (Please create an issue if you need help))
- See [required resources](#required-resources)
- Strongly recommended to have an Ingress-Controller already installed
  - See https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/

Even though this Helm chart makes deploying the solution on Kubernetes/OpenShift much easier, extensive knowledge 
about Kubernetes/OpenShift and Helm is mandatory.  
You must be familiar with:  
- Concepts of Helm, How to create a Helm-Chart, Install & Upgrade
- Kubernetes resources such as Deployments, ConfigMaps, Secrets
- Kubernetes networking, Ingress, Services and Load-Balancing
- Kubernetes Persistent Volumes, Volumes, Volume-Mounts

We try to help to the best of our knowledge within the framework of this project, but we cannot cover every environment and its specifics.

## Architecture overview

The following figure shows an overview of the architecture to be deployed in the Kubernetes cluster. The example 
is for an environment where the API management platform is external to Kubernetes, so Filebeat is also external.  

Further deployment options and customizations are described in this document.  

![Kubernetes architecture all components](../imgs/kubernetes/all_components_overview_ext_api-management.png)

### Get started

Create your own `myvalues.yaml` based on the standard [`values.yaml`](values.yaml) and configure all required parameters, like in the example below. All of the parameters are 
explained in detail in the charts [`values.yaml`](values.yaml).  

The following represents the most simple `myvalues.yaml` assuming the API-Management Plattform + Filebeat is running externally to the Kubernetes cluster as indicated in the illustration above:  

```yaml
apibuilder4elastic: 
  anmUrl: "https://my-admin-node-manager:8090"
  secrets: 
    apimgrUsername: "apiadmin"
    apimgrPassword: "changeme"
# Enable, if you would like to deploy a new Elasticsearch cluster for the solution
elasticsearch:
  enabled: true
  volumeClaimTemplate:
    accessModes: [ "ReadWriteOnce" ]
    resources:
      requests:
        storage: 1Gi
# Enable, if you would like to deploy Kibana for the solution
kibana:
  enabled: true
```

### Elasticsearch Persistent volumes

As Elasticsearch is enabled and requires a PersistentVolume for each Elasticsearch node, first two persistent volumes must be created.  

The following should help you to get started, but these volumes are HostPath volumes pointing to a Worker-Node directory - This is not for production.
Make sure to create a directory `/tmp/data` on your WorkerNodes and give it permissions for everybody.

```
kubectl apply -n apim-elk \ 
    -f https://raw.githubusercontent.com/Axway-API-Management-Plus/apigateway-openlogging-elk/develop/helm/misc/pv-vol1.yaml \
    -f https://raw.githubusercontent.com/Axway-API-Management-Plus/apigateway-openlogging-elk/develop/helm/misc/pv-vol2.yaml

// Example indicating to grant permissions
ssh kubenode01
cd /tmp
sudo chmod 777 data
```

### Install the Helm-Chart

With Elasticsearch volumes and your `myvalues.yaml` file in place, you can start the installation (__Please note:__ The Helm Release-Name: __axway-elk__ is mandatory as of now):  
```
helm install -n apim-elk -f myvalues.yaml axway-elk apim4elastic-3.0.0.tgz
```

You may run the following commands to check the status of the deployment, pods, services, etc.
```
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

// Desribe a certain POD
kubectl -n apim-elk describe pod axway-elk-apim4elastic-elasticsearch-0

// Get the logs for a POD
kubectl -n apim-elk logs axway-elk-apim4elastic-apibuilder4elastic-65b5d56d77-5hv9z
```

If everything goes well, you can access the different components on the following host-names:  

https://kibana.apim4elastic.local  
https://apibuilder.apim4elastic.local  
https://elasticsearch.apim4elastic.local  

:point-right: This assumes, that Ingress is configured and DNS-Resolution for `apim4elastic.local` points to your cluster IP. More details is out of scope for this document.

At this point, it is still assumed, that the API-Management Plattform is running externally. Therefore, as the next step, you need to connect one or more Filebeats to Logstash running in Kubernetes. 

## Logstash and Filebeat

The communication between Filebeat and Logstash is a persistent TCP connection. This means that once the connection has been extended, it will continue 
to be used for the best possible throughput. If you specify multiple Logstash instances in your Filebeat configuration, then Filebeat will establish multiple 
persistent connections handle the load balancing for you.  
This is however only in the classical Deployment easily possible, since you can address each Logstash instance individually.  

In the case of Kubernetes/OpenShift, multiple Logstash instances are running behind a Kubernetes service, which acts like a load balancer. 

1. __NodePort Service__

By default, a single service is deployed for all Logstash instances. This service is by default configured as a NodePort and thus Logstash becomes available on the configured 
port: `32001` on all nodes of the cluster.  
You can now setup the corresponding nodes as Logstash hosts in your Filebeat configuration with Load-Balancing enabled and Filebeat will distribute the 
Traffic accross the available nodes. With that, it works almost the same as before, as Filebeat will establish multiple peristent connections for you.  

This is an example setup:  
```
// The service exposing Logstash as a NodePort on 32001
kubectl -n apim-elk get services axway-elk-apim4elastic-logstash -o wide
NAME                              TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE   SELECTOR
axway-elk-apim4elastic-logstash   NodePort   10.110.89.215   <none>        5044:32001/TCP   85m   app=axway-elk-apim4elastic-logstash,chart=logstash,release=axway-elk

// The given NodePort (default 32001) is exposed on all Worker-Nodes:
kubectl get nodes -o wide
NAME                            STATUS   ROLES                  AGE   VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE         KERNEL-VERSION                  CONTAINER-RUNTIME
ip-172-31-51-209.ec2.internal   Ready    <none>                 23h   v1.21.0   172.31.51.209   <none>        Amazon Linux 2   4.14.209-160.339.amzn2.x86_64   docker://19.3.13
ip-172-31-53-214.ec2.internal   Ready    <none>                 23h   v1.21.0   172.31.53.214   <none>        Amazon Linux 2   4.14.193-149.317.amzn2.x86_64   docker://19.3.6
ip-172-31-54-120.ec2.internal   Ready    <none>                 23h   v1.21.0   172.31.54.120   <none>        Amazon Linux 2   4.14.209-160.339.amzn2.x86_64   docker://19.3.13
ip-172-31-57-105.ec2.internal   Ready    <none>                 23h   v1.21.0   172.31.57.105   <none>        Amazon Linux 2   4.14.181-142.260.amzn2.x86_64   docker://19.3.6
ip-172-31-61-143.ec2.internal   Ready    control-plane,master   23h   v1.21.0   172.31.61.143   <none>        Amazon Linux 2   4.14.181-142.260.amzn2.x86_64   docker://19.3.6
```

And this would be the belonging configuration for the Filebeat Logstash output  
```yaml
output.logstash:
  hosts: ["172.31.51.209:32001", "172.31.53.214:32001", "172.31.54.120:32001"]
  # Or as part of the .env:
  # LOGSTASH_HOSTS=172.31.51.209:32001,172.31.53.214:32001,172.31.54.120:32001
  worker: 2
  bulk_max_size: 3072
  loadbalance: true
```

The NodePort Service is the recommended approach for the best possible throughput.  

2. __Load Balancer__  

Using the single service approach above is the most optimal setup, as it makes sure Filebeat can perform proper load balancing still using persistent connections for the best throughput.  

However, if you prefer to use a Load-Balancer to have a single entry point it's also possible. You can configure the service from a NodePort to a LoadBalancer if you prefer and use for instance 
your Public-Cloud Load-Balancer, from AWS, GCP, etc.  
But With that kind of setup, care must be taken to ensure that Filebeat is set with an appropriate [TTL](https://www.elastic.co/guide/en/beats/filebeat/7.12/logstash-output.html#_ttl) to 
ensure that the load is at least better distributed between the available Logstash instances. (See here for more details https://github.com/elastic/beats/issues/661)  

For example:  
```yaml
output.logstash:
  # Or as part of the .env:
  # LOGSTASH_HOSTS=172.31.51.209:32001,172.31.53.214:32001,172.31.54.120:32001
  hosts: ["logstash.on.load-balancer:5044"]
  worker: 2
  bulk_max_size: 3072
  # This parameter has not effect, as there is only one Logstash host configured
  loadbalance: true
  # The following two parameters drop & re-establish the connection to Logstash every 5 minutes
  # With that, you give the Service/LoadBalancer from time to time the chance to distribute the traffic. 
  # But even with that, it might be the case, that call traffic goes to one Logstash instance.
  # Do not set the ttl less than 1 minute, as it would increase the connection management overhead
  ttl: 5m
  pipelining: 0
```

If you would like to read more: https://discuss.elastic.co/t/filebeat-only-goes-to-one-of-the-logstash-servers-that-is-behind-an-elb/48875/5

## Enable User-Authentication

Enabling user authentication in Elasticsearch is quite analogous to the Docker Compose approach. For a newly created Elasticsearch cluster, 
you generate passwords for the default Elasticsearch users and then store them in your `myvalues.yaml` or in your own secrets.  

Run the following command to generate the passwords for the default users.

```
kubectl -n apim-elk exec axway-elk-apim4elastic-elasticsearch-0 -- bin/elasticsearch-setup-passwords auto --batch --url https://localhost:9200
```

This structure shows how to setup the Elasticsearch users in your `myvalues.yaml` and disable anonymous access.

```yaml
apibuilder4elastic:
  secrets:
    elasticsearchUsername: "elastic"
    elasticsearchPassword: "XXXXXXXXXXXXXXXXXXXX"
logstash:
  logstashSecrets:
    # Used to send stack monitoring information
    logstashSystemUsername: "logstash_system"
    logstashSystemPassword: "AAAAAAAAAAAAAAAAAA"
    # Used to send events
    logstashUsername: "elastic"
    logstashPassword: "XXXXXXXXXXXXXXXXXXXX"
kibana:
  kibanaSecrets:
    username: "kibana_system"
    password: "ZZZZZZZZZZZZZZZZZ"
filebeatSecrets: 
  beatsSystemUsername: "beats_system"
  beatsSystemPassword: "YYYYYYYYYYYYYYYYYYY"
  elasticsearchClusterUUID: "YOUR-CLUSTER-UUID-ID"
# Required for the Elasticsearch readiness check, once users have been generated
elasticsearch:
  elasticsearchSecrets: 
    elasticsearchPassword: "elastic"
    elasticUsername: "BBBBBBBBBBBBBBBBBBBBBB"
  anonymous: 
    enabled: false
```

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
If you do not control all keys and certificates yourself, you must continue to reference the secret: `axway-elk-apim4elastic-certificates`, otherwise it 
will not be included by the new declaration and some keys from the default certificates are missing.

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
You can declare secret mounts in the same way for each component. After you provide each component with the additional secret, you can store the path to its CA in your `myvalues.yaml`.

```yaml
global:
  elasticsearchCa: "customConfig/certificates/myElasticsearchCa.crt"
```
This tells every component to read the CA for Elasticsearch from this location.

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

## API-Management running in Kubernetes

If you are already running the Axway API management solution in a Kubernetes environment, then it makes sense to also run Filebeat in Kubernetes.

The following shows Filebeat and API-Management in a Kubernetes cluster:  
![Kubernetes architecture all components](../imgs/kubernetes/all_components_incl_filebeat.png)  

One way to provide Filebeat with the necessary log files of the API-Gateway in a central volume. All API-Gateways write to this volume and Filebeat reads & streams the corresponding documents/events.  

Add the log volume into the Filebeat container using `extraVolumes` and mount it in the correct location using `extraVolumeMounts`. You can find sample configuration in `values.yaml`. Make sure to mount the volume only once.

Other options are possible, but have not yet been tested.

### Upgrade the release

Example how to upgrade an existing Helm release:  
```
helm upgrade -n apim-elk -f myvalues.yaml axway-elk apim4elastic-3.1.0.tgz
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

Maximum number of file descriptors must be at least 65536. (See for instance here: https://documentation.sisense.com/latest/linux/dockerlimits.htm)

### Kibana

Memory: 500m - 500m  
CPU: 500m - 500m

## Why Helm Release-Name axway-elk ?
The release name must currently: `axway-elk`, because many resources, like Services, ConfigMaps or Secrets 
are created with it and referenced in the standard `values.yaml`. An example is the Elasticsearch-Service: `axway-elk-apim4elastic-elasticsearch`, 
which is for instance used for the standard `elasticsearchHosts: "https://axway-elk-apim4elastic-elasticsearch:9200"`. This restriction may 
be changed in a later release to get more flexibility.  
## Create a release

1. Merge develop to master

2. Bump version number

- docker-compose.yml
  - `image: cwiechmann/apibuilder4elastic:v2.0.0`
- apibuilder4elastic/package.json
  - `"version": "v2.0.0",`
- UPDATE.md
  - `"version": "v2.0.0",`
  - Adjust/Verify version table
- README.md
  - `"version": "v2.0.0",`

3. Modify the CHANGELOG.md
- Add/Verify recent changes
- Set the release version and date

4. Create the release
- Create a new release on Github with the tag name: e.g. v2.0.2

## Create the shipped certificates

To generate the sample keys and certificates we are using the Elasticsearch cert-util: 
https://www.elastic.co/guide/en/elasticsearch/reference/current/certutil.html

Within a running Elasticsearch instance docker container:  
`docker exec -it elasticsearch1 sh`

Create an instances.yml in the Elasticsearch home directory:  
```yml
instances:
  - name: "elasticsearch1"
    dns:
      - "elasticsearch1"
      - "localhost"
      - "api-env"
      - "*.ec2.internal"
      - "*.compute-1.amazonaws.com"
      - "*.cloudapp.azure.com"
  - name: "kibana"
    dns:
      - "kibana"
      - "localhost"
      - "api-env"
      - "*.ec2.internal"
      - "*.compute-1.amazonaws.com"
      - "*.cloudapp.azure.com"
  - name: "apibuilder4elastic"
    dns:
      - "apibuilder4elastic"
      - "localhost"
      - "api-env"
      - "*.ec2.internal"
      - "*.compute-1.amazonaws.com"
      - "*.cloudapp.azure.com"
```

Run elasticsearch-certutil:  
`bin/elasticsearch-certutil cert --silent --in instances.yml --out sample-certificates.zip --pem --keep-ca-key`

Copy the ZIP-File:  
`docker cp elasticsearch1:/usr/share/elasticsearch/sample-certificates.zip .`

Store the certificates in the config/certificates folder

## Elastic commands 

Run if Shards are not assigned to see the reason:  
`GET /_cluster/allocation/explain`

Assign the entire index to a specific Node as it is needed to shrink:  
```
PUT /apigw-traffic-details-eu-000001/_settings
{
  "settings": {
    "index.routing.allocation.require._name": "Elasticsearch1", 
    "index.blocks.write": true                                    
  }
}
```

Go to a specific ILM-Step:
```
POST _ilm/move/apigw-traffic-details-eu-000001
{
  "current_step": { 
    "phase": "warm",
    "action": "shrink",
    "name": "shrunk-shards-allocated"
  },
  "next_step": { 
    "phase": "warm",
    "action": "shrink",
    "name": "shrink"
  }
}
```

Retry an ILM-Step:
```
POST /apigw-traffic-details-eu-000001/_ilm/retry
```
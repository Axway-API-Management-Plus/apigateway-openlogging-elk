## Create a release

### Bump version
- docker-compose.yml
    `image: cwiechmann/apibuilder4elastic:v2.0.0`
- apibuilder4elastic/package.json
    `"version": "v2.0.0",`
- UPDATE.md
    `"version": "v2.0.0",`

### CHANGELOG.md
- Add recent changes

### Create the release
- Create a new release on Github with the tag name: v2.0.0

## Create the shipped certificates

To generate the sample keys and certificates we a using the Elasticsearch cert-util: 
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
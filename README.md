# API-Management Traffic-Monitor based ELK stack

## Prerequisites

1. docker
2. docker-compose
3. API-Management Version >7.7-20200130

### Update vm.max_map_count kernel setting to at least 262144

See https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-prod-prerequisites

## Start local elasticsearch cluster

1.  Edit the .env file and configure both APIGATEWAY_LOGS_FOLDER and APIGATEWAY_TRACES_FOLDER environment variables to point to your open traffic and trace folders respectively.
2.  Bring the cluster up using docker-compose:
````
docker-compose up -d
````

## Stop cluster
````
docker-compose down
````


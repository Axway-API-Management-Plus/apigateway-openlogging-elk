#!/bin/bash -e

# This scripts adjust the configured list of Elasticsearch hosts from a comma separated list 
# into a space separated list. This is currently the only available option in Logstash

elasticsearchHosts=${ELASTICSEARCH_HOSTS}

elasticsearchHosts=`echo "$elasticsearchHosts" | tr "," " "`

echo "Adjusted given Elasticsearch hosts: ${elasticsearchHosts} for Logstash"

export ELASTICSEARCH_HOSTS=$elasticsearchHosts

if [ "${ELASTICSEARCH_SSL_VERIFICATIONMODE}" == "none" ];then
    echo "Logstash-Pipelines to Elasticsearch certificate validation is disabled."
    export ELASTICSEARCH_SSL_VERIFICATIONMODE=false
else
    echo "Logstash-Pipelines to Elasticsearch certificate validation is enabled."
    export ELASTICSEARCH_SSL_VERIFICATIONMODE=true
fi

# Finally call the original Docker-Entrypoint
/usr/local/bin/docker-entrypoint "$@"

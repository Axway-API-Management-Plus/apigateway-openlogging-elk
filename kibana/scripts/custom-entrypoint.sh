#!/bin/bash -e

# This scripts adjusts the configured list of Elasticsearch hosts
# Kibana requires each host to be double quoted 

hostsForKibana=`echo ${ELASTICSEARCH_HOSTS} | awk '{split($0, va, /,/); vl=""; for (v in va) { if (vl =="" ) vl = sprintf("\"%s\"", va[v]); else vl = vl sprintf(",\"%s\"", va[v]); } print(vl) }'`

echo "Adjusted given Elasticsearch hosts: ${hostsForKibana} for Kibana"

export ELASTICSEARCH_HOSTS=[$hostsForKibana]

# Finally call the original Docker-Entrypoint
#/usr/local/bin/dumb-init "--"
/usr/local/bin/kibana-docker

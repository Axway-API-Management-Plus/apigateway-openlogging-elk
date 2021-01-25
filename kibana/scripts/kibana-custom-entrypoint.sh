#!/bin/bash -e

# This scripts adjusts the configured list of Elasticsearch hosts
# Kibana requires each host to be double quoted 

hostsForKibana=`echo ${ELASTICSEARCH_HOSTS} | awk '{split($0, va, /,/); vl=""; for (v in va) { if (vl =="" ) vl = sprintf("\"%s\"", va[v]); else vl = vl sprintf(",\"%s\"", va[v]); } printf("'[%s]'", vl) }'`

echo "Adjusted given Elasticsearch hosts: ${hostsForKibana} for Kibana"

if [ -z "${SELF_MONITORING_ENABLED}" ];then
    echo "Parameter: SELF_MONITORING_ENABLED not set, default to true.";
    export MONITORING_UI_CONTAINER_ELASTICSEARCH_ENABLED=true
fi

export ELASTICSEARCH_HOSTS=$hostsForKibana

# Finally call the original Docker-Entrypoint
/usr/local/bin/kibana-docker
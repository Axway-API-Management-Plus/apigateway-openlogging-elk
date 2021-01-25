#!/bin/sh -e

# This script adjusts the configured list of Logstash hosts
# as is it required by Filebeat. 

if [ -z "${LOGSTASH_HOSTS}" ];then
    if [ -z "${LOGSTASH}" ]; then
        echo "Parameter: LOGSTASH_HOSTS is missing";
        exit 99;
    else 
        echo "Parameter LOGSTASH is deprecated. Please migrate your configuration (.env file) to parameter: LOGSTASH_HOSTS";
        LOGSTASH_HOSTS=${LOGSTASH}
    fi
fi

hostsForFilebeat=`echo ${LOGSTASH_HOSTS} | awk '{split($0, va, /,/); vl=""; for (v in va) { if (vl =="" ) vl = sprintf("\"%s\"", va[v]); else vl = vl sprintf(",\"%s\"", va[v]); } printf("'[%s]'", vl) }'`

echo "Adjusted given Logstash hosts: ${hostsForFilebeat} for Filebeat"

export LOGSTASH_HOSTS=$hostsForFilebeat

# Finally call the original Docker-Entrypoint
/usr/local/bin/docker-entrypoint "$@"

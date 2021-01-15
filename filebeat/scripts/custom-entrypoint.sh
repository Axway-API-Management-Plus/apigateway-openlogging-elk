#!/bin/sh -e

# This script adjusts the configured list of Logstash hosts
# as is it required by Filebeat. 

hostsForFilebeat=`echo ${LOGSTASH_HOSTS} | awk '{split($0, va, /,/); vl=""; for (v in va) { if (vl =="" ) vl = sprintf("\"%s\"", va[v]); else vl = vl sprintf(",\"%s\"", va[v]); } printf("'[%s]'", vl) }'`

echo "Adjusted given Logstash hosts: ${hostsForFilebeat} for Filebeat"

export LOGSTASH_HOSTS=$hostsForFilebeat

# Finally call the original Docker-Entrypoint
/usr/local/bin/docker-entrypoint "$@"
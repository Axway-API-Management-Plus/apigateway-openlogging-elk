#!/bin/sh -e

# This script adjusts the configured list of Elasticsearch hosts as required by Metricbeat

if [ "${METRICBEAT_ENABLED}" = "false" ];then
    echo "Metricbeat is disabled as parameter METRICBEAT_ENABLED is set to false";
    exit 88;
fi

if [ -z "${METRICBEAT_USERNAME}"  ] || [ -z "${METRICBEAT_PASSWORD}"  ];then
    if [ "${ELASTICSEARCH_ANONYMOUS_ENABLED}" = "false" ];then
        echo "ELASTICSEARCH_ANONYMOUS_ENABLED is false, but parameter: METRICBEAT_USERNAME or METRICBEAT_PASSWORD is missing";
        exit 99;
    fi
fi

if [ -z "${ELASTICSEARCH_HOSTS}" ];then
    echo "Parameter: ELASTICSEARCH_HOSTS is missing";
    exit 99;
fi

if [ -z "${KIBANA_HOST}" ];then
    echo "Parameter KIBANA_HOST not given, using first Elasticsearch";
    kibanaHost=`echo ${ELASTICSEARCH_HOSTS} | awk '{split($0, va, /,/); first=va[1]; split(first, parts, /:/); printf("'https:%s:5601'", parts[2]) }'`
    export KIBANA_HOST=$kibanaHost
fi

elasticHosts=`echo ${ELASTICSEARCH_HOSTS} | awk '{split($0, va, /,/); vl=""; for (v in va) { if (vl =="" ) vl = sprintf("\"%s\"", va[v]); else vl = vl sprintf(",\"%s\"", va[v]); } printf("'[%s]'", vl) }'`

echo "Adjusted given Elasticsearch hosts: ${elasticHosts} for Metricbeat"

echo "KIBANA_HOST set to: ${KIBANA_HOST}";

# Save the originally given parameters
params=$@

export ELASTICSEARCH_HOSTS=$elasticHosts

if [ "${METRICBEAT_SETUP_DASHBOARDS}" != "false" ];then
    echo "Loading Metricbeat Dashboards into Kibana";
    # Get the config-file
    for i in "$@"
    do
        case $i in
            -c)
                shift
                configFile="$1"
                break
                ;;
            *)
                shift
                ;;
        esac
    done
    metricbeat setup --strict.perms=false -e -c ${configFile}
fi

# Finally call the original Docker-Entrypoint
/usr/local/bin/docker-entrypoint $params

#!/bin/sh -e

# This script adjusts the configured list of Elasticsearch hosts as required by Metricbeat


# Save the originally given parameters as they are forwarded to the original docker-entrypoint script
params=$@

if [ "${METRICBEAT_ENABLED}" = "false" ];then
    echo "Metricbeat is disabled as parameter METRICBEAT_ENABLED is set to false";
    exit 88;
fi

if [ -z "${METRICBEAT_USERNAME}"  ] || [ -z "${METRICBEAT_PASSWORD}"  ];then
    if [ "${ELASTICSEARCH_ANONYMOUS_ENABLED}" = "false" ];then
        echo "ELASTICSEARCH_ANONYMOUS_ENABLED is false, but parameter: METRICBEAT_USERNAME or METRICBEAT_PASSWORD is missing";
        exit 98;
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

elasticHosts=`echo ${ELASTICSEARCH_HOSTS} | awk '
    function ltrim(s) { sub(/^[ \t\r\n]+/, "", s); return s }
    function rtrim(s) { sub(/[ \t\r\n]+$/, "", s); return s }
    function trim(s)  { return rtrim(ltrim(s)); }
    {
        split($0, va, /,/); vl=""; for (v in va) { 
            if (vl =="" ) 
                vl = sprintf("\"%s\"", trim(va[v])); 
            else 
                vl = vl sprintf(",\"%s\"", trim(va[v])); 
        } 
        printf("'[%s]'", vl) 
    }'
`

echo "Adjusted given Elasticsearch hosts: ${elasticHosts} for Metricbeat"

# Check if Kibana-Host is reachable and if, enable Kibana-Monitoring
curl -skfv ${KIBANA_HOST} || rc=$?

if [ "$rc" != "0" ];then
    echo "KIBANA_HOST: ${KIBANA_HOST} is not reachable. Got returncode: ${rc} for command: curl -kv ${KIBANA_HOST}";
    echo "Metricbeat Kibana monitoring will be disabled on this host.";
    export METRICBEAT_ENABLE_KIBANA=false;
else 
    echo "Successfully connected to Kibana-Host: ${KIBANA_HOST}. Enable Metricbeat monitoring."
    export METRICBEAT_ENABLE_KIBANA=true;
    # Only if Kibana is reachable, try to load Dashboards is enabled
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
fi

export ELASTICSEARCH_HOSTS=$elasticHosts

# Stop here, if script is tested with bats
if [ -z "${BATS_TEST_FILENAME}" ]; then
    exit 0
fi
# Finally call the original Docker-Entrypoint
/usr/local/bin/docker-entrypoint $params

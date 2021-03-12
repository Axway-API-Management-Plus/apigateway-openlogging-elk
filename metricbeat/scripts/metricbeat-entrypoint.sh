#!/bin/bash -e

# Each Metricbeat requires access to Elasticsearch to send Metric information and optionally (but at least one times)
# access to Kibana in order to load the Metricbeat Dashboards into Kibana.
# This script adjusts the configured list of Elasticsearch hosts as required by Metricbeat. In addition it is 
# using the first Elasticsearch host as the Kibana-Host if not given externally with KIBANA_HOST

# Save the originally given parameters as they are forwarded to the original docker-entrypoint script
params=$@

export METRICBEAT_KIBANA_ENABLED=false
export METRICBEAT_ELASTICSEARCH_ENABLED=false
export METRICBEAT_LOGSTASH_ENABLED=false
export METRICBEAT_BEAT_ENABLED=false
export METRICBEAT_MEMCACHED_ENABLED=false
export METRICBEAT_SYSTEM_ENABLED=false
export METRICBEAT_DOCKER_ENABLED=false

# Don't start if the node-name is not set
if [ -z "${METRICBEAT_NODE_NAME}" ];then
    echo "METRICBEAT_NODE_NAME is missing";
    exit 55;
fi

if [ -z "${METRICBEAT_MODULES}" ];then
    echo "METRICBEAT_MODULES is missing";
    exit 77;
else 
    # Parse the comma separated list
    IFS=', ' read -r -a array <<< "${METRICBEAT_MODULES}"
    for module in "${array[@]}"
    do
        if [ "${module}" = "kibana" ]; then
            echo "Enable metricbeat Kibana module"
            export METRICBEAT_KIBANA_ENABLED=true
            continue;
        fi
        if [ "${module}" = "elasticsearch" ]; then
            echo "Enable metricbeat Elasticsearch module"
            export METRICBEAT_ELASTICSEARCH_ENABLED=true
            continue;
        fi
        if [ "${module}" = "logstash" ]; then
            echo "Enable metricbeat Logstash module"
            export METRICBEAT_LOGSTASH_ENABLED=true
            continue;
        fi
        if [ "${module}" = "filebeat" ]; then
            echo "Enable metricbeat Beat module"
            export METRICBEAT_BEAT_ENABLED=true
            continue;
        fi
        if [ "${module}" = "memcached" ]; then
            echo "Enable metricbeat Memcached module"
            export METRICBEAT_MEMCACHED_ENABLED=true
            continue;
        fi
        if [ "${module}" = "system" ]; then
            echo "Enable metricbeat System module"
            export METRICBEAT_SYSTEM_ENABLED=true
            continue;
        fi
        if [ "${module}" = "docker" ]; then
            echo "Enable metricbeat Docker module"
            export METRICBEAT_DOCKER_ENABLED=true
            continue;
        fi
    done
fi

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
    echo "Parameter KIBANA_HOST not given, using https://kibana:5601 as default";
    kibanaHost="https://kibana:5601" # This is the default as given by Docker-Compose
    export KIBANA_HOST=$kibanaHost
    echo "KIBANA_HOST set to $kibanaHost"
fi

# All Elasticsearch hosts should be monitored by one Metricbeat
# Therefore the list format of the given Elasticsearch hosts must be adjusted for Metricbeat
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

echo "Elasticsearch hosts: ${elasticHosts} will be monitored by Metricbeat"
# Check if Kibana-Host is reachable and if not, disable Kibana-Monitoring
curl -skf ${KIBANA_HOST} || rc=$?
if [ \( "$rc" != "0" -a "$rc" != "" \) ] && [ "${SKIP_VALIDATION}" != true ]; then
    echo "KIBANA_HOST: ${KIBANA_HOST} is not reachable. Got returncode: for command: curl -kv ${KIBANA_HOST}";
    echo "Metricbeat Kibana monitoring will be disabled on this host.";
    export METRICBEAT_KIBANA_ENABLED=false;
else 
    # Only if Kibana is reachable, try to load Dashboards is enabled
    echo "Successfully connected to Kibana-Host: ${KIBANA_HOST}."
    if [ "${METRICBEAT_SETUP_DASHBOARDS}" != "false" ];then
        echo "Loading Metricbeat Dashboards into Kibana";
        # Get the config file required to load Kibana-Dashboards
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
        echo "Calling metricbeat setup with config file: ${configFile}"
        if [ "${BATS_TEST}" != true ]; then
            metricbeat setup --strict.perms=false -e -c ${configFile}
        fi
    fi
fi

export ELASTICSEARCH_HOSTS=$elasticHosts

# Skip, if running in a test
if [ "${BATS_TEST}" != true ]; then
    # Finally call the original Docker-Entrypoint
    /usr/local/bin/docker-entrypoint $params
fi

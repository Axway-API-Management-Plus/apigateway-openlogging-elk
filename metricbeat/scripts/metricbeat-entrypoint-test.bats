setup() {
    unset ELASTICSEARCH_HOSTS
    export METRICBEAT_NODE_NAME=Test-Node-1
    export BATS_TEST=true
}

@test "invoke metric-entrypoint without Node-Name prints an error" {
    unset METRICBEAT_NODE_NAME
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 55 ]
    [ "$output" = "METRICBEAT_NODE_NAME is missing" ]
}

@test "invoke metric-entrypoint without modules prints an error" {
    unset METRICBEAT_MODULES
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 77 ]
    [ "$output" = "METRICBEAT_MODULES is missing" ]
}

@test "invoke metric-entrypoint without ELASTICSEARCH_HOSTS prints an error" {
    export METRICBEAT_MODULES="kibana,elasticsearch"
    run metricbeat/scripts/metricbeat-entrypoint.sh -m kibana,elasticsearch
    [ "$status" -eq 99 ]
    [ "${lines[2]}" = "Parameter: ELASTICSEARCH_HOSTS is missing" ]
}

@test "invoke metric-entrypoint with valid ELASTICSEARCH_HOSTS prints adjusted hosts" {
    export ELASTICSEARCH_HOSTS="https://elasticsearch1.host:9200,https://elasticsearch1.host:9201"
    export METRICBEAT_MODULES="kibana,elasticsearch"
    metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 0 ]
    [ "${lines[2]}" = 'Elasticsearch hosts: ["https://elasticsearch1.host:9200","https://elasticsearch1.host:9201"] will be monitored by Metricbeat' ]
}

@test "invoke metric-entrypoint with ELASTICSEARCH_HOSTS including spaces prints adjusted hosts" {
    export ELASTICSEARCH_HOSTS="https://elasticsearch1.host:9200 , https://elasticsearch2.host:9202, https://elasticsearch3.host:9203"
    export METRICBEAT_MODULES="kibana,elasticsearch"
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 0 ]
    [ "${lines[2]}" = 'Elasticsearch hosts: ["https://elasticsearch1.host:9200","https://elasticsearch2.host:9202","https://elasticsearch3.host:9203"] will be monitored by Metricbeat' ]
}

@test "invoke metric-entrypoint without KIBANA_HOST - First Elasticsearch host should be used as KIBANA_HOST" {
    export ELASTICSEARCH_HOSTS="https://elasticsearch1.host:9200 , https://elasticsearch2.host:9202, https://elasticsearch3.host:9203"
    export METRICBEAT_MODULES="kibana,elasticsearch"
    unset KIBANA_HOST
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 0 ]
    [ "${lines[2]}" = 'Parameter KIBANA_HOST not given, using first Elasticsearch host' ]
    [ "${lines[3]}" = 'KIBANA_HOST set to https://elasticsearch1.host:5601' ]
}

@test "invoke metric-entrypoint with valid KIBANA_HOST (simuluated as valid host)" {
    export SKIP_VALIDATION=true
    export ELASTICSEARCH_HOSTS="https://elasticsearch1.host:9200 , https://elasticsearch2.host:9202, https://elasticsearch3.host:9203"
    export KIBANA_HOST="https://my.kibana.host:5601"
    export METRICBEAT_MODULES="kibana,elasticsearch"
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 0 ]
    [ "${lines[3]}" = 'Successfully connected to Kibana-Host: https://my.kibana.host:5601.' ]
    [ "${lines[4]}" = 'Loading Metricbeat Dashboards into Kibana' ]
}

@test "invoke metric-entrypoint with invalid KIBANA_HOST" {
    export ELASTICSEARCH_HOSTS="https://elasticsearch1.host:9200 , https://elasticsearch2.host:9202, https://elasticsearch3.host:9203"
    export KIBANA_HOST="https://my.kibana.host:5601"
    export METRICBEAT_MODULES="kibana,elasticsearch"
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 0 ]
    [ "${lines[3]}" = 'KIBANA_HOST: https://my.kibana.host:5601 is not reachable. Got returncode: 6 for command: curl -kv https://my.kibana.host:5601' ]
    [ "${lines[4]}" = 'Metricbeat Kibana monitoring will be disabled on this host.' ]
}

@test "invoke metric-entrypoint without Metricbeat-Username and anonymous access is disabled" {
    unset METRICBEAT_USERNAME
    export ELASTICSEARCH_ANONYMOUS_ENABLED=false
    export METRICBEAT_MODULES="kibana,elasticsearch"
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 98 ]
    [ "${lines[2]}" = 'ELASTICSEARCH_ANONYMOUS_ENABLED is false, but parameter: METRICBEAT_USERNAME or METRICBEAT_PASSWORD is missing' ]
}

@test "invoke metric-entrypoint without Metricbeat-Password and anonymous access is disabled" {
    unset METRICBEAT_PASSWORD
    export ELASTICSEARCH_ANONYMOUS_ENABLED=false
    export METRICBEAT_MODULES="kibana,elasticsearch"
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 98 ]
    [ "${lines[2]}" = 'ELASTICSEARCH_ANONYMOUS_ENABLED is false, but parameter: METRICBEAT_USERNAME or METRICBEAT_PASSWORD is missing' ]
}

@test "invoke metric-entrypoint having Metricbeat configured as disabled" {
    export METRICBEAT_ENABLED=false
    export METRICBEAT_MODULES="kibana,elasticsearch"
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 88 ]
    [ "${lines[2]}" = 'Metricbeat is disabled as parameter METRICBEAT_ENABLED is set to false' ]
}

@test "invoke metric-entrypoint all modules enabled" {
    export ELASTICSEARCH_HOSTS="https://elasticsearch1.host:9200 , https://elasticsearch2.host:9202, https://elasticsearch3.host:9203"
    export METRICBEAT_MODULES="kibana,elasticsearch,logstash,filebeat,memcached,system,docker"
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 0 ]
    [ "${lines[0]}" = 'Enable metricbeat Kibana module' ]
    [ "${lines[1]}" = 'Enable metricbeat Elasticsearch module' ]
    [ "${lines[2]}" = 'Enable metricbeat Logstash module' ]
    [ "${lines[3]}" = 'Enable metricbeat Beat module' ]
    [ "${lines[4]}" = 'Enable metricbeat Memcached module' ]
    [ "${lines[5]}" = 'Enable metricbeat System module' ]
    [ "${lines[6]}" = 'Enable metricbeat Docker module' ]
}
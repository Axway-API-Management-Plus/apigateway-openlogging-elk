setup() {
    unset ELASTICSEARCH_HOSTS
}

@test "invoke metric-entrypoint without ELASTICSEARCH_HOSTS prints an error" {
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 99 ]
    [ "$output" = "Parameter: ELASTICSEARCH_HOSTS is missing" ]
}

@test "invoke metric-entrypoint with valid ELASTICSEARCH_HOSTS prints adjusted hosts" {
    export ELASTICSEARCH_HOSTS="https://elasticsearch1.host:9200,https://elasticsearch1.host:9201"
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 0 ]
    [ "${lines[1]}" = 'Adjusted given Elasticsearch hosts: ["https://elasticsearch1.host:9200","https://elasticsearch1.host:9201"] for Metricbeat' ]
}

@test "invoke metric-entrypoint with ELASTICSEARCH_HOSTS including spaces prints adjusted hosts" {
    export ELASTICSEARCH_HOSTS="https://elasticsearch1.host:9200 , https://elasticsearch2.host:9202, https://elasticsearch3.host:9203"
    run metricbeat/scripts/metricbeat-entrypoint.sh
    [ "$status" -eq 0 ]
    echo ${lines[1]}
    [ "${lines[1]}" = 'Adjusted given Elasticsearch hosts: ["https://elasticsearch1.host:9200","https://elasticsearch2.host:9202","https://elasticsearch3.host:9203"] for Metricbeat' ]
}
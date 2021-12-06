#!/bin/bash -e

if [ "${APM_ENABLED}" = "false" ];then
    echo "APM is disabled as parameter APM_ENABLED is set to false";
    exit 88;
fi

if [ -z "${APM_USERNAME}"  ] || [ -z "${APM_PASSWORD}"  ];then
    if [ "${ELASTICSEARCH_ANONYMOUS_ENABLED}" = "false" ];then
        echo "ELASTICSEARCH_ANONYMOUS_ENABLED is false, but parameter: APM_USERNAME or APM_PASSWORD is missing";
        exit 98;
    fi
fi

if [ -z "${ELASTICSEARCH_HOSTS}" ];then
    echo "Parameter: ELASTICSEARCH_HOSTS is missing";
    exit 99;
fi

# Finally call the original Docker-Entrypoint
/usr/local/bin/docker-entrypoint -environment container "$@"

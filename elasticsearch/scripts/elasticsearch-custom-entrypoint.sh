#!/bin/bash -e

# This script is using the given ELASTICSEARCH_HOSTS to populate required parameters
# to setup a Multi-Node Elasticsearch cluster. It is done with the help of the 
# environment variable node.name which is set by Elasticsearch itself within the container.
# If parameters (network.publish_host, http.port, transport.port) are  
# given externally they are used with precedence.

# It is required to translate the dotted environment variable into Non-Dotted 
# to make is accessible with bash commands
nodeName=`echo | awk '{ print ENVIRON["node.name"] }'`

# Get the number and basename of the Elasticsearch node based on the node.name (e.g. elasticsearch2)
nodeBasename=`echo $nodeName | sed -r 's/([a-zA-Z]*)([0-9]{1,})/\1/'`
nodeNumber=`echo $nodeName | sed -r 's/([a-zA-Z]*)([0-9]{1,})/\2/'`

echo "Setup Elasticsearch cluster node: ${nodeNumber} based on ELASTICSEARCH_HOSTS: ${ELASTICSEARCH_HOSTS}"

count=1
params=""
seedHosts=""
initialMasterNode=""
nodeConfigured=false
for host in ${ELASTICSEARCH_HOSTS//,/ }
do
    # Use only the first node as initial master node, when initializing the cluster
    # It is assumed, that node-names are sequentially counted elasticsearch1, elasticsearch2, ...
    if [ "${initCluster}" = "true" -a "${initialMasterNode}" == "" ]; then
        echo "Init Elasticsearch cluster using nodeBasename: ${nodeBasename} and count: ${count}"
        initialMasterNode=" cluster.initial_master_nodes=${nodeBasename}${count}"
    fi
    # Use all declared hosts as seed hosts, but only if
    # seed hosts are not given externally and the standard transport ports are used
    discoverySeedHosts=`echo | awk '{ print ENVIRON["discovery.seed_hosts"] }'`
    discoveryTransportPort=`echo | awk '{ print ENVIRON["transport.port"] }'`
    if [ -z "${discoverySeedHosts}" -a -z "${discoveryTransportPort}" ]
    then
        # Get the hostname and defined transportPort based on the URL (e.g. https://elasticsearch2:9201) 9201 --> 9301
        discoverPublishHostname=`echo $host | sed -r 's/https?:\/\/(.*)\:[0-9]{4}/\1/'`
        discoveryTransportPort=`echo $host | sed -r 's/https?:\/\/(.*)\:[0-9]{2}([0-9]{2})/93\2/'`
        if [ "${seedHosts}" == "" ]; then
            seedHosts=" discovery.seed_hosts=${discoverPublishHostname}:${discoveryTransportPort}"
        else 
            seedHosts="${seedHosts},${discoverPublishHostname}:${discoveryTransportPort}"
        fi
    fi

    if [ "${count}" == "${nodeNumber}" ]; then
        nodeConfigured=true
        publishHost=`echo | awk '{ print ENVIRON["network.publish_host"] }'`
        if [ -z "${publishHost}" ]; then
            publishHost=`echo $host | sed -r 's/https?:\/\/(.*)\:[0-9]{4}/\1/'`
            params="$params network.publish_host=${publishHost}"
            echo "Set network.publish_host=${publishHost} based on given host: ${host}"
        else
            echo "network.publish_host=${publishHost} taken from envionment variable"
        fi

        httpPort=`echo http.port | awk '{print ENVIRON[$0]}'`
        if [ -z "${httpPort}" ]
        then
            httpPort=`echo $host | sed -r 's/https?:\/\/(.*)\:([0-9]*)/\2/'`
            params="$params http.port=${httpPort}"
            echo "Set http.port=${httpPort} based on given host: ${host}"
        else
            echo "http.port=${httpPort} taken from envionment variable"
        fi

        transportPort=`echo | awk '{ print ENVIRON["transport.port"] }'`
        if [ -z "${transportPort}" ]
        then
            transportPort=`echo $host | sed -r 's/https?:\/\/(.*)\:[0-9]{2}([0-9]{2})/93\2/'`
            params="$params transport.port=${transportPort}"
            echo "Set transport.port=${transportPort} based on given host: ${host}"
        else
            echo "transport.port=${transportPort} taken from envionment variable"
        fi
    fi
    count=`expr $count + 1`
done

if [ ${nodeConfigured} == false ]; then
    echo "Failed to start/configure Elasticsearch node: ${nodeNumber}. Please check that ELASTICSEARCH_HOSTS contains the required number of nodes.";
    exit 99
fi

# Check if Self-Monitoring should be enabled
if [ -z "${SELF_MONITORING_ENABLED}" ];then
    echo "Parameter: SELF_MONITORING_ENABLED not set, default to true.";
    export SELF_MONITORING_ENABLED=true;
fi

# Check if the ELASTICSEARCH_ANONYMOUS_ENABLED status
if [ "${ELASTICSEARCH_ANONYMOUS_ENABLED}" = "true" ]; then
    anonymousUsername="xpack.security.authc.anonymous.roles=kibana_admin,superuser,beats_system,logstash_system"
    anonymousRoles="xpack.security.authc.anonymous.username=anonymous"
fi

if [ -z "${ES_JAVA_OPTS}" -o "${ES_JAVA_OPTS}" == "-Xmx1g -Xms1g" ];then
    echo "WARN: >>>> The parameter ES_JAVA_OPTS is not set. Please check and set this parameter for a production environment. <<<<<"
fi

# Finally call the original Docker-Entrypoint
env ${params} ${seedHosts} ${initialMasterNode} ${anonymousUsername} ${anonymousRoles} /usr/local/bin/docker-entrypoint.sh elasticsearch

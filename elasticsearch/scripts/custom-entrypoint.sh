#!/bin/bash -e

# This script is using the given ELASTICSEARCH_HOSTS to populate required parameters
# to setup a Multi-Node Elasticsearch cluster.
# If parameters (network.publish_host, http.port, transport.port) are already 
# given externally they are used with precedence.

# Get the number of the Elasticsearch node based on the node.name (e.g. elasticsearch2)
nodeBasename=`echo node.name | awk 'match(ENVIRON[$0], /([a-zA-Z]*)([0-9]{1,})/, v) { print v[1] }'`
nodeNumber=`echo node.name | awk 'match(ENVIRON[$0], /([a-zA-Z]*)([0-9]{1,})/, v) { print v[2] }'`

count=1
params=""
seedHosts=""
initialMasterNodes=""
for host in ${ELASTICSEARCH_HOSTS//,/ }
do
    # Use all nodes as initial master node, when initializing the cluster
    # It is assumed, that node-names are sequentially counted elasticsearch1, elasticsearch2, ...
    if [ "${initCluster}" = "true" ]; then
        if [ "${initialMasterNodes}" == "" ]; then
            initialMasterNodes="-E cluster.initial_master_nodes=${nodeBasename}${count}"
        else 
            initialMasterNodes="${initialMasterNodes},${nodeBasename}${count}"
        fi
    fi
    # Use all declared hosts as seed hosts if 
    # Seeds hosts are not given externally and the standard transport ports are used
    discoverySeedHosts=`echo discovery.seed_hosts | awk '{print ENVIRON[$0]}'`
    discoveryTransportPort=`echo transport.port | awk '{print ENVIRON[$0]}'`
    if [ -z "${discoverySeedHosts}" -a -z "${discoveryTransportPort}" ]
    then
        # Get the hostname and transport from the URL
        discoverPublishHostname=`echo $host | awk 'match($0, /https?:\/\/(.*)\:(\d*)/, v) { print v[1] }'`
        discoveryTransportPort=`echo $host | awk 'match($0,/https?:\/\/(.*)\:[0-9]{2}([0-9]{2})/, v) { print 93v[2] }'`
        if [ "${seedHosts}" == "" ]; then
            seedHosts="-E discovery.seed_hosts=${discoverPublishHostname}:${discoveryTransportPort}"
        else 
            seedHosts="${seedHosts},${discoverPublishHostname}:${discoveryTransportPort}"
        fi
    fi

    if [ "${count}" == "${nodeNumber}" ]; then
        echo "Setting up Elasticsearch node: ${nodeNumber}"
        publishHost=`echo network.publish_host | awk '{print ENVIRON[$0]}'`
        if [ -z "${publishHost}" ]; then
            publishHost=`echo $host | awk 'match($0, /https?:\/\/(.*)\:(\d*)/, v) { print v[1] }'`
            params="$params -E network.publish_host=${publishHost}"
            echo "Set network.publish_host=${publishHost} based on given host: ${host}"
        else
            echo "network.publish_host=${publishHost} taken from envionment variable"
        fi

        httpPort=`echo http.port | awk '{print ENVIRON[$0]}'`
        if [ -z "${httpPort}" ]
        then
            httpPort=`echo $host | awk 'match($0,/https?:\/\/(.*)\:([0-9]*)/, v) { print v[2] }'`
            params="$params -E http.port=${httpPort}"
            echo "Set http.port=${httpPort} based on given host: ${host}"
        else
            echo "http.port=${httpPort} taken from envionment variable"
        fi

        transportPort=`echo transport.port | awk '{print ENVIRON[$0]}'`
        if [ -z "${transportPort}" ]
        then
            transportPort=`echo $host | awk 'match($0,/https?:\/\/(.*)\:[0-9]{2}([0-9]{2})/, v) { print 93v[2] }'`
            params="$params -E transport.port=${transportPort}"
            echo "Set transport.port=${transportPort} based on given host: ${host}"
        else
            echo "transport.port=${transportPort} taken from envionment variable"
        fi
    fi
    count=`expr $count + 1`    
done

# Finally call the original Docker-Entrypoint
/usr/local/bin/docker-entrypoint.sh elasticsearch ${params} ${seedHosts} ${initialMasterNodes}
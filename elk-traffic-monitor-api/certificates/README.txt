The certificates in this folder are used as a fallback, when the API-Project docker container is 
running without having the certificates folder mounted externally. 
For instance, when running as a service container during the Logstash pipeline tests.
This folder is supposed to be overwritten with externally provided certificates.
If you are using an existing Elasticsearch cluster, then the following roles and users must be created in advance.

# Roles

## Role: axway_apigw_write

```json
POST /_security/role/axway_apigw_write
{
  "cluster": ["monitor"],
  "indices": [
    {
      "names": [ "apigw-*" ],
      "privileges": ["write"]
    }
  ]
}
```

## Role: axway_apigw_read

```json
POST /_security/role/axway_apigw_read
{
  "cluster": ["monitor"],
  "indices": [
    {
      "names": [ "apigw-*" ],
      "privileges": ["read"]
    }
  ]
}
```

## Role: axway_apigw_admin

```json
POST /_security/role/axway_apigw_admin
{
  "cluster": ["monitor", "manage_ilm", "manage_index_templates", "manage_transform" ],
  "indices": [
    {
      "names": [ "apigw-*" ],
      "privileges": ["monitor", "view_index_metadata", "create_index" ]
    },
    {
      "names": [ "apm-*" ],
      "privileges": ["read", "view_index_metadata" ]
    }
  ]
}
```

## Role: axway_kibana_write

```json
POST /_security/role/axway_kibana_write
{
   "applications":[
      {
         "application":"kibana-.kibana",
         "privileges":[
            "feature_discover.all",
            "feature_dashboard.all",
            "feature_visualize.all"
         ],
         "resources":[ "*" ]
      }
   ]
}
```

## Role: axway_kibana_read

```json
POST /_security/role/axway_kibana_read
{
   "applications":[
      {
         "application":"kibana-.kibana",
         "privileges":[
            "feature_discover.read",
            "feature_dashboard.read"
         ],
         "resources":[ "*" ]
      }
   ]
}
```

# Users

## User: axway_logstash

```json
POST /_security/user/axway_logstash
{
   "password" : "changeme",
   "roles":[
      "axway_apigw_write",
      "logstash_system"
   ],
   "enabled":true
}
```

## User: axway_apibuilder

```json
POST /_security/user/axway_apibuilder
{
   "password" : "changeme",
   "roles":[
      "axway_apigw_read",
      "axway_apigw_admin"
   ],
   "enabled":true
}
```

## User: axway_filebeat

```json
POST /_security/user/axway_filebeat
{
   "password" : "changeme",
   "roles":[
      "beats_system"
   ],
   "enabled":true
}
```

## User: axway_kibana_read

```json
POST /_security/user/axway_kibana_read
{
   "password" : "changeme",
   "roles":[
      "axway_apigw_read",
      "axway_kibana_read"
   ],
   "enabled":true
}
```

## User: axway_kibana_write

```json
POST /_security/user/axway_kibana_write
{
   "password" : "changeme",
   "roles":[
      "axway_apigw_read",
      "axway_kibana_write"
   ],
   "enabled":true
}
```

## User: axway_kibana_admin

```json
POST /_security/user/axway_kibana_admin
{
   "password" : "changeme",
   "roles":[
      "axway_kibana_write",
      "monitoring_user",
      "axway_apigw_admin",
      "axway_apigw_read"
   ],
   "enabled":true
}
```
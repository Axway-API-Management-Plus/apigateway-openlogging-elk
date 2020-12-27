# External Authorization flow node

## API-Manager Organization

The ELK solution allows API Manager users to use the default API-Gateway Manager Traffic Monitor, seeing only their own traffic. By default the following is happens for this:
1. a user logs into the API-Gateway Manager and gets a session.
2. this session is forwarded to the API-Builder for the corresponding requests
3. the API-Builder determines the user at the Gateway Manager based on the session ID
4. the user is searched for at the API-Manager to determine the corresponding organization there
5. Now the query is performed on Elasticsearch based on the Organization.

The following figure shows the process:
[Standard Organization Authorization][https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/raw/develop/imgs/current_user_restriction_workflow.png]  

Finally it adds an additional Term-Clause (`[{ "term": { "serviceContext.apiOrg": "API Development" } }]`) to the Elasticsearch query like in the following example:  
```json
{
  "query": {
    "bool": {
      "must": [
        {
          "exists": {
            "field": "http"
          }
        },
        {
          "term": {
            "processInfo.serviceId": "instance-1"
          }
        },
        {
          "range": {
            "@timestamp": {
              "gt": 1608598868466
            }
          }
        },
        {
          "term": {
            "serviceContext.apiOrg": "API Development"
          }
        }
      ]
    }
  }
}
```

### External Authorization

As an alternative an external service might be used to return a custom filter. (`[{ "term": { "customProperties.propertyA": "ResultFromRESTEndpoint" } }]`)

Final search query:  
```json
{
  "query": {
    "bool": {
      "must": [
        {
          "exists": {
            "field": "http"
          }
        },
        {
          "term": {
            "processInfo.serviceId": "instance-1"
          }
        },
        {
          "range": {
            "@timestamp": {
              "gt": 1608598868466
            }
          }
        },
        {
          "term": {
            "customProperties.propertyA": "ResultFromRESTEndpoint"
          }
        }
      ]
    }
  }
}
```
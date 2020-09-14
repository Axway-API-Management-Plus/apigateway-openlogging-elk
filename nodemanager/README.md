# Configure Admin-Node-Manager Policy

It's recommended to use the provided Policy-Fragment: [policy-use-elasticsearch-api-7.7.0.xml](nodemanager/policy-use-elasticsearch-api-7.7.0.xml). 
Howevery, if you like to setup the policy you find the details here.

## How to create the policy manually

- Create a new policy and name it `Use Elasticsearch API` - *This Policy will decide on what API calls can be routed to Elasticsearch*
- The configured Policy should look like this:

  ![use ES API][img3]  

    - The `Compare Attribute` filter named `Is managed by Elasticsearch API?` checks for each endpoint based on the attribute: `http.request.path` if the requested API can be handled by the API-Builder ElasticSearch-Traffic-Monitor API.    
    As a basis for decision-making a criteria for each endpoint needs to be added to the filter configuration.  
    _The following endpoints are currently supported by the API Builder based Traffic-Monitor API._  

| Endpoint       | Expression               | Comment | 
| :---          | :---                 | :---  |
| **Search**     | `^\/api\/router\/service\/[A-Za-z0-9-.]+\/ops\/search$` | This endpoint which provides the data for the HTTP Traffic overview and all filtering capabilities|
| **Circuitpath**     | `^\/api\/router\/service\/[A-Za-z0-9-.]+\/ops\/stream\/[A-Za-z0-9]+\/[^\/]+\/circuitpath$` | Endpoint which provides the data for the Filter Execution Path as part of the detailed view of a transaction|
| **Trace**     | `^\/api\/router\/service\/[A-Za-z0-9-.]+\/ops\/trace\/[A-Za-z0-9]+[\?]?.*$` | Endpoint which returns the trace information and the **getinfo** endpoint which returns the request detail information including the http header of each leg|
| **GetInfo**     | `^\/api\/router\/service\/[A-Za-z0-9-.]+\/ops\/[A-Za-z0-9]+\/[A-Za-z0-9]+\/[\*0-9]{1}\/getinfo[\?]?.*$` |Endpoint provides information for the Requesr- Response-Details|

The compare attribute filter should look like this:   
![Is API Managed][img6]  
- Adjust the URL of the Connect to URL filter to your running API-Builder docker container and port - **default is 8889**. Sample: `https://api-env:8443/api/elk/v1${http.request.rawURI}`  
![Connect to ES API][img7]
- Is not implemented is a compare attribute filter configured like so:  
![Is not implemented](imgs/is_not_implemented.png)  
# Traffic-Monitor based on Elasticsearch based on API-Builder

This Axway API-Builder project is exposing the API-Gateway Traffic-Monitor API based on an Elasticsearch cluster to improve query performance on large datasets.

For more information on using API Builder please see the [API Builder Getting Started Guide](https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/api_builder_getting_started_guide.html).

## How it works?
The Axway API-Gateway Traffic-Monitor is normally communicating with the REST-API exposed the Admin-Node-Manager, which is using as a ultimate backbone the integrated OPSDB running on each API-Gateway instance. This API-Builder project is exposing a few methods (for instance the search request) of the same API, but implements it using the Elasticsearch cluster. It becomes basically a middleware or mediation layer between the requesting client and Elasticsearch.  

To implement the required API an API-First approach has been used:
1. Defined the subset of API-methods that are needed 
2. Imported the API-Definition into the API-Builder project
3. Imported the [Elasticsearch connector]((https://github.com/Axway-API-Builder-Ext/api-builder-extras/tree/master/api-builder-plugin-fn-elasticsearch)) into the API-Builder project 
4. Created a flow
   - that handles all filter parameters 
   - Query Elasticsearch
   - Format and return the response in the way it is expected
   
Documenting this API-Builder project is still in progress
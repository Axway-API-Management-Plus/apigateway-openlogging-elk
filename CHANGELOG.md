# Changelog Axway API-Management based on the Elastic-Stack
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.1] 2021-01-28
### Fixed
- Avoid a Race-Condition by making the variable apiProxy locally instead of global [#61](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/61)
- Avoid a Race-Condition for log messages logged with the wrong Transaction-ID  [#62](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/62)

## [2.0.0] 2021-01-26
### Added
- Support for API Custom-Properties
  - configured custom properties are indexed according to their configuration in API-Manager
    - can be used to create custom dashboard or perform custom queries
- Regional-Support to store data from different regions separatly
  - Makes it possible to use this solution with multiple domains
  - See https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk#different-topologiesdomains
- Local API-Lookup for native API-Enrichment & Disable APIs/Events
  - See https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/blob/develop/README.md#setup-local-lookup
- Payload-Support
  - See https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk#traffic-payload
- Flexible User-Authorization
  - See https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/blob/develop/README.md#customize-user-authorization
- Life-Cycle-Management
  - See https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/blob/develop/README.md#lifecycle-management
- API-Overview dashboard shows average response time
- Initial early version of new Platform-Health-Dashboard
  - the dashboard will be improved with future releases
- Added Metricbeat support
  - Used to monitor the Elastic-Stack
  - Used to monitor API-Gateways & Docker-Containers (Optional)

### Changed
- Updated API-Builder to version Dubai
- Elasticsearch configuration now managed by API-Builder project and no longer by Logstash
  - Index-Templates
  - ILM-Policies has been added
  - Rollup-Jobs has been added

### Fixed
- Trace-Messages for an API-Request now sorted correctly
- API-Manager configuration not properly injected into API-Builder container
- Kibana failed to start, when using multiple Elasticsearch hosts

## [1.0.0] 2020-10-01
### Added
- Initial version

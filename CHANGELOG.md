# Changelog Axway API-Management based on the Elastic-Stack
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Fixed
- API builder mistakenly tries to create the regional index again [#81](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/81)

### Changed
- Index: Traffic-Summary, Field correlationId now has doc_values enabled / New index field: transactionId [#84](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/84)
- Hot-Phase for indices: Traffic-Summary, Traffic-Details & Trace reduced from 15 to 10 days. 5 days added to the Warm phase
- API-Builder release changed from dubai to hanoi
- API-Builder Log-Level messages enabled

## [2.1.2] 2021-02-23
### Fixed
- Parse error when using multiple API_MANAGER configuration [#76](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/76)

### Changed
- Log-Retention-Period for Trace-Messages from 75 days to 30 days [#77](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/77)

### Added
- Added FAQ to make clear, that AWS Elasticsearch service is not supported [#78](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/78)

## [2.1.1] 2021-02-05
### Fixed
- Race-Condition, causing wrong organization assigned to API under heavy load [#75](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/75)

## [2.1.0] 2021-02-04
### Added
- Now the Application-Id shown in Traffic-Monitor column: Subject resolves to the Application-Name [#69](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/69)
- Now it is possible to perform a Full-Text search (search for a part of value) on the Subject-Column in Traffic-Monitor [#70](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/70)

### Changed
- ILM policies optimized to reduce the required disk space / Traffic-Details & -Summary retention period now 30 days [#73](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/73)

### Fixed
- Indices are rolled over too often when an Index-Template is changed [#72](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/72)
- Parameter: LOGSTASH_NODE_NAME added to env-sample [#74](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/74)

## [2.0.2] 2021-02-02
### Fixed
- Wrong ILM Rollover alias added to regional index [#67](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/67)
- Index-Rollover error when using regional indices [#66](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/66)

### Changed
- ILM policies optimized for the ideal index sizes and number of shards [#68](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/68)

### Added
- Initial version of Update instructions. See [UPDATE.md](UPDATE.md)

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

# Changelog Axway API-Management based on the Elastic-Stack
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] 2021-01-12
### Added
- Custom-Properties for an API now looked up
  - Index mapping now includes all configured custom properties
- Regional-Support to store data from different regions separatly
  - See https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk#different-topologiesdomains
- Local API-Lookup for native API-Enrichment & Disable APIs/Events ()
  - See https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/blob/develop/README.md#setup-local-lookup
- Payload-Support
  - See https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk#traffic-payload
- External HTTP-Based User-Authorization
  - See https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/blob/develop/README.md#customize-user-authorization
- Life-Cycle-Management
  - See https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/blob/develop/README.md#lifecycle-management

### Changed
- Updated API-Builder to version Dubai
- Elasticsearch configuration now managed by API-Builder project and no longer by Logstash
  - Index-Templates
  - ILM-Policies has been added
  - Rollup-Jobs has been added

## [1.0.0] 2020-10-01
### Added
- Initial version
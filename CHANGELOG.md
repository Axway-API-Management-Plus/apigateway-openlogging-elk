# Changelog Axway API-Management based on the Elastic-Stack
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- API-Management KPIs incl. dashboard [#64](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/64)

### Changed
- Helm Default-Values for Kibana Memory-Limits changed from 300MB to 500MB (Request) and 300MB to 750MB (Limit)

## [3.6.0] 2021-09-20
### Added
- Make sure Filebeat is not mixing up OpenTraffic with other Log-Files such as Audit-Log [#145](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/145)
- New optional parameter: `API_BUILDER_LOG_LEVEL` to set the API-Builder Log-Level in your .env file
- Support for multiple Admin-Node-Managers when using the regional feature [#144](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/144)
- Added documentation and examples for ES_JAVA_OPTS and LS_JAVA_OPTS on how to setup a different temp directory for Elasticsearch & Logstash

## [3.5.0] 2021-09-13
### Added
- Traffic-Monitor Authorization should support Multi-Organization [#141](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/141)
- New optional parameter: `FILEBEAT_COMPRESSION_LEVEL` for Filebeat to Logstash compression rate [#143](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/143)
- A warning is now logged if unexpectly no Circuit-Path for an API-Request is found [#140](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/140)

### Fixed
- Filter for Authentication Subject ID filter is not working as expected [#138](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/138)

## [3.4.0] 2021-09-02
### Fixed
- Service name filtering is not working as expected [#129](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/129)
- API Operation filter not working as expected [#131](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/131)
- V-Host filter is ignored / Index-Template changed to index VHost additionally as text [#130](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/130)

### Changed
- Updated Elastic-Stack from version 7.12.1 to 7.14.0
  - with that increased the min. amount of memory from 16GB to 18GB
  - minimum Elasticsearch version is 7.10.x
- Updated API-Builder version from Quezon to Timbuktu
- API-Builder now always returns an Unknown API object if an API could not be found [#128](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/128)
- Field http.status now indexed as a keyword additionally to Integer, which is required for Long-Term-Analytics (Transformation-Job)

### Added
- Added support for Long-Term API-Analytics based on transformation jobs
- Added Quartely- and Yearly-API-Request dashboars in addition to the existing Real-Time Dashboard
- Added support for Transactions [#83](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/83)
- If the Current-User request to ANM REST-API fails, API-Builder is now trying it again [#135](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/135)
- New optional parameter: `DROP_TRACE_MESSAGE_LEVELS` to skip indexing of certain trace message levels [#136](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/136)

## [3.3.2] 2021-08-30
### Fixed
- Custom-Property mapping created as undefinedCustomProperties.myProp [#133](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/133)

## [3.3.1] 2021-08-17
### Fixed
- Index-Templates failed to install without using a region [#124](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/124)

### Added
- Skip Ext-HTTP-User-AuthZ if returned URL is undefined [#126](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/126)

### Changed
- API-Builder stops/terminates with an error-message and error-code, if Elasticsearch cannot be configured (e.g. Index-Templates cannot be installed)
- Events Logstash-Pipeline is now processing Transaction-Events with a customMsgAtts.transactionId into the Traffic-Summary index


## [3.3.0] 2021-07-21
### Fixed
- Failed to validated API-Manager connection, when using Load-Balanced API-Manager instances [#117](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/117)
- For JMS-Traffic the fields: leg0.protocolInfo.recvHeader and leg0.protocolInfo.sentHeader are copied into the summary index, as they are used for JMS-Property filtering
- Error when setting up Traffic-Summary index without having a Default-API-Manager configured [#119](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/119)
- Region is not used to load the payload [#121](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/121)

### Added
- New optional parameter: UNRESTRICTED_PERMISSIONS to control which users see all traffic [#120](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/120)

### Changed
- API-Builder version changed from Ottawa to Quezon
- Updated Custom-Flow Nodes dependencies
- In docker-compose files, now using relative paths instead of ${PWD} to mount volumes [#122](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/122)

## [3.2.0] 2021-06-22
### Fixed
- Trace message in Traffic-Monitor is truncated [#112](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/112)
- API-Manager User looked up at API-Manager even if external HTTP-Based AuthZ is configured [#111](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/111)
- Custom-Properties in Traffic-Details Index are not indexed as they are missing in the Index-Template [#115](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/115)
- EMT-Mode - API-Gateway-Traffic-Monitor don't show traffic when Pod is recreated [#114](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/114)
- External-HTTP Authorization - Traffic-Details in Traffic-Monitor not working [#113](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/113)

### Changed
- Custom-Properties type custom now additionally indexed with type keyword [#116](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/116)

## [3.1.0] 2021-05-13
### Changed
- Helm-Chart for Filebeat now creates a dedicated ConfigMap: `...tic-filebeat-env-config` for environment properties and `...tic-filebeat-config` for the filebeat.yaml
- Helm-Chart now expects files given in `/var/<logType>` instead of `/var/log/<logType>`, as `var/log` was causing the error: read-only file system: unknown when trying to mount the directories
- Helm-Chart now expects the Cluster-UUID for Filebeat given in `filebeat.elasticsearchClusterUUID` instead of `filebeat.filebeatSecrets.elasticsearchClusterUUID`
- Logstash lookup for unknown APIs should return 200 instead of 404 [#109](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/109)
- API-Builder version changed from Madrid to Ottawa

### Fixed
- Potential race condition, when using External-HTTP-Based AuthZ [#110](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/110)

## [3.0.0] 2021-05-11
### Added
- New option to skip Elasticsearch in ANM and instead still use the OPSDB by providing an extra REST-API parameter [#105](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/105)
- HELM-Chart - Learn more about the provided chart [here](helm/README.md) [#63](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/63)

### Changed
- Parameter: `SKIP_PAYLOAD_HANDLING` changed to `PAYLOAD_HANDLING_ENABLED`
- Updated Elastic-Version from 7.10.0 to 7.12.1
- Updated API-Builder version from Ibiza (4.60.0) to Lyon (4.63.0)

## [2.4.2] 2021-04-28
### Added
- Traffic-Monitor Search API now supports the field sslSubject [#104](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/104)

## [2.4.1] 2021-04-28
### Fixed
- Error during setup - Get custom properties flow node returned with error message: `Assignment to constant variable`
### Added
- Traffic-Monitor Search API now returns almost the same fields as the original API [#103](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/103)

## [2.4.0] 2021-04-26
### Fixed
- TransactionData not shown, if TransactionElement legs are not in a row [#97](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/97)
- Already existing ServiceName and Operation (Policy-Based) is removed during API-Lookup, when native API cannot be looked up [#98](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/98)
- Data is deleted too early - Data is not visible anymore after ap. 7 days [#99](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/99)
- Logstash Pipeline crashes with NullPointerException in some cases [#101](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/101)

### Added
- Added a new parameter: `DISABLE_CUSTOM_PROPERTIES` to disable custom properties support [#95](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/95)
- Added more flexibility for the API-Gateway HTTP Status-Code filter. Filters such as 2xx or !2xx are now supported [#100](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/100)

## [2.3.0] 2021-04-05
### Fixed
- Duplicated document for one correlationId returned from Elasticsearch causing API-Payload details not to show [#90](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/90)
- API-Manager config for groupId only was registered wrong - Causing error API-Manager config not found for group

### Added
- Option to disable user authorization for the API-Gateway Traffic-Monitor [#91](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/91)

### Changed
- Consider N/A and n/a for the region as not set - In case Logstash does not properly clean it
- Updated Dev-Dependency mocha to version 8.3.2

## [2.2.0] 2021-03-19
### Fixed
- API builder mistakenly tries to create the regional index again [#81](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/81)
- Payload not visible for restricted users [#88](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/88)
- IsIgnoreAPI Lookup failure for JMS-Legs [#89](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/89)
- TransactionDetails not shown if one of the Legs used non HTTP (e.g. JMS) [#87](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/87)

### Changed
- Index: Traffic-Summary, Field correlationId now has doc_values enabled / New index field: transactionId [#84](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/84)
- Reduced Retention-Period from 30 to 14 days for Traffic-Summary/-Details & Trace [#85](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/85)
- API-Builder release changed from Dubai to Ibiza
- API-Builder Log-Level messages enabled
- Now all cookies are returned back to the Admin-Node-Manager. This makes it possible to use Load-Balances ANMs with session stickyness
- Now the returned error message is properly logged if the API-Manager login test at startup fails.

### Added
- New option for external HTTPS-Based user authorization. Server certificates can now be verified with correct CA or validation can be disabled completely.
- New callback to external HTTPS-Based user authorization to set the request URI
- API-Gateway CorrelationId is now logged in API-Builder for all lookups performed by Logstash [#86](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/86)

## [2.1.2] 2021-02-23
### Fixed
- Parse error when using multiple API_MANAGER configuration [#76](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/76)

### Changed
- Log-Retention-Period for Trace-Messages from 75 days to 30 days [#77](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/77)

### Added
- FAQ to make clear, that AWS Elasticsearch service is not supported [#78](https://github.com/Axway-API-Management-Plus/apigateway-openlogging-elk/issues/78)

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

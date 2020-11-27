# Changelog Axway API-Management based on the Elastic-Stack
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] 
### Added
- Custom-Properties for an API now looked up
  - Index mapping now includes all configured custom properties

### Changed
- Updated API-Builder to version Agra
- Elasticsearch configuration now managed by API-Builder project and no longer by Logstash
  - Index-Templates
  - ILM-Policies has been added
  - Rollup-Jobs has been added

## [1.0.0] 2020-10-01
### Added
- Initial version

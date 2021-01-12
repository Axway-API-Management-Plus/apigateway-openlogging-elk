## Steps to create a release

### Bump version
- docker-compose.yml
    `image: cwiechmann/apibuilder4elastic:v2.0.0`
- apibuilder4elastic/package.json
    `"version": "v2.0.0",`

### CHANGELOG.md
- Add recent changes

### Create the release
- Create a new release on Github with the tag name: v2.0.0
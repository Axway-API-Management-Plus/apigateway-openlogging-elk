const fs = require('fs');

module.exports = {
	pluginConfig: {
		'@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch': {
			'elastic': {
				node: process.env.ELASTICSEARCH_HOST || 'https://elasticsearch1:9200',
				auth: {
					// Use an API-Key
					// apiKey: process.env.ELASTICSEARCH_APIKEY,
					// or username / password based
					username: process.env.API_BUILDER_USERNAME,
					password: process.env.API_BUILDER_PASSWORD
				},
				// The name to identify the client instance in the events.
				name: process.env.ELASTICSEARCH_CLIENT_NAME || 'apibuilder4elastic',
				// You can use all configuration options documented here: 
				// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/client-configuration.html
				maxRetries: 5,
				requestTimeout: 60000,
				ssl: {
					//ca: fs.readFileSync('C:/temp/elasticsearch.crt'),
					rejectUnauthorized: false
				}
			}
		}
	}
};
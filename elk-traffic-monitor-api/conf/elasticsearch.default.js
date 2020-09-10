const fs = require('fs');

module.exports = {
	pluginConfig: {
		'@axway-api-builder-ext/api-builder-plugin-fn-elasticsearch': {
			'elastic': {
				node: process.env.ELASTICSEARCH_HOST || 'http://elasticsearch1:9200',
				auth: {
					// Use an API-Key
					apiKey: process.env.ELASTIC_API_KEY,
					// or username / password based
					username: process.env.ELASTIC_USERNAME,
					password: process.env.ELASTIC_PASSWORD
				},
				// The name to identify the client instance in the events.
				name: process.env.ELASTIC_CLIENT_NAME || 'elk-traffic-monitor-api',
				// You can use all configuration options documented here: 
				// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/client-configuration.html
				maxRetries: 5,
				requestTimeout: 60000,
				ssl: {
					//ca: fs.readFileSync('C:/temp/elasticsearch1.crt'),
					rejectUnauthorized: false
				}
			}
		}
	}
};

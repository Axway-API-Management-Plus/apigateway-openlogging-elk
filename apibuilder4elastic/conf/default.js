const fs = require('fs');
const path = require('path');
/**
 * These are your configuration file defaults.
 *
 * You can create additional configuration files ending in *.default.js or
 * *.local.js that the server will load. The *.local.js files are ignored by
 * git/npm due to the .gitignore file in the conf directory. Docker will also
 * ignore these files using the .dockerignore file in the project root. This
 * is so you can develop your service locally using *.local.js files and keep
 * your production configs in the *.default.js files.
 *
 * For example, you may want to develop your service using a test API key. You
 * would place that API key in a *.local.js file and it would get merged over
 * the API key that is already present in default.js
 *
 * This is a JavaScript file (instead of JSON) so you can also use environment
 * variables or perform logic in this file if needed.
 */
module.exports = {
	// The main configuration to configure required Elasticsearch indicies/mappings/etc.
	indexConfigFile: process.env.INDEX_CONFIG_FILE || 'elasticsearch_config/index_config.json',

	authorizationMode: process.env.USER_AUTHORIZATION_MODE || 'ManagerOrganization',

	// Payload configuration settings
	payload: {
		// Mainly used for tests as normally the folder to payload should be fixed
		folder: process.env.PAYLOAD_FOLDER || '/var/log/payloads', 
		// Limit the payload to a certain size (in Byte)
		limit: process.env.PAYLOAD_LIMIT || 10000
	},

	// Mock the API-Creation endpoint, which is required for the Logstash pipeline tests
	mockIndexCreation: ("true" == process.env.MOCK_API_CREATION) ? true : false,

	// This is your generated API key.  It was generated uniquely when you
	// created this project. DO NOT SHARE this key with other services and be
	// careful with this key since it controls access to your API using the
	// default configuration.

	// API key
	apikey: 'MH8gIje1mN0lAw5I3O52PmJ6JTC0sIOT',

	// This is the base url the service will be reachable at not including the
	// port
	baseurl: 'https://localhost',

	// Enabling this property will print out the process.env at startup time
	printEnvVars: false,

	// Proxy configuration. This configuration option allows to configure
	// proxy server URL that can be leveraged in plugins that do http/s
	// communication.
	// proxy: 'http://localhost:8081',

	// Configures your http server
	http: {
		// This is the port the service will be bound to. Defaults to 8080.
		port: parseInt(process.env.PORT) || 8080,

		// HTTP is disabled by default - But for tests it still can be enabled
		disabled: Boolean(process.env.ENABLE_HTTP_PORT) ? false:  true,
	},

	// SSL configuration. For a step-by-step tutorial on how to configure SSL see:
	// https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/enable_a_secure_https_listener.html
	// Note that the sample SSL code below uses the 'fs' and 'path' modules, e.g.:
	// const fs = require('fs');
	// const path = require('path');
	ssl: {
	 	port: 8443,
		key: fs.readFileSync(path.join('.', process.env.API_BUILDER_SSL_KEY || 'certificates/apibuilder4elastic.key'), 'utf8'),
		cert: fs.readFileSync(path.join('.', process.env.API_BUILDER_SSL_CERT || 'certificates/apibuilder4elastic.crt'), 'utf8'),
		passphrase: process.env.API_BUILDER_SSL_PASSWORD || 'axway'
	},

	// The number of milliseconds before timing out a request to the server.
	timeout: 120000,

	// Log level of the application. Can be set to (in order of most-verbose to
	// least): trace, debug, info, warn, error, fatal, none
	logLevel: process.env.LOG_LEVEL || 'info',

	// Prefix to use for APIs, access to which is governed via `accessControl`.
	apiPrefix: '/api',

	// Control access to the service.  Set the `apiPrefixSecurity` to change
	// the authentication security to APIs bound to `apiPrefix`.  Note that
	// different authentication security require different input parameters.
	// `apiPrefixSecurity` can be any of the following:
	//
	// 'none' - Disable authentication.  Note that this will make all APIs
	// hosted on `apiPrefix` public.
	//
	// 'ldap' - LDAP authentication.  Requires HTTP Basic Authentication
	// (RFC-2617) scheme with Base64 encoded username:password.  Also requires
	// specifying configuration property named `ldap`. It should be of type
	// object and should contain required property `url` and optional
	// properties described in ldapauth-fork module docs. See:
	// https://www.npmjs.com/package/ldapauth-fork#ldapauth-config-options
	//
	// 'apikey' - HTTP header authentication.  Requires a HTTP header `APIKey`
	// with the API key.
	//
	// 'basic' - This is the default.  HTTP Basic Authentication (RFC 2617)
	// where the username is the `apikey`, and the password is blank.
	//
	// 'plugin' - A custom authentication scheme. See:
	// https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/authentication_schemes.html#AuthenticationSchemes-Customauthentication
	//
	// If you wish any path that is not bound to `apiPrefix` to be accessible
	// without authentication, then you can explicitly add them to `public`
	// paths.
	accessControl: {
		apiPrefixSecurity: 'none', // none | basic | apikey | ldap | plugin
		public: []
	},

	// Admin UI settings. Controls the settings for the
	// @axway/api-builder-admin UI console.
	admin: {
		// Control whether the admin website is available.
		enabled: true,
		// The hostnames or IPs from which connections to admin are allowed.
		// Hostnames must be resolvable on the server. IP ranges can also be
		// specified. e.g. [ 'localhost', '192.168.1.0/24', '10.1.1.1' ]. An
		// empty list [] will allow unrestricted access, though this is not
		// recommended due to security concerns.
		allowedHosts: [
			'localhost', '::1'
		]
	},

	// Swagger API documentation configuration.
	apidoc: {
		// If you disable, the swagger API documentation will not be available.
		// If @axway/api-builder-admin is installed and enabled, this has no
		// effect.
		disabled: false,

		// The prefix for the swagger API documentation. Documentation is always
		// available from '{prefix}/swagger.json'
		prefix: '/apidoc',

		// Overides for the Swagger API documentation.  These optional
		// overrides tweak how the API is generated, but not how it is hosted
		// (use `apiPrefix`, `port`, and `ssl` configuration instead).  This
		// allows you to tweak specific Swagger values that are useful when
		// the service is not consumed directly, such as when the services is
		// exposed through a proxy.  Available options are:
		//
		// schemes - The transfer protocol of the service. It is an array of
		// values that must be one or more of 'http', 'https', 'ws' or 'wss'.
		// e.g. ['https']
		//
		// host - The host (name or ip) serving the service. This MUST be the
		// host only and does not include the scheme nor sub-paths. It may
		// include a port.
		//
		// basePath - The base path on which the service is served relative to
		// the host. If provided, this MUST start with a leading slash, or be
		// null to specify not to use basePath.
		overrides: {
			// schemes: [ 'https' ],
			// host: 'localhost:8080',
			// basePath: '/'
		}
	},

	// You can generally leave this as-is since it is generated for each new
	// service you created.
	session: {
		encryptionAlgorithm: 'aes256',
		encryptionKey: 'fJuOadXFZcAh8G4MJ8ZairnpHIyNy4RSeeXm0Vksr20=',
		signatureAlgorithm: 'sha512-drop256',
		signatureKey: 'ETYlfmj6UYDok4HkzsApDqsjpvaavoZvs3UX2E1uMQ527pE9BQfRJ5C09n3IuQANg31ruSUp5q71EDjn01N7Jw==',
		// should be a large unguessable string
		secret: 'cYg2YZ8gGL3WnHDo01MrE+0QezqEhXZT',
		// how long the session will stay valid in ms
		duration: 86400000,
		// if expiresIn < activeDuration, the session will be extended by
		// activeDuration milliseconds
		activeDuration: 300000
	},

	// If you want signed cookies, you can set this value. if you don't want
	// signed cookies, remove or make null
	cookieSecret: '9GGH5fVoGbl45JnHHV0YSn032D+/g5oR',

	// Your connector configuration goes here
	connectors: {
	},

	// Cross-Origin Resource Sharing (CORS) settings.  The available options:
	//
	// 'Access-Control-Allow-Origin' - List of allowed origins.  The format can
	// be any (e.g. '*'), a space separated list of strings (e.g.
	// 'http://foo.com http://bar.com'), an array (e.g. ['http://foo.com',
	// 'http://bar.com']), or a regex expression (e.g. /foo\.com$/).
	//
	// 'Access-Control-Allow-Credentials' - Adds the header to responses.  This
	// response header tells browsers whether to expose the response to frontend
	// JavaScript code when the request's credentials mode
	// (`Request.credentials`) is `include`.
	//
	// 'Access-Control-Allow-Methods' - Only these methods will be allowed (out
	// of all available HTTP methods) for an endpoint. All available methods
	// are allowed by default (format: comma separated string or, an array:
	// e.g. 'GET' or 'GET, PUT' or ['GET', 'PUT'])
	//
	// 'Access-Control-Allow-Headers' - Allowed request headers (format: comma
	// separated string or, an array: e.g. 'content-type, authorization' or
	// ['content-type', 'authorization']) 'Access-Control-Allow-Headers':
	// ['content-type', 'authorization']
	//
	// 'Access-Control-Expose-Headers' - List of response headers exposed to the
	// user. Always exposed headers: request-id, response-time and any headers
	// defined in the endpoint (format: comma separated string or, an array:
	// e.g. 'content-type, response-time' or ['content-type', 'response-time'])
	// 'Access-Control-Expose-Headers': ['content-type', 'response-time']
	//
	cors: {
		'Access-Control-Allow-Origin': '*'
	},

	// Health check configuration. The path to a file which exports an express
	// middleware function used as a healthcheck. For more information on
	// express middleware functions, see:
	// https://expressjs.com/en/4x/api.html#middleware-callback-function-examples
	//
	// This healthcheck middleware is executed by invoking
	// "GET /apibuilderPing.json". By default, invoking this endpoint will
	// return {success: <bool>} where <bool> is `true` as long as the service
	// shutting down.
	//
	// healthCheckAPI: './healthCheck.js',

	// Flags configuration.  Enable features that are not ready for
	// production, or whose use may require manual upgrade steps in legacy
	// services.
	flags: {
		enableOverrideEndpointContentType: true,
		// Enable support for aliases in comparison operators on composite
		// models. Breaking change for old versions as previously queries $lt,
		// $gt, $lte, $gte, $in, $nin, $eq would not have translated aliased
		// fields.
		enableAliasesInCompositeOperators: true,

		// Enable support for the $like comparison operator in the Memory
		// connector.
		enableMemoryConnectorLike: true,

		// Enable support for Models that have no primary key. Breaking change
		// for old versions as previously the Create API returned a location
		// header. Also the model advertised unsupported methods.
		enableModelsWithNoPrimaryKey: true,

		// Generate APIs and Flows that user primary key type rather than always
		// assuming string. Breaking change for old versions as the generated
		// APIs will change when enabled.
		usePrimaryKeyType: true,

		// Enabling this flag will cause the service to exit when there is a
		// problem loading a plugin
		exitOnPluginFailure: true,

		// Enabling this flag ensures that a plugin only receives the config
		// relevant to that plugin.
		enableScopedConfig: true,

		// Enable support for null fields coming from Models
		enableNullModelFields: true,

		// Enable support for model names being percent-encoded as per RFC-3986
		// in auto-generated API. Breaking change for old versions as previously
		// names like "foo/bar" will now be encoded as "foo%2Fbar"
		enableModelNameEncoding: true,

		// Enable support for model names being percent-encoded as per RFC-3986
		// in API Builder's Swagger. Breaking change for old versions as
		// previously names like "foo/bar" will now be encoded as "foo%2Fbar"
		enableModelNameEncodingInSwagger: true,

		// Enable support for model names being encoded whilst preserving the
		// connector's slash. This flag only applies when
		// enableModelNameEncodingInSwagger is enabled. Breaking change for old
		// versions as previously model names that start with a connector name,
		// e.g. "oracle/foó" will now be encoded as "oracle/fo%C3%B3".
		enableModelNameEncodingWithConnectorSlash: true
	},

	authorization: {
		callback: '/auth/callback',
		credentials: {
		}
	}
};

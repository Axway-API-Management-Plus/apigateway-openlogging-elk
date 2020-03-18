var APIBuilder = require('@axway/api-builder-runtime');

var User = APIBuilder.Model.extend('testuser', {
	fields: {
		first_name: { type: String },
		last_name: { type: String },
		email: { type: String }
	},
	connector: 'memory'
});

module.exports = User;

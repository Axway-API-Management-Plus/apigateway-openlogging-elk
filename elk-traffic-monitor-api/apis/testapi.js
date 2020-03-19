var APIBuilder = require('@axway/api-builder-runtime');

var TestAPI = APIBuilder.API.extend({
	group: 'testapi',
	path: '/api/testapi/:id',
	method: 'GET',
	description: 'this is an api that shows how to implement an API',
	model: 'testuser',
	before: 'pre_example',
	after: 'post_example',
	parameters: {
		id: { description: 'the test user id' }
	},
	action: function (req, resp, next) {
		// invoke the model find method passing the id parameter
		// stream the result back as response
		resp.stream(req.model.find, req.params.id, next);
	}
});

module.exports = TestAPI;

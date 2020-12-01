const simple = require('simple-mock');
const fs = require('fs');
const { debug } = require('console');

function spyElasticSearchMethod(client, methodName) {
    // methodName might be ilm.getPolicy
    var [namespace, method] = methodName.split('.')
    var fn;
    if (method == null) {
      method = namespace
      namespace = null
    }
    // Get the actual function from the ES-Client
    if (namespace != null) {
        fn = client[namespace][method];
    } else {
        fn = client[method];
    }
    // Spy this function
    var spyFn = simple.spy(fn);
    client.extend(methodName, { force: true }, ({ makeRequest }) => {
        // Extend the ES-Client with the Spy-Function
        return spyFn;
    });
    // Return the mocked function to perform assertions
    return spyFn;
}

module.exports = {
    spyElasticSearchMethod
}
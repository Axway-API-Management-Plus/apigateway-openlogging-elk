# API-Gateway Traffic-Monitor based on Elastic-Search 

This Axway API-Builder project is exposing the API-Gateway Traffic-Monitor API based on an Elasticsearch cluster to improve query performance on large datasets.

For more information on using API Builder please see the [API Builder Getting Started Guide](https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/api_builder_getting_started_guide.html).

## Running your service

**Run and develop your service**

```bash
npm start
```

## Service configuration

On startup, the service will load and merge all configuration files named `conf/*default.js` or `conf/*local.js`. If a property is configured in both `default.js` and `local.js`, the `local.js` value will take precedence.  Configuration files are applied alphabetically "default" first, and then "local", so that any setting in "local" files, will take precedence over any previously set in "default".

### Local configuration

The local configuration files are explcitly ignored by git, npm, and docker.  Any sensitive keys should be applied to local configuration.

### Runtime configuration

If you need to be able to configure a runtime setting, then you can expose the desired properties with environment variables before running the service. For example, if you want to be able to configure the apikey when your service runs, then modify an appropriate configuration file, e.g. `conf/local.js`, so that apikey will use the `process.env.myapikey` environment variable:

```js
// local.js
module.exports = {
	apikey: process.env.myapikey
}
```

Then you would supply the variable at runtime using `bash`:

```bash
myapikey=secret npm start
```

Supplying the runtime using Windows:

```
SET myapikey=secret && npm start
```

## Additional custom configuration

Additional environment variables may be necessary depending on how your service was developed. For example you may have a flow that is configured in advance to consume the environment variable `SECRETKEY`. Your flow would access it at `$.env.SECRETKEY` and you would set the key at runtime.  For example, using `bash`:

```bash
SECRETKEY=foobar npm start
```

Using Windows:

```
SET SECRETKEY=foobar && npm start
```

## Invoking an API locally

This makes a request against the custom run above:

```bash
curl -X GET -u <yourKey>: "http://127.0.0.1:8080/api/greet?username=user"
```

## Logs
The service streams its log messages to the console, this allows for easier integration with third-party log aggregation tools. For additional information on integrating API Builder logging with a third-party log aggregation tool, refer to [Log aggregation in API Builder](https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/export_api_builder_logs_into_a_data_store.html).

### Logs format
The API Builder logs use different logging utility.
At runtime your service will log all messages to the console.
The Request/Response Logs have a format:
```
<timestamp> [requiest-id: <requestid>] (Response|Request) <json data>
```

### Set __logLevel__
Edit `./conf/default.js` from the root of your project.
Set the log level by changing `logLevel` to one of the accepted values: __debug__, __error__, __fatal__, __info__, __trace__, or __warn__.
```js
// logging configuration
	logLevel: 'debug', // Log level of the main logger.
```

# Dockerise API Builder Service

We already know that generation of API Builder service is very easy with the help of the API Builder CLI tool.
However, one might want to run it within Docker container so it can later be weaved as part of a more complex solution. This is a step by step tutorial on how to run API Builder service within a Docker container.

## Prerequisites

Here are the technical requirements for being able to execute the steps suggested in this guide. You need to have the following installed:
* Docker - The installation of Docker is via dedicated installer for specific operation system. [Read the official guide for how to install Docker](https://docs.docker.com/install/).
* API Builder CLI - It is a node module published in [npm public repository](https://www.npmjs.com/package/@axway/api-builder). Basically, it is a one line command as follows:


```npm install -g @axway/api-builder```

[You can read the official documentation for more information.](https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/api_builder_getting_started_guide.html)

## Step 1: Scaffold and Run API Builder Service

If you already have a generated service you can go to Step 2.
Still for the completeness of this tutorial we are showing you how to do that:

```
api-builder init <YOUR_APP_NAME>
cd <YOUR_APP_NAME>
npm install --no-optional
npm start
```

Once your service is running, you can point your browser at http://localhost:8080/console to access the API Builder user interface (UI) console.
[You can read the official documentation of how to further use the API Builder Console.](https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/api_builder_getting_started_guide.html)

Excellent! Now you tested out how your service is running directly on your machine.
Now please stop the service with using Ctrl + C in your terminal where the service is running and go to the next step.

**Variable placeholders used in this section**

Variable Placeholder | Description
-------------- | -------------
<SERVICE_NAME> | This is the service name of your choice e.g. "myservice" that the API Builder CLI is using. It will create folder with the same name and will place all the generated files in that folder.


## Step 2: Prepare to run your service within Docker
In Step 1 we showed the classic way of running the service locally. Let's see how to run the service within a container. When running your service in a container it is often desirable to have the configuration (or parts of it) set at runtime rather than relying on static values. To achieve this one could update the configuration files to read from the environment. In Node.js world this is done with reading variables from process.env e.g. process.env.<VARIABLE_NAME>.

### Configuration Files Types

The configuration files that could contain environment variables are placed in <SERVICE_FOLDER>/conf folder.
All the variables in your configuration files that support to be taken from "process.env.<VARIABLE_NAME>" could be provided when running the Docker container. Bellow are presented different configuration files, their location, and their example content. Note that this tutorial does not require connector installation. The connector configuration is just shown to inform you that you will have additional set of environment variables that must be provided when dockerising API Builder service with connectors.

Configuration File | Location | Example
-------------- | ------------- | -------------
Service Configuration | `<SERVICE_FOLDER>/conf/default.js` | ```module.exports = { apiKey: process.env.APIKEY };```
Connector Configuration | Example with MySQL. The file will be named: <SERVICE_FOLDER>/conf/mysql.default.js | ```module.exports = {connectors: { mysql: { connector: '@axway/api-builder-plugin-dc-mysql' connectionPooling: true, connectionLimit: 10, host: process,env.MYSQL_HOST || 'localhost', port: 3306, database: 'mysql', user: process.env.MYSQL_USER, password: process.env.MYSQL_PASSWORD, generateModelsFromSchema: true, modelAutogen: false}}};```

Excellent! Now you defined which variables could be provided at runtime while starting your Docker container.
Let's see next how to prepare your Docker image and run Docker container out of it.

## Step 3: Create Docker image for your service - meet the Dockerfile

API Builder Services come with a Dockerfile. When we generate a service with API Builder CLI we get a service that has Dockerfile in its root.
This file is just one possible Dockerfile that can be used for Docker image creation. One can perfectly create another Dockerfile tailored for specific needs. The sample Dockerfile content is:

```
# This line defines which node.js Docker image to leverage
# Available versions are described at https://hub.docker.com/_/node/
FROM node:8-alpine

# Sets the default working directory to /app which is where we've copied the service files to.
WORKDIR /app

# TODO: for security purposes, you should update this Dockerfile to specify your own target user/group
# -S stands for '--system'
# -G stands for group
# -R changes the ownership rights of a file recursively
RUN addgroup -S axway-group && adduser -S axway-user -G axway-group && \
	chown -R axway-user:axway-group /app

# Set non-root user
USER axway-user

# Denotes to copy all files in the service to 'app' folder in the container
COPY . /app

# Install service dependencies relevant for production builds skipping all development dependencies.
RUN npm install --production --no-optional

# Starts the service
CMD ["node", "."]
```

> In case that you want to specify your own user and password, you could use `ENV` (Environment Variables) in tha APP Dockerfile, please find an example below:

```
# Set specific user & password using Env Vars
ENV NONROOT_USER="<user>"

RUN adduser $NONROOT_USER &&  \
    echo $NONROOT_USER":<password>" | chpasswd

USER $NONROOT_USER
```

Docker image can be created with:

```docker build -t <IMAGE_NAME> ./```

Now we are able to run as much containers as we want out of this image. To check the presence of the newly created image one can run:

```docker image ls```

Docker image with name <IMAGE_NAME> should be visible in the list with images.
Usually those images are published in Docker repository but how to do this is out of scope for this tutorial.
[See `docker push` documentation](https://docs.docker.com/engine/reference/commandline/push/)for information on how to push your image to a docker registry.

**Variable placeholders used in this section**

Variable Placeholder | Description
-------------- | -------------
<IMAGE_NAME> | This is the docker image name of your choice e.g. "myimage". Docker is using this name to create Docker image for the service with it. After creation of the image using 'docker image ls' should show an image with such name in the list with all available images on your machine.

## Step 4: Run the Docker Container and Access the Service
Things to observe when running your service within Docker container:

* **Set Environment Variables:** Make sure that you provide values on all the environment variables that have no default values as well as on those you have to change the default values. Make sure you provide values not only for service configuration but also for all the connectors you have installed in your service.
* **Production Deployment:** As the image is built in production mode, the service is no longer editable. The API Builder console will not be available.
* **Run Multiple Services:** Having containerized your service it is now possible, and generally desirable, to run multiple instances of your service. This allows you to address load balancing, scalablity, and the resilience of your service.

Next we will show two approaches of running the docker container. Pick up the first one if you don't want to map ports on you host machine and the second one if you want to access the service like if it is working on your localhost.

#### Approach 1: Running Docker Container - Plain
Using the image created on Step 3 you can now run a Docker container. Running Docker container will execute the CMD specified in the Dockefile as a result of which your service will be started.
```
# Run the container exposing the port 8080 to your host so the service is accessible on that port
docker run --name <CONTAINER_NAME> <IMAGE_NAME>
```

#### How to provide environment variables for Docker container?

In case you want to run the service within Docker container providing runtime values for those properties that are configured to be read from environment (see Step 2) one could do as follows:

```
# Run the container setting the port where the service will run within the container to 8081
docker run --name <CONTAINER_NAME> -e PORT=8081 <IMAGE_NAME>
```

#### Other useful commands
```
# If you want to see that your container is running
# You should see <CONTAINER_NAME> in the list of started containers
docker container ls

# Once ran the running container could be stopped with
docker container stop <CONTAINER_NAME>

# ... and started again with
docker container start <CONTAINER_NAME>
```

#### How to access the service?

First of all you need to check the IP Address that Docker is using to run your container:
```docker inspect <CONTAINER_NAME> | grep '"IPAddress"' | head -n 1```

Now check the value of your apikey property in `<SERVICE_FOLDER>/conf/default.js.`

Using that apikey you could execute:

```
curl -X GET -u <API_KEY>: "http://<IP_ADDRESS>:<PORT>/api/greet?username=APIBuilder"
```

**Variable placeholders used in this section**

Variable Placeholder | Description
-------------- | -------------
<IMAGE_NAME> | This is the name of the docker image name specified by you on the previous step.
<CONTAINER_NAME> | This is the docker container name of your choice e.g. "mycontainer". Docker will use this name to run container based on the Docker image specified with <IMAGE_NAME>.
<API_KEY> | Must be replaced with the value of the apiKey property specified in `<SERVICE_FOLDER>/conf/default.js`
< PORT > | 8080 if not overiden
<IP_ADDRESS> | Should be replaced with the value returned by the command that grep the IP Address shown above



#### Approach 2: Running Docker Container - Detached Mode with Port Mapping
Using the image we can run a Docker container with:
```
# Run the container exposing the port 8080 to your host so the service is accessible on that port
docker run --name <CONTAINER_NAME> -p 8080:8080 -d <IMAGE_NAME>

# Now access with
curl -X GET -u <API_KEY>: "http://localhost:8080/api/greet?username=APIBuilder"
```

Alternatively with overriding the port we can do
```
# Note that if you provide another port with -e option you must map that provided port value to the desired port number of the host machine
# The example bellow run the service within container on 8081 and map that port to 8082 of the host machine
docker run --name <CONTAINER_NAME> -e PORT=8081 -p 8082:8081 -d <IMAGE_NAME>


# Now access with
curl -X GET -u <API_KEY>: "http://localhost:8082/api/greet?username=APIBuilder"
```

**Docker options explained**

Variable Placeholder | Description
-------------- | -------------
-d | Run container in background and print container ID
-p | The -p option allows you to map ports on your host machine to ports inside the container e.g. <host_port>:<container_port>

**Variable placeholders used in this section**

Variable Placeholder | Description
-------------- | -------------
<IMAGE_NAME> | This is the name of the docker image name specified by you on the previous step.
<CONTAINER_NAME> | This is the docker container name of your choice e.g. "mycontainer". Docker will use this name to run container based on the Docker image specified with <IMAGE_NAME>.
<API_KEY> | Must be replaced with the value of the apiKey property specified in `<SERVICE_FOLDER>/conf/default.js`

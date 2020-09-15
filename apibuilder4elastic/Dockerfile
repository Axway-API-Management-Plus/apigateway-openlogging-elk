# See the README.md for usage and configuration info

# This line defines which node.js Docker image to leverage
# Available versions are described at https://hub.docker.com/_/node/
FROM node:12-alpine

# Sets the default working directory to /app which is where we copy the service files to.
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
COPY --chown=axway-user:axway-group . /app

# Install service dependencies relevant for production builds skipping all development dependencies.
RUN npm install --production --no-optional

# check every 5s to ensure this service is healthy
HEALTHCHECK --interval=5s --start-period=10s --timeout=5s --retries=5 CMD node healthcheck.js

# Starts the service
CMD ["node", "."]

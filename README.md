# Message Distributor Service
Takes in an input via REST API in the form of a message and passes it to the desired destination. \
\
GET is used on 'hostname:port/' to get the help information and basic template. \
POST is sent to the 'hostname:port/' to send the message.

## Flags
--server   - starts the distributor server. \
--getHelp  - retrieves example message used for sending. \
--sendTest - sends a test message to distributor for processing.

## Destinations Supported
None, message sent to distributor but is not forwarded from there. \
Discord, requires DISCORD_TOKEN to be set.

## Client Examples
Get the message format from distributor: rest-client/getHelp.ts \
Send a message to the distributor: rest-client/sendMessage.ts

## Message Format
{ \
&nbsp;&nbsp;&nbsp;&nbsp;source: string; \
&nbsp;&nbsp;&nbsp;&nbsp;sourceId: string; \
&nbsp;&nbsp;&nbsp;&nbsp;dest: string; \
&nbsp;&nbsp;&nbsp;&nbsp;destId: string; \
&nbsp;&nbsp;&nbsp;&nbsp;status: string; \
&nbsp;&nbsp;&nbsp;&nbsp;value: string; \
&nbsp;&nbsp;&nbsp;&nbsp;created: string; \
}

## Configuration
DEFAULT_REST_PORT is '5644'. \
DISCORD_TOKEN needs to be set to use that feature.

## Dockerize Application
Keep in mind the default port is 5644, if you wish to use a different one then specify that in the Dockerfile and when you go to start the container. \
\
Build the application: \
docker build . -t username/mdsrv \
\
Run the docker container: \
docker run -dp 5644:5644 --name mdsrv username/mdsrv:latest \
\
Specify an '.env' file to pass environment variables: \
docker run --env-file ./.env -dp 5644:5644 --name mdsrv username/mdsrv:latest

## Create Systemd Service
podman generate systemd --name -f mdsrv \
mv container-mdsrv.service /etc/systemd/user/. \
systemctl daemon-reload \
systemctl --user start container-mdsrv.service

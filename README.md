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
Discord, requires MDSRV_DISCORD_TOKEN to be set.

## Client Examples
Functional client project: [mdsrv-client](https://github.com/Ohkthx/mdsrv-client). Also available via npm. \
\
Basic operations:
Get the message format from distributor: [rest-client/getHelp.ts](https://github.com/Ohkthx/mdsrv/blob/main/src/rest-client/getHelp.ts) \
Send a message to the distributor: [rest-client/sendMessage.ts](https://github.com/Ohkthx/mdsrv/blob/main/src/rest-client/sendMessage.ts)

## Message Format
```json
{
	source: string;
	sourceId: string;
	dest: string;
	destId: string;
	status: string;
	value: string;
	created: string;
}
```

## Configuration
The following can be changed in a '.env' file located in the root directory of the project or passed as environment variables to modify the configuration of the service.
```bash
MDSRV_DEBUG=false
MDSRV_HOSTNAME=localhost
MDSRV_PORT=5644
MDSRV_DISCORD_TOKEN=

```

## Dockerize Application
Keep in mind the default port is 5644, if you wish to use a different one then specify that in the Dockerfile and when you go to start the container. \
\
Build the application:
```bash
docker build . -t ohkthx/mdsrv
```
Run the docker container:
```bash
docker run -dp 5644:5644 --name mdsrv ohkthx/mdsrv:latest
```
Specify an '.env' file to pass environment variables:
```bash
docker run --env-file ./.env -dp 5644:5644 --name mdsrv ohkthx/mdsrv:latest
```

## Create Systemd Service
```bash
podman generate systemd --name -f mdsrv
mv container-mdsrv.service /etc/systemd/user/.
systemctl daemon-reload
systemctl --user start container-mdsrv.service
```

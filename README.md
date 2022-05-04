# Message Distributor Service
Takes in an input via REST API in the form of a message and passes it to the desired destination. \

GET is used on 'hostname:port/' to get the help information and basic template. \
POST is sent to the 'hostname:port/' to send the message. \

## Flags
--server   - starts the distributor server. \
--getHelp  - retrieves example message used for sending. \
--sendTest - sends a test message to distributor for processing. \

## Destinations Supported
None, message sent to distributor but is not forwarded from there. \
Discord, requires DISCORD_TOKEN to be set. \

## Message Format
{ \
  source: string; \
  sourceId: string; \
  dest: string; \
  destId: string; \
  status: string; \
  value: string; \
  created: string; \
} \

## Configuration
DEFAULT_REST_PORT is '5644'. \
DISCORD_TOKEN needs to be set to use that feature. \

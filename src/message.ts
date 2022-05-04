export enum Destination {
  DISCORD = 'discord',
}

export enum Status {
  INFO = 'info',
  LOG = 'log',
  DEBUG = 'debug',
  WARN = 'warn',
  ERROR = 'error',
}

export interface Message {
  source: string;
  sourceId: string;
  dest: string;
  destId: string;
  status: string;
  value: string;
  created: string;
}

/**
 * Create a new message.
 *
 * @param {string} source - Source of the message
 * @param {string} sourceId - More precise identifier for the source
 * @param {Destination} dest - Destination or service to send to
 * @param {string} destId - More precise destination identifier
 * @param {Status} status - 'error', 'info', etc.
 * @param {string} value - Message data/text
 * @param {string} created - Optional: Date timestamp in ISO format
 */
export function newMessage(
  source: string,
  sourceId: string,
  dest: Destination,
  destId: string,
  status: Status,
  value: string,
  created?: string,
): Message {
  if (!created || created === '') {
    created = new Date(Date.now()).toISOString();
  }

  return {
    source: source,
    sourceId: sourceId,
    dest: dest,
    destId: destId,
    status: status,
    value: value,
    created: created,
  };
}

export const helpMessage: Message = {
  source: 'originating source: application name, hostname, etc.',
  sourceId: 'more specific identifier for the source',
  dest: 'destination of the message',
  destId: 'more specific identifier for the destination',
  status: "'error', 'info', etc.",
  value: 'message to be sent',
  created: 'timestamp in ISO',
};

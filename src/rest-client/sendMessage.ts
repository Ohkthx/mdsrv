import axios, {AxiosError} from 'axios';
import {Destination, Message, Status} from '../message';
import {config as envLoad} from 'dotenv';
import {DEFAULT_REST_HOSTNAME, DEFAULT_REST_PORT} from '../rest';

// Load the environment variables into process.env
envLoad();

// Get the HOSTNAME and PORT to create the URI.
const HOSTNAME = process.env.DEFAULT_REST_HOSTNAME ?? DEFAULT_REST_HOSTNAME;
let PORT = parseInt(process.env.DEFAULT_REST_PORT ?? '');
if (isNaN(PORT)) {
  PORT = DEFAULT_REST_PORT;
  console.error(
    `'DEFAULT_REST_PORT' is not set in '.env' file, using port '${PORT}'`,
  );
}

// Set the target URI.
const ENV_REST_URI: string = `http://${HOSTNAME}:${PORT}/`;

/**
 * Send a message to the distributor.
 *
 * @param {Message} message - Message to be distributed.
 */
export async function sendMessage(message: Message) {
  try {
    const response = await axios.post<Message>(ENV_REST_URI, message);
    return response.data;
  } catch (error) {
    if ((error as AxiosError)?.response?.status === 404) {
      throw new Error(`invalid uri '${ENV_REST_URI}', received 404.`);
    }

    throw new Error(`could not access '${ENV_REST_URI}'`);
  }
}

export const TEST_MESSAGE: Message = {
  source: 'local',
  sourceId: 'test',
  dest: Destination.NONE,
  destId: 'none',
  status: Status.DEBUG,
  value: 'This is a test message.',
  created: new Date(Date.now()).toISOString(),
};

import {delay} from '.';
import {config as envLoad} from 'dotenv';
import {DEFAULT_REST_PORT, HTTPServer} from './rest';
import {getHelp} from './rest-client';
import {sendMessage, TEST_MESSAGE} from './rest-client/sendMessage';

// Load the environment variables into process.env
envLoad();
let ENV_REST_PORT = parseInt(process.env.DEFAULT_REST_PORT ?? '');
if (isNaN(ENV_REST_PORT)) {
  ENV_REST_PORT = DEFAULT_REST_PORT;
  console.error(
    `'DEFAULT_REST_PORT' is not set in '.env' file, using port '${ENV_REST_PORT}'`,
  );
}

let sigintFired: number = 0; // Prevents spam messages from occurring.
process.on('SIGINT', async () => {
  if (sigintFired > 0) return;
  sigintFired++;

  console.warn('\n\nCaught interrupt signal');

  // Kill the HTTP server.
  HTTPServer.stop();
  if (HTTPServer.isActive) {
    console.info('[REST Server] waiting to close.');
    while (HTTPServer.isActive) await delay(250);
  }
  console.info('[REST Server] disabled.');

  process.exit();
});

(async () => {
  if (process.argv.find((a) => a === '--server')) {
    // Start the REST server.
    await HTTPServer.start(ENV_REST_PORT);
  } else if (process.argv.find((a) => a === '--getHelp')) {
    // Get the help message as a template.
    const helpMessage = await getHelp();
    console.log(JSON.stringify(helpMessage, null, 2));
    process.exit();
  } else if (process.argv.find((a) => a === '--sendTest')) {
    // Send a test message to make sure the server is working.
    const res = await sendMessage(TEST_MESSAGE);
    console.log(`Response:\n${JSON.stringify(res, null, 2)}`);
    process.exit();
  } else {
    // No flags passed, just exit.
    process.exit();
  }
})().catch((err) => {
  let errMsg = 'unknown error';
  if (err?.response) errMsg = err.response.data.message;
  else if (err instanceof Error) errMsg = err.message;
  else errMsg = err;

  console.error(`\n\nexiting application: ${errMsg}`);
});

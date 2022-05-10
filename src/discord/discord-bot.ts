import {Client, Intents, MessageEmbed, TextChannel} from 'discord.js';
import {config as envLoad} from 'dotenv';
import {delay} from '..';

// Load the environment variables into process.env
envLoad();
const DISCORD_TOKEN: string = process.env.MDSRV_DISCORD_TOKEN ?? '';

const isArray = function (a: any) {
  return !!a && a.constructor === Array;
};

export class DiscordBot {
  private static client: Client<true> | undefined;
  private static ready: boolean = false;
  private static timeoutSet: boolean = false;
  private static lastMessage: number = Date.now();

  private static async initDiscordBot() {
    // Do not continue to intialize if we already have.
    if (DiscordBot.client && DiscordBot.ready) return;

    // Check if the token is valid.
    if (DISCORD_TOKEN === '') {
      throw new Error(
        `'MDSRV_DISCORD_TOKEN' is not set in '.env' file, please set it before using this feature.`,
      );
    }

    // Set the client with a limited scope.
    const client = new Client({intents: [Intents.FLAGS.DIRECT_MESSAGES]});

    try {
      client.once('ready', (client: Client<true>) => {
        DiscordBot.client = client;
        DiscordBot.ready = true;
      });

      // Login and wait for the bot to be ready.
      client.login(DISCORD_TOKEN);
      while (!DiscordBot.ready) {
        await delay(250);
      }
    } catch (error: any) {
      throw new Error(
        `unable to establish discord connection, check the discord token`,
      );
    }
  }

  private static async timeout() {
    if (!DiscordBot.timeoutSet) return;

    if (Date.now() - DiscordBot.lastMessage >= 30000) {
      DiscordBot.client?.destroy();
      DiscordBot.client = undefined;
      DiscordBot.ready = false;
      DiscordBot.timeoutSet = false;
    } else {
      setTimeout(DiscordBot.timeout, 60000);
    }
  }

  /**
   * Send a notification in the form of an embed to discord.
   *
   * @param {string} discordId - id of the discord channel
   * @param {MessageEmbed | MessageEmbed[]} embed - Embed to send
   */
  public static async sendNotification(
    discordId: string,
    embed: MessageEmbed | MessageEmbed[],
  ) {
    await DiscordBot.initDiscordBot();

    // Cannot send notification if the client is unassigned.
    const client = DiscordBot.client?.user;
    if (!client) {
      throw new Error('could not obtain discord bots user account.');
    }

    // Attempt to find the receiving channel.
    const ch = await DiscordBot.client?.channels.fetch(discordId);
    if (!ch) {
      throw new Error(
        `could not resolve discord channel by id, '${discordId}'.`,
      );
    }

    // Update our timer.
    DiscordBot.lastMessage = Date.now();
    if (!DiscordBot.timeoutSet) {
      setTimeout(DiscordBot.timeout, 60000);
      DiscordBot.timeoutSet = true;
    }

    try {
      const channel = <TextChannel>ch;
      if (isArray(embed)) {
        // Send all embeds if it is an array.
        return channel.send({embeds: <MessageEmbed[]>embed});
      } else {
        // Send single embed.
        return channel.send({embeds: [<MessageEmbed>embed]});
      }
    } catch (err) {
      throw new Error(
        'could not send message to channel, make sure it is the correct channel.',
      );
    }
  }
}

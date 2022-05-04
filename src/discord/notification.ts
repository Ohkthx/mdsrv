import {ColorResolvable, MessageEmbed} from 'discord.js';
import {DiscordColor} from '.';
import {Message, Status} from '../message';

// A blank space.
const BLANK: string = '\u200B';

/**
 * Creates a notification in the form of an embed.
 *
 * @param {Message} message - Message to convert to an embed
 * @returns {MessageEmbed} Newly created embed
 */
export function newNotification(message: Message): MessageEmbed {
  let color: string = DiscordColor.NEUTRAL;
  switch (message.status) {
    case Status.WARN:
    case Status.ERROR:
      color = DiscordColor.RED;
      break;
    case Status.INFO:
    case Status.LOG:
      color = DiscordColor.GREEN;
  }

  return new MessageEmbed()
    .setColor(<ColorResolvable>color)
    .addFields(
      {
        name: 'source',
        value: message.source,
        inline: true,
      },
      {
        name: 'id',
        value: message.sourceId,
        inline: true,
      },
      {
        name: 'status',
        value: message.status,
        inline: true,
      },
      {
        name: BLANK,
        value: message.value,
        inline: false,
      },
    )
    .setTimestamp(new Date(message.created));
}

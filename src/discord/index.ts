import {CommandInteraction} from 'discord.js';

export const separator = '-==- -==- -==- -==- -==- -==- -==- -==-';

export const redmark: string = '<:redmark:887734442406314094>';
export const grnmark: string = '<:greenmark:887731874523402281>';

export enum DiscordColor {
  GREEN = '#77b255',
  RED = '#dd2e44',
  NEUTRAL = '',
}

// Stores the last command performed by the source.
export const LastCommand: Map<string, CommandInteraction> = new Map();

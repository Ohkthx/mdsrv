import {Request, Response, NextFunction} from 'express';
import {DiscordBot} from '../../discord/discord-bot';
import {newNotification} from '../../discord/notification';
import {Destination, helpMessage, Message} from '../../message';
import {newResponse} from '../response';

async function getHelp(_req: Request, res: Response, _: NextFunction) {
  return res.status(200).json(helpMessage);
}

async function postMessage(req: Request, res: Response, _: NextFunction) {
  let response = newResponse(501, 'not implemented');
  const msg = <Message>req.body;
  try {
    switch (msg.dest) {
      case Destination.NONE:
        // Message will arrive locally but not be forwarded.
        response = newResponse(200, 'message received');
        break;

      case Destination.DISCORD:
        // Send the message to a discord servers channel.
        const embed = newNotification(req.body);
        await DiscordBot.sendNotification(msg.destId, embed);
        response = newResponse(200, 'message sent');
        break;

      default:
        response = newResponse(400, 'invalid destination service');
    }
  } catch (err: any) {
    let errMsg = 'unknown error';
    if (err.response) errMsg = err.response.data.message;
    else if (err instanceof Error) errMsg = err.message;
    else errMsg = err;

    console.error(`[error] [source: ${msg.source}-${msg.sourceId}] ${errMsg}`);
    response = newResponse(400, 'invalid request');
  }

  return res.status(response.code).json(response);
}

module.exports = {getHelp, postMessage};

import express from 'express';

// Create message router, import message controller.
const msgRouter = express.Router();
const msgController = require('../controllers/message-controller');

// Message router handling data.
msgRouter.get('/', msgController.getHelp);
msgRouter.post('/', msgController.postMessage);

export = msgRouter;

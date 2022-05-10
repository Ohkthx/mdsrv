import http from 'http';
import express, {Express, NextFunction, Request, Response} from 'express';
import msgRouter from './routes/message';
import {DEFAULT_MDSRV_PORT} from '.';

const router: Express = express();

router.use(express.urlencoded({extended: false}));
router.use(express.json());

// REST API headers.
router.use((req: Request, res: Response, next: NextFunction) => {
  // CORS policy
  res.header('Access-Control-Allow-Origin', '*');

  // CORS headers
  res.header(
    'Access-Control-Allow-Headers',
    'origin, X-Requested-With,Content-Type,Accept, Authorization',
  );

  // CORS method headers
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
    return res.status(200).json({});
  }
  next();
});

// Catch invalid input passed by user.
router.use(
  (err: ErrorEvent, _req: Request, res: Response, next: NextFunction) => {
    if (err.type !== 'entity.parse.failed') return next(err);
    return res.status(400).json({message: 'bad request'});
  },
);

// Set the routes
router.use('/', msgRouter);

// Handle errors with 404.
router.use((_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).json({
    message: 'not found',
  });
});

export class HTTPServer {
  static isActive: boolean = false;
  private static httpServer: http.Server = http.createServer(router);

  /**
   * Starts the rest server.
   *
   * @param {number} port - Port number to start the server.
   */
  static async start(port: number) {
    if (port < 0 || port > 65535) {
      console.warn(
        `[REST Server] invalid port '${port}' provided, using '${DEFAULT_MDSRV_PORT}'`,
      );
      port = DEFAULT_MDSRV_PORT;
    }
    HTTPServer.httpServer.listen(port, () => {
      HTTPServer.isActive = true;
      console.info('[REST Server] enabled.');
    });
  }

  /**
   * Stops the server.
   */
  static stop() {
    if (!HTTPServer.httpServer) return;

    HTTPServer.httpServer.close(() => {
      HTTPServer.isActive = false;
    });
  }
}

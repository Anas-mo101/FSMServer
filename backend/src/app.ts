import express, { Response, Request, NextFunction } from 'express';
import cors from "cors";
import "express-async-errors";
import routes from './routes';
import cookieParser from "cookie-parser";
import AppError from './errors/AppError';

import "./database";
import { initIO } from './services/WSServices/socket';

const app = express();
const port = 3000;

app.use(cookieParser());

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3030" }));

app.use(routes);

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.log(err);
  return res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

initIO(server);
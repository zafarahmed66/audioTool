import express, { Express, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from "morgan";

import errorMiddleware from './middlewares/error.middleware';
import enhanceRoute from './routes/enhance.route';
import logger from './utils/logger';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const morganFormat = ":method :url :status :response-time ms";

// Middleware
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/v1', enhanceRoute);

// Test route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Express + TypeScript Server' });
});

app.get("/processed/:filename", (req, res) => {
  const filePath = path.join(__dirname, "processed", req.params.filename);
  res.download(filePath); // Forces file download
});

app.use(errorMiddleware);

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

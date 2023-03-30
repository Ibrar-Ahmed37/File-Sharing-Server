import bodyParser from "body-parser";
import express from "express";
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { filesRouter } from "./routes/files.js";
import { cleanupFiles } from "./utils/cleanup.js";

const port = process.env.PORT || 3000;
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: process.env.REQUEST_LIMIT // Limit each IP to 100 requests per day
});

dotenv.config();
const app = express();

app.use(limiter);
app.use(bodyParser.json());
app.use("/files", filesRouter);

// * Error handler middlware that catches request failure
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong! Please try again');
});

setInterval(cleanupFiles, process.env.CLEANUP_INTERVAL);

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);

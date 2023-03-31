import bodyParser from "body-parser";
import express from "express";
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { filesRouter } from "./routes/files.js";
import { cleanupFiles } from "./utils/cleanup.js";

const port = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 86400, // 24 hours
  max: 100 // Limit each IP to 100 requests per day
});

dotenv.config();
const app = express();

// * MiddleWare for limiting the api requests
app.use(limiter);

app.use(bodyParser.json());

// * Files Route defined in the middleware
app.use("/files", filesRouter);

// * Error handler middlware that catches request failure
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong! Please try again');
});

//clean up the files that are inactive till 30 days and check after Every day  
setInterval(cleanupFiles, 86400);


app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);

export  { app };
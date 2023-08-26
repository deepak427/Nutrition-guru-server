import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from 'body-parser';

import llamaRoutes from './routes/llama.js'

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Spam-Jam.");
});

app.use('/llama', llamaRoutes);

const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}.`);
});

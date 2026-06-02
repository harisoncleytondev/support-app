import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();

import routes from "./routes/index.routes.js";

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"] }));
app.use(express.json());
app.use(routes);

export default app;

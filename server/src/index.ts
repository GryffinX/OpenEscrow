import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import escrowsRouter from "./routes/escrows.js";
import { startEscrowListener } from "./indexer/escrowListener.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/escrows", escrowsRouter);

startEscrowListener();

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});

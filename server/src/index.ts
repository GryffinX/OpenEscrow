import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/health", (_, res) => {
  res.send("OK");
});

app.listen(4000, () => {
  console.log("Backend running on port 4000");
});

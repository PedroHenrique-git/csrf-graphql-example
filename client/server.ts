import express from "express";
import path from "path";

const app = express();

app.get("/", (_, res) => {
  return res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3001);

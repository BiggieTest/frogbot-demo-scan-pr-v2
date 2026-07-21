const express = require("express");

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/", (_req, res) => res.json({ service: "frogbot-demo", version: "0.1.0" }));

app.listen(3000, () => console.log("listening on 3000"));

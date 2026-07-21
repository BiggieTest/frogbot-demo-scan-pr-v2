const express = require("express");
const { exec } = require("child_process");
const _ = require("lodash");
const handlebars = require("handlebars");

const { verifyToken, API_KEY } = require("./auth");

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/", (_req, res) => res.json({ service: "frogbot-demo", version: "0.2.0" }));

app.get("/exec", (req, res) => {
  // SAST: command injection
  exec("ls " + req.query.cmd, (_err, stdout) => res.send(stdout));
});

app.post("/eval", (req, res) => {
  // SAST: code injection
  res.send(String(eval(req.body.expr)));
});

app.post("/merge", (req, res) => {
  // SAST + vulnerable lodash: prototype pollution
  const target = {};
  _.merge(target, req.body);
  res.json(target);
});

app.get("/render", (req, res) => {
  // SAST + vulnerable handlebars: template injection
  const tpl = handlebars.compile(req.query.tpl || "hi {{name}}");
  res.send(tpl({ name: "world" }));
});

app.get("/token", (req, res) => {
  if (!verifyToken(req.query.t)) return res.status(401).send("nope");
  res.send("api key: " + API_KEY.slice(0, 4) + "***");
});

app.listen(3000, () => console.log("listening on 3000"));

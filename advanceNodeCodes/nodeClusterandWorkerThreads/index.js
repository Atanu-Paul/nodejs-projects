"use strict";

import crypto from "crypto";
import express from "express";
import morgan from "morgan";

const app = express();
const port = 3000;

app.use(morgan("dev"));

app.get("/", (req, res) => {
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    res.send(`HELLO`);
  });
});

app.get("/fast", (req, res) => {
  res.send(`NEW TEXTTTTTTTTTT!!!`);
});

app.listen(port, () => {
  console.log(`Express Server listing on Port ${port}`);
});

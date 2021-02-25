"use strict";
process.env.UV_THREADPOOL_SIZE = 1;

import cluster from "cluster";
import crypto from "crypto";
import express from "express";
import morgan from "morgan";

//setting up the node.js cluster
//Flow: so when we run npm start/node index.js node boots up the index file and checks
// if the file is executed in master mode which will be yes because everytime the file boots up first time
//it is in master/parent mode so if condition is true we enter the if block.
if (cluster.isMaster) {
  //inside this block cluster.fork() will be executed which will the cause the index.js file to boot up
  //AGAIN but this time in worker/child mode thus creating a new node.js cluster instance of our server.
  cluster.fork(); // one cluster.fork()means one child
  cluster.fork();
} else {
  //so now when index.js file is booted up for the second time the if condition will be false
  // and we will enter this block for each new cluster instance and from here on each new cluster will work just
  //as a normal node express server works.
  const app = express();
  const port = 3000;
  //   const start = Date.now();

  app.use(morgan("dev"));

  //function that will delibertly take a lot of CPU processing power to execute this is done how we can solve this problem using clustring
  //   const doWork = (duration) => {
  //     const start = Date.now();
  //     while (Date.now() - start < duration) {}
  //   };

  app.get("/", (req, res) => {
    // doWork(5000);
    // this will execute in the event loop so while this is executing our express server can not do anything else since the event loop is blocked.
    //so when 2 or more call are made to the same route the single thread of node will execute each one by one not concerrently/simuntaniously so basically our server will be
    //slow to respond. To help manage this issue we use clusters where a cluster manager will be incharge of multiple instance of the same node.js single thread, and each new incoimg
    //request will be handled by a new instance of a node.js single thread and the einter operations will be overlooked by the cluster manager.

    //using the pbkdf2 function instead of the dummy doWork() function
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
}

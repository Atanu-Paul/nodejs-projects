//this program is to check how long node.js event loop takes to complete the operating systems task/process it has stored/pending.
//we will just make a http request to fetch google homepage and calculate the amount on time it toke to complete it.

"use strict";

const https = require("https");

const start = Date.now();

//res here is not the same kind of response object that we get when we use the fetch/axios.get method
//this 'res' object has a lot ot event emmitiers
function makeRequest() {
  https
    .request("https://www.google.com", (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        console.log(Date.now() - start);
      });
    })
    .end();
}

makeRequest();
makeRequest();
makeRequest();
makeRequest();
makeRequest();
makeRequest();
makeRequest();

/**
 * when we run this code we see all the http request gets completed more or less at the same time because
 * nither node.js or the libuv c++ libary inside node.js has any particular function to handle these calls
 * so libuv actually delegated this low level task the OS of the computer as to how to handle it.
 */

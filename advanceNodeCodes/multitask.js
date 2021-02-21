"use strict";
process.env.UV_THREADPOOL_SIZE = 5;

const crypto = require("crypto");
const https = require("https");
const fs = require("fs");

const start = Date.now();

function makeRequest() {
  https
    .request("https://www.google.com", (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        console.log("HTTPS", Date.now() - start);
      });
    })
    .end();
}

function makeHash() {
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    console.log("HASH:", Date.now() - start);
  });
}

makeRequest();

fs.readFile("multitask.js", "utf8", () => {
  console.log("FS:", Date.now() - start);
});

makeHash();
makeHash();
makeHash();
makeHash();

/**
 * the HTTPS is printed first because it dose not utilizes the node.js thread pool at all and completely skips that
 * goes to the OS and gets exectued first. Where as the FS and the HASH calls needs the thread pool to execute.
 * 
 * the FS and the HASH calls are all allocated to the thread pool, so 1 FS call and 4 HASH call are allocated to 4 threads in the pool
 * thread 1 takes FS while thread 2-4 takes HASH calls from 1-3 and the 4th HASH call is left unattended as there is no more thread left.
 * now the thread with the FS call starts and encounters a slight delay in execution because it takes some time 
 * for the fs node module to read the file from the computers hard drive, so what thread 1 dose is leaves the fs call and lets it run
 * and picks up the remaining 4th HASH call and starts executing the hash meanwhile thread 2 or anyother thread completes its work
 * prints the result and looks for anyother pending task and finds the now unattended halfway done FS call,
 * so it picks it up completes it and prints the result. Hence in the console we see HTTPS first, a HASH print in second, FS print in third,
 * followed by the remaing three HASH calls
 * i.e
 *  HTTPS 427
    HASH: 2428
    FS: 2446
    HASH: 2463
    HASH: 2488
    HASH: 2575
    
    node only has 4 threads in the thread pool by default so if we increase the size of the pool by the 
    process.env.UV_THREADPOOL_SIZE = 5; then an whole thread is allocated to the FS call which will be executed first 
    followed by the HTTPS call and the 4 HASH calls i.e

    FS: 55
    HTTPS 595
    HASH: 2163
    HASH: 2210
    HASH: 2227
    HASH: 2264
 *  remember HTTPS call is not dependent on the thread pool so it will execute on its own time depending on your internet strength
 *  where as the FS and HASH calls will fight for the resources of the thread pool to get executed.
 * 
 */

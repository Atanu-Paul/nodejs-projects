// a small program to check if node.js is really single threaded or not.
"use strict";
process.env.UV_THREADPOOL_SIZE = 5;

const crypto = require("crypto");

const start = Date.now();

crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log("1:", Date.now() - start);
});

crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log("2:", Date.now() - start);
});

crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log("3:", Date.now() - start);
});

crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log("4:", Date.now() - start);
});

crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
  console.log("5:", Date.now() - start);
});

/**
 * in this code we can see that a fucntion line pbkdf2 which is a hashing function inside the libuv c++ libary
 * is a resource intensive fucntion so the node.js event loops single thread handes this task over to the thread pool
 * of OS which is managed by the libuv libary. In the thread pool the OS makes desicions as to which task is assigned
 * to which thread and which thread is assigned to which core of the CPU. By declaring the number of threads we
 * want to be used by the OS at the top of our code file we can how the function calls are assigned to the threads
 * and hence make the execution of the program faster or slower.
 */

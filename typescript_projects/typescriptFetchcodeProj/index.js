"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var url = "https://jsonplaceholder.typicode.com/todos/2";
var logMessage = function (ID, title, finished) {
    console.log("ID is: " + ID + ", Title is: " + title + ", and something is: " + finished);
};
axios_1["default"]
    .get(url)
    .then(function (response) {
    //console.log(response.data);
    var todo = response.data;
    var ID = todo.id;
    var title = todo.title;
    var finished = todo.completed;
    logMessage(ID, title, finished);
})["catch"](function (err) {
    console.error(err);
});

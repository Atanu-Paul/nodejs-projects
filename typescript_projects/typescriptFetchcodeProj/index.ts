import axios from "axios";

const url = "https://jsonplaceholder.typicode.com/todos/2";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const logMessage = (ID: number, title: string, finished: boolean) => {
  console.log(
    `ID is: ${ID}, Title is: ${title}, and something is: ${finished}`
  );
};

axios
  .get(url)
  .then((response) => {
    //console.log(response.data);
    const todo = response.data as Todo;
    const ID = todo.id;
    const title = todo.title;
    const finished = todo.completed;
    logMessage(ID, title, finished);
  })
  .catch((err) => {
    console.error(err);
  });

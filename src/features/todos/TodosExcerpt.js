import React from "react";
import TimeAgo from "./TimeAgo";
import TodoAuthor from "./TodoAuthor";
import { Link } from 'react-router-dom';

const TodosExcerpt = ({ todo }) => {
  return (
    <article>
      <h3>{todo.title}</h3>
      <p>{todo.completed === true ? "Done" : "Mark Done"}</p>
      <p className="postCredit">
        <TodoAuthor userId={todo.userId} />
        <TimeAgo timestamp={todo.date} />
        <br />
        <Link to={`todo/${todo.id}`}>View Todo</Link>
      </p>
    </article>
  );
};

export default TodosExcerpt;
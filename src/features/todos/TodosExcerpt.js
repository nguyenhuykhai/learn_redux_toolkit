import TimeAgo from "./TimeAgo";
import TodoAuthor from "./TodoAuthor";
import { Link } from 'react-router-dom';
import ReactionButtons from "./ReactionButtons";

import { useSelector } from "react-redux";
import { selectTodoById } from "./todosSlice";

const TodosExcerpt = ({ todoId }) => {
  const todo = useSelector(state => selectTodoById(state, todoId));

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
      <ReactionButtons todo={todo} />
    </article>
  );
};

export default TodosExcerpt;
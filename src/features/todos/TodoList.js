import { useSelector, useDispatch } from "react-redux";
import {
  selectAllTodos,
  getTodosStatus,
  getTodosError,
  fetchTodos,
} from "./todosSlice";
import { useEffect } from "react";
import TodosExcerpt from "./TodosExcerpt";

const TodoList = () => {
  const dispatch = useDispatch();

  const todos = useSelector(selectAllTodos);
  const todoStatus = useSelector(getTodosStatus);
  const error = useSelector(getTodosError);

  useEffect(() => {
    if (todoStatus === "idle") {
      dispatch(fetchTodos());
    }
  }, [todoStatus, dispatch]);

  let content;
  if (todoStatus === "loading") {
    content = <p>"Loading..."</p>;
  } else if (todoStatus === "succeeded") {
    const orderdTodo = todos.slice().sort((a, b) => b.date.localeCompare(a.date));
    content = orderdTodo.map(todo => <TodosExcerpt key={todo.id} todo={todo} />)
  } else if (todoStatus === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>Todos</h2>
      {content}
    </section>
  );
};

export default TodoList;

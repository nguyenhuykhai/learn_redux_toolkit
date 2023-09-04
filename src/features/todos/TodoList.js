import { useSelector } from "react-redux";
import { selectTodoIds, getTodosStatus, getTodosError } from "./todosSlice";
import TodosExcerpt from "./TodosExcerpt";

const TodoList = () => {

  const orderedTodoIds = useSelector(selectTodoIds);
  const todoStatus = useSelector(getTodosStatus);
  const error = useSelector(getTodosError);

  let content;
  if (todoStatus === "loading") {
    content = <p>"Loading..."</p>;
  } else if (todoStatus === "succeeded") {
    content = orderedTodoIds.map((todoId) => ( <TodosExcerpt key={todoId} todoId={todoId} />));
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

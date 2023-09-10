import { useSelector } from "react-redux";
import { selectTodoIds, useGetTodosQuery } from "./todosSlice";
import TodosExcerpt from "./TodosExcerpt";

const TodoList = () => {
  const {
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetTodosQuery()

  const orderedTodoIds = useSelector(selectTodoIds);

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = orderedTodoIds.map(todoId => <TodosExcerpt key={todoId} todoId={todoId} />);
  } else if (isError) {
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

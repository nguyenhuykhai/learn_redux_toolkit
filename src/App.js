import TodoList from "./features/todos/TodoList";
import { Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout";
import AddPostForm from "./features/todos/AddTodoForm";
import SingleTodoPage from "./features/todos/SingleTodoPage";
import EditTodoForm from "./features/todos/EditTodoForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<TodoList />} />

        <Route path="todo">
          <Route index element={<AddPostForm />} />
          <Route path=":todoId" element={<SingleTodoPage />} />
          <Route path="edit/:todoId" element={<EditTodoForm />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;

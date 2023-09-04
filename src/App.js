import TodoList from "./features/todos/TodoList";
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./components/Layout";
import AddPostForm from "./features/todos/AddTodoForm";
import SingleTodoPage from "./features/todos/SingleTodoPage";
import EditTodoForm from "./features/todos/EditTodoForm";
import UsersList from "./features/users/UserList"
import UserPage from "./features/users/UserPage"

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

        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>

        {/* Catch all - replace with 404 component if you want */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
}

export default App;

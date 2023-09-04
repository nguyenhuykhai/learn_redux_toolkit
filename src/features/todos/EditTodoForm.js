import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTodoById, updateTodo, deleteTodo } from "./todosSlice";
import { useParams, useNavigate } from "react-router-dom";

import { selectAllUsers } from "../users/usersSlice";

const EditTodoForm = () => {
  const { todoId } = useParams();
  const navigate = useNavigate();

  const todo = useSelector((state) => selectTodoById(state, Number(todoId)));
  const users = useSelector(selectAllUsers);

  const [title, setTitle] = useState(todo?.title);
  const [completed, setCompleted] = useState(todo?.completed);
  const [userId, setUserId] = useState(todo?.userId);
  const [requestStatus, setRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  if (!todo) {
    return (
      <section>
        <h2>Todo not found!</h2>
      </section>
    );
  }

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onCompletedChanged = (e) => {
    const isTrue = e.target.value == "true";
    setCompleted(isTrue);
  };
  const onAuthorChanged = (e) => setUserId(Number(e.target.value));

  const canSave = [title, userId].every(Boolean) && requestStatus === "idle";

  const onSaveTodoClicked = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");
        dispatch(
          updateTodo({ id: todo.id, title, completed: completed, userId })
        ).unwrap();

        setTitle("");
        setCompleted(false);
        setUserId("");
        navigate(`/todo/${todoId}`);
      } catch (err) {
        console.error("Failed to save the todo", err);
      } finally {
        setRequestStatus("idle");
      }
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  const onDeleteTodoClicked = () => {
    try {
      setRequestStatus("pending");
      dispatch(deleteTodo({ id: todo.id })).unwrap();

      setTitle("");
      setCompleted(false);
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the todo", err);
    } finally {
      setRequestStatus("idle");
    }
  };

  return (
    <section>
      <h2>Edit Todo</h2>
      <form>
        <label htmlFor="postTitle">Todo Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Completed:</label>
        <select
          value={completed}
          onChange={onCompletedChanged}
          name="postContent"
          id="postContent"
        >
          <option value="true">Done</option>
          <option value="false">Not Done</option>
        </select>
        <button type="button" onClick={onSaveTodoClicked} disabled={!canSave}>
          Save Post
        </button>
        <button
          className="deleteButton"
          type="button"
          onClick={onDeleteTodoClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditTodoForm;

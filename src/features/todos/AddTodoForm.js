import { useState } from "react";
import { useSelector } from "react-redux";

import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";
import { useAddNewTodoMutation } from "./todosSlice";

const AddPostForm = () => {
  const [addNewTodo, { isLoading }] = useAddNewTodoMutation()

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState("");

  const users = useSelector(selectAllUsers);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onCompletedChanged = (e) => {
    const isTrue = e.target.value == 'true';
    setCompleted(isTrue);
  }
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const canSave = [title, userId].every(Boolean) && !isLoading;

  const onSaveTodoClicked = async () => {
    if (canSave) {
      try {
        await addNewTodo({ title, completed: completed, userId }).unwrap()

        setTitle("");
        setCompleted(false);
        setUserId("");
        navigate("/");
      } catch (err) {
        console.error("Failed to save the post", err);
      }
    }
  };

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Todo</h2>
      <form>
        <label htmlFor="postTitle">Todo Task:</label>
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
        <select value={completed} onChange={onCompletedChanged} name="postContent" id="postContent">
          <option value="true">Done</option>
          <option value="false">Not Done</option>
        </select>
        <button type="button" onClick={onSaveTodoClicked} disabled={!canSave}>
          Save Todo
        </button>
      </form>
    </section>
  );
};
export default AddPostForm;

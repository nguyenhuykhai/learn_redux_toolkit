import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../features/todos/todosSlice"
import userReducer from "../features/users/usersSlice"

export const store = configureStore({
    reducer: {
        todos: todosReducer,
        users: userReducer
    }
})
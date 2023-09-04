import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos'

const initialState = {
    todos: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const fetchTodos = createAsyncThunk('todos/fetchPosts', async () => {
    const response = await axios.get(TODOS_URL)
    return response.data
})

export const addNewTodo = createAsyncThunk('todos/addNewTodo', async (initialTodo) => {
    const response = await axios.post(TODOS_URL, initialTodo)
    return response.data
})

export const updateTodo = createAsyncThunk('posts/updateTodo', async (initialTodo) => {
    const { id } = initialTodo;
    try {
        const response = await axios.put(`${TODOS_URL}/${id}`, initialTodo)
        return response.data
    } catch (err) {
        //return err.message;
        return initialTodo; // only for testing Redux!
    }
})

export const deleteTodo = createAsyncThunk('posts/deleteTodo', async (initialTodo) => {
    const { id } = initialTodo;
    try {
        const response = await axios.delete(`${TODOS_URL}/${id}`)
        if (response?.status === 200) return initialTodo;
        return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
        return err.message;
    }
})

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        todoAdded: {
            reducer(state, action) {
                state.todos.push(action.payload)
            },
            prepare(title, completed, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        completed,
                        date: new Date().toISOString(),
                        userId,
                    }
                }
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTodos.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date
                let min = 1;
                const loadedTodos = action.payload.map(todo => {
                    todo.date = sub(new Date(), { minutes: min++ }).toISOString();
                    return todo
                })
                state.todos = state.todos.concat(loadedTodos);
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewTodo.fulfilled, (state, action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs
                const sortedTodos = state.todos.sort((a, b) => {
                    if (a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                })
                action.payload.id = sortedTodos[sortedTodos.length - 1].id + 1;
                // End fix for fake API post IDs 

                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                console.log(action.payload)
                state.todos.push(action.payload)
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                action.payload.date = new Date().toISOString();
                const todos = state.todos.filter(todo => todo.id !== id);
                state.todos = [...todos, action.payload];
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                const todos = state.todos.filter(todo => todo.id !== id);
                state.todos = todos;
            })
    }
})

export const selectAllTodos = (state) => state.todos.todos;
export const getTodosStatus = (state) => state.todos.status;
export const getTodosError = (state) => state.todos.error;

export const selectTodoById = (state, todoId) =>
    state.todos.todos.find(todo => todo.id === todoId);

export const { todoAdded } = todosSlice.actions

export default todosSlice.reducer
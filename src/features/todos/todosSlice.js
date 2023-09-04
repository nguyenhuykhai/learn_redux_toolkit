import { createSlice, createSelector, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos'

const todosAdapter = createEntityAdapter({
    sortComparer: (a,b) => b.date.localeCompare(a.date)
})

const initialState = todosAdapter.getInitialState({
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    count: 0
})

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
        reactionAdded:(state, action) => {
            const { todoId, reaction } = action.payload;
            const existingTodo = state.entities[todoId];
            if (existingTodo) {
                existingTodo.reactions[reaction]++
            }
        },
        increaseCount(state, action ){
            state.count = state.count + 1
        }
        // todoAdded: {
        //     reducer(state, action) {
        //         state.todos.push(action.payload)
        //     },
        //     prepare(title, completed, userId) {
        //         return {
        //             payload: {
        //                 id: nanoid(),
        //                 title,
        //                 completed,
        //                 date: new Date().toISOString(),
        //                 userId,
        //             }
        //         }
        //     }
        // }
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
                    todo.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return todo
                })

                /* Update hoặc thêm mới nhiều thực thể state
                   ---------------Dạng cơ bản---------------
                   state.todos = state.todos.concat(loadedTodos);
                   -----------Sử dụng Redux Toolkit------------*/

                todosAdapter.upsertMany(state, loadedTodos);
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
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)

                /*        Thêm mới một thực thể state
                   ---------------Dạng cơ bản---------------
                        state.todos.push(action.payload)
                   -----------Sử dụng Redux Toolkit--------*/

                todosAdapter.addOne(state, action.payload)
                
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                action.payload.date = new Date().toISOString();

                /*         Update một thực thể state
                   ---------------Dạng cơ bản---------------
                   const todos = state.todos.filter(todo => todo.id !== id);
                   state.todos = [...todos, action.payload];
                   -----------Sử dụng Redux Toolkit--------*/
                
                todosAdapter.upsertOne(state, action.payload)
                
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return;
                }

                /*         Xóa một thực thể state
                   ---------------Dạng cơ bản---------------
                   const todos = state.todos.filter(todo => todo.id !== id);
                   state.todos = todos;
                   -----------Sử dụng Redux Toolkit--------*/

                const { id } = action.payload;
                todosAdapter.removeOne(state, id)
            })
    }
})

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTodos,
    selectById: selectTodoById,
    selectIds: selectTodoIds
    // Pass in a selector that returns the posts slice of state
} = todosAdapter.getSelectors(state => state.todos)

export const getTodosStatus = (state) => state.todos.status;
export const getTodosError = (state) => state.todos.error;
export const getCount = (state) => state.todos.count;

export const selectTodosByUser = createSelector(
    [selectAllTodos, (state, userId) => userId],
    (todos, userId) => todos.filter(todo => todo.userId === userId) // Select todo has userId === userId, return Array
)

export const { increaseCount, reactionAdded } = todosSlice.actions

export default todosSlice.reducer
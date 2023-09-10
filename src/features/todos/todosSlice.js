import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

const todosAdapter = createEntityAdapter({
    sortComparer: (a,b) => b.date.localeCompare(a.date)
})

const initialState = todosAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTodos: builder.query({
            query: () => "/todos",
            transformResponse: responseData => {
                let min = 1;
                const loadedTodos = responseData.map(todo => {
                    if (!todo?.date) todo.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!todo?.reactions) todo.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return todo;
                });
                return todosAdapter.setAll(initialState, loadedTodos)
            },
            providesTags: (result, error, args) => [
                {type: 'Todo', id: 'LIST'},
                ...result.ids.map(id => ({ type: 'Todo', id }))
            ]
        }),
        getTodosByUserId: builder.query({
            query: id => `/todos/?userId=${id}`,
            transformResponse: responseData => {
                let min = 1;
                const loadedTodos = responseData.map(todo => {
                    if (!todo?.date) todo.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!todo?.reactions) todo.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return todo;
                });
                return todosAdapter.setAll(initialState, loadedTodos)
            },
            providesTags: (result, error, arg) => [
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
        addNewTodo: builder.mutation({
            query: initialTodo => ({
                url: '/todos',
                method: 'POST',
                body: {
                    ...initialTodo,
                    userId: Number(initialTodo.userId),
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }
            }),
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),
        updateTodo: builder.mutation({
            query: initialTodo => ({
                url: `/todos/${initialTodo.id}`,
                method: 'PUT',
                body: {
                    ...initialTodo,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        deleteTodo: builder.mutation({
            query: ({ id }) => ({
                url: `/todos/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        addReaction: builder.mutation({
            query: ({ todoId, reactions }) => ({
                url: `todos/${todoId}`,
                method: 'PATCH',
                // In a real app, we'd probably need to base this on user ID somehow
                // so that a user can't do the same reaction more than once
                body: { reactions }
            }),
            // onQueryStarted: Chức năng giống một funtion, thực hiện sau khi hoàn thành query ở trên
            async onQueryStarted({ todoId, reactions }, { dispatch, queryFulfilled }) {
                // `updateQueryData` requires the endpoint name and cache key arguments,
                // so it knows which piece of cache state to update
                const patchResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getTodos', undefined, draft => {
                        // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                        const todo = draft.entities[todoId]
                        if (todo) todo.reactions = reactions
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        })

    })
})

// Sử dụng hook từ extendedApiSlice
export const {
    useGetTodosQuery,
    useGetTodosByUserIdQuery,
    useAddNewTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useAddReactionMutation
} = extendedApiSlice

// returns the query result object
export const selectTodosResult = extendedApiSlice.endpoints.getTodos.select()

// Creates memoized selector
const selectTodosData = createSelector(
    selectTodosResult,
    todosResult => todosResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTodos,
    selectById: selectTodoById,
    selectIds: selectTodoIds
    // Pass in a selector that returns the posts slice of state
} = todosAdapter.getSelectors(state => selectTodosData(state) ?? initialState)
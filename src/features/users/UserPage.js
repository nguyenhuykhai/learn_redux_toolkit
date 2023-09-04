import { useSelector } from 'react-redux'
import { selectUserById } from '../users/usersSlice'
import { selectAllTodos, selectTodosByUser } from '../todos/todosSlice'
import { Link, useParams } from 'react-router-dom'

const UserPage = () => {
    const { userId } = useParams()
    const user = useSelector(state => selectUserById(state, Number(userId)))

    const todosForUser = useSelector(state => selectTodosByUser(state, Number(userId)))

    const todoTitles = todosForUser.map(todo => (
        <li key={todo.id}>
            <Link to={`/todo/${todo.id}`}>{todo.title}</Link>
        </li>
    ))

    return (
        <section>
            <h2>{user?.name}</h2>

            <ol>{todoTitles}</ol>
        </section>
    )
}

export default UserPage
import { useSelector } from 'react-redux'
import { selectUserById } from '../users/usersSlice'
import { useGetTodosByUserIdQuery } from '../todos/todosSlice'
import { Link, useParams } from 'react-router-dom'

const UserPage = () => {
    const { userId } = useParams()
    const user = useSelector(state => selectUserById(state, Number(userId)))

    const {
        data: todosForUser,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTodosByUserIdQuery(userId);

    let content;
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess) {
        const { ids, entities } = todosForUser
        content = ids.map(id => (
            <li key={id}>
                <Link to={`/todo/${id}`}>{entities[id].title}</Link>
            </li>
        ))
    } else if (isError) {
        content = <p>{error}</p>;
    }

    console.log("USER: ", content);

    return (
        <section>
            <h2>{user?.name}</h2>

            <ol>{content}</ol>
        </section>
    )
}

export default UserPage
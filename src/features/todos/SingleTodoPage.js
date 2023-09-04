import { useSelector } from 'react-redux'
import { selectTodoById } from './todosSlice'

import ReactionButtons from "./ReactionButtons";
import TodoAuthor from "./TodoAuthor";
import TimeAgo from "./TimeAgo";

import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SingleTodoPage = () => {
    const { todoId } = useParams()

    const todo = useSelector((state) => selectTodoById(state, Number(todoId)))

    if (!todo) {
        return (
            <section>
                <h2>Todo not found!</h2>
            </section>
        )
    }

    return (
        <article>
            <h2>{todo.title}</h2>
            <p>{todo.completed === true ? "Done" : "Mark Done"}</p>
            <p className="postCredit">
                <TodoAuthor userId={todo.userId} />
                <TimeAgo timestamp={todo.date} />
                <br />
                <Link to={`/todo/edit/${todo.id}`}>Edit Todo</Link>
            </p>
            <ReactionButtons todo={todo} />
        </article>
    )
}

export default SingleTodoPage
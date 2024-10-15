import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

const deleteTodo = (id: string) => {
  client.models.Todo.delete({ id });
};

const updateTodo = (id: string, value: string) => {
  client.models.Todo.update({ id, content: value });
};

const TodoItem = ({ todo }: any) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [todoValue, setTodoValue] = useState<string>(todo.content);
  const editHandler = (value: string) => {
    setEdit((ps) => !ps);
    setTodoValue(value);
    updateTodo(todo.id, value);
  };
  return (
    <li
      style={{
        gap: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {edit ? (
        <input
          type="text"
          value={todoValue}
          onChange={(e) => setTodoValue(e.target.value)}
          style={{ width: "100%" }}
        />
      ) : (
        <strong>{todo.content}</strong>
      )}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={() => editHandler(todoValue)}>Edit</button>
        <button onClick={() => deleteTodo(todo.id)}>x</button>
      </div>
    </li>
  );
};

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator();

  const createTodo = () => {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  };

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={() => createTodo()}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={() => signOut()}>Sign out</button>
    </main>
  );
}

export default App;

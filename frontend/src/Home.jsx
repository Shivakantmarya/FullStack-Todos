import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  // const apiUrl = import.meta.env.VITE_API_URL;
  const apiUrl = "https://mytodos-rvpc.onrender.com";
  const [isClicked, setIsClicked] = useState(false);
  const [todo, setTodo] = useState("");
  const [todoData, setTodoData] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  //all todos
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiUrl}/api/todo/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodoData(res.data.allTodos);
    } catch (err) {
      console.error("fetched todo error", err);
    }
  };

  //Edit todos
  const editTodo = async (id, currentText) => {
    const updateText = prompt("Edit Text ", currentText);
    if (!updateText) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${apiUrl}/api/todo/update/${id}`,
        { todo: updateText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Edit response ", res);
      setTodoData((prev) =>
        prev.map((to) => (to._id === id ? res.data.todo : to))
      );
      
    } catch (e) {
      console.log("Internal error", e);
    }
  };

  //Delete todos
  const deleteTodo = async (id) => {
    console.log("deleted id : ", id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/todo/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodoData((prevTo) => prevTo.filter((uId) => uId._id !== id));
    } catch (e) {
      console.log("delete error", e);
    }
  };

  //Create todos
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${apiUrl}/api/todo/create`,
        { todo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //  console.log(res.data.data.todo);
      setTodoData((prevData) => [...prevData, res.data.data]);
    } catch (e) {
      console.error("todo not added ", e);
    }
    // setTodoData((prevData) => [...prevData, todo]);
    setIsClicked(false);
    setTodo("");
  };

  const newTodo = () => {
    setIsClicked(!isClicked);
  };

  const navigate = useNavigate();

  //log out function
  const logData = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate("/login");
  };

  const location = useLocation();
  const userName = location.state?.userName || "Guest";

  return (
    <div className="main">
      <div className="sidebar">
        <div className="header">
          <h2>My To-Do App</h2>
          <h1>@{userName}</h1>
          <button onClick={newTodo}>New To-Do</button>
        </div>
        <div className="footer">
          <button onClick={logData}>Log out</button>
          <p>Copyright@my_to_do_app!</p>
        </div>
      </div>

      {isClicked ? (
        <div className="inputBox">
          <input
            className="todoInput"
            type="text"
            placeholder="your todos.."
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <button onClick={addTodo} className="addBtn">
            Add
          </button>
        </div>
      ) : (
        ""
      )}

      {/* show todos  */}

      <div className="todoList">
        <h1>My Todo's</h1>
        {todoData.map((todos) => (
          <ul key={todos._id}>
            <li className="todoItem">
              <span className="todoText">
                {todos.todo &&
                  todos.todo.charAt(0).toUpperCase() + todos.todo.slice(1)}
              </span>
              <span className="date">
                CreatedAt: {new Date(todos.createdAt).toLocaleString()}
              </span>

              <div className="todoActions">
                <button
                  onClick={() => editTodo(todos._id, todos.todo)}
                  className="editBtn"
                  style={{ backgroundColor: "#43b581" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todos._id)}
                  className="deleteBtn"
                  style={{ backgroundColor: "#f04747" }}
                >
                  Delete
                </button>
              </div>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}

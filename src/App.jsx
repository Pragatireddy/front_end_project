import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const addTask = async () => {
    if (!task.trim()) return;

    const newTask = {
      text: task,
      completed: false,
    };

    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const data = await res.json();
    setTodos([...todos, data]);
    setTask("");
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const saveEdit = async (todo) => {
    const trimmed = editText.trim();
    if (!trimmed) return;

    const updatedTodo = {
      ...todo,
      text: trimmed,
    };

    await fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });

    setTodos(
      todos.map((t) =>
        t.id === todo.id ? updatedTodo : t
      )
    );
    cancelEdit();
  };

  const toggleStatus = async (todo) => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    await fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });

    setTodos(
      todos.map((t) =>
        t.id === todo.id ? updatedTodo : t
      )
    );
  };

  return (
    <div className="app">
      <div className="page-shell">
        <header className="page-header">
          <div className="brand">
            <span className="brand-mark">✓</span>
            <div>
              <p className="brand-label">TaskFlow</p>
              <p className="brand-copy">A clean task manager for your daily priorities.</p>
            </div>
          </div>

          <nav className="top-nav">
            <a href="#todos">Tasks</a>
            <a href="#about">About</a>
            <a href="#help">Help</a>
          </nav>
        </header>

        <div className="todo-container" id="todos">
          <h1>My Todo List</h1>
          <p className="subtitle">Organize your day with a clean, responsive todo list and keep your priorities clear.</p>

          <div className="todo-form">
            <input
              type="text"
              placeholder="Enter task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />

            <button className="add-btn" onClick={addTask}>
              <span className="btn-icon">+</span>
              Add Task
            </button>
          </div>

          <div className="todo-list">
            {todos.map((todo) => (
              <div className="todo-item" key={todo.id}>
                {editId === todo.id ? (
                  <>
                    <input
                      className="edit-input"
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="todo-actions">
                      <button className="save-btn" onClick={() => saveEdit(todo)}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
                      {todo.text}
                    </span>

                    <div className="todo-actions">
                      <button
                        className="status-btn"
                        onClick={() => toggleStatus(todo)}
                      >
                        {todo.completed ? "Undo" : "Complete"}
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => startEdit(todo)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteTask(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <footer className="page-footer">
          <div className="footer-copy">
            <p>Designed for fast daily planning.</p>
            
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
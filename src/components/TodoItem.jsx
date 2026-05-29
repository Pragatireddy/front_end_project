<div className="todo-list">
  {todos.map((todo, index) => (
    <div className="todo-item" key={index}>
      <span>{todo}</span>

      <button
        className="delete-btn"
        onClick={() => deleteTask(index)}
      >
        Delete
      </button>
    </div>
  ))}
</div>
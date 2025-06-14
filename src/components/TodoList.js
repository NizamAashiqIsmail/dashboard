"use client";

import React, { useState } from "react";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim() !== "") {
      setTasks([...tasks, { text: input, done: false }]);
      setInput("");
    }
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTasks(updatedTasks);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "20px",
        background: "#f9fafb",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      
      <div style={{ display: "flex", marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="Enter a new task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            marginRight: "8px",
            fontSize: "0.95rem",
          }}
        />
        <button
          onClick={addTask}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          Add
        </button>
      </div>

      <ul style={{ paddingLeft: "16px", margin: 0 }}>
        {tasks.map((task, idx) => (
          <li
            key={idx}
            onClick={() => toggleTask(idx)}
            style={{
              marginBottom: "8px",
              fontSize: "1rem",
              cursor: "pointer",
              color: task.done ? "#9ca3af" : "#111827",
              textDecoration: task.done ? "line-through" : "none",
              transition: "color 0.2s",
            }}
          >
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;

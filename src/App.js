import React, { useState, useEffect } from "react";
import menuData from "./data";

const App = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Bea 2L apă", completed: false },
    { id: 2, text: "Fă 30 min de mișcare", completed: false },
    { id: 3, text: "Evită zahărul procesat", completed: false }
  ]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const toggleTask = (id) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Plan Alimentar Project</h1>
      <h2>Meniu Luni:</h2>
      <ul>
        <li><strong>Mic dejun:</strong> {menuData.week_1.monday.breakfast}</li>
        <li><strong>Prânz:</strong> {menuData.week_1.monday.lunch}</li>
        <li><strong>Cină:</strong> {menuData.week_1.monday.dinner}</li>
        <li><strong>Gustări:</strong> {menuData.week_1.monday.snacks.join(", ")}</li>
        <li><strong>Apă:</strong> {menuData.week_1.monday.water}</li>
      </ul>

      <h2>Task-uri zilnice:</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: "10px" }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />{" "}
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import menuData from "./data";
import tasksData from "./tasks";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


const App = () => {
  const [selectedWeek, setSelectedWeek] = useState("week_1");
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setTasks(tasksData[selectedWeek] || []);
  }, [selectedWeek]);

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${selectedWeek}`, JSON.stringify(updatedTasks));
  };

  return (
    <div className={`container mt-4 ${darkMode ? "dark-mode" : ""}`}>
      {/* Buton Dark Mode */}
      <button className="btn btn-dark mb-3" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌞 Mod Luminos" : "🌙 Mod Întunecat"}
      </button>

      {/* Selector de săptămână */}
      <div className="mb-4">
        <label className="form-label">Alege săptămâna:</label>
        <select className="form-select" onChange={(e) => setSelectedWeek(e.target.value)}>
          <option value="week_1">Săptămâna 1</option>
          <option value="week_2">Săptămâna 2</option>
        </select>
      </div>

      {/* Meniu săptămânal */}
      <div className="card p-3 shadow">
        <h2 className="text-secondary">Meniu pentru {selectedWeek.replace("_", " ")}:</h2>
        {Object.keys(menuData[selectedWeek] || {}).map((day) => (
          <div key={day} className="border p-2 mb-2 bg-light">
            <h4 className="text-dark">{menuData[selectedWeek][day].icon} {menuData[selectedWeek][day].dayName}</h4>
            <ul className="list-group">
              <li className="list-group-item"><strong>Mic dejun:</strong> {menuData[selectedWeek][day].breakfast}</li>
              <li className="list-group-item"><strong>Prânz:</strong> {menuData[selectedWeek][day].lunch}</li>
              <li className="list-group-item"><strong>Cină:</strong> {menuData[selectedWeek][day].dinner}</li>
              <li className="list-group-item"><strong>Gustări:</strong> {menuData[selectedWeek][day].snacks.join(", ")}</li>
              <li className="list-group-item"><strong>Apă:</strong> {menuData[selectedWeek][day].water}</li>
            </ul>
          </div>
        ))}
      </div>

      {/* Task-uri zilnice */}
      <h2 className="mt-4">Task-uri pentru {selectedWeek.replace("_", " ")}:</h2>
      {tasks.length > 0 && tasks.every(task => task.completed) && (
        <div className="alert alert-success" role="alert">
          ✅ Felicitări! Ai completat toate task-urile acestei săptămâni!
        </div>
      )}
      <ul className="list-group">
        {tasks.map(task => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            {task.text}
            <button className={`btn ${task.completed ? "btn-success" : "btn-outline-secondary"} btn-sm`} 
              onClick={() => toggleTask(task.id)}>
              {task.completed ? "✔️" : "⚪"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
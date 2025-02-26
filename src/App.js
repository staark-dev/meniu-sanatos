import React, { useState, useEffect } from "react";
import menuData from "./data";
import tasksData from "./tasks";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [selectedWeek, setSelectedWeek] = useState("week_1");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(tasksData[selectedWeek]);
  }, [selectedWeek]);

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-primary text-center">Plan Alimentar și Task-uri</h1>

      {/* Selector de săptămână */}
      <div className="mb-4">
        <label className="form-label">Alege săptămâna:</label>
        <select className="form-select" onChange={(e) => setSelectedWeek(e.target.value)}>
          <option value="week_1">Săptămâna 1</option>
          <option value="week_2">Săptămâna 2</option>
          <option value="week_3">Săptămâna 3</option>
          <option value="week_4">Săptămâna 4</option>
        </select>
      </div>

      {/* Afișare meniu săptămânal */}
      <div className="card p-3 shadow">
        <h2 className="text-secondary">Meniu pentru {selectedWeek.replace("_", " ")}:</h2>
        {Object.keys(menuData[selectedWeek] || {}).map((day) => (
          <div key={day} className="border p-2 mb-2 bg-light">
            <h4 className="text-dark">{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
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

      {/* Afișare task-uri */}
      <h2 className="mt-4">Task-uri pentru {selectedWeek.replace("_", " ")}:</h2>
      <ul className="list-group">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="list-group-item d-flex align-items-center">
              <input className="form-check-input me-2" type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
              {task.text}
            </li>
          ))
        ) : (
          <p className="text-muted">Nu există task-uri pentru această săptămână.</p>
        )}
      </ul>
    </div>
  );
};

export default App;
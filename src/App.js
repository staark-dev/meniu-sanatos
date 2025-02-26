import React, { useState, useEffect } from "react";
import menuData from "./data";
import tasksData from "./tasks";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [completedWeeks, setCompletedWeeks] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  // Inițializează starea task-urilor pentru fiecare săptămână
  const [taskState, setTaskState] = useState(() => {
    const savedState = JSON.parse(localStorage.getItem("taskState")) || {};
    return savedState;
  });

  useEffect(() => {
    localStorage.setItem("taskState", JSON.stringify(taskState));
  }, [taskState]);

  const toggleTask = (week, id) => {
    const updatedTasks = taskState[week].map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    setTaskState({ ...taskState, [week]: updatedTasks });

    // Dacă toate task-urile sunt complete, marchează săptămâna ca finalizată
    if (updatedTasks.every(task => task.completed)) {
      setCompletedWeeks(prev => ({ ...prev, [week]: true }));
    }
  };

  // Inițializează task-urile pentru fiecare săptămână
  useEffect(() => {
    const initialTasks = {};
    Object.keys(tasksData).forEach(week => {
      initialTasks[week] = tasksData[week];
    });
    setTaskState(initialTasks);
  }, []);

  return (
    <div className={`container mt-4 ${darkMode ? "dark-mode" : ""}`}>
      {/* Buton Dark Mode */}
      <button className="btn btn-dark mb-3" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌞 Mod Luminos" : "🌙 Mod Întunecat"}
      </button>

      {/* Meniu săptămâni */}
      <h1 className="text-primary text-center">Plan Alimentar</h1>
      <ul className="nav nav-tabs">
        {Object.keys(menuData).map(week => (
          <li className="nav-item" key={week}>
            <a className="nav-link" href={`#${week}`}>
              {menuData[week].name}
            </a>
          </li>
        ))}
      </ul>

      {/* Afișează fiecare săptămână */}
      {Object.keys(menuData).map(week => (
        <div key={week} className="mt-4" id={week}>
          <h2 className="text-secondary">{menuData[week].name}</h2>

          {/* Meniu pe zile */}
          {Object.keys(menuData[week].days).map(day => (
            <div key={day} className="border p-3 mb-3 bg-light">
              <h4>{menuData[week].days[day].icon} {menuData[week].days[day].dayName}</h4>
              <ul className="list-group">
                <li className="list-group-item"><strong>Mic dejun:</strong> {menuData[week].days[day].breakfast}</li>
                <li className="list-group-item"><strong>Prânz:</strong> {menuData[week].days[day].lunch}</li>
                <li className="list-group-item"><strong>Cină:</strong> {menuData[week].days[day].dinner}</li>
                <li className="list-group-item"><strong>Gustări:</strong> {menuData[week].days[day].snacks.join(", ")}</li>
                <li className="list-group-item"><strong>Apă:</strong> {menuData[week].days[day].water}</li>
              </ul>
            </div>
          ))}

          {/* Task-uri zilnice (se ascund dacă sunt completate) */}
          {!completedWeeks[week] && taskState[week] && (
            <>
              <h3 className="mt-4">Task-uri pentru {menuData[week].name}:</h3>
              <ul className="list-group">
                {taskState[week].map(task => (
                  <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {task.text}
                    <button className={`btn ${task.completed ? "btn-success" : "btn-outline-secondary"} btn-sm`} 
                      onClick={() => toggleTask(week, task.id)}>
                      {task.completed ? "✔️" : "⚪"}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
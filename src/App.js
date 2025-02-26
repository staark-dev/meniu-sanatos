import React, { useState, useEffect } from "react";
import menuData from "./data";
import tasksData from "./tasks";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { FaCheckCircle, FaRegCircle, FaUtensils, FaCalendarAlt, FaTasks, FaAward } from "react-icons/fa";

const App = () => {
  const weekKeys = Object.keys(menuData);
  const [selectedWeek, setSelectedWeek] = useState(weekKeys[0]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Selectează automat prima zi din săptămâna curentă
  useEffect(() => {
    const firstDay = Object.keys(menuData[selectedWeek].days)[0];
    setSelectedDay(firstDay);
  }, [selectedWeek]);

  useEffect(() => {
    if (selectedDay && tasksData[selectedWeek]?.[selectedDay]) {
      setTasks(tasksData[selectedWeek][selectedDay]);
    } else {
      setTasks([]);
    }
  }, [selectedWeek, selectedDay]);

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    const remainingTasks = updatedTasks.filter(task => !task.completed).length;

    setTasks(updatedTasks);

    if (remainingTasks === 0) {
      setPopupMessage(`🎉 Felicitări, ai finalizat toate task-urile pentru ${menuData[selectedWeek].days[selectedDay].dayName}!`);
      setTimeout(() => setShowPopup(false), 7000); // Popup durează 7 secunde
    } else {
      setPopupMessage(`📢 Mai ai ${remainingTasks} task-uri pentru ziua ${menuData[selectedWeek].days[selectedDay].dayName}.`);
      setTimeout(() => setShowPopup(false), 5000); // Popup durează 5 secunde
    }

    setShowPopup(true);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary">
        <FaUtensils className="me-2" /> Plan Alimentar Simona 
      </h1>

      {/* Meniu săptămâni */}
      <div className="week-menu d-flex flex-wrap justify-content-center mb-3">
        {weekKeys.map(week => (
          <button
            key={week}
            className={`btn ${selectedWeek === week ? "btn-primary" : "btn-outline-primary"} week-btn`}
            onClick={() => setSelectedWeek(week)}
          >
            <FaCalendarAlt className="me-2" />
            {menuData[week].name}
          </button>
        ))}
      </div>

      {/* Meniu zile */}
      {selectedWeek && (
        <div>
          <h2 className="text-secondary text-center">Selectează o zi:</h2>
          <div className="d-flex flex-wrap justify-content-center">
            {Object.keys(menuData[selectedWeek].days).map(day => (
              <button
                key={day}
                className={`btn ${selectedDay === day ? "btn-success" : "btn-outline-success"} mx-1 my-1`}
                onClick={() => setSelectedDay(day)}
              >
                {menuData[selectedWeek].days[day].icon} {menuData[selectedWeek].days[day].dayName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Meniu zilei selectate */}
      {selectedDay && menuData[selectedWeek].days[selectedDay] && (
        <div className="card p-3 shadow mt-3">
          <h3><FaUtensils className="me-2" /> {menuData[selectedWeek].days[selectedDay].dayName}</h3>
          <ul className="list-group">
            <li className="list-group-item"><strong>🍳 Mic dejun:</strong> {menuData[selectedWeek].days[selectedDay].breakfast}</li>
            <li className="list-group-item"><strong>🥗 Prânz:</strong> {menuData[selectedWeek].days[selectedDay].lunch}</li>
            <li className="list-group-item"><strong>🍽 Cină:</strong> {menuData[selectedWeek].days[selectedDay].dinner}</li>
           <li className="list-group-item"><strong>🍽 Snacks:</strong> {menuData[selectedWeek].days[selectedDay].snak}</li>
          </ul>
        </div>
      )}

      {/* Task-uri zilei selectate */}
      {tasks.length > 0 && (
        <div className="mt-4">
          <h3><FaTasks className="me-2" /> Task-uri:</h3>
          <ul className="list-group">
            {tasks.map(task => (
              !task.completed && (
                <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {task.text}
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleTask(task.id)}>
                    {task.completed ? <FaCheckCircle className="text-success" /> : <FaRegCircle />}
                  </button>
                </li>
              )
            ))}
          </ul>
        </div>
      )}

      {/* Popup notificare */}
      {showPopup && (
        <div className="alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3">
          {popupMessage}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center mt-5 p-3 bg-light">
        <FaAward className="me-2 text-warning" /> © 2025 Plan Alimentar - Sănătate și echilibru
      </footer>
    </div>
  );
};

export default App;
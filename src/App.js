import React, { useState, useEffect } from "react";
import { fetchPlanAlimentar } from "./data";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle, FaRegCircle, FaUtensils, FaCalendarAlt, FaTasks, FaAward } from "react-icons/fa";

const App = () => {
  const [plan, setPlan] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");


useEffect(() => {
  fetchPlanAlimentar().then((data) => {
    if (data) {
      console.log("Plan alimentar încărcat:", data); // Verifică în consolă
      setPlan(data);
      const firstWeek = Object.keys(data)[0];
      setSelectedWeek(firstWeek);
      const firstDay = Object.keys(data[firstWeek].days)[0];
      setSelectedDay(firstDay);
      setTasks(data[firstWeek].days[firstDay].tasks || []);
    } else {
      console.error("Planul alimentar nu s-a putut încărca.");
    }
  });
}, []);

  if (!plan) {
    return <h1 className="text-center mt-5">Se încarcă planul alimentar...</h1>;
  }

/*  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    const remainingTasks = updatedTasks.filter(task => !task.completed).length;

    setTasks(updatedTasks);

    if (remainingTasks === 0) {
      setPopupMessage(`🎉 Felicitări, ai finalizat toate task-urile pentru ${plan[selectedWeek].days[selectedDay].dayName}!`);
      setTimeout(() => setShowPopup(false), 7000);
    } else {
      setPopupMessage(`📢 Mai ai ${remainingTasks} task-uri pentru ziua ${plan[selectedWeek].days[selectedDay].dayName}.`);
      setTimeout(() => setShowPopup(false), 5000);
    }

    setShowPopup(true);
  };
*/
const toggleTask = (id) => {
  const updatedTasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  setTasks(updatedTasks);

  // Verifică dacă toate task-urile sunt completate
  const allTasksCompleted = updatedTasks.every(task => task.completed);

  if (allTasksCompleted) {
    setTimeout(() => {
      setTasks([]); // Ascunde cardul după 1 secundă
    }, 1000);
    
    setPopupMessage(`🎉 Felicitări, ai finalizat toate task-urile pentru ziua ${plan[selectedWeek].days[selectedDay].dayName}!`);
  } else {
    const remainingTasks = updatedTasks.filter(task => !task.completed).length;
    setPopupMessage(`📢 Mai ai ${remainingTasks} task-uri pentru ziua ${plan[selectedWeek].days[selectedDay].dayName}.`);
  }

  setShowPopup(true);
};

const calculateWeeklyProgress = () => {
  let totalTasks = 0;
  let completedTasksTotal = 0;

  Object.values(plan[selectedWeek].days).forEach(day => {
    if (day.tasks) {
      totalTasks += day.tasks.length;
      completedTasksTotal += day.tasks.filter(task => task.completed).length;
    }
  });

  return totalTasks > 0 ? (completedTasksTotal / totalTasks) * 100 : 0;
};

useEffect(() => {
  setWeeklyProgress(calculateWeeklyProgress());
}, [tasks, selectedWeek]);


  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary">
        <FaUtensils className="me-2" /> Plan Alimentar Simona 
      </h1>

      {/* Meniu săptămâni */}
      <div className="week-menu d-flex flex-wrap justify-content-center mb-3">
        {Object.keys(plan).map(week => (
          <button
            key={week}
            className={`btn ${selectedWeek === week ? "btn-primary" : "btn-outline-primary"} week-btn`}
            onClick={() => setSelectedWeek(week)}
          >
            <FaCalendarAlt className="me-2" />
            {plan[week].name}
          </button>
        ))}
      </div>

      {/* Meniu zile */}
      {selectedWeek && (
        <div>
          <h2 className="text-secondary text-center">Selectează o zi:</h2>
          <div className="d-flex flex-wrap justify-content-center">
            {Object.keys(plan[selectedWeek].days).map(day => (
              <button
                key={day}
                className={`btn ${selectedDay === day ? "btn-success" : "btn-outline-success"} mx-1 my-1`}
                onClick={() => setSelectedDay(day)}
              >
                {plan[selectedWeek].days[day].icon} {plan[selectedWeek].days[day].dayName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Meniu zilei selectate */}
      {selectedDay && plan[selectedWeek].days[selectedDay] && (
        <div className="card p-3 shadow mt-3">
          <h3><FaUtensils className="me-2" /> {plan[selectedWeek].days[selectedDay].dayName}</h3>
          <ul className="list-group">
            <li className="list-group-item"><strong>🍳 Mic dejun:</strong> {plan[selectedWeek].days[selectedDay].breakfast}</li>
            <li className="list-group-item"><strong>🥑 Gustare 1:</strong> {plan[selectedWeek].days[selectedDay].snack1}</li>
            <li className="list-group-item"><strong>🥗 Prânz:</strong> {plan[selectedWeek].days[selectedDay].lunch}</li>
            <li className="list-group-item"><strong>🍌 Gustare 2:</strong> {plan[selectedWeek].days[selectedDay].snack2}</li>
            <li className="list-group-item"><strong>🍽 Cină:</strong> {plan[selectedWeek].days[selectedDay].dinner}</li>
          </ul>
        </div>
      )}

      {/* Task-uri zilei selectate */}
      {tasks.length > 0 && (
        <div className="mt-4">
          <h3><FaTasks className="me-2" /> Task-uri:</h3>
          <ul className="list-group">
            {tasks.map(task => (
              <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                {task.text}
                <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleTask(task.id)}>
                  {task.completed ? <FaCheckCircle className="text-success" /> : <FaRegCircle />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

<div className="weekly-summary mt-4">
  <h3>📊 Progres săptămânal:</h3>
  <div className="progress">
    <div className="progress-bar bg-info" role="progressbar" style={{ width: `${calculateWeeklyProgress()}%` }}>
      {Math.round(calculateWeeklyProgress())}%
    </div>
  </div>
</div>

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
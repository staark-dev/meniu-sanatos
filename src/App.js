import React, { useState, useEffect, useCallback } from "react";
import { fetchPlanAlimentar } from "./data";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle, FaChartLine } from "react-icons/fa";

const App = () => {
  const [plan, setPlan] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchPlanAlimentar().then((data) => {
      if (data) {
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

useEffect(() => {
  if (selectedDay && plan && selectedWeek) {
    const savedTasks = localStorage.getItem(`tasks_${selectedWeek}_${selectedDay}`);
    
    if (savedTasks) {
      console.log("📝 Task-uri încărcate din localStorage:", JSON.parse(savedTasks));
      setTasks(JSON.parse(savedTasks));
    } else {
      console.log("📌 Task-uri încărcate din JSON:", plan[selectedWeek].days[selectedDay].tasks);
      setTasks(plan[selectedWeek].days[selectedDay].tasks || []);
    }
  }
}, [selectedWeek, selectedDay, plan]);

const calculateWeeklyProgress = useCallback(() => {
  if (!plan || !selectedWeek || !plan[selectedWeek] || !plan[selectedWeek].days) return 0;

  let totalTasks = 0;
  let completedTasksTotal = 0;

  Object.values(plan[selectedWeek].days).forEach(day => {
    if (day.tasks) {
      totalTasks += day.tasks.length;
      completedTasksTotal += day.tasks.filter(task => task.completed).length;
    }
  });

  return totalTasks > 0 ? (completedTasksTotal / totalTasks) * 100 : 100;
}, [plan, selectedWeek]);

useEffect(() => {
  if (plan && selectedWeek) {
    setWeeklyProgress(calculateWeeklyProgress());
  }
}, [tasks, selectedWeek, plan, calculateWeeklyProgress]);
if (!plan || !selectedWeek || !selectedDay) {
  return <h1 className="text-center mt-5">Se încarcă planul alimentar...</h1>;
}
  return (
    <div className="container mt-4">
      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-primary px-3 d-flex justify-content-between">
        <h4 className="text-white">📅 Martie</h4>
        
        <div className="d-flex align-items-center">
          {/* Dropdown progres */}
          <div className="dropdown me-3">
            <button
              className="btn btn-light dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaChartLine className="me-2" /> Progres
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu show">
                <p className="dropdown-item">📊 Progres săptămânal: {Math.round(weeklyProgress)}%</p>
              </div>
            )}
          </div>

          {/* Avatar utilizator */}
          <div className="d-flex align-items-center">
            <FaUserCircle className="text-white fs-3 me-2" />
            <span className="text-white">Simona</span>
          </div>
        </div>
      </nav>

      {/* AFIȘARE ZILELE SĂPTĂMÂNII */}
      <div className="week-menu d-flex flex-wrap justify-content-center my-3">
        {Object.keys(plan[selectedWeek].days).map(day => (
          <button
            key={day}
            className={`btn ${selectedDay === day ? "btn-success" : "btn-outline-success"} mx-1 my-1`}
            onClick={() => setSelectedDay(day)}
          >
            {plan[selectedWeek].days[day].dayName}
          </button>
        ))}
      </div>

      {/* MENIU ZILNIC */}
      {selectedDay && plan[selectedWeek].days[selectedDay] && (
        <div className="card p-3 shadow mt-3">
          <h3>🍽 {plan[selectedWeek].days[selectedDay].dayName}</h3>
          <ul className="list-group">
            <li className="list-group-item"><strong>🍳 Mic dejun:</strong> {plan[selectedWeek].days[selectedDay].breakfast}</li>
            <li className="list-group-item"><strong>🥑 Gustare 1:</strong> {plan[selectedWeek].days[selectedDay].snack1}</li>
            <li className="list-group-item"><strong>🥗 Prânz:</strong> {plan[selectedWeek].days[selectedDay].lunch}</li>
            <li className="list-group-item"><strong>🍌 Gustare 2:</strong> {plan[selectedWeek].days[selectedDay].snack2}</li>
            <li className="list-group-item"><strong>🍽 Cină:</strong> {plan[selectedWeek].days[selectedDay].dinner}</li>
          </ul>
        </div>
      )}
    </div>

{tasks.length > 0 && (
  <div className="mt-4">
    <h3>📋 Task-uri pentru ziua {plan[selectedWeek].days[selectedDay].dayName}:</h3>
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
) : (
  <p className="text-muted text-center">✅ Nu ai task-uri de făcut azi!</p>
)}
  );
};

export default App;
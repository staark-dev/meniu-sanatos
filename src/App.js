import React, { useState, useEffect } from "react";
import { fetchPlanAlimentar } from "./data";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { calculateWeeklyProgress } from "./utils/calculateProgress";
import { FaCheckCircle, FaRegCircle, FaUserCircle, FaChartLine } from "react-icons/fa";

const App = () => {
    const [plan, setPlan] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [weeklyProgress, setWeeklyProgress] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownWeekOpen, setDropdownWeekOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

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
    
    // Calcul progres săptămânal după fiecare schimbare a `tasks`
    useEffect(() => {
        if (plan && selectedWeek) {
            setWeeklyProgress(calculateWeeklyProgress(plan, selectedWeek));
            console.log(`📊 Progres actualizat: ${calculateWeeklyProgress(plan, selectedWeek)}%`);
        }
    }, [tasks, selectedWeek, plan]);
        
    const toggleTask = (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );

        setTasks(updatedTasks);
        
        // Salvăm progresul în LocalStorage
        localStorage.setItem(`tasks_${selectedWeek}_${selectedDay}`, JSON.stringify(updatedTasks));

        setPopupMessage(`🎉 Felicitări, ai finalizat unul dintre task-urile pentru ziua ${plan[selectedWeek].days[selectedDay].dayName}!`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);

        // Verificăm dacă toate task-urile sunt completate
        const allTasksCompleted = updatedTasks.every(task => task.completed);

        if (allTasksCompleted) {
            setPopupMessage(`🎉 Felicitări, ai finalizat toate task-urile pentru ziua ${plan[selectedWeek].days[selectedDay].dayName}!`);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 4000);

            setTimeout(() => {
                setTasks([]);
            }, 100);
        }
    };

  if (!plan || !selectedWeek || !selectedDay) {
    return <h1 className="text-center mt-5">Se încarcă planul alimentar...</h1>;
  }
  
  return (<div className="container mt-4">
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

        {/* Dropdown pentru selectarea săptămânii */}
        <div className="dropdown me-3">
          <button
            className="btn btn-light dropdown-toggle"
            onClick={() => setDropdownWeekOpen(!dropdownWeekOpen)}
          >
            📆 Selectează săptămâna
          </button>
          {dropdownWeekOpen && (
            <div className="dropdown-menu show">
              {Object.keys(plan).map(week => (
                <button
                  key={week}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedWeek(week);
                    setSelectedDay(Object.keys(plan[week].days)[0]); // Selectează prima zi
                    setDropdownWeekOpen(false);
                  }}
                >
                  {plan[week].name}
                </button>
              ))}
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

    {/* Bara de progres zilnic */}
    {/* Bara de progres săptămânal */}
    <div className="progress my-3">
        <div className="progress-bar bg-success position-relative" role="progressbar" style={{ width: `${weeklyProgress}%` }}>
            <span className="position-absolute w-100 text-center text-white fw-bold">
                {Math.round(weeklyProgress)}% completat
            </span>
        </div>
    </div>


    <div className="progress my-3">
        <div className="progress-bar bg-success" role="progressbar" placeholder="Task Progres" style={{ width: `${(tasks.filter(task => task.completed).length / tasks.length) * 100}%` }}>
            {Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)}%
        </div>
    </div>

    {/* MENIU ZILNIC */}
    {selectedDay && plan[selectedWeek].days[selectedDay] && (
        <div className="card p-3 shadow mt-3">
        <h3>🍽 {plan[selectedWeek].days[selectedDay].dayName}</h3>
        <ul className="list-group">
            <li className="list-group-item"><strong>🍳 Mic dejun:</strong> {plan[selectedWeek].days[selectedDay].breakfast}</li>
            <li className="list-group-item"><strong>🥑 Gustare:</strong> {plan[selectedWeek].days[selectedDay].snack1}</li>
            <li className="list-group-item"><strong>🥗 Prânz:</strong> {plan[selectedWeek].days[selectedDay].lunch}</li>
            <li className="list-group-item"><strong>🍌 Gustare:</strong> {plan[selectedWeek].days[selectedDay].snack2}</li>
            <li className="list-group-item"><strong>🍽 Cină:</strong> {plan[selectedWeek].days[selectedDay].dinner}</li>
        </ul>
        </div>
    )}

        {/* TASK-URI */}
        {tasks.length > 0 && tasks.some(task => !task.completed) ? (
        <div className="mt-4">
            <h3>📋 Task-uri pentru ziua {plan[selectedWeek].days[selectedDay].dayName}:</h3>
            <ul className="list-group">
            {tasks.filter(task => !task.completed).map(task => (
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
            <p className="text-muted text-center mt-5 py-5">✅ Nu ai task-uri de făcut azi!</p>
        )}

        {showPopup && (
        <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3">
            {popupMessage}
        </div>
        )}

        {/* FOOTER */}
        <footer className="text-center mt-5 p-3 bg-light">
            <FaUserCircle className="me-2 text-primary" /> © 2025 Plan Alimentar - Sănătate și echilibru
        </footer>
  </div>
);
};

export default App;

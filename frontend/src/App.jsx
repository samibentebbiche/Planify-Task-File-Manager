import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AddTaskPage from './pages/AddTaskPage';
import MonthPage from './pages/MonthPage';
import TaskDetailsPage from './pages/TaskDetailsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/add-task" element={<AddTaskPage />} />
          <Route path="/month/:year/:month" element={<MonthPage />} />
          <Route path="/task/:id" element={<TaskDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

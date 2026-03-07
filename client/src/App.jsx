import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StudentRegister from "./pages/StudentRegister";
import AlumniRegister from "./pages/AlumniRegister";
import StudentLogin from "./pages/StudentLogin";
import AlumniLogin from "./pages/AlumniLogin";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="animated-bg"></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/alumni/register" element={<AlumniRegister />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/alumni/login" element={<AlumniLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

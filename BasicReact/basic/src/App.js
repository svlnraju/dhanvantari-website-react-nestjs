import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import UsersListPage from "./pages/UsersListPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/users" element={<UsersListPage />} />
      </Routes>
    </Router>
  );
}

export default App;

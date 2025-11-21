import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Register from './Auth/Register';
import ClientProfile from './Clients/ClientProfile';
import './App.scss';

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/profile" 
            element={
              isAuthenticated() ? (
                <ClientProfile />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
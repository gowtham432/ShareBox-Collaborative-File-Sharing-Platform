import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import Login from './LoginAndRegistration/Login';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home/Home';
import Registration from './LoginAndRegistration/Registration';
import HomePage from './HomePage/HomePage';
function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/registration" element={<Registration />}></Route>
          <Route path="/homepage" element={<HomePage />}></Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;

import React from "react";
import { Link } from "react-router-dom";

function Home () {
  
    return (
        <div className="home-container">
          <h1>Welcome to My App</h1>
          <div className="button-container">
            <Link to="/login" className="home-button login-button">Login</Link>
            <Link to="/registration" className="home-button registration-button">Registration</Link>
          </div>
        </div>
      );    
}

export default Home;
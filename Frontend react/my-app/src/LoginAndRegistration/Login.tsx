import React, { useState } from 'react';
import './login.css'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalidDetails, setInvalidDetails] = useState('')
    const navigate = useNavigate();

    const url = "http://localhost:4000"
    const handleLogin = () => {
        axios.post(url + "/loggedIn", {
            username: username,
            password: password
        })
            .then((res) => {
                if (res.data === "Invalid login credentials") {
                    setInvalidDetails(res.data)
                } else {
                    console.log(res?.data)
                    sessionStorage.setItem("username", JSON.stringify(res.data))
                    console.log(sessionStorage.getItem("username"))
                    navigate("/homepage")
                }
            })
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="login-input" />
            <br />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="login-input" />
            <br />
            <button onClick={handleLogin} className="login-button">Login</button>
            {invalidDetails.length > 0 && <h4>{invalidDetails}</h4>}
        </div>
    );
};

export default Login;
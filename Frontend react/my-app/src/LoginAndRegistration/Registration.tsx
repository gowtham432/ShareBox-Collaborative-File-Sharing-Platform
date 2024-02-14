import React, { useState } from "react";
import axios from "axios";
import './registration.css'
import { error } from "console";
import { useNavigate } from "react-router";

function Registration() {

    const url: string = "http://localhost:4000"

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [messageEmail, setMessageEmail] = useState('');
    const [messagePassword, setMessagePassword] = useState('');
    const [userexsist,setUserExsist] = useState('')
    const navigate = useNavigate()

    const handleRegister = () => {
        axios.post(url + "/registartion",
            { email: email, username: username, password: password })
            .then((res) => {
                if(typeof res.data === "string"){
                    setUserExsist(res.data)
                } else{
                    navigate("/")
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    const addEmail = (value: string) => {
        let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        setEmail(value)
        if (!emailRegex.test(value)) {
            setMessageEmail("Please Enter a valid email")
        } else {
            setMessageEmail("")
        }
    }

    const addPassword = (value: string) => {
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
        setPassword(value)
        if (!passwordRegex.test(value)) {
            setMessagePassword("Please enter strong password")
        } else {
            setMessagePassword("")
        }
    }

    return (
        <div className="registration-container">
            <h2>Registration</h2>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => addEmail(e.target.value)}
                className="registration-input"
            />
            {messageEmail.length > 0 ? <h4>{messageEmail}</h4> : null}
            <br />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="registration-input"
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => addPassword(e.target.value)}
                className="registration-input"
            />
            {messagePassword.length > 0 ? <h4>{messagePassword}</h4> : null}
            <br />
            <button onClick={handleRegister} className="registration-button">
                Register
            </button>
            {setUserExsist.length > 0 ? <h4>{userexsist}</h4> : null}
        </div>
    );
}

export default Registration
import React from "react";
import { useNavigate } from "react-router";
import './logout.css'

const Logout = ()=>{

    const navigate =  useNavigate()
    const onClick = ()=>{
        sessionStorage.clear()
        navigate("/")
    }

    return(
        <button className="logout-button" onClick={onClick}>
         Logout
    </button>
    )
}

export default Logout
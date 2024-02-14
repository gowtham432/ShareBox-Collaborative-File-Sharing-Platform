import {useEffect} from "react";
import './FileUpload'
import FileUpload from "./FileUpload";
import Logout from "../LoginAndRegistration/Logout";
import { useNavigate } from "react-router";

function HomePage() {

    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.length === 0) {
            navigate("/")
        }
    })

    return (
        <div>
            <FileUpload></FileUpload>
            <Logout></Logout>
        </div>
    )
}

export default HomePage
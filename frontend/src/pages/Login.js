import React, { useState, useEffect } from "react";
import '../index.css';
import { LinearProgress } from "@mui/material";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Donor');
    const [isLoading, setIsLoading] = useState(false);

    const loginHandler = () => {
        if (/\S+@\S+\.\S+/.test(email) === false) {
            window.alert("Enter valid email address");
            return;
        }
        if (password.length === 0) {
            window.alert("Enter the password");
            return;
        }
        setIsLoading(true);
        fetch(`http://localhost:5000/login${userType}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === true) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("email", data.email);
                    localStorage.setItem("id", data.id);
                    if (data.name !== null) {
                        localStorage.setItem("name", data.name);
                    }
                    window.location.replace(`http://localhost:3000/main${userType}/`);
                }
                else {
                    console.log("Error logging in");
                    window.alert(data.msg);
                }
            })
            .catch(err => {
                setIsLoading(false);
                window.alert("Error connecting to server");
            })
    }

    return <>
        <div className="loginContainer">
            <div className="login">
                <div className="loadingContainer">
                    {isLoading && <LinearProgress />}
                </div>
                <div className="inputContainer">
                    <p>Email : </p>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} >
                    </input>
                </div>
                <div className="inputContainer">
                    <p>Password : </p>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}>
                    </input>
                </div>
                <div className="inputContainer center">
                    <select onChange={(e) => setUserType(e.target.value)} value={userType}>
                        <option value={"Donor"}>Donor</option>
                        <option value={"Organisation"}>Organisation</option>
                        <option value={"Admin"}>Admin</option>
                    </select>
                </div>
                <div className="center">
                    <button onClick={loginHandler}>Login</button>
                </div>
                <div className="center">
                    <button onClick={() => window.location.replace("/signup")}>Click here to signup</button>
                </div>
            </div>
        </div>
    </>
}

export default Login;
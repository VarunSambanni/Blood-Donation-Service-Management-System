import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';
import { LinearProgress } from "@mui/material";


const OrganisationSignup = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [size, setSize] = useState('');


    const signupHandler = () => {
        if (/\S+@\S+\.\S+/.test(email) === false) {
            window.alert("Enter valid email address");
            return;
        }

        if (name.length === 0) {
            window.alert("Enter valid name");
            return;
        }

        if (password.length < 8) {
            window.alert("Password must contain 8 characters at least");
            return;
        }
        if (password !== confirmPassword) {
            window.alert("Passwords don't match");
            return;
        }
        if (size.length === 0) {
            window.alert("Enter valid size");
            return;
        }

        setIsLoading(true);
        fetch(`http://localhost:5000/organisationSignup`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ email: email, name: name, password: password, confirmPassword: confirmPassword, size: size })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === true) {
                    localStorage.setItem("token", data.token);
                    window.alert(data.msg);
                }
                else {
                    console.log("Error signing up");
                    window.alert(data.msg);
                }
            })
            .catch(err => {
                setIsLoading(false);
                window.alert("Error connecting to server");
            })
    }


    return <>
        <div className="loadingContainer">
            {isLoading && <LinearProgress />}
        </div>
        <div className="center">
            <div className='pageTitle'>ORGANISATION SIGNUP</div>
        </div>
        <div className="mainContainer">
            <div className="loginContainer">
                <div className="login">
                    <div className="inputContainer">
                        <p>Email : </p>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} >
                        </input>
                    </div>
                    <div className="inputContainer">
                        <p>Name : </p>
                        <input value={name} onChange={(e) => setName(e.target.value)} >
                        </input>
                    </div>
                    <div className="inputContainer">
                        <p>Password : </p>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}>
                        </input>
                    </div>
                    <div className="inputContainer">
                        <p>Confirm Password : </p>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}>
                        </input>
                    </div>
                    <div className="inputContainer">
                        <p>Size : </p>
                        <input value={size} onChange={(e) => setSize(e.target.value)}>
                        </input>
                    </div>
                    <div className="center">
                        <button onClick={signupHandler}>Signup</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default OrganisationSignup;
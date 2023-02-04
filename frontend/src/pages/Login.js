import React, { useState, useEffect } from "react";
import '../index.css';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Donor');
    const [isLoading, setIsLoading] = useState(false);

    const loginHandler = () => {
        setIsLoading(true);
        fetch('http://localhost:5000/login', {
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
                    window.location.replace('http://localhost:3000/mainDonor/');
                }
                else {
                    console.log("Error logging in");
                }
            })
        setIsLoading(false);
    }

    return <>
        <div className="loginContainer">
            {isLoading && <div>Loading...</div>}
            <div className="login">
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
                    </select>
                </div>
                <div className="center">
                    <button onClick={loginHandler}>Login</button>
                </div>
            </div>
        </div>
    </>
}

export default Login;
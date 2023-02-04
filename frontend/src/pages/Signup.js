import React, { useState, useEffect } from "react";
import '../index.css';

const Signup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [bloodType, setBloodType] = useState('O+ve');
    const [phoneNumber, setPhoneNumber] = useState('');

    const signupHandler = () => {

    }


    return <>
        <div className="loginContainer">
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
                <div className="inputContainer">
                    <p>Confirm Password : </p>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}>
                    </input>
                </div>
                <div className="inputContainer">
                    <p>Phone Number : </p>
                    <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}>
                    </input>
                </div>
                <div className="inputContainer flexRow">
                    <p>Blood Type : </p>
                    <select onChange={(e) => setBloodType(e.target.value)} value={bloodType}>
                        <option value={"O+"}>O+</option>
                        <option value={"O-"}>O-</option>
                        <option value={"A+"}>A+</option>
                        <option value={"A-"}>A-</option>
                        <option value={"B+"}>B+</option>
                        <option value={"B-"}>B-</option>
                        <option value={"AB+"}>AB+</option>
                        <option value={"AB-"}>AB-</option>
                    </select>
                </div>
                <div className="center">
                    <button onClick={signupHandler}>Signup</button>
                </div>
            </div>
        </div>
    </>
}

export default Signup;
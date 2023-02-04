import React, { useState, useEffect } from "react";
import '../index.css';

const Signup = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [bloodType, setBloodType] = useState('O+ve');
    const [phoneNumber, setPhoneNumber] = useState('');

    const signupHandler = () => {
        setIsLoading(true);
        fetch(`http://localhost:5000/signupDonor`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password, confirmPassword: confirmPassword, phone_no: phoneNumber, blood_type: bloodType })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === true) {
                    localStorage.setItem("token", data.token);
                    window.location.replace(`http://localhost:3000/`);
                }
                else {
                    console.log("Error signing up");
                    window.alert(data.msg);
                }
            })
            .catch(err => {
                window.alert("Error connecting to server");
            })
        setIsLoading(false);
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
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';
import { LinearProgress } from "@mui/material";


const BloodReception = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [name, setName] = useState('');
    const [bloodType, setBloodType] = useState('O+');

    const receiveHandler = () => {

        if (/\S+@\S+\.\S+/.test(email) === false) {
            window.alert("Enter valid email address");
            return;
        }

        if (name.length === 0) {
            window.alert("Enter valid name");
            return;
        }

        if (phoneNo.length !== 10) {
            window.alert("Enter valid phone number");
            return;
        }

        setIsLoading(true);
        fetch(`http://localhost:5000/bloodReception`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ name: name, phone_no: phoneNo, email: email, blood_type: bloodType })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === true) {
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
            <div className='pageTitle'>BLOOD RECEPTION</div>
        </div>
        <div className="mainContainer">
            <div className="loginContainer">
                <div className="login">
                    <div className="inputContainer">
                        <p>Name : </p>
                        <input value={name} onChange={(e) => setName(e.target.value)} >
                        </input>
                    </div>
                    <div className="inputContainer">
                        <p>Email : </p>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} >
                        </input>
                    </div>
                    <div className="inputContainer">
                        <p>Phone Number : </p>
                        <input value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} >
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
                        <button onClick={receiveHandler}>Receive</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default BloodReception;
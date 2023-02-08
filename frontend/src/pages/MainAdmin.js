import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';
import OrganisationSignup from '../pages/OrganisationSignup';
import Logout from "../components/Logout";
import BloodReception from "./BloodReception";
import DonorsList from "./DonorsList";

const MainAdmin = () => {

    if (localStorage.getItem("menuSelected") === null)
        localStorage.setItem("menuSelected", true);

    useEffect(() => {
        fetch('http://localhost:5000/checkAuthAdmin', {
            method: "GET",
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false) {
                    console.log('Unauthenticated Admin');
                    window.location.replace('http://localhost:3000/');
                }
                console.log("Authenticated Admin");
            })
            .catch(err => {
                console.log("Error connecting to server from mainAdmin");
            })
    }, []);

    return <>
        <div>
            <div className="loggedInBar">
                <div className="loggedInInfo">
                    Logged In As : {localStorage.getItem("email")}
                </div>
                <div className="adminButtonsContainer">
                    <button style={{ marginRight: '0.4em' }} onClick={() => {
                        localStorage.setItem("menuSelected", true);
                        window.location.replace('http://localhost:3000/mainAdmin/');
                    }}>Home</button>
                    <Logout />
                </div>
            </div>
            {
                JSON.parse(localStorage.getItem("menuSelected")) === true ?
                    <div className="menu">
                        <a href='/mainAdmin/organisationSignup' onClick={() => localStorage.setItem("menuSelected", false)} className="menuItem">Organisation Signup </a>
                        <a href='/mainAdmin/bloodReception' onClick={() => localStorage.setItem("menuSelected", false)} className="menuItem">Blood Reception</a>
                        <a href='/mainAdmin/donorsList' onClick={() => localStorage.setItem("menuSelected", false)} className="menuItem">Donors List</a>
                    </div>
                    :
                    <Router>
                        <Switch>
                            <Route exact path='/mainAdmin/organisationSignup'>
                                <OrganisationSignup />
                            </Route>
                            <Route exact path='/mainAdmin/BloodReception'>
                                <BloodReception />
                            </Route>
                            <Route exact path='/mainAdmin/donorsList'>
                                <DonorsList />
                            </Route>
                        </Switch>
                    </Router>
            }

        </div>
    </>
}

export default MainAdmin;
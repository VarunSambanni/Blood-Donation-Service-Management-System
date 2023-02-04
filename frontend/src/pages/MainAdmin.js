import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';
import OrganisationSignup from '../pages/OrganisationSignup';


const MainAdmin = () => {

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
        <div className="mainContainer">
            Hello Admin
            <div className="menu">
                <a href='/mainAdmin/organisationSignup' className="menuItem">Organisation Signup </a>
                <a href='/mainAdmin/bloodReception' className="menuItem">Blood Reception</a>
            </div>
            <Router>
                <Switch>
                    <Route exact path='/mainAdmin/'>

                    </Route>
                    <Route exact path='/mainAdmin/organisationSignup'>
                        <OrganisationSignup />
                    </Route>
                </Switch>
            </Router>

        </div>
    </>
}

export default MainAdmin;
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';
import AddEvents from "./AddEvent";


const MainOrganisation = () => {
    console.log("main organisation");
    useEffect(() => {
        fetch('http://localhost:5000/checkAuthOrganisation', {
            method: "GET",
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false) {
                    console.log('Unauthenticated Organisation');
                    window.location.replace('http://localhost:3000/');
                }
                console.log("Authenticated Organisation");
            })
            .catch(err => {
                console.log("Error connecting to server from mainOrganisation");
            })
    }, []);

    return <>
        <div className="mainContainer">
            <div className="userInfoContainer">
                <div className="userInfoLine">
                    Organisation Email : {localStorage.getItem("email")}
                </div>
                <div className="userInfoLine">
                    Organisation Name : {localStorage.getItem("name")}
                </div>
            </div>
            <div className="menu">
                <a href='/mainOrganisation/addEvents' className="menuItem">Add Event </a>
                <a href='/mainOrganisation/bloodDonation' className="menuItem">Blood Donation</a>
            </div>
            <Router>
                <Switch>

                    <Route exact path='/mainOrganisation/addEvents'>
                        <AddEvents />
                    </Route>
                    <Route exact path='/mainOrganisation/bloodDonation'>
                    </Route>
                </Switch>
            </Router>
        </div>
    </>
}

export default MainOrganisation;
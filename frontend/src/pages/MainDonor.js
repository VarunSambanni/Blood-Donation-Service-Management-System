import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';
import Events from '../pages/Events';

const MainDonor = () => {

    useEffect(() => {
        fetch('http://localhost:5000/checkAuthDonor', {
            method: "GET",
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false) {
                    console.log('Unauthenticated Donor');
                    window.location.replace('http://localhost:3000/');
                }
                console.log("Authenticated Donor");
            })
            .catch(err => {
                console.log("Error connecting to server from mainDonor");
            })
    }, []);


    return <>
        <div className="mainContainer">
            Hello Donor
            <Router>
                <Switch>
                    <Route exact path='/mainDonor/'>
                        <Events></Events>
                    </Route>
                </Switch>
            </Router>
        </div>
    </>
}

export default MainDonor;
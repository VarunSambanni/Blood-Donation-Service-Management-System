import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';
import Events from '../pages/Events';

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
            <Router>
                <Switch>
                    <Route exact path='/mainAdmin/'>
                        <Events></Events>
                    </Route>
                </Switch>
            </Router>
        </div>
    </>
}

export default MainAdmin;
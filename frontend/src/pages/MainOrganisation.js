import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';


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
            Hello Organisation
            <Router>
                <Switch>
                    <Route exact path='/mainOrganisation/'>
                    </Route>
                </Switch>
            </Router>
        </div>
    </>
}

export default MainOrganisation;
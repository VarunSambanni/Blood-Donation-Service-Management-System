import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';
import Events from '../pages/Events';
import Logout from "../components/Logout";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

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
            <div className="loggedInBar">
                <div className="loggedInInfo">
                    <PermIdentityIcon style={{ marginBottom: '-0.28em', transform: 'scale(1.1)', backgroundColor: 'blue', color: 'white', borderRadius: '0.2em' }} />&nbsp;{localStorage.getItem("email")}
                </div>
                <div className="adminButtonsContainer">
                    <Logout />
                </div>
            </div>
            <hr />
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
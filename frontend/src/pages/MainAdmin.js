import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';
import OrganisationSignup from '../pages/OrganisationSignup';
import Logout from "../components/Logout";
import BloodReception from "./BloodReception";
import DonorsList from "./DonorsList";
import OrganisersList from "./OrganisationsList";
import BloodUnitsList from "./BloodUnitsList";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { LinearProgress } from "@mui/material";
import GroupsIcon from '@mui/icons-material/Groups';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InventoryIcon from '@mui/icons-material/Inventory';

const MainAdmin = () => {

    const [isLoading, setIsLoading] = useState(false);

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
                    <PermIdentityIcon style={{ marginBottom: '-0.28em', transform: 'scale(1.1)', backgroundColor: 'blue', color: 'white', borderRadius: '0.2em' }} />&nbsp;{localStorage.getItem("email")}
                </div>
                <div className="adminButtonsContainer">
                    <button style={{ marginRight: '0.4em' }} onClick={() => {
                        localStorage.setItem("menuSelected", true);
                        window.location.replace('http://localhost:3000/mainAdmin/');
                    }}>Home</button>
                    <Logout />
                </div>
            </div>
            <hr />

            {JSON.parse(localStorage.getItem("menuSelected")) === true &&
                <div className="loadingContainer">
                    {isLoading && <LinearProgress />}
                </div>
            }
            {JSON.parse(localStorage.getItem("menuSelected")) === true &&
                <div className="center">
                    <div className='pageTitle'>ADMIN HOME</div>
                </div>
            }

            {
                JSON.parse(localStorage.getItem("menuSelected")) === true ?
                    <div className="menu center">
                        <a href='/mainAdmin/organisationSignup' onClick={() => localStorage.setItem("menuSelected", false)} className="menuItem ">
                            <GroupsIcon style={{ marginBottom: '-0.28em', transform: 'scale(1.2)', color: 'black', borderRadius: '0.2em' }} />&nbsp;
                            Organisation Signup
                        </a>
                        <a href='/mainAdmin/bloodReception' onClick={() => localStorage.setItem("menuSelected", false)} className="menuItem ">
                            <BloodtypeIcon style={{ marginBottom: '-0.28em', transform: 'scale(1.2)', color: 'black', borderRadius: '0.2em' }} />&nbsp;
                            Blood Reception
                        </a>
                        <a href='/mainAdmin/donorsList' onClick={() => localStorage.setItem("menuSelected", false)} className="menuItem ">
                            <PeopleAltIcon style={{ marginBottom: '-0.28em', transform: 'scale(1.2)', color: 'black', borderRadius: '0.2em' }} />&nbsp;
                            Donors
                        </a>
                        <a href='/mainAdmin/organisersList' onClick={() => localStorage.setItem("menuSelected", false)} className="menuItem ">
                            <ListAltIcon style={{ marginBottom: '-0.28em', transform: 'scale(1.2)', color: 'black', borderRadius: '0.2em' }} />&nbsp;
                            Organisers
                        </a>
                        <a href='/mainAdmin/bloodUnitsList' onClick={() => localStorage.setItem("menuSelected", false)} className="menuItem ">
                            <InventoryIcon style={{ marginBottom: '-0.28em', transform: 'scale(1.2)', color: 'black', borderRadius: '0.2em' }} />&nbsp;
                            Blood Units
                        </a>
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
                            <Route exact path='/mainAdmin/organisersList'>
                                <OrganisersList />
                            </Route>
                            <Route exact path='/mainAdmin/bloodUnitsList'>
                                <BloodUnitsList />
                            </Route>
                        </Switch>
                    </Router>
            }

        </div>
    </>
}

export default MainAdmin;
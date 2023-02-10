import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';
import AddEvents from "./AddEvent";
import Logout from "../components/Logout";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BloodDonation from "./BloodDonation";

const MainOrganisation = () => {

    if (localStorage.getItem("menuSelected") === null)
        localStorage.setItem("menuSelected", true);

    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [idRegistrationsMap, setIdRegistrationsMap] = useState({});


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

    useEffect(() => {
        fetch('http://localhost:5000/getAllEventsByOrganisation', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ org_id: localStorage.getItem('id') })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false) {
                    window.alert(data.msg);
                }
                console.log("Events ", data.data);
                data.data.reverse();
                setEvents(data.data);
            })
            .catch(err => {
                console.log("Error connecting to server from mainOrganisation");
            })
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/getRegistrationsByIds', {
            method: "GET",
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false) {
                    window.alert(data.msg);
                }
                else {
                    console.log("Map ", data.data);
                    localStorage.setItem("idRegistrationsMap", JSON.stringify(data.data));
                    let viewsFlag = {};
                    for (const [key, value] of Object.entries(data.data)) {
                        viewsFlag[key] = false;
                    }
                    localStorage.setItem("viewsFlag", JSON.stringify(viewsFlag));
                    setIdRegistrationsMap(data.data);
                    console.log("Map ", idRegistrationsMap);
                }
            })
            .catch(err => {
                console.log("Error connecting to server from mainDonor");
            })
    }, []);


    return <>
        <div className="mainContainer">
            {isLoading && <div>Loading...</div>}
            <div className="loggedInBar">
                <div className="loggedInInfo">
                    Logged In As : {localStorage.getItem("email")}
                    <br />
                    Organisation Name : {localStorage.getItem("name")}
                </div>
                <div className="adminButtonsContainer">
                    <button style={{ marginRight: '0.4em' }} onClick={() => {
                        localStorage.setItem("menuSelected", true);
                        window.location.replace('http://localhost:3000/mainOrganisation/');
                    }}>Home</button>
                    <Logout />
                </div>
            </div>
            {
                JSON.parse(localStorage.getItem("menuSelected")) === true &&
                <div className="menu">
                    <a href='/mainOrganisation/addEvents' onClick={() => { localStorage.setItem("menuSelected", false) }} className="menuItem">Add Event </a>
                    <a href='/mainOrganisation/bloodDonation' onClick={() => { localStorage.setItem("menuSelected", false) }} className="menuItem">Blood Donation</a>
                </div>
            }
            {JSON.parse(localStorage.getItem("menuSelected")) === false &&
                <Router>
                    <Switch>
                        <Route exact path='/mainOrganisation/addEvents'>
                            <AddEvents />
                        </Route>
                        <Route exact path='/mainOrganisation/bloodDonation'>
                            <BloodDonation />
                        </Route>
                    </Switch>
                </Router>
            }
            {JSON.parse(localStorage.getItem("menuSelected")) === true &&
                <div className="eventsContainer">
                    <div className="center">
                        LIST OF EVENTS ORGANISED
                    </div>
                    {
                        events.map((event, idx) => {
                            return <div className="eventContainer">
                                <div className="" key={idx} onClick={{}}>
                                    <p>{event.description}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <p>Time : {event.time}</p>
                                            <p>Venue : {event.venue}</p>
                                        </div>

                                    </div>
                                    <hr />
                                </div>
                                <Accordion sx={{ backgroundColor: '#f7fcfc', border: '1px solid black' }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        View Registrations
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className="center">
                                            {localStorage.getItem("idRegistrationsMap") &&
                                                <table>
                                                    <tr>
                                                        <th>Donor Id</th>
                                                        <th>Email</th>
                                                        <th>Phone No</th>
                                                        <th>Blood Type</th>
                                                    </tr>
                                                    {JSON.parse(localStorage.getItem("idRegistrationsMap")) !== null
                                                        && (event.event_id in JSON.parse(localStorage.getItem("idRegistrationsMap"))) === true
                                                        && JSON.parse(localStorage.getItem("idRegistrationsMap"))[event.event_id].length > 0
                                                        && JSON.parse(localStorage.getItem("idRegistrationsMap"))[event.event_id].map((reg, index) => {
                                                            return <tr key={index}>
                                                                <td>{reg.donor_id}</td>
                                                                <td>{reg.email}</td>
                                                                <td>{reg.phone_no}</td>
                                                                <td>{reg.blood_type}</td>
                                                            </tr>
                                                        })
                                                    }
                                                </table>
                                            }
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        })
                    }
                </div>
            }
        </div>
    </>
}

export default MainOrganisation;
import { LinearProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import '../index.css';

const Events = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [idNameMap, setIdNameMap] = useState({});

    useEffect(() => {
        setIsLoading(true);
        fetch('http://localhost:5000/allEvents', {
            method: "GET",
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === false) {
                    window.alert(data.msg);
                }
                else {
                    data.data.reverse();
                    setEvents(data.data);
                    console.log(data.data);
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log("Error connecting to server from mainDonor");
            })
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetch('http://localhost:5000/getEventNamesByIds', {
            method: "GET",
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === false) {
                    window.alert(data.msg);
                }
                else {
                    setIdNameMap(data.data);
                    console.log(data.data);
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log("Error connecting to server from mainDonor");
            })
    }, []);

    const registerHandler = (event_id) => {
        setIsLoading(true);
        fetch(`http://localhost:5000/registerEvent`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ donor_id: localStorage.getItem("id"), event_id: event_id })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === true) {
                    window.alert(data.msg);
                }
                else {
                    console.log("Error registering for event");
                    window.alert(data.msg);
                }
            })
            .catch(err => {
                setIsLoading(false);
                window.alert("Error connecting to server");
            })
    }


    return <>
        <div>
            <div className="loadingContainer">
                {isLoading && <LinearProgress />}
            </div>
            <div className="center">
                <div className='pageTitle'>EVENTS</div>
            </div>
            <div className="eventsContainer">
                {events.map((event, idx) => {
                    return <div className="eventContainer" key={idx}>
                        <div className="organiserNameContainer">
                            <p className="organiserName">Organisor : {idNameMap[event.event_id]}</p>
                        </div>
                        <p>{event.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <p>Time : {event.time}</p>
                                <p>Venue : {event.venue}</p>
                            </div>
                            <button style={{ marginRight: '0.4em' }} onClick={() => registerHandler(event.event_id)}>Register</button>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </>
}

export default Events;
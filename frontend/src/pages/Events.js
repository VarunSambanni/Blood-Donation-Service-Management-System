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
                console.log("Error connecting to server from mainDonor");
            })
        setIsLoading(false);
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
                if (data.success === false) {
                    window.alert(data.msg);
                }
                else {
                    setIdNameMap(data.data);
                    console.log(data.data);
                }
            })
            .catch(err => {
                console.log("Error connecting to server from mainDonor");
            })
        setIsLoading(false);
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
                window.alert("Error connecting to server");
            })
        setIsLoading(false);
    }


    return <>
        <div>
            {isLoading && <div>Loading...</div>}
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
                            <button onClick={() => registerHandler(event.event_id)}>Register</button>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </>
}

export default Events;
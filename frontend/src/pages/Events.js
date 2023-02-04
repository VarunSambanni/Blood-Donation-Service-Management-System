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



    return <>
        <div>
            {isLoading && <div>Loading...</div>}
            <div className="eventsContainer">
                {events.map((event, idx) => {
                    return <div className="eventContainer">
                        <p>Organisor : {idNameMap[event.event_id]}</p>
                        <p>{event.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Time : {event.time}</p>
                            <p>Venue : {event.venue}</p>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </>
}

export default Events;
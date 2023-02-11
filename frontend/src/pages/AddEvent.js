import React, { useState, useEffect } from "react";
import '../index.css';
import { LinearProgress } from "@mui/material";

const AddEvents = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [venue, setVenue] = useState('');

    const addEventHandler = () => {
        setIsLoading(true);
        fetch(`http://localhost:5000/addEvent`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ description: description, time: time, venue: venue, org_id: localStorage.getItem('id') })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === true) {
                    window.alert(data.msg);
                }
                else {
                    console.log("Error adding event");
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
            <div className="loadingContainer">
                {isLoading && <LinearProgress />}
            </div>
            <div className="center">
                <div className='pageTitle'>ADD EVENT</div>
            </div>
            <div className="loginContainer">
                <div className="login addEventsContainer">
                    <div className="inputContainer">
                        <p>Description : </p>
                        <textarea value={description} cols={10} onChange={(e) => setDescription(e.target.value)} >
                        </textarea>
                    </div>
                    <div className="inputContainer">
                        <p>Time : </p>
                        <input value={time} onChange={(e) => setTime(e.target.value)}>
                        </input>
                    </div>
                    <div className="inputContainer">
                        <p>Venue : </p>
                        <input value={venue} onChange={(e) => setVenue(e.target.value)}>
                        </input>
                    </div>
                    <div className="center">
                        <button onClick={addEventHandler}>Add Event</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default AddEvents;
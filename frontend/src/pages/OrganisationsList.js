import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';


const OrganisersList = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [organisersList, setOrganisersList] = useState([]);
    const [nameFreqMap, setNameFreqMap] = useState({});


    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:5000/getOrganisersList`, {
            method: "GET",
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === true) {
                    console.log(data.data)
                    setOrganisersList(data.data);
                }
                else {
                    window.alert(data.msg);
                }
            })
            .catch(err => {
                window.alert("Error connecting to server");
            })
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetch('http://localhost:5000/getEventNamesByIds-Admin', {
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
                    for (const [key, value] of Object.entries(data.data)) {
                        nameFreqMap[value] = 0;
                    }
                    for (const [key, value] of Object.entries(data.data)) {
                        nameFreqMap[value]++;
                    }
                    console.log(nameFreqMap);
                    setNameFreqMap(nameFreqMap);
                }
            })
            .catch(err => {
                console.log("Error connecting to server from mainDonor");
            })
        setIsLoading(false);
    }, []);


    return <>
        <div>
            <div className="center tableContainer">
                <table>
                    <tr>
                        <th>Organisation Id</th>
                        <th>Name</th>
                        <th>Email No</th>
                        <th>Size</th>
                        <th>Events Organised</th>
                    </tr>
                    {
                        organisersList.map((organiser, idx) => {
                            return <tr key={idx}>
                                <td>{organiser.org_id}</td>
                                <td>{organiser.name}</td>
                                <td>{organiser.email}</td>
                                <td>{organiser.size}</td>
                                <td>{nameFreqMap[organiser.name]}</td>
                            </tr>
                        })
                    }
                </table>
            </div>
        </div>
    </>
}

export default OrganisersList;
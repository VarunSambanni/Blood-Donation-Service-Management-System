import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';


const OrganisersList = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [organisersList, setOrganisersList] = useState([]);

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


    return <>
        <div>
            <div className="center tableContainer">
                <table>
                    <tr>
                        <th>Organisation Id</th>
                        <th>Name</th>
                        <th>Email No</th>
                        <th>Size</th>
                    </tr>
                    {
                        organisersList.map((organiser, idx) => {
                            return <tr key={idx}>
                                <td>{organiser.org_id}</td>
                                <td>{organiser.name}</td>
                                <td>{organiser.email}</td>
                                <td>{organiser.size}</td>
                            </tr>
                        })
                    }
                </table>
            </div>
        </div>
    </>
}

export default OrganisersList;
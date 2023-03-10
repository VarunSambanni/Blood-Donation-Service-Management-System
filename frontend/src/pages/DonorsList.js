import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';
import { LinearProgress } from "@mui/material";

const DonorsList = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [donorsList, setDonorsList] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:5000/getDonorsList`, {
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
                    setDonorsList(data.data);
                }
                else {
                    window.alert(data.msg);
                }
            })
            .catch(err => {
                setIsLoading(false);
                window.alert("Error connecting to server");
            })
    }, []);


    return <>
        <div className="loadingContainer">
            {isLoading && <LinearProgress />}
        </div>
        <div className="center">
            <div className='pageTitle'>DONORS</div>
        </div>
        <div>
            <div className="tableContainer">
                <table>
                    <tr>
                        <th>Donor Id</th>
                        <th>Email</th>
                        <th>Phone No</th>
                        <th>Blood Type</th>
                    </tr>
                    {
                        donorsList.map((donor, idx) => {
                            return <tr>
                                <td>{donor.donor_id}</td>
                                <td>{donor.email}</td>
                                <td>{donor.phone_no}</td>
                                <td>{donor.blood_type}</td>
                            </tr>
                        })
                    }
                </table>
            </div>
        </div>
    </>
}

export default DonorsList;
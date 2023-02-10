import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../index.css';


const BloodUnitsList = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [bloodUnitsList, setBloodUnitsList] = useState([]);

    const groups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

    if (localStorage.getItem('O+') === null) {
        localStorage.setItem("O+", 0);
    }
    if (localStorage.getItem('O-') === null) {
        localStorage.setItem("O-", 0);
    }
    if (localStorage.getItem('A+') === null) {
        localStorage.setItem("A+", 0);
    }
    if (localStorage.getItem('A-') === null) {
        localStorage.setItem("A-", 0);
    }
    if (localStorage.getItem('B+') === null) {
        localStorage.setItem("B+", 0);
    }
    if (localStorage.getItem('B-') === null) {
        localStorage.setItem("B-", 0);
    }
    if (localStorage.getItem('AB+') === null) {
        localStorage.setItem("AB+", 0);
    }
    if (localStorage.getItem('AB-') === null) {
        localStorage.setItem("AB-", 0);
    }

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:5000/getBloodUnitsList`, {
            method: "GET",
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === true) {
                    console.log(data.data);
                    let temp = [0, 0, 0, 0, 0, 0, 0, 0];
                    localStorage.setItem("O+", 0);
                    localStorage.setItem("O-", 0);
                    localStorage.setItem("A+", 0);
                    localStorage.setItem("A-", 0);
                    localStorage.setItem("B+", 0);
                    localStorage.setItem("B-", 0);
                    localStorage.setItem("AB+", 0);
                    localStorage.setItem("AB-", 0);
                    for (let i = 0; i < data.data.length; i++) {
                        if (data.data[i].blood_type === 'O+') {
                            localStorage.setItem("O+", JSON.parse(localStorage.getItem('O+')) + 1);
                        }
                        if (data.data[i].blood_type === 'O-') {
                            localStorage.setItem("O-", JSON.parse(localStorage.getItem('O-')) + 1);
                        }
                        if (data.data[i].blood_type === 'A+') {
                            localStorage.setItem("A+", JSON.parse(localStorage.getItem('A+')) + 1);
                        }
                        if (data.data[i].blood_type === 'A-') {
                            localStorage.setItem("A-", JSON.parse(localStorage.getItem('A-')) + 1);
                        }
                        if (data.data[i].blood_type === 'B+') {
                            localStorage.setItem("B+", JSON.parse(localStorage.getItem('B+')) + 1);
                        }
                        if (data.data[i].blood_type === 'B-') {
                            localStorage.setItem("B-", JSON.parse(localStorage.getItem('B-')) + 1);
                        }
                        if (data.data[i].blood_type === 'AB+') {
                            localStorage.setItem("AB+", JSON.parse(localStorage.getItem('AB+')) + 1);
                        }
                        if (data.data[i].blood_type === 'AB-') {
                            localStorage.setItem("AB-", JSON.parse(localStorage.getItem('AB-')) + 1);
                        }
                    }
                    localStorage.setItem("counts", temp);
                    setBloodUnitsList(data.data);
                }
                else {

                    window.alert(data.msg);
                }
            })
            .catch(err => {
                window.alert("Error connecting to server " + err);
            })
        setIsLoading(false);
    }, []);


    return <>
        <div>
            <div className="center tableContainer">
                <table>
                    <tr>
                        <th>Blood Type</th>
                        <th>Count</th>
                    </tr>
                    {
                        groups.map((ele, idx) => {
                            return <tr key={idx}>
                                <td>{ele}</td>
                                <td>{localStorage.getItem(ele)}</td>
                            </tr>
                        })
                    }
                </table>
            </div>
            <div className="center">LIST OF UNITS</div>
            <div className="center tableContainer">
                <table>
                    <tr>
                        <th>Unit Id</th>
                        <th>Blood Type</th>
                    </tr>
                    {
                        bloodUnitsList.map((bloodUnit, idx) => {
                            return <tr key={idx}>
                                <td>{bloodUnit.unit_id}</td>
                                <td>{bloodUnit.blood_type}</td>
                            </tr>
                        })
                    }
                </table>
            </div>
        </div>
    </>
}

export default BloodUnitsList;
import React, { useState, useEffect } from "react";
import '../index.css';

const Logout = () => {

    const logoutHandler = () => {
        localStorage.clear();
        window.location.replace('http://localhost:3000/');
    }

    return <>
        <button onClick={logoutHandler}>Logout</button>
    </>
}

export default Logout;
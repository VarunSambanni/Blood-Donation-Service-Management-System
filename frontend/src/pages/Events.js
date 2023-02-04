import React, { useState, useEffect } from "react";
import '../index.css';

const Events = () => {
    const [isLoading, setIsLoading] = useState(false);



    return <>
        <div className="eventsContainer">
            {isLoading && <div>Loading...</div>}
            Events Page
        </div>
    </>
}

export default Events;
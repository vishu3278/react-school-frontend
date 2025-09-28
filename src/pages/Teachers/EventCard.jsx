import React, { useState, useEffect } from 'react';
// import axios from 'axios';

const EventCard = (props) => {
  // const [error, setError] = useState(null);
  // const [datestring, setDatestring] = useState("");
  
  const humanDate = (datestring) => {
    const dt = new Date(datestring)
    return `${dt.getDate()} ${dt.getMonth()} ${dt.getFullYear()}`
  };

  useEffect(() => {
    fetchEvents();
  }, []);


  return (
    <div key={props.eventData?._id} className="card bg-opacity-40 relative">
      <span className="text-3xl absolute right-1 top-1">📆</span>
      <p className="">{humanDate(props.eventData?.date)}</p>
      <span className="text-xl">{props.eventData?.events}</span>
    </div>
  );
};
export default EventCard;

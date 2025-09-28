import React, { useState, useEffect } from 'react';
// import axios from 'axios';

const EventCard = (props) => {
  
  const humanDate = (datestring) => {
    const dt = new Date(datestring)
    // return `${dt.getDate()} ${dt.getMonth()+1} ${dt.getFullYear()}`
    return dt.toDateString()
  };

  return (
    <div className={`card bg-${props.color}-100 border-${props.color}-300 relative`}>
      <span className="text-3xl absolute right-1 top-1">📆</span>
      <p className="">{humanDate(props.eventData?.date)}</p>
      <span className="text-xl">{props.eventData?.events}</span>
    </div>
  );
};
export default EventCard;

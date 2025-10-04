import React, { useState, useEffect } from 'react';
// import axios from 'axios';

const EventCard = (props) => {
  
  const humanDate = (datestring) => {
    const dt = new Date(datestring)
    // return `${dt.getDate()} ${dt.getMonth()+1} ${dt.getFullYear()}`
    return dt.toDateString()
  };

  return (
    <div key={props.eventData.id} className={`card bg-gradient-to-br from-${props.color}-200 to-${props.color}-300 border-${props.color}-300 relative`}>
      <span className="text-3xl absolute right-1 top-1 opacity-50">📆</span>
      <p className="">{humanDate(props.eventData?.date)}</p>
      <span className="text-xl">{props.eventData?.events}</span>
    </div>
  );
};
export default EventCard;

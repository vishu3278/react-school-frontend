// EventCalendar.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
/*import {
  EventCalendarContainer,
  Content,
  CalendarContainer,
  Events,
  Event,
  AddEventForm,
  EventInput,
  AddEventButton,
  ErrorText,
} from '../../styles/EventCalendarStyles';*/

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState('');
  const [error, setError] = useState(null);

  // Function to fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/events/getall');
      // console.log(response.data.event)
      const evArr = response.data.event.map((e1) => e1.events)
      setEvents(evArr || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error fetching events');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to add a new event
  const addEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/v1/events', {
        events: newEvent,
      });
      setEvents([...events, response.data.events]);
      setNewEvent('');
    } catch (error) {
      console.error('Error adding event:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error adding event');
      }
    }
  };

  return (
    <section className="bg-sky-200 rounded shadow p-4 my-4">
      {/*<Sidebar />*/}
        <h1 className="text-2xl mb-2">Events & Calendar</h1>
        <div>Current Time: {new Date().toLocaleString()}</div>
      <div className="flex ">
        <div className="w-4/6">
          {/* Display Calendar Here */}
          {/* For example: <Calendar /> */}
          <h2 className="text-xl mb-1">Calendar</h2>
          <div className="h-32"></div>
          <form onSubmit={addEvent}>
            <h2>Add New Event</h2>
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="Enter Event"
            />
            <button type="submit" className="bg-blue-400 rounded px-4 py-1">Add Event</button>
            {error && <p>{error}</p>}
          </form>
        </div>
        <div>
          <h2 className="text-xl mb-1">Events</h2>
          {events.map((events, index) => (
            <div key={index} className="">&bull; {events}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;

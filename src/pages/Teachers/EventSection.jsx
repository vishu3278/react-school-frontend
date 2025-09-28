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
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EventCard from './EventCard';
const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState('');
  const [error, setError] = useState(null);
  const [value, onChange] = useState(new Date());

  // Function to fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/events/getall');
      // console.log(response.data.event)
      // const evArr = response.data.event.map((e1) => {title: e1.events, date: e1.date, id: e1._id})
      setEvents(response.data.event || []);
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
    if (!newEvent || !value) {
      console.error("Date and Event title required")
      return
    }
    try {
      const response = await axios.post('http://localhost:4000/api/v1/events', {
        events: newEvent,
        date: value.toString()
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
    <section className="bg-sky-200 rounded shadow my-4">
      {/*<Sidebar />*/}
        <h1 className="bg-sky-300 text-2xl text-sky-800 font-semibold p-4 mb-2">Events & Calendar</h1>
        {/*<div>Current Time: {new Date().toLocaleString()}</div>*/}
      <div className="flex p-4">
        <div className="w-4/6">
          {/* Display Calendar Here */}
          {/* For example: <Calendar /> */}
          <h2 className="text-xl mb-1">Calendar</h2>
          <div className="min-h-32 mb-4">
            <Calendar onChange={onChange} value={value} />
          </div>
          <h2>Add New Event - {value.toDateString()}</h2>
          <form onSubmit={addEvent} className="my-2">
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="Event title"
            />
            <button type="submit" className="bg-sky-400 ">Add Event</button>
            {error && <p>{error}</p>}
          </form>
        </div>
        <div>
          <h2 className="text-xl mb-1">Events</h2>
          <div className="grid grid-cols-3 gap-2">
            {events.map((event) => (
              <EventCard key={event._id} eventData={event} color="sky" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventSection;

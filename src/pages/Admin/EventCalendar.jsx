// EventCalendar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EventCard from './EventCard';
import { fetchEvents } from '../../services/api';

const EventCalendar = () => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState('');
    const [error, setError] = useState(null);
    const [value, onChange] = useState(new Date());
    const [viewMode, setViewMode] = useState('upcoming'); // 'upcoming' or 'past'

    const loadEvents = useCallback(async () => {
        try {
            const data = await fetchEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Error fetching events');
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const addEvent = async (e) => {
        e.preventDefault();
        if (!newEvent || !value) {
            setError("Date and Event title required");
            return;
        }
        try {
            const response = await axios.post('http://localhost:4000/api/v1/events', {
                events: newEvent,
                date: value.toString()
            });

            if (response.data.event) {
                setEvents([...events, response.data.event]);
            } else {
                loadEvents();
            }

            setNewEvent('');
            setError(null);
        } catch (error) {
            console.error('Error adding event:', error);
            setError(error.response?.data?.message || 'Error adding event');
        }
    };

    // Filter and Sort Logic
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Compare dates only

        if (viewMode === 'upcoming') {
            return eventDate >= today;
        } else {
            return eventDate < today;
        }
    }).sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return viewMode === 'upcoming' ? dateA - dateB : dateB - dateA;
    });

    return (
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <h2 className="bg-blue-50 text-blue-900 px-6 py-4 font-bold text-lg border-b border-gray-100 flex justify-between items-center">
                Events & Calendar
                <div className="flex bg-white/50 p-1 rounded-lg border border-blue-200">
                    <button
                        onClick={() => setViewMode('upcoming')}
                        className={`px-3 py-1 rounded text-sm transition-all ${viewMode === 'upcoming' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setViewMode('past')}
                        className={`px-3 py-1 rounded text-sm transition-all ${viewMode === 'past' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                        Past
                    </button>
                </div>
            </h2>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-md font-semibold text-gray-700 mb-4">Select Date</h3>
                        <div className="flex justify-center">
                            <Calendar
                                onChange={onChange}
                                value={value}
                                className="border-none shadow-sm rounded-lg"
                            />
                        </div>

                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Event - {value.toDateString()}</h3>
                            <form onSubmit={addEvent} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newEvent}
                                    onChange={(e) => setNewEvent(e.target.value)}
                                    placeholder="Event title"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Add
                                </button>
                            </form>
                            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-md font-semibold text-gray-700 mb-4 capitalize">
                            {viewMode} Events ({filteredEvents.length})
                        </h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event, index) => (
                                    <EventCard key={event._id || index} eventData={event} color={viewMode === 'upcoming' ? 'blue' : 'slate'} />
                                ))
                            ) : (
                                <div className="text-center py-10 space-y-2">
                                    <span className="text-4xl block grayscale opacity-30">📅</span>
                                    <p className="text-gray-400">No {viewMode} events found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventCalendar;

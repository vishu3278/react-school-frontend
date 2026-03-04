import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Calendar from 'react-calendar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Announcement = () => {
  // State for managing announcement
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [startDate, setStartDate] = useState(new Date)
  const [endDate, setEndDate] = useState(null)

  // Function to fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/announcements/getall');
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };
  
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const humanDate = (datestring) => {
    const dt = new Date(datestring)
    // return `${dt.getDate()} ${dt.getMonth()+1} ${dt.getFullYear()}`
    return dt.toDateString()
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!announcement) {
      toast.error("Missing required field")
      return
    }
    try {
      const response = await axios.post('http://localhost:4000/api/v1/announcements', {
        announcement, // Ensure that the key matches the backend model
        startDate,
        endDate
      });
      console.log('Announcement sent:', response.data);
      // Display success toast message
      toast.success('Announcement sent successfully');
      // Clear the form
      setAnnouncement('');
      // Fetch announcements again to update the list
      fetchAnnouncements();
    } catch (error) {
      console.error('Error sending announcement:', error);
      // Display error toast message
      toast.error('Error sending announcement');
    }
  };

  return (
    <section className="flex bg-teal-50">
      <aside className="w-64 hidden md:block">
        <Sidebar/>
      </aside>
      <div className="w-full p-4">

      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-10 bg-teal-500 rounded-full"></span>
        <h2 className="box-title ">Announcement Management</h2>
        <div className="bg-white py-1 px-2 ml-auto rounded-lg shadow-sm border border-gray-200 flex items-center gap-2">{announcements.length} announcements</div>
      </div>
      <div className=" p-4">
        {/* Announcement Form */}
        <form className="bg-white p-4 shadow rounded" onSubmit={handleSubmit}>
            <h4 className="text-xl font-medium mt-0 mb-4">Add announcement</h4>
          <div className="flex gap-4">
            <div className="">
              <h5 className="text-md font-medium mb-4">Start date</h5>
                <Calendar
                    onChange={setStartDate}
                    value={startDate}
                    className="border-none shadow-sm rounded-lg"
                />
            </div>
            <div>
            <h5 className="text-md font-medium mb-4">Announcement*</h5>

            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
              rows={2}
              cols={50}
              className="border border-gray-200 rounded p-2"
              />
              </div>
            <div className="">
              <h5 className="text-md font-medium mb-4">End date*</h5>
                  <Calendar
                      onChange={setEndDate}
                      value={endDate}
                      className="border-none shadow-sm rounded-lg"
                  />
              </div>
          </div>
          <div className="text-center my-4">
            <button type="submit" className="bg-teal-400 ">Send Announcement</button>

          </div>
        </form>
        <div>
          {/* Display Announcements */}
          <h2 className="text-xl font-semibold mb-1">Announcements</h2>
          <ul>
            {announcements.map((announcement) => (
              <li className="flex items-center" key={announcement._id}>
                <div className='w-8 text-lg'>📢</div>
                <p className="py-1 leading-tight"> {announcement.announcement}
                  {announcement.endDate ? (<span className='text-xs'><br/>End: {humanDate(announcement.endDate)}</span>) : ('')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
            </div>
    </section>
  );
};

export default Announcement;

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/*import {
  AnnouncementContainer,
  Content,
  Title,
  AnnouncementForm,
  FormGroup,
  Label,
  TextArea,
  Button,
  AnnouncementList,
  AnnouncementItem,
  AnnouncementContent,
} from '../../styles/AnnouncementStyles';*/

const Announcement = () => {
  // State for managing announcement
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/v1/announcements', {
        announcement: announcement, // Ensure that the key matches the backend model
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
    <section className="bg-teal-200 rounded p-4 my-4">
      <ToastContainer />
      {/*<Sidebar />*/}
      <div>
        <h1 className="text-2xl font-semibold mb-2">Announcement</h1>
        {/* Announcement Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <label htmlFor="announcement">Add announcement</label>
            <textarea
              id="announcement"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
              rows={2}
              cols={50}
            />
            <button type="submit" className="bg-teal-400 rounded px-4 py-1">Send Announcement</button>
          </div>
        </form>

        {/* Display Announcements */}
        <h2 className="text-xl mb-1">Announcements</h2>
        <ul>
          {announcements.map((announcement) => (
            <li key={announcement._id}>
              <p>{announcement.announcement}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Announcement;

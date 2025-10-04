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
    <section className="bg-teal-100 rounded my-4">
      <ToastContainer />
      {/*<Sidebar />*/}
      <h1 className="box-title bg-teal-200">Announcement</h1>
      <div className="flex gap-5 p-4">
        {/* Announcement Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="announcement">Add announcement</label>
            <textarea
              id="announcement"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
              rows={2}
              cols={50}
            />
            <button type="submit" className="bg-teal-300 ">Send Announcement</button>
          </div>
        </form>
        <div>
          {/* Display Announcements */}
          <h2 className="text-xl font-semibold mb-1">Announcements</h2>
          <ul>
            {announcements.map((announcement) => (
              <li key={announcement._id}>
                <p className="py-1">📢 {announcement.announcement}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Announcement;

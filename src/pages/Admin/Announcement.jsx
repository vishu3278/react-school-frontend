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
  const [editingId, setEditingId] = useState(null)
  const [editAnnouncement, setEditAnnouncement] = useState('')
  const [editStartDate, setEditStartDate] = useState(null)
  const [editEndDate, setEditEndDate] = useState(null)
  const [showForm, setShowForm] = useState(false)

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

  const startEditing = (item) => {
    setEditingId(item._id)
    setEditAnnouncement(item.announcement || '')
    setEditStartDate(item.startDate ? new Date(item.startDate) : null)
    setEditEndDate(item.endDate ? new Date(item.endDate) : null)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditAnnouncement('')
    setEditStartDate(null)
    setEditEndDate(null)
  }

  const saveEdit = async () => {
    if (!editAnnouncement) {
      toast.error("Missing required field")
      return
    }
    try {
      const payload = {
        announcement: editAnnouncement,
        startDate: editStartDate,
        endDate: editEndDate
      }
      await axios.put(`http://localhost:4000/api/v1/announcements/${editingId}`, payload)
      toast.success('Announcement updated')
      cancelEditing()
      fetchAnnouncements()
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Error updating announcement');
    }
  }

  const deleteAnnouncementItem = async (id) => {
    const ok = window.confirm('Delete this announcement?')
    if (!ok) return
    try {
      await axios.delete(`http://localhost:4000/api/v1/announcements/${id}`)
      toast.success('Announcement deleted')
      if (editingId === id) cancelEditing()
      fetchAnnouncements()
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Error deleting announcement');
    }
  }

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
        <button
          type="button"
          onClick={() => setShowForm(v => !v)}
          className="bg-teal-500 text-white px-3 py-1 rounded"
        >
          {showForm ? 'Hide form' : 'Add announcement'}
        </button>
      </div>
      <div className=" p-4">
        {showForm && (
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
        )}
        <div>
          {/* Display Announcements */}
          <h2 className="text-xl font-semibold mb-1">Announcements</h2>
          <ul>
            {announcements.map((announcement) => (
              <li className="flex items-start gap-3 py-2" key={announcement._id}>
                <div className='w-8 text-lg'>📢</div>
                {editingId === announcement._id ? (
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex-1">
                      <textarea
                        value={editAnnouncement}
                        onChange={(e) => setEditAnnouncement(e.target.value)}
                        rows={2}
                        cols={50}
                        className="border border-gray-200 rounded p-2 w-full"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {editEndDate ? `End: ${humanDate(editEndDate)}` : ''}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-md font-medium mb-2">Start date</h5>
                      <Calendar
                        onChange={setEditStartDate}
                        value={editStartDate}
                        className="border-none shadow-sm rounded-lg"
                      />
                    </div>
                    <div>
                      <h5 className="text-md font-medium mb-2">End date</h5>
                      <Calendar
                        onChange={setEditEndDate}
                        value={editEndDate}
                        className="border-none shadow-sm rounded-lg"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={saveEdit} className="bg-teal-500 text-white px-3 py-1 rounded">Save</button>
                      <button type="button" onClick={cancelEditing} className="bg-gray-200 px-3 py-1 rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 md:flex md:items-center">
                    <p className="py-1 leading-tight flex-1">
                      {announcement.announcement}
                      {announcement.endDate ? (<span className='text-xs block'>End: {humanDate(announcement.endDate)}</span>) : ('')}
                    </p>
                    <div className="mt-2 md:mt-0 flex items-center gap-2">
                      <button type="button" onClick={() => startEditing(announcement)} className="bg-teal-100 text-teal-700 px-3 py-1 rounded border border-teal-200">Edit</button>
                      <button type="button" onClick={() => deleteAnnouncementItem(announcement._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded border border-red-200">Delete</button>
                    </div>
                  </div>
                )}
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

// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import EventCalendar from './EventCalender';
import Announcement from './Announcement';
import Performance from './Performance';
import axios from 'axios';
/*import {
  AdminDashboardContainer,
  Content,
  TopContent,
  BottomContent,
  Section,
  SectionTitle,
  CardContainer,
  Card,
  CardTitle,
  CardContent,
} from '../../styles/DashboardStyles';*/
import '../../styles/Dashboard.css'

const AdminDashboard = () => {
  // const [isOpen, setIsOpen] = useState(true);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState([]);

  /*useEffect(() => {
    fetchEvents();
    fetchAnnouncements();
    fetchStudentPerformance();
  }, []);*/

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/events/getall');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/announcements/getall');
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchStudentPerformance = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/performance/getall');
      setStudentPerformance(response.data.performance || []);
    } catch (error) {
      console.error('Error fetching student performance:', error);
    }
  };

  return (
    <section className="grid wrapper">
      <header className="header bg-blue-900 text-center">
        <h2 className="text-2xl text-white leading-snug p-1">School Management System</h2>
      </header>
      <Sidebar />
      <main className="main" >
        <div className="px-4">
          <section className="shadow my-4 bg-blue-100 rounded ">
            <h2 className="box-title bg-blue-200">Overview</h2>
            <div className="flex justify-between p-4">
              <div>
                <h4 className="font-medium">Total Students</h4>
                <div className="rounded-tr-3xl rounded-bl-3xl bg-gradient-to-br from-blue-200 to-blue-300 text-4xl text-center py-4 font-semibold">500</div>
              </div>
              <div>
                <h4 className="font-medium">Total Teachers</h4>
                <div className="rounded-tr-3xl rounded-bl-3xl bg-gradient-to-br from-blue-200 to-blue-300 text-4xl text-center py-4 font-semibold">10</div>
              </div>
              <div>
                <h4 className="font-medium">Total Classes</h4>
                <div className="rounded-tr-3xl rounded-bl-3xl bg-gradient-to-br from-blue-200 to-blue-300 text-4xl text-center py-4 font-semibold">8</div>
              </div>
            </div>
          </section>

          <Performance studentPerformance={studentPerformance} />
          <EventCalendar events={events} />
          
          <Announcement announcements={announcements} />
        </div>
      </main>
      <footer className="footer text-center text-sm bg-gray-300 text-gray-500 p-1">
        <p>Copyright ©️ 2025</p>
      </footer>
    </section>
  );
};

export default AdminDashboard;

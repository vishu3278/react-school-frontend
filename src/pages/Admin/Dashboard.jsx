// AdminDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import EventCalendar from './EventCalendar';
import Announcement from './Announcement';
import Performance from './Performance';
import Quiz from '../../components/Quiz';
import StatCard from '../../components/StatCard';
import { fetchEvents, fetchAnnouncements, fetchPerformance } from '../../services/api';
import '../../styles/Dashboard.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsData, announcementsData, performanceData] = await Promise.all([
        fetchEvents(),
        fetchAnnouncements(),
        fetchPerformance(),
      ]);

      setEvents(eventsData);
      setAnnouncements(announcementsData);
      setStudentPerformance(performanceData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-blue-600 animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={loadDashboardData}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="grid wrapper bg-gray-50 min-h-screen">
      <header className="header bg-blue-900 shadow-md">
        <h2 className="text-2xl text-white font-bold text-center py-3">School Management System</h2>
      </header>

      <Sidebar />

      <main className="main p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <Quiz />

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
              Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Students" value="500" />
              <StatCard title="Total Teachers" value="10" />
              <StatCard title="Total Classes" value="8" />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Performance studentPerformance={studentPerformance} />
            <EventCalendar events={events} />
          </div>

          <Announcement announcements={announcements} />
        </div>
      </main>

      <footer className="footer bg-white border-t border-gray-200 py-4 mt-8">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} School Management System. All rights reserved.
        </p>
      </footer>
    </section>
  );
};

export default AdminDashboard;

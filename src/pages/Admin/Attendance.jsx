// Attendance.js
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Restrict date to today and past
  const maxDate = new Date();

  const fetchAttendanceForDate = useCallback(async (date, studentList) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/v1/attendance/getall?date=${date.toISOString()}`);
      const records = response.data.attendanceRecords;

      const newAttendanceData = {};
      studentList.forEach(student => {
        const existingRecord = records.find(r => r.student._id === student._id);
        newAttendanceData[student._id] = existingRecord ? existingRecord.status : 'Present'; // Default to Present
      });

      setAttendanceData(newAttendanceData);
    } catch (error) {
      console.error("Error fetching attendance records", error);
      toast.error("Error loading attendance data");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/v1/students/getall');
      const studentList = response.data.students;
      setStudents(studentList);
      await fetchAttendanceForDate(selectedDate, studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error("Error fetching students");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, fetchAttendanceForDate]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const updatedData = { ...attendanceData };
    students.forEach(student => {
      updatedData[student._id] = 'Present';
    });
    setAttendanceData(updatedData);
    toast.info("All students marked as Present");
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const formattedData = Object.entries(attendanceData).map(([studentId, status]) => ({
        student: studentId,
        status,
        date: selectedDate
      }));

      const response = await axios.post('http://localhost:4000/api/v1/attendance', { attendanceData: formattedData });
      toast.success(response.data.message || 'Attendance updated successfully!');
    } catch (error) {
      console.error('Error submitting attendance data:', error);
      toast.error(error.response?.data?.message || 'Error submitting attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-8xl mx-auto space-y-8">
          <header className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Attendance Management</h2>
              <p className="text-gray-500 mt-1">Mark and track student attendance</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleMarkAllPresent}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
              >
                Mark All Present
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || loading}
                className={`px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 hover:shadow-lg active:scale-95'}`}
              >
                {submitting ? 'Saving...' : 'Submit Attendance'}
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Select Date</h3>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  maxDate={maxDate}
                  className="w-full border-none rounded-xl"
                />
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-blue-800 font-medium">Selected: {selectedDate.toDateString()}</p>
                </div>
              </div>
            </aside>

            <section className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Student Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Grade</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        <tr>
                          <td colSpan="3" className="px-6 py-10 text-center">
                            <div className="flex justify-center items-center gap-2 text-gray-400">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Loading students...
                            </div>
                          </td>
                        </tr>
                      ) : students.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-6 py-10 text-center text-gray-500">
                            No students found.
                          </td>
                        </tr>
                      ) : (
                        students.map((student) => (
                          <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                            <td className="px-6 py-4">
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                                {student.grade}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex justify-center gap-2">
                                {['Present', 'Absent', 'Leave'].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusChange(student._id, status)}
                                    className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 border ${attendanceData[student._id] === status
                                      ? status === 'Present'
                                        ? 'bg-green-100 border-green-500 text-green-700 font-bold'
                                        : status === 'Absent'
                                          ? 'bg-red-100 border-red-500 text-red-700 font-bold'
                                          : 'bg-amber-100 border-amber-500 text-amber-700 font-bold'
                                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                      }`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Attendance;

// Attendance.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
/*import {
  AttendanceContainer,
  Content,
  AttendanceContent,
  AttendanceHeader,
  AttendanceList,
  AttendanceItem,
  StudentName,
  CheckboxLabel,
  Divider,
  SubmitButton,
} from '../../styles/AttendanceStyles';*/
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [value, onChange] = useState(new Date());

  useEffect(() => {
    fetchStudents();
  }, [value]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/students/getall');
      setStudents(response.data.students);
      initializeAttendanceData(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  /*const initializeAttendanceData = (students) => {
    const initialAttendanceData = students.map((student) => ({
      id: student._id,
      // reg: student.registrationNumber,
      name: student.name,
      grade: student.grade,
      status: 'Present', // Default to 'Present'
    }));
    setAttendanceData(initialAttendanceData);
  };*/

  const initializeAttendanceData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/attendance/getall?date=${value}`)
      if(response.data.attendanceRecords.length === 0) {
        toast.error('No attendance data found for this date');
        return
      }
      setAttendanceData(response.data.attendanceRecords.map((a) => {
        return {status: a.status, ...a.student}
      }));
    } catch (error) {
      console.error("Error fetching attendanceRecords", error)
    }
  }

  const handleStatusChange = (id, status) => {
    const updatedData = attendanceData.map((student) => {
      if (student.id === id) {
        return { ...student, status };
      }
      return student;
    });
    setAttendanceData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      // Send attendance data to the database
      const formattedData = attendanceData.map(({ id, name, status }) => ({ student: id, name, status, date: value }));
      const response = await axios.post('http://localhost:4000/api/v1/attendance', { attendanceData: formattedData });
      console.log('Attendance data submitted:', response.data);
    } catch (error) {
      console.error('Error submitting attendance data:', error);
    }
  };

  return (
    <section className="bg-yellow-100 rounded flex">
      <ToastContainer />
      {/*<Sidebar />*/}
      <div className="grow">
        <div className="p-4">
          <h2 className="text-2xl mb-2 font-semibold">Attendance </h2>
          <div className="min-h-32 mb-4 flex gap-10">
            <Calendar onChange={onChange} value={value} maxDate={new Date()}/>
            <p>{value.toDateString()}</p>
          </div>
          <div className="grid grid-cols-5">
            {students.map((student, index) => (
              <React.Fragment key={student._id}>
                  <div>{student.name}</div>
                  <div>{student.grade}</div>
                  <div>
                    <label className="checkbox text-green-600">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={attendanceData[index]?.status === 'Present'}
                        onChange={() => handleStatusChange(student._id, 'Present')}
                      />
                      Present
                    </label>
                  </div>

                  <div>
                    <label className="checkbox text-pink-800">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={attendanceData[index]?.status === 'Absent'}
                        onChange={() => handleStatusChange(student._id, 'Absent')}
                      />
                      Absent
                    </label>
                  </div>

                  <div>
                    <label className="checkbox text-amber-800">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={attendanceData[index]?.status === 'Absent with apology'}
                        onChange={() => handleStatusChange(student._id, 'Absent with apology')}
                      />
                      Absent with apology
                    </label>
                  </div>
                
                {/*{index !== students.length - 1 && <hr />}*/}
              </React.Fragment>
            ))}
          </div>
          <button className="bg-amber-400 font-semibold" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </section>
  );
};

export default Attendance;

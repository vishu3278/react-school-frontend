// Exam.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

const Exam = () => {
  const [student, setStudent] = useState({});
  const [students, setStudents] = useState([]);
  const [examData, setExamData] = useState([]);
  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [className, setClassName] = useState('');
  const [marks, setMarks] = useState('');

  useEffect(() => {
    fetchStudents()
    fetchExams();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/students/getall');
      setStudents(response.data.students);
      // initializeAttendanceData(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleChange = (event) => {
    const id = event.target.value
    setStudent(students.filter(std => std._id === id)[0])
  }

  const fetchExams = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/exam/getall');
      if (Array.isArray(response.data)) {
        setExamData(response.data);
      } else {
        setExamData([response.data]); // Wrap non-array response in an array
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    const newExam = { name, registrationNumber, className, marks: parseInt(marks) };
    try {
      const response = await axios.post('http://localhost:4000/api/v1/exam', newExam);
      // Ensure response data is always an object
      if (typeof response.data === 'object') {
        setExamData([...examData, response.data]);
        setName('');
        setRegistrationNumber('');
        setClassName('');
        setMarks('');
      } else {
        console.error('Error: API response data is not an object');
      }
    } catch (error) {
      console.error('Error adding exam:', error);
    }
  };

  const calculateTotalMarks = () => {
    let total = 0;
    for (let i = 0; i < examData.length; i++) {
      total += examData[i].marks;
    }
    return total;
  };

  return (
    <section className="flex bg-teal-50 rounded">
      {/*<div className="" style={{flex: 0 0 250px;}}>*/}
        <Sidebar />
      {/*</div>*/}
      <div className="p-4">
        <h2 className="text-2xl mb-2">Exam Details</h2>
        <div className="flex gap-4">
          <select onChange={handleChange}>
            {students.map((std, ind) => (
              <option key={ind} value={std._id}>{std.name} - {std.grade}</option>
            ))}
          </select>
          <output>
            {student.registrationNumber} - {student.name} - {student.grade}
          </output>
        </div>
        {/*<form className="flex flex-col" onSubmit={handleAddExam}>
          <label className="mt-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label className="mt-2">Registration Number:</label>
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
          />
          <label className="mt-2">Class:</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
          <label className="mt-2">Marks:</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            required
          />
          <button type="submit" className="bg-teal-200 mt-2">Add Exam</button>
        </form>*/}
        <h2>Total Marks: {calculateTotalMarks()}</h2>
        <h3>Exam Details:</h3>
        <ul>
          {examData.map((exam, index) => (
            <li key={index}>
              Name: {exam.name}, Registration Number: {exam.registrationNumber}, Class: {exam.className}, Marks: {exam.marks}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Exam;

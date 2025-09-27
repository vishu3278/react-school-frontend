// Students.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
/*import {
  StudentsContainer,
  Content,
  StudentsContent,
  StudentsHeader,
  StudentList,
  StudentItem,
  AddStudentForm,
  AddStudentInput,
  AddStudentButton,
} from '../../styles/StudentsStyles'; */

const Students = () => {
  const [newStudent, setNewStudent] = useState({ name: '', registrationNumber: '', grade: '' });
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/students/getall');
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/class/getall');
      console.log(response.data)
      // const clsArr = response.data.classes.map((item) => item.grade)
      // console.log(clsArr)
      if (response.data && Array.isArray(response.data.classes)) {
      // if (clsArr.length > 0) 
        setClasses(response.data.classes);
      } else {
        console.error('Error fetching classes: Invalid data format', response.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error.message);
    }
  };

  const handleAddStudent = async (e) => {
    // e.preventDefault();
    if (newStudent.name.trim() !== '' && newStudent.registrationNumber.trim() !== '' && newStudent.grade.trim() !== '') {
      try {
        const response = await axios.post('http://localhost:4000/api/v1/students', newStudent);
        setStudents([...students, response.data.student]);
        setNewStudent({ name: '', registrationNumber: '', grade: '' });
      } catch (error) {
        console.error('Error adding student:', error);
      }
    }
  };

  return (
    <section className="bg-pink-200 rounded shadow p-4 my-4">
      {/*<Sidebar />*/}
      <div>
        <div>
          <h2 className="text-2xl mb-2">Students</h2>
          <form className="inline-flex gap-4 my-2" onSubmit={handleAddStudent}>
            <input
              type="text"
              placeholder="Enter student name"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Enter registration number"
              value={newStudent.registrationNumber}
              onChange={(e) => setNewStudent({ ...newStudent, registrationNumber: e.target.value })}
            />
            {/*<input
              type="text"
              placeholder="Enter grade"
              value={newStudent.grade}
              onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
            />*/}
            <select name="grade"
              onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
             >
              {classes.map((grade, ind) => (
                <option key={grade._id}>{grade.grade}</option>
              ))}
            </select>
            <button type="submit" className="bg-pink-400 ">Add Student</button>
          </form>
          <ul className="list-decimal list-inside">
            {students.map((student) => (
              <li key={student.id}>{student.name} - {student.registrationNumber} - {student.grade}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Students;

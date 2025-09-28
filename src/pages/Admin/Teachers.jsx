// Teachers.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
/*import {
  TeachersContainer,
  Content,
  TeachersContent,
  TeachersHeader,
  TeacherList,
  TeacherItem,
  AddTeacherForm,
  AddTeacherInput,
  AddTeacherButton,
} from '../../styles/TeachersStyles';*/ // Import styled components from TeachersStyles.js

const Teachers = () => {
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', subject: '' });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/teachers/getall');
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (newTeacher.name.trim() !== '' && newTeacher.email.trim() !== '' && newTeacher.subject.trim() !== '') {
      try {
        const response = await axios.post('http://localhost:4000/api/v1/teachers', newTeacher);
        const createdTeacher = response.data.teacher;
        setTeachers([...teachers, createdTeacher]);
        setNewTeacher({ name: '', email: '', subject: '' });
      } catch (error) {
        console.error('Error adding teacher:', error);
      }
    }
  };

  return (
    <section className="bg-green-200 rounded shadow p-4 my-4">
      {/*<Sidebar />*/}
      <div>
        <div className="p-4">
          <h2 className="text-2xl mb-2">Teachers</h2>
          <form onSubmit={handleAddTeacher} className="inline-flex gap-4 my-2">
            <input
              type="text"
              placeholder="Enter teacher name"
              value={newTeacher.name}
              onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Enter teacher email"
              value={newTeacher.email}
              onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Enter teacher subject"
              value={newTeacher.subject}
              onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
            />
            <button type="submit" className="px-4 py-1 bg-green-400 rounded">Add Teacher</button>
          </form>
          <table className="border-collapse " cellPadding="5">
            <thead>
              <tr>
                <th className="border border-green-400">#</th>
                <th className="border border-green-400">name</th>
                <th className="border border-green-400">email</th>
                <th className="border border-green-400">subject</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={index}>
                  <td className="border border-green-400">{index+1}</td>
                  <td className="border border-green-400">{teacher.name}</td>
                  <td className="border border-green-400">{teacher.email}</td>
                  <td className="border border-green-400">{teacher.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Teachers;

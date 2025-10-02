// Classes.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

const Subjects = () => {
  const [newSubject, setNewSubject] = useState('');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, [newSubject]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/subject/getall');
      if (response.data && Array.isArray(response.data.subjects)) {
        setSubjects(response.data.subjects);
      } else {
        console.error('Error fetching Subjects: Invalid data format', response.data);
      }
    } catch (error) {
      console.error('Error fetching Subjects:', error.message);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (newSubject.trim() !== '') {
      try {
        const response = await axios.post('http://localhost:4000/api/v1/subject', { name: newSubject });
        console.log('Response data:', response.data); // Log the response data
        setSubjects(prevSubjects => {
          if (Array.isArray(prevSubjects)) {
            return [...prevSubjects, response.data]; // Use callback function to update state
          } else {
            console.error('Error adding subject: Invalid state for subjects:', prevSubjects);
            return []; // Reset subjectes state to an empty array
          }
        });
        setNewSubject('');
      } catch (error) {
        console.error('Error adding subject:', error);
      }
    }
  };

  return (
    <section className="bg-sky-200 rounded shadow p-4 my-4">
      {/*<Sidebar />*/}
      <div className="grow shrink">
        <div className="p-4">
          <h2>Subjects</h2>
          <form className="mb-4" onSubmit={handleAddSubject}>
            <input
              type="text"
              placeholder="Enter subject name"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <button type="submit" className="bg-sky-400">Add Subject</button>
          </form>
          <ul>
            {/* Ensure that classes is an array before mapping over it */}
            {Array.isArray(subjects) && subjects.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Subjects;

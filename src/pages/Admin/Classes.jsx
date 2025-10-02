// Classes.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
/*import {
  ClassesContainer,
  Content,
  ClassesContent,
  ClassesHeader,
  ClassList,
  ClassItem,
  AddClassForm,
  AddClassInput,
  AddClassButton,
} from '../../styles/ClassesStyles';*/

const Classes = () => {
  const [newClassName, setNewClassName] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/class/getall');
      if (response.data && Array.isArray(response.data.classes)) {
        setClasses(response.data.classes);
        fetchSubjects();
      } else {
        console.error('Error fetching classes: Invalid data format', response.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error.message);
    }
  };

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

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (newClassName.trim() !== '') {
      try {
        const response = await axios.post('http://localhost:4000/api/v1/class', { grade: newClassName });
        // console.log('Response data:', response.data); // Log the response data
        setClasses(prevClasses => {
          if (Array.isArray(prevClasses)) {
            return [...prevClasses, response.data]; // Use callback function to update state
          } else {
            console.error('Error adding class: Invalid state for classes:', prevClasses);
            return []; // Reset classes state to an empty array
          }
        });
        setNewClassName('');
      } catch (error) {
        console.error('Error adding class:', error);
      }
    }
  };

  const handleUpdateClass = async (className, subjectId) => {
    e.preventDefault()
    if (!className) {
      try {
        const response = await axios.put("http://localhost:4000/api/v1/class/updateClass", {grade: className, subjects: subjectId})
        console.log(response.data)
      }
    }
  }

  return (
    <section className="bg-sky-200 rounded shadow p-4 my-4">
      {/*<Sidebar />*/}
      <div className="grow shrink">
        <div className="p-4">
          <h2>Classes</h2>
          <form className="mb-4" onSubmit={handleAddClass}>
            <input
              type="text"
              placeholder="Enter class name"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
            <button type="submit" className=" bg-sky-400">Add Class</button>
          </form>
          {/*<div className="grid grid-cols-8">
            <div>#</div>
            {Array.isArray(classes) && classes.map((classItem, index) => (
              <div key={index}>{classItem.grade}

              </div>
            ))}
              {Array.isArray(subjects) && subjects.map((item, ind) => (
                <div key={item._id}><label className="checkbox"><input type="checkbox" /> {item.name}</label></div>
              ))}
          </div>*/}
          <table className="table table-collapse bor" cellPadding="5">
            <tr>
              <th className="border border-sky-300">Class</th>
              <th className="border border-sky-300" colSpan={subjects.length}>Subjects</th>
            </tr>
            {Array.isArray(classes) && classes.map((classItem, index) => (
              <tr key={index}>
                <td className="border border-sky-300">{classItem.grade}</td>
                {Array.isArray(subjects) && subjects.map((item, ind) => (
                  <td className="border border-sky-300" key={item._id+index}><label className="checkbox"><input type="checkbox"  /> {item.name}</label></td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      </div>
    </section>
  );
};

export default Classes;

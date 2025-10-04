// Classes.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Classes = () => {
  const [newClassName, setNewClassName] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSubject, setClassSubject] = useState([])

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

  const handleClassSubject = (event, className) => {
    // console.log(event.target.checked, className.grade, event.target.value)
    // const cs = {[className.grade]: subject.name}
    const {value, checked} = event.target
    /*if (checked) {
      setClassSubject(prev => [...prev, value])
    } else {
      setClassSubject(prev => prev.filter(item => item !== value))
    }*/
    
    // return
    if (checked) {
      console.info("plus")
      let updatedData = classes.map(cls => {
        if (cls.grade == className.grade) {
          return {...cls, subjects: [...cls.subjects, value]}
        } 
        return cls
      })
      setClasses(updatedData)
      setClassSubject(prev => [...prev, value])
    } else {
      console.info("minus")
      let updatedData = classes.map(cls => {
        if (cls.grade == className.grade) {
          return { ...cls, subjects: cls.subjects.filter(c => c !== value)}
        } 
        return cls
      })
      setClasses(updatedData)
      setClassSubject(prev => prev.filter(item => item !== value))
    }
     
  }

  const handleUpdateClass = async (className) => {
    // e.preventDefault()
    console.log(className, classSubject)
    if (className) {
      try {
        const response = await axios.put("http://localhost:4000/api/v1/class/update", {grade: className, subjects: classSubject})
        console.log(response.data)
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error updating class:', error);
        toast.error('Error sending announcement');
      }
    } else {
      console.error("classname is required")
    }
  }

  return (
    <section className="bg-sky-200 rounded shadow m-2">
      {/*<Sidebar />*/}
      <div className="grow shrink">
        <h2 className="box-title bg-sky-300">Classes</h2>
        <div className="p-4">
          <form className="mb-4" onSubmit={handleAddClass}>
            <input
              type="text"
              placeholder="Enter class name"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
            <button type="submit" className=" bg-sky-300">Add Class</button>
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
            <thead>
              <tr>
                <th className="border border-sky-300">Class</th>
                <th className="border border-sky-300" colSpan={subjects.length}>Subjects</th>
                <th className="border border-sky-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(classes) && classes.map((classItem, index) => (
                <tr key={index}>
                  <td className="border border-sky-300 font-medium">{classItem.grade}</td>
                  {Array.isArray(subjects) && subjects.map((item, ind) => (
                    <td className="border border-sky-300" key={item._id+ind}><label className="checkbox"><input type="checkbox" value={item._id} checked={classItem.subjects?.includes(item._id)} onChange={(event) => handleClassSubject(event, classItem)} /> {item.name}</label></td>
                  ))}
                    <td className="border border-sky-300">
                      <button className="bg-sky-300" onClick={() => handleUpdateClass(classItem.grade)}>Update</button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          {classSubject}
        </div>
      </div>
      <ToastContainer />

    </section>
  );
};

export default Classes;

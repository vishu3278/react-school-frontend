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
    const trimmedName = newClassName.trim();

    if (!trimmedName) {
      return;
    }

    const exists = Array.isArray(classes)
      && classes.some((cls) => String(cls.grade).toLowerCase() === trimmedName.toLowerCase());

    if (exists) {
      toast.error('Class already exists');
      return;
    }

    if (trimmedName !== '') {
      try {
        const response = await axios.post('http://localhost:4000/api/v1/class', { grade: trimmedName });
        const createdClass = {
          grade: trimmedName,
          subjects: [],
        };

        setClasses((prevClasses) => {
          if (Array.isArray(prevClasses)) {
            return [...prevClasses, createdClass];
          }

          console.error('Error adding class: Invalid state for classes:', prevClasses);
          return [createdClass];
        });
        setNewClassName('');
      } catch (error) {
        console.error('Error adding class:', error);
      }
    }
  };

  const handleClassSubject = (event, classItem) => {
    // console.log(event.target.checked, className.grade, event.target.value)
    // const cs = {[className.grade]: subject.name}
    const { value, checked } = event.target;
    /*if (checked) {
      setClassSubject(prev => [...prev, value])
    } else {
      setClassSubject(prev => prev.filter(item => item !== value))
    }*/
    
    // return
    const updatedData = classes.map((cls) => {
      if (cls.grade === classItem.grade) {
        const current = Array.isArray(cls.subjects) ? cls.subjects : [];

        if (checked) {
          const next = current.includes(value) ? current : [...current, value];
          return { ...cls, subjects: next };
        } else {
          const next = current.filter((c) => c !== value);
          return { ...cls, subjects: next };
        }
      }
      return cls;
    });

    setClasses(updatedData);
  };

  const handleUpdateClass = async (classItem) => {
    if (classItem?.grade) {
      try {
        const response = await axios.put("http://localhost:4000/api/v1/class/update", {
          grade: classItem.grade,
          subjects: Array.isArray(classItem.subjects) ? classItem.subjects : [],
        });
        console.log(response.data)
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error updating class:', error);
        toast.error('Error updating class');
      }
    } else {
      console.error('classname is required');
    }
  };

  return (
    <section className="flex bg-sky-100 min-h-[calc(100vh-4rem)]">
      <aside className="w-64 hidden md:block">
        <Sidebar />
      </aside>

      <div className="w-full max-w-8xl p-4">
        <h2 className="box-title bg-gradient-to-r from-sky-200 to-sky-100">Classes</h2>
      
      <div className="grow shrink">
        
        
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
                <th className="border border-sky-300" colSpan={Math.max(subjects.length || 0, 1)}>Subjects</th>
                <th className="border border-sky-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(classes) && classes.map((classItem) => (
                <tr key={classItem._id ?? classItem.grade}>
                  <td className="border border-sky-300 font-medium">{classItem.grade}</td>
                  {Array.isArray(subjects) && subjects.map((item) => (
                    <td className="border border-sky-300" key={item._id}>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          value={item._id}
                          checked={Array.isArray(classItem.subjects) ? classItem.subjects.includes(item._id) : false}
                          onChange={(event) => handleClassSubject(event, classItem)}
                        />{' '}
                        {item.name}
                      </label>
                    </td>
                  ))}
                    <td className="border border-sky-300">
                      <button className="bg-sky-300" onClick={() => handleUpdateClass(classItem)}>Update</button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        
      </div>
      <ToastContainer />
</div>
    </section>
  );
};

export default Classes;

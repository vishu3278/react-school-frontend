// Exam.js
import React, { useState, useEffect, useReducer } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

function reducerFunc(state, action) {
  // console.log(state, action)
  // return state.reduce((curr, acc) => curr + acc, state)
  return Number(state)
}

const Exam = () => {
  const [student, setStudent] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [total, dispatchTotal] = useReducer(reducerFunc, 0);
  const [students, setStudents] = useState([]);
  const [examData, setExamData] = useState([]);
  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  // const [className, setClassName] = useState('');
  const [marks, setMarks] = useState('');
  const [subMark, setSubMark] = useState([]);

  useEffect(() => {
    fetchStudents()
    fetchExams();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/students/getall');
      setStudents(response.data.students);
      fetchSubjects()
    } catch (error) {
      console.error('Error fetching students:', error);
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

  const handleChange = (event) => {
    const id = event.target.value
    setStudent(students.filter(std => std._id == id)[0])
  }

  const handleCount = (event) => {
    dispatchCount({payload: Number(event.target.value)})
  }

  const handleSubjectMark = (event) => {
    const {value, id } = event.target
    // console.log(value, id)
    if (subMark.length === 0) {
      setSubMark([{id, marks: value}])
    } else {
      const exists = subMark.some(sm => sm.id === id);
      if (exists) {
        const updatedData = subMark.map(sm => {
          console.info("sm: ",sm)
          if (sm.id === id) {
            return {...sm, marks: value}
          } 
          return sm
        })
        console.log(updatedData)
        setSubMark(updatedData)
      } else {
        setSubMark([...subMark, { id, marks: value }]);
      }
    }
    // dispatchTotal()
  }

  const fetchExams = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/exam/getall');
      if (Array.isArray(response.data)) {
        setExamData(response.data.exams);
      } else {
        setExamData([response.data.exams]); // Wrap non-array response in an array
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    const newExam = { name: student.name, registrationNumber: student.registrationNumber, className: student.grade, marks: subMark };
    try {
      const response = await axios.post('http://localhost:4000/api/v1/exam', newExam);
      // Ensure response data is always an object
      if (typeof response.data === 'object') {
        setExamData([...examData, response.data]);
        // setName('');
        // setRegistrationNumber('');
        // setClassName('');
        // setMarks('');
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
            <option value="0">Select student</option>
            {students.map((std, ind) => (
              <option key={std._id} value={std._id}>{std.name} - {std.grade}</option>
            ))}
          </select>
          <input type="number" onChange={handleCount} />
          {/*<output className="border px-2">{count}</output>*/}
          <output className="border px-2">
            #️⃣ {student.registrationNumber} - 🧑🏼‍🎓 {student.name} - {student.grade}
          </output>
        </div>
        <form className="flex flex-col my-4" onSubmit={handleAddExam}>
          {/*<label className="mt-2">Name:</label>
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
          />*/}
          <div className="grid grid-cols-2 gap-2">
            
            {subjects.map((item, ind) => (
              <>
              <div key={item._id}>{item.name}</div>
              <div><input type="number" id={item._id} onChange={handleSubjectMark} required /></div>
              </>
            ))}
          </div>

          {/*<label className="mt-2">Marks:</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            required
          />*/}
          <button type="submit" className="bg-teal-200 mt-2">Add Exam</button>
        </form>
        <h2 className="text-2xl mb-2">Total Marks: {calculateTotalMarks()}</h2>
        <h3 className="text-lg mb-1">Exam Details:</h3>
        <div className="grid grid-cols-4 gap-2">
          {examData.map((exam, index) => (
            <>
              <div className="card bg-slate-100">Name:<br/>{exam.name}</div>
              <div className="card bg-slate-100">Registration: {exam.registrationNumber}</div>
              <div className="card bg-slate-100">Grade: {exam.className}</div>
              <div className="card bg-slate-100">Marks: {exam?.marks}</div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Exam;

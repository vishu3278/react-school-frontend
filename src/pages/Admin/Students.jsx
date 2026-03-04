import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { fetchStudents, fetchClasses, createStudent, updateStudent } from '../../services/api';

const Students = () => {
  const [newStudent, setNewStudent] = useState({
    name: '',
    registrationNumber: '',
    grade: '',
    dob: '',
    motherName: '',
    fatherName: '',
    aadharNumber: '',
    address: '',
    rollNumber: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editStudent, setEditStudent] = useState({});
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [studentsData, classesData] = await Promise.all([
          fetchStudents(),
          fetchClasses()
        ]);
        setStudents(studentsData);
        setClasses(classesData);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.registrationNumber || !newStudent.grade || !newStudent.dob || !newStudent.motherName || !newStudent.fatherName || !newStudent.aadharNumber || !newStudent.address || !newStudent.rollNumber) {
      setError("Please fill all fields");
      return;
    }

    try {
      const data = await createStudent(newStudent);
      if (data.success) {
        setStudents([...students, data.student]);
        setNewStudent({
          name: '',
          registrationNumber: '',
          grade: '',
          dob: '',
          motherName: '',
          fatherName: '',
          aadharNumber: '',
          address: '',
          rollNumber: ''
        });
        setError(null);
      }
    } catch (err) {
      console.error('Error adding student:', err);
      setError(err.response?.data?.message || "Error adding student");
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setEditStudent({ ...student, dob: student.dob ? student.dob.split('T')[0] : '' });
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const data = await updateStudent(editingId, editStudent);
      if (data.success) {
        setStudents(students.map(s => s._id === editingId ? data.student : s));
        setEditingId(null);
        setError(null);
      }
    } catch (err) {
      console.error('Error updating student:', err);
      setError(err.response?.data?.message || "Error updating student");
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = filterClass === 'All' || student.grade === filterClass;
      return matchesSearch && matchesClass;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  if (loading) return <div className="p-8 text-center text-blue-600 animate-pulse">Loading Students...</div>;

  return (
    <section className="flex bg-pink-50 min-h-screen">
      <aside className="w-64 hidden md:block">
        <Sidebar />
      </aside>
      <div className="w-full max-w-8xl p-4">
      <div className="p-4 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="w-2 h-10 bg-pink-500 rounded-full mr-4"></span>
            Student Management
          </h2>
          <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 px-2">Total Students: {students.length}</span>
          </div>
        </div>

        {/* Add Student Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Student</h3>
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Registration No."
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              value={newStudent.registrationNumber}
              onChange={(e) => setNewStudent({ ...newStudent, registrationNumber: e.target.value })}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              value={newStudent.dob}
              onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
            />
            <input
              type="text"
              placeholder="Aadhar No."
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              value={newStudent.aadharNumber}
              onChange={(e) => setNewStudent({ ...newStudent, aadharNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="Father's Name"
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              value={newStudent.fatherName}
              onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Mother's Name"
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              value={newStudent.motherName}
              onChange={(e) => setNewStudent({ ...newStudent, motherName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              value={newStudent.address}
              onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
            />
            <select
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all bg-white"
              value={newStudent.grade}
              onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls.grade}>{cls.grade}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Roll No."
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              value={newStudent.rollNumber}
              onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
            />
            <button
              type="submit"
              className="bg-pink-500 text-white font-bold py-2 rounded-xl hover:bg-pink-600 transition-all shadow-md active:scale-95 md:col-span-1"
            >
              Add Student
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {/* Filters and List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/50">
            <div className="flex-1 max-w-md relative">
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by name or reg no..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                className="px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-blue-500"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="All">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls.grade}>{cls.grade}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('name')}>
                    Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('rollNumber')}>
                    Roll No {sortConfig.key === 'rollNumber' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('registrationNumber')}>
                    Reg No {sortConfig.key === 'registrationNumber' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('grade')}>
                    Class {sortConfig.key === 'grade' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4">Parents</th>
                  <th className="px-6 py-4">Aadhar / DOB</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSortedStudents.length > 0 ? (filteredAndSortedStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors group">
                    {editingId === student._id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded"
                            value={editStudent.name}
                            onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                          />
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded mt-1 text-xs"
                            placeholder="Address"
                            value={editStudent.address}
                            onChange={(e) => setEditStudent({ ...editStudent, address: e.target.value })}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded"
                            value={editStudent.rollNumber}
                            onChange={(e) => setEditStudent({ ...editStudent, rollNumber: e.target.value })}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded"
                            value={editStudent.registrationNumber}
                            onChange={(e) => setEditStudent({ ...editStudent, registrationNumber: e.target.value })}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            className="w-full px-2 py-1 border rounded"
                            value={editStudent.grade}
                            onChange={(e) => setEditStudent({ ...editStudent, grade: e.target.value })}
                          >
                            {classes.map((cls) => (
                              <option key={cls._id} value={cls.grade}>{cls.grade}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-xs"
                            placeholder="Father"
                            value={editStudent.fatherName}
                            onChange={(e) => setEditStudent({ ...editStudent, fatherName: e.target.value })}
                          />
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded mt-1 text-xs"
                            placeholder="Mother"
                            value={editStudent.motherName}
                            onChange={(e) => setEditStudent({ ...editStudent, motherName: e.target.value })}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-xs"
                            placeholder="Aadhar"
                            value={editStudent.aadharNumber}
                            onChange={(e) => setEditStudent({ ...editStudent, aadharNumber: e.target.value })}
                          />
                          <input
                            type="date"
                            className="w-full px-2 py-1 border rounded mt-1 text-xs"
                            value={editStudent.dob}
                            onChange={(e) => setEditStudent({ ...editStudent, dob: e.target.value })}
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col gap-1">
                            <button onClick={handleUpdateStudent} className="text-green-600 text-xs font-bold hover:underline">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-gray-500 text-xs font-bold hover:underline">Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          <div>{student.name}</div>
                          <div className="text-xs text-gray-400 font-normal">{student.address}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{student.rollNumber}</td>
                        <td className="px-6 py-4 text-gray-600">{student.registrationNumber}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            {student.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          <div>F: {student.fatherName}</div>
                          <div>M: {student.motherName}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          <div>ID: {student.aadharNumber}</div>
                          <div>DOB: {student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleEdit(student)} className="bg-yellow-100 hover:bg-yellow-200 transition-colors " title="Edit">✏️</button>
                            <button className="bg-red-100 hover:bg-red-200 transition-colors " title="Delete">🗑️</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400 italic">
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Students;

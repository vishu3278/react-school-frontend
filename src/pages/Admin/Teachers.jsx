import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { fetchTeachers, createTeacher, fetchSubjects, updateTeacher } from '../../services/api';

const Teachers = () => {
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', mobile: '', subject: '', status: 'active' });
  const [teachers, setTeachers] = useState([]);
  const [dbSubjects, setDbSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editing State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', mobile: '', subject: '', status: 'active' });

  // Filter and Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [teachersData, subjectsData] = await Promise.all([
          fetchTeachers(),
          fetchSubjects()
        ]);
        setTeachers(teachersData);
        setDbSubjects(subjectsData);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    const sanitizedEmail = newTeacher.email?.trim();
    if (!newTeacher.name?.trim() || !newTeacher.mobile?.trim() || !newTeacher.subject) {
      setError("Name, Mobile, and Subject are required");
      return;
    }

    try {
      const data = await createTeacher({
        ...newTeacher,
        name: newTeacher.name.trim(),
        mobile: newTeacher.mobile.trim(),
        email: sanitizedEmail || ""
      });
      if (data.success) {
        setTeachers([...teachers, data.teacher]);
        setNewTeacher({ name: '', email: '', mobile: '', subject: '', status: 'active' });
        setError(null);
      }
    } catch (err) {
      console.error('Error adding teacher:', err);
      setError(err.response?.data?.message || "Error adding teacher");
    }
  };

  const handleStartEdit = (teacher) => {
    setEditingId(teacher._id);
    setEditForm({
      name: teacher.name,
      email: teacher.email || '',
      mobile: teacher.mobile,
      subject: teacher.subject,
      status: teacher.status || 'active'
    });
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      const sanitizedData = {
        ...editForm,
        name: editForm.name.trim(),
        mobile: editForm.mobile.trim(),
        email: editForm.email?.trim() || ""
      };
      const data = await updateTeacher(editingId, sanitizedData);
      if (data.success) {
        setTeachers(teachers.map(t => t._id === editingId ? data.teacher : t));
        setEditingId(null);
        setError(null);
      }
    } catch (err) {
      console.error('Error updating teacher:', err);
      setError(err.response?.data?.message || "Error updating teacher");
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter options
  const subjectOptions = ['All', ...dbSubjects.map(s => s.name), '--'];
  const uniqueSubjectOptions = [...new Set(subjectOptions)];
  const statusOptions = ['All', 'active', 'inactive'];

  const filteredAndSortedTeachers = teachers
    .filter(teacher => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = teacher.name.toLowerCase().includes(searchStr) ||
        (teacher.email && teacher.email.toLowerCase().includes(searchStr)) ||
        teacher.mobile.includes(searchStr) ||
        teacher.subject.toLowerCase().includes(searchStr);
      const matchesSubject = filterSubject === 'All' || teacher.subject === filterSubject;
      const matchesStatus = filterStatus === 'All' || teacher.status === filterStatus;
      return matchesSearch && matchesSubject && matchesStatus;
    })
    .sort((a, b) => {
      const valA = (a[sortConfig.key] || '').toString().toLowerCase();
      const valB = (b[sortConfig.key] || '').toString().toLowerCase();
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) return <div className="p-8 text-center text-green-600 animate-pulse">Loading Teachers...</div>;

  return (
    <section className="flex bg-green-50 min-h-screen ">
      <aside className="w-64 hidden md:block">
        <Sidebar />
      </aside>
      <div className="w-full  p-4">
      <div className=" space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="w-2 h-10 bg-green-500 rounded-full mr-4"></span>
            Staff Management
          </h2>
          <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 px-2">Total Staff: {teachers.length}</span>
          </div>
        </div>

        {/* Add Teacher Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Staff</h3>
          <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Full Name *"
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm"
              value={newTeacher.name}
              onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Mobile Number *"
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm"
              value={newTeacher.mobile}
              onChange={(e) => setNewTeacher({ ...newTeacher, mobile: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email (Optional)"
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm"
              value={newTeacher.email}
              onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
            />
            <select
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all bg-white text-sm"
              value={newTeacher.subject}
              onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
            >
              <option value="">Dept/Subject *</option>
              {dbSubjects.map((sub) => (
                <option key={sub._id} value={sub.name}>{sub.name}</option>
              ))}
              <option value="--">-- (Non-Teaching)</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all bg-white text-sm"
              value={newTeacher.status}
              onChange={(e) => setNewTeacher({ ...newTeacher, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              type="submit"
              className="bg-green-500 text-white font-bold py-2 rounded-xl hover:bg-green-600 transition-all shadow-md active:scale-95 text-sm"
            >
              Add Staff
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {/* Filters and List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row gap-4 justify-between bg-gray-50/50">
            <div className="flex-1 max-lg:max-w-full max-w-md relative">
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search staff..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <select
                className="px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                {uniqueSubjectOptions.map((sub, idx) => (
                  <option key={idx} value={sub}>{sub === 'All' ? 'All Departments' : sub}</option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt === 'All' ? 'All Status' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:text-green-600 transition-colors" onClick={() => handleSort('name')}>
                    Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-green-600 transition-colors" onClick={() => handleSort('mobile')}>
                    Mobile {sortConfig.key === 'mobile' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-green-600 transition-colors" onClick={() => handleSort('email')}>
                    Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-green-600 transition-colors" onClick={() => handleSort('subject')}>
                    Dept {sortConfig.key === 'subject' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-green-600 transition-colors text-center" onClick={() => handleSort('status')}>
                    Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSortedTeachers.length > 0 ? (
                  filteredAndSortedTeachers.map((teacher) => (
                    <tr key={teacher._id} className={`hover:bg-gray-50 transition-colors group ${editingId === teacher._id ? 'bg-green-50/50' : ''}`}>
                      {editingId === teacher._id ? (
                        /* Edit Mode Row */
                        <>
                          <td className="px-4 py-2">
                            <input
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-green-500 outline-none text-sm"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-green-500 outline-none text-sm"
                              value={editForm.mobile}
                              onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-green-500 outline-none text-sm"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-green-500 outline-none bg-white text-sm"
                              value={editForm.subject}
                              onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                            >
                              {dbSubjects.map(sub => <option key={sub._id} value={sub.name}>{sub.name}</option>)}
                              <option value="--">--</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <select
                              className="px-2 py-1 border rounded focus:ring-1 focus:ring-green-500 outline-none bg-white text-sm"
                              value={editForm.status}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 text-center space-x-2">
                            <button onClick={handleUpdateTeacher} className="text-green-600 hover:text-green-800 font-bold text-sm">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700 font-bold text-sm">Cancel</button>
                          </td>
                        </>
                      ) : (
                        /* Normal View Row */
                        <>
                          <td className="px-6 py-4 font-medium text-gray-800">{teacher.name}</td>
                          <td className="px-6 py-4 text-gray-600 font-mono text-sm">{teacher.mobile}</td>
                          <td className="px-6 py-4 text-gray-500 italic text-sm">{teacher.email || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${teacher.subject === '--' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                              {teacher.subject}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${teacher.status === 'inactive' ? 'bg-gray-200 text-gray-600' : 'bg-green-500 text-white'}`}>
                              {teacher.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button onClick={() => handleStartEdit(teacher)} className="text-gray-400 hover:text-green-600 transition-colors">✏️</button>
                              <button className="text-gray-400 hover:text-red-500 transition-colors">🗑️</button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 italic">
                      No staff members found matching your criteria.
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

export default Teachers;

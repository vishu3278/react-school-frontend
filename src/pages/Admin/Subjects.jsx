import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { fetchSubjects, createSubject } from '../../services/api';

const Subjects = () => {
  const [newSubject, setNewSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const data = await fetchSubjects();
        setSubjects(data);
      } catch (err) {
        setError("Failed to load subjects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      setError("Subject name is required");
      return;
    }

    try {
      const data = await createSubject({ name: newSubject });
      if (data.success) {
        // The backend returns { success: true, message: "Subject Created!" }
        // We might need to re-fetch or if the backend returns the subject, use it.
        // Let's re-fetch to be safe if the object isn't returned, or append if it is.
        // Based on subjectController.js, it doesn't return the object.
        const updatedData = await fetchSubjects();
        setSubjects(updatedData);
        setNewSubject('');
        setError(null);
      }
    } catch (err) {
      console.error('Error adding subject:', err);
      setError(err.response?.data?.message || "Error adding subject");
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedSubjects = subjects
    .filter(subject => {
      const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
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

  if (loading) return <div className="p-8 text-center text-sky-600 animate-pulse">Loading Subjects...</div>;

  return (
    <section className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="w-2 h-10 bg-sky-500 rounded-full mr-4"></span>
            Subject Management
          </h2>
          <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 px-2">Total Subjects: {subjects.length}</span>
          </div>
        </div>

        {/* Add Subject Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Subject</h3>
          <form onSubmit={handleAddSubject} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="e.g. Mathematics, Physics, Art"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <button
              type="submit"
              className="bg-sky-500 text-white font-bold px-8 py-2 rounded-xl hover:bg-sky-600 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Add Subject
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {/* Filters and List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <div className="max-w-md relative">
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search subjects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:text-sky-600 transition-colors" onClick={() => handleSort('name')}>
                    Subject Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSortedSubjects.length > 0 ? (
                  filteredAndSortedSubjects.map((subject, index) => (
                    <tr key={subject._id || index} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-gray-800">{subject.name}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-gray-300 hover:text-red-500 transition-colors">🗑️</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-6 py-12 text-center text-gray-400 italic">
                      No subjects found. Add your first subject above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subjects;

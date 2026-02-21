// Performance.js
import React from 'react';

const Performance = ({ studentPerformance = [] }) => {
  // Calculate average score if data exists
  const averageScore = studentPerformance.length > 0
    ? (studentPerformance.reduce((acc, curr) => acc + curr.score, 0) / studentPerformance.length).toFixed(1)
    : 0;

  // Get top performances (sorted by score descending)
  const topPerformances = [...studentPerformance]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <h2 className="bg-indigo-50 text-indigo-900 px-6 py-4 font-bold text-lg border-b border-gray-100">
        School Performance
      </h2>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-700">General Stats</h3>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Average Score</span>
                <span className="text-2xl font-bold text-indigo-700">{averageScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Records</span>
                <span className="text-lg font-semibold text-gray-700">{studentPerformance.length}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-4">Top 3 Performances</h3>
            <div className="space-y-3">
              {topPerformances.length > 0 ? (
                topPerformances.map((perf, index) => (
                  <div key={perf._id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-800">{perf.title}</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                      {perf.score}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4 italic">No data available yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Performance;

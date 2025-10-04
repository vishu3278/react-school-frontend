// Performance.js
import React from 'react';
import Sidebar from './Sidebar';
/*import {
  PerformanceContainer,
  Content,
  PerformanceContent,
  PerformanceHeader,
  SchoolPerformance,
  IndividualPerformance,
} from '../../styles/PerformanceStyles'; */

const Performance = () => {
  // Sample data for school performance
  const schoolPerformanceData = {
    averageScore: 85,
    totalStudents: 100,
  };

  // Sample data for individual student performance
  const individualPerformanceData = [
    { id: 1, name: 'John Doe', score: 90 },
    { id: 2, name: 'Jane Smith', score: 85 },
    { id: 3, name: 'Michael Johnson', score: 92 },
  ];

  return (
    <section className="bg-indigo-100 shadow rounded my-4">
      {/*<Sidebar /> */}
      
          <h2 className="box-title bg-indigo-200">School Performance</h2>
          <div className="flex justify-between p-4">
            
            <div>
              <p>Average Score: {schoolPerformanceData.averageScore}</p>
              <p>Total Students: {schoolPerformanceData.totalStudents}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium">Top 3 performances</h2>
              {individualPerformanceData.map((student) => (
                <p key={student.id}>
                  {student.name}: {student.score}
                </p>
              ))}
            </div>
          </div>
        
      
    </section>
  );
};

export default Performance;

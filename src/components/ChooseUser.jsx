// ChooseUser.js
import React from 'react';
// import { ChooseUserContainer, UserSection, Title, Button } from '../styles/ChooseUserStyles'; // Import styles
import { Link } from 'react-router-dom';

const ChooseUser = () => {
  return (
    <div className="flex gap-10 p-10">
      <div className="text-center grow bg-gradient-to-br from-purple-200 to-purple-200 via-purple-100 p-4">
        <h3 className="text-3xl mb-4">Admin</h3>
        <Link to="/admin-signIn" className="button bg-purple-300 ">Login as Admin</Link>
      </div>
      <div className="text-center grow bg-gradient-to-br from-pink-200 to-pink-200 via-pink-100 p-4">
        <h3 className="text-3xl mb-4">Student</h3>
        <Link to="/student-signIn" className="button bg-pink-300 ">Login as Student</Link>
      </div>
      <div className="text-center grow bg-gradient-to-br from-green-200 to-green-200 via-green-100 p-4">
        <h3 className="text-3xl mb-4">Teacher</h3>
        <Link to="/teacher-signIn" className="button bg-green-300 ">Login as Teacher</Link>
      </div>
    </div>
  );
};

export default ChooseUser;

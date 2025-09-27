import React, { useState } from 'react';
// import { AdminSignInContainer, FormContainer, InputField, SubmitButton } from '../styles/AdminSignInStyles';
import axios from 'axios';

const AdminSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:4000/api/v1/register/signin', { email, password }); 
      if (response.status === 200) {
        // Sign-in successful, redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        // Handle sign-in errors
        console.error('Sign-in failed');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:4000/api/v1/register/admin', { email, password }); 
      if (response.status === 200) {
        // Sign-in successful, redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        // Handle sign-in errors
        console.error('Sign-in failed');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-10 p-10">
      <div className="bg-purple-100 rounded p-5">
        <h2 className="text-2xl mb-2">Admin Sign In</h2>
        <form className="inline-flex gap-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /> 
          <button onClick={handleSignIn} className="bg-purple-300">Sign In</button>
        </form>
      </div>

      <div className="bg-fuchsia-100 p-5 rounded">
        <h2 className="text-2xl mb-2">Admin Create</h2>
        <form className="inline-flex gap-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /> 
          <button onClick={handleCreate} className="bg-fuchsia-300">Create</button>
        </form>
      </div>

    </div>
  );
};

export default AdminSignIn;

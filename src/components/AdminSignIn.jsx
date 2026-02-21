import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, registerAdmin } from '../services/api';

const AdminSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = isRegistering
        ? await registerAdmin(email, password)
        : await loginAdmin(email, password);

      if (response.status === 200) {
        navigate('/admin/dashboard');
      } else {
        setError(isRegistering ? 'Registration failed' : 'Sign-in failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.response?.data?.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-fuchsia-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isRegistering ? 'Admin Registration' : 'Admin Portal'}
          </h2>
          <p className="text-purple-100 text-sm">
            {isRegistering ? 'Create your administrator account' : 'Sign in to manage your school system'}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="admin@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-[0.98] ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:shadow-purple-200 hover:brightness-110'
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isRegistering ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              {isRegistering ? 'Already have an account?' : 'Need to create an admin account?'}
            </p>
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="mt-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              {isRegistering ? 'Sign in instead' : 'Register now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;

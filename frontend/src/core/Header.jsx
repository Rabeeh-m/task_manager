
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleAuthAction = () => {
    if (isAuthenticated) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-wide hover:text-gray-300 transition duration-300 cursor-pointer" onClick={() => navigate('/')}>
          Task Manager
        </h1>
        <button
          onClick={handleAuthAction}
          className="px-5 py-2 rounded-xl font-semibold bg-white text-black hover:bg-gray-100 hover:shadow-md transition-all duration-300"
        >
          {isAuthenticated ? 'Log out' : 'Log in'}
        </button>
      </div>
    </header>
  );
};

export default Header;

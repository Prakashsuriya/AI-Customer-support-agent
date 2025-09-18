import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md h-16">
      <div className="container mx-auto flex justify-between items-center h-full px-4">
        <Link to="/chat" className="text-xl font-bold text-indigo-600">
          AI Support Agent
        </Link>
        <div className="flex items-center space-x-4">
          {userInfo.token ? (
            <>
              <span className="text-gray-700">Welcome, {userInfo.username}</span>
              <button 
                onClick={logoutHandler} 
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors duration-300"
            >
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

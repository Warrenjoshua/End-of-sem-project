import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Study Group Finder
          </Link>
          {user && (
            <div className="flex space-x-4">
              <Link to="/" className="hover:text-gray-200">Dashboard</Link>
              <Link to="/groups" className="hover:text-gray-200">Browse Groups</Link>
              <Link to="/groups/create" className="hover:text-gray-200">Create Group</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-gray-200">Admin</Link>
              )}
              <button onClick={handleLogout} className="hover:text-gray-200">
                Logout ({user.name})
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
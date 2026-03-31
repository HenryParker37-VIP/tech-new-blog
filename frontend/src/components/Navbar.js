import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600">TechPulse</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">
              Home
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

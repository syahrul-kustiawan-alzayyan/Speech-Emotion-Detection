import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <span className="mr-2">😊</span>
          Emotion Detector
        </Link>
        <div className="flex space-x-4">
          <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded transition">
            Home
          </Link>
          <Link to="/realtime" className="hover:bg-blue-700 px-3 py-2 rounded transition">
            Real-time Detection
          </Link>
          <Link to="/upload" className="hover:bg-blue-700 px-3 py-2 rounded transition">
            Upload File
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
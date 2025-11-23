import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RealtimeDetection from './pages/RealtimeDetection';
import FileDetection from './pages/FileDetection';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/realtime" element={<RealtimeDetection />} />
          <Route path="/upload" element={<FileDetection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProducerConsumer from './pages/ProducerConsumer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/producer-consumer" element={<ProducerConsumer />} />
        {/* Add more routes for other IPC problems later */}
      </Routes>
    </Router>
  );
};

export default App;
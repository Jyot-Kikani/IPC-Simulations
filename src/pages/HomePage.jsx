import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        IPC Problem Simulations
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Producer-Consumer Card */}
        <Link
          to="/producer-consumer"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">
            Producer-Consumer Problem
          </h2>
          <p className="text-gray-600">
            Explore the classic synchronization problem with producers and consumers sharing a buffer.
          </p>
        </Link>
        {/* Placeholder for future simulations */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg opacity-50">
          <h2 className="text-2xl font-semibold text-gray-500 mb-2">
            Dining Philosophers (Coming Soon)
          </h2>
          <p className="text-gray-600">
            Simulate resource contention among philosophers.
          </p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg opacity-50">
          <h2 className="text-2xl font-semibold text-gray-500 mb-2">
            Readers-Writers (Coming Soon)
          </h2>
          <p className="text-gray-600">
            Manage concurrent access to a shared resource.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
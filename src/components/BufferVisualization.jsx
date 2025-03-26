import React from 'react';

const BufferVisualization = ({ buffer }) => {
  return (
    <div className="flex justify-center gap-4 mb-6">
      {buffer.map((item, index) => (
        <div
          key={index}
          className={`w-16 h-16 border-2 border-gray-500 flex items-center justify-center text-lg font-medium rounded ${
            item ? 'bg-green-500 text-white' : 'bg-gray-100'
          }`}
        >
          {item || ''}
        </div>
      ))}
    </div>
  );
};

export default BufferVisualization;
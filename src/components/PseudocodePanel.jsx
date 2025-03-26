import React from 'react';

const PseudocodePanel = ({
  producerCode,
  consumerCode,
  producerHighlightedLine,
  consumerHighlightedLine,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">
          Producer Pseudocode
        </h3>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
          {producerCode.map((line, index) => (
            <div
              key={index}
              className={
                index === producerHighlightedLine - 1 ? 'bg-yellow-200' : ''
              }
            >
              {line}
            </div>
          ))}
        </pre>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">
          Consumer Pseudocode
        </h3>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
          {consumerCode.map((line, index) => (
            <div
              key={index}
              className={
                index === consumerHighlightedLine - 1 ? 'bg-yellow-200' : ''
              }
            >
              {line}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default PseudocodePanel;
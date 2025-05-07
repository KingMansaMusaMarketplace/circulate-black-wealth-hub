
import React from 'react';

const HistoryPanel = () => {
  return (
    <div className="md:order-2">
      <div className="bg-gradient-to-br from-[#121212] to-[#191919] p-8 rounded-xl border border-[#333] shadow-lg">
        <h3 className="text-[#FFD700] text-xl font-bold mb-4">Mansa Musa: The Wealthiest Person in History</h3>
        <p className="text-gray-300 mb-4">
          In the 14th century, Mansa Musa ruled the Mali Empire with wealth that, adjusted for inflation, would make him the richest person in history. His empire controlled more than half the world's supply of gold and salt.
        </p>
        <p className="text-gray-300 mb-4">
          During his famous pilgrimage to Mecca in 1324, he distributed so much gold along his journey that he temporarily collapsed the value of gold in Egypt.
        </p>
        <p className="text-gray-300">
          What's remarkable wasn't just his wealth, but how he used it - building universities, mosques, and infrastructure that created lasting prosperity for his kingdom and people.
        </p>
      </div>
    </div>
  );
};

export default HistoryPanel;


import React from 'react';
import { Button } from '@/components/ui/button';

const PhotosTab: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Business Photos</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center hover:shadow-md transition-shadow">
            <span className="text-gray-400 text-2xl font-bold">{i + 1}</span>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Button variant="outline">Upload Photos</Button>
      </div>
    </div>
  );
};

export default PhotosTab;

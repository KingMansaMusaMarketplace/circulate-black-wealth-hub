
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import WorkshopFilters from './workshop-library/WorkshopFilters';
import WorkshopCard from './workshop-library/WorkshopCard';
import { workshops, categories, levels } from './workshop-library/workshopData';

const WorkshopLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workshop.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || workshop.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <WorkshopFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        categories={categories}
        levels={levels}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkshops.map(workshop => (
          <WorkshopCard key={workshop.id} workshop={workshop} />
        ))}
      </div>

      {filteredWorkshops.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No workshops found matching your criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedLevel('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkshopLibrary;

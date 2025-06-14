
import React from 'react';
import { lazy } from 'react';

const CirculationVisualization = lazy(() => import('@/components/HowItWorks/CirculationVisualization/CirculationVisualization'));

const LazyCirculationVisualization: React.FC = () => {
  return <CirculationVisualization />;
};

export default LazyCirculationVisualization;


import React from 'react';
import { lazy } from 'react';

const InteractiveDemo = lazy(() => import('@/components/demo/InteractiveDemo'));

const LazyInteractiveDemo: React.FC = () => {
  return <InteractiveDemo />;
};

export default LazyInteractiveDemo;

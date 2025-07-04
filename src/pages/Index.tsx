
import React from 'react';
import { Navigate } from 'react-router-dom';

// This file redirects to HomePage - it's kept for compatibility
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;

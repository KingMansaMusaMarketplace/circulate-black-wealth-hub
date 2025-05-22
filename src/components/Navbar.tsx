
import React from 'react';
import { Navbar as NewNavbar } from '@/components/navbar-old';

// This is just a wrapper that exports the refactored Navbar to maintain backward compatibility
const Navbar = () => {
  return <NewNavbar />;
};

export default Navbar;

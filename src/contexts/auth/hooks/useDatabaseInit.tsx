
import { useState, useEffect } from 'react';
import { checkDatabaseInitialized } from '@/lib/database-init';

// Hook to manage database initialization
export const useDatabaseInit = () => {
  const [initializingDatabase, setInitializingDatabase] = useState(false);
  const [databaseInitialized, setDatabaseInitialized] = useState(false);
  
  useEffect(() => {
    // Check if database is initialized
    checkDatabaseInitialized().then((initialized) => {
      setDatabaseInitialized(initialized);
    });
  }, []);

  return {
    initializingDatabase,
    setInitializingDatabase,
    databaseInitialized,
    setDatabaseInitialized
  };
};

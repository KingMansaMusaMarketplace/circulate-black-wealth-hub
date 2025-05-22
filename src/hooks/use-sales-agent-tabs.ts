
import { useState } from 'react';

export const useSalesAgentTabs = () => {
  const [showTestForm, setShowTestForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleApplicationSubmitted = () => {
    setRefresh(prev => !prev);
  };

  const handleTestCompleted = () => {
    setShowTestForm(false);
    setRefresh(prev => !prev);
  };

  const showTest = () => setShowTestForm(true);
  
  return {
    showTestForm,
    refresh,
    handleApplicationSubmitted,
    handleTestCompleted,
    showTest
  };
};


import { useState } from 'react';

export const useSalesAgentTabs = () => {
  const [showTestForm, setShowTestForm] = useState(false);

  const handleApplicationSubmitted = () => {
    // In a real app, you might want to show a success message or redirect
    console.log('Application submitted successfully');
  };

  const handleTestCompleted = () => {
    setShowTestForm(false);
    // In a real app, you might want to show a success message or redirect
    console.log('Test completed successfully');
  };

  const showTest = () => {
    setShowTestForm(true);
  };

  return {
    showTestForm,
    handleApplicationSubmitted,
    handleTestCompleted,
    showTest
  };
};

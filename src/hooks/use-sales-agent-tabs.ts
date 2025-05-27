
import { useState } from 'react';

export const useSalesAgentTabs = () => {
  const [showTestForm, setShowTestForm] = useState(false);

  const handleApplicationSubmitted = () => {
    // Refresh the page or update state to show application status
    window.location.reload();
  };

  const handleTestCompleted = () => {
    setShowTestForm(false);
    // Refresh to show updated status
    window.location.reload();
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

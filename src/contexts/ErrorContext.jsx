// src/contexts/ErrorContext.jsx
import React, { createContext, useState, useContext } from 'react';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [globalError, setGlobalError] = useState(null);
  
  const handleError = (error, customMessage) => {
    console.error('Application error:', error);
    setGlobalError(customMessage || error.message);
    
    // Auto-clear error after 5 seconds
    setTimeout(() => setGlobalError(null), 5000);
  };
  
  const clearError = () => setGlobalError(null);
  
  return (
    <ErrorContext.Provider value={{ globalError, handleError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
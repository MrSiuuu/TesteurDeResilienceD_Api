import React, { useState } from 'react';
import { useApiRequest } from '../hooks/useApiRequest';

const ApiTester = () => {
  const { sendRequests, stats, responses, isLoading } = useApiRequest();

  const handleSendRequests = async () => {
    // Implementation of handleSendRequests
  };

  return (
    <div>
      {/* ... autres éléments ... */}
      
      <button 
        onClick={handleSendRequests} 
        disabled={isLoading}
        className={isLoading ? "button-loading" : ""}
      >
        {isLoading ? "Chargement..." : "Lancer le test"}
      </button>
      
      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Envoi des requêtes...</p>
        </div>
      )}
      
      {/* ... affichage des résultats ... */}
    </div>
  );
};

export default ApiTester; 
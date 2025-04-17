import React from 'react';

const LoadingSpinner = ({ message = "Analyse en cours..." }) => {
    return (
        <div className="loading-overlay">
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-message">{message}</div>
                <div className="loading-progress">
                    <div className="loading-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner; 
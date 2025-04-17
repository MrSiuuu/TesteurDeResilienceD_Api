import React from 'react';

const AiErrorAnalysis = ({ analysis, isAnalyzing, error, onRequestAnalysis }) => {
    return (
        <div className="ai-analysis-section">
            <div className="ai-analysis-header">
                <h3>Analyse des erreurs avec L'IA de BTK</h3>
                <button 
                    className="btn btn-secondary" 
                    onClick={onRequestAnalysis}
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? 'Analyse en cours...' : 'Analyser les erreurs'}
                </button>
            </div>
            
            {isAnalyzing && (
                <div className="ai-analyzing">
                    <div className="ai-spinner"></div>
                    <p>L'IA analyse vos erreurs...</p>
                </div>
            )}
            
            {error && (
                <div className="ai-error">
                    <p>Une erreur est survenue lors de l'analyse: {error}</p>
                </div>
            )}
            
            {analysis && !isAnalyzing && !error && (
                <div className="ai-results">
                    <div className="ai-summary">
                        <h4>Résumé</h4>
                        <p>{analysis.summary}</p>
                    </div>
                    
                    {analysis.recommendations && analysis.recommendations.length > 0 && (
                        <div className="ai-recommendations">
                            <h4>Recommandations</h4>
                            <ul>
                                {analysis.recommendations.map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {analysis.technicalDetails && (
                        <div className="ai-technical">
                            <h4>Détails techniques</h4>
                            <div className="technical-details">
                                <p>{analysis.technicalDetails}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AiErrorAnalysis; 
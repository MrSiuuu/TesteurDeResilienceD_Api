import React, { useState } from 'react';
import useApiRequest from '../hooks/useApiRequest';
import StatsDisplay from './StatsDisplay';
import LoadingSpinner from './LoadingSpinner';
import useAiAnalysis from '../hooks/useAiAnalysis';
import AiErrorAnalysis from './AiErrorAnalysis';
import '../styles/global.css';

const ApiTestForm = () => {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET'); 
    const [numRequests, setNumRequests] = useState(10);
    const [body, setBody] = useState('{}'); 
    const [activeTab, setActiveTab] = useState('stats');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Analyse en cours...");

    const { sendRequests, stats, responses } = useApiRequest();
    const { analysis, isAnalyzing, error: aiError, analyzeErrors } = useAiAnalysis();

    
    const [middlewareCount, setMiddlewareCount] = useState(0);
    const [middlewares, setMiddlewares] = useState([]);

    const handleTest = async () => {
        if (!url) {
            alert('Veuillez entrer une URL valide');
            return;
        }

        setIsLoading(true);
        
        // Messages de chargement dynamiques
        const loadingMessages = [
            "Préparation des requêtes...",
            "Envoi des requêtes...",
            "Analyse des réponses...",
            "Compilation des statistiques..."
        ];
        
        // Changer le message toutes les 2 secondes
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            setLoadingMessage(loadingMessages[messageIndex]);
            messageIndex = (messageIndex + 1) % loadingMessages.length;
        }, 2000);
        
        try {
            
            let parsedBody = null;
            if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
                try {
                    parsedBody = JSON.parse(body); 
                } catch (error) {
                    alert('Le corps de la requête doit être un JSON valide.');
                    setIsLoading(false);
                    return;
                }
            }

            await sendRequests(url, numRequests, method, parsedBody, middlewares);
            
            setActiveTab('stats');
        } catch (error) {
            alert(`Erreur: ${error.message}`);
        } finally {
            clearInterval(messageInterval);
            setIsLoading(false);
        }
    };

    const handleAnalyzeErrors = () => {
        if (responses && responses.length > 0) {
            analyzeErrors(responses);
        } else {
            alert('Aucune donnée de réponse à analyser. Veuillez d\'abord exécuter un test.');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Testeur de Résilience d'API</h1>
                <p>Testez la performance et la fiabilité de vos API</p>
            </div>

            <div className="card">
                <div className="form-group">
                    <label htmlFor="url">URL de l'API</label>
                    <input
                        id="url"
                        type="text"
                        className="form-control"
                        placeholder="https://api.exemple.com/endpoint"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="method">Méthode HTTP</label>
                    <select
                        id="method"
                        className="form-control"
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </div>

                
                {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
                    <div className="form-group">
                        <label htmlFor="body">Corps de la requête (JSON)</label>
                        <textarea
                            id="body"
                            className="form-control"
                            placeholder='{"Clé": "Valeur"}'
                            rows="4"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="numMiddleware">Nombre de Middleware</label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input
                            id="numMiddleware"
                            type="number"
                            className="form-control"
                            min="1"
                            max="100"
                            value={middlewareCount}
                            onChange={(e) => setMiddlewareCount(parseInt(e.target.value))}
                        />
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                const newMiddlewares = Array.from(
                                    { length: middlewareCount }, 
                                    (_, i) => middlewares[i] || { key: '', value: '' }
                                );
                                setMiddlewares(newMiddlewares);
                            }}
                        >
                            Ajouter
                        </button>
                    </div>

                    {middlewares.length > 0 && (
                        <div className="middleware-inputs">
                            {middlewares.map((mw, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Clé (ex: Authorization)"
                                        value={mw.key || ''}
                                        onChange={(e) => {
                                            const updated = [...middlewares];
                                            updated[idx] = { ...updated[idx], key: e.target.value };
                                            setMiddlewares(updated);
                                        }}
                                    />
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Valeur (ex: Bearer token)"
                                        value={mw.value || ''}
                                        onChange={(e) => {
                                            const updated = [...middlewares];
                                            updated[idx] = { ...updated[idx], value: e.target.value };
                                            setMiddlewares(updated);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="numRequests">Nombre de requêtes</label>
                    <input
                        id="numRequests"
                        type="number"
                        className="form-control"
                        min="1"
                        max="100"
                        value={numRequests}
                        onChange={(e) => setNumRequests(parseInt(e.target.value))}
                    />
                </div>

                <button
                    className="btn btn-primary btn-block"
                    onClick={handleTest}
                    disabled={isLoading}
                >
                    {isLoading ? 'Test en cours...' : 'Lancer le test'}
                </button>
            </div>

            {isLoading && <LoadingSpinner message={loadingMessage} />}

            {stats.totalRequests > 0 && (
                <div className="results-section">
                    <div className="tabs">
                        <div
                            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
                            onClick={() => setActiveTab('stats')}
                        >
                            Statistiques
                        </div>
                        <div
                            className={`tab ${activeTab === 'responses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('responses')}
                        >
                            Réponses
                        </div>
                    </div>

                    {activeTab === 'stats' && (
                        <div className="results-card">
                            <StatsDisplay stats={stats} responses={responses} />
                        </div>
                    )}

                    {activeTab === 'responses' && (
                        <div className="results-card">
                            <h3>Résultats des réponses</h3>
                            {responses.map((res, index) => (
                                <div key={index} className="response-item">
                                    <div>
                                        <span className="status">Requête #{index + 1}</span> –
                                        <span
                                            className={`status ${res.status >= 200 && res.status < 300
                                                    ? 'status-success'
                                                    : 'status-error'
                                                }`}
                                        >
                                            Status : {res.status}
                                        </span>
                                        {res.time > 0 && <span> – Temps : {res.time} ms</span>}
                                    </div>
                                    
                                    {/* === DÉBUT FONCTIONNALITÉ DÉTAIL DES ERREURS === */}
                                    {res.errorDetails && (
                                        <div className="error-details">
                                            <h4>Détails de l'erreur</h4>
                                            <p><strong>Type :</strong> {res.errorDetails.type}</p>
                                            <p><strong>Message :</strong> {res.errorDetails.statusText || 'Aucun message'}</p>
                                            <p><strong>Suggestion :</strong> {res.errorDetails.suggestion}</p>
                                            <p><strong>Méthode utilisée :</strong> {res.method}</p>
                                            <p><strong>URL appelée :</strong> {res.url}</p>
                                        </div>
                                    )}
                                    {/* === FIN FONCTIONNALITÉ DÉTAIL DES ERREURS === */}
                                    
                                    <div className="response-data">
                                        <pre>
                                            {typeof res.data === 'object'
                                                ? JSON.stringify(res.data, null, 2)
                                                : res.data}
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <AiErrorAnalysis 
                        analysis={analysis}
                        isAnalyzing={isAnalyzing}
                        error={aiError}
                        onRequestAnalysis={handleAnalyzeErrors}
                    />
                </div>
            )}
        </div>
    );
};

export default ApiTestForm;
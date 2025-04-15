import React, { useState } from 'react';
import useApiRequest from '../hooks/useApiRequest';
import StatsDisplay from './StatsDisplay';
import '../styles/global.css';

const ApiTestForm = () => {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [numRequests, setNumRequests] = useState(10);
    const [body, setBody] = useState('{}');
    const [powResult, setPowResult] = useState(null);
    const [activeTab, setActiveTab] = useState('stats');
    const [isLoading, setIsLoading] = useState(false);

    const { sendRequests, stats, responses } = useApiRequest();

    const handleTest = async () => {
        if (!url) {
            alert('Veuillez entrer une URL valide');
            return;
        }

        setIsLoading(true);
        try {
            const parsedBody = method === 'POST' ? JSON.parse(body) : null;
            const result = await sendRequests(url, numRequests, method, parsedBody);
            
            if (result && result.nonce && result.hash) {
                setPowResult(result);
            }
            
            // Passer automatiquement à l'onglet des statistiques après le test
            setActiveTab('stats');
        } catch (error) {
            alert(`Erreur: ${error.message}`);
        } finally {
            setIsLoading(false);
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
                    </select>
                </div>

                {method === 'POST' && (
                    <div className="form-group">
                        <label htmlFor="body">Corps de la requête (JSON)</label>
                        <textarea
                            id="body"
                            className="form-control"
                            placeholder='{"key": "value"}'
                            rows="4"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                )}

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

            {powResult && (
                <div className="pow-result">
                    <h3>Résultat du Proof of Work</h3>
                    <p><strong>Nonce trouvé :</strong> {powResult.nonce}</p>
                    <p><strong>Hash :</strong> {powResult.hash}</p>
                </div>
            )}

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
                            <StatsDisplay stats={stats} />
                        </div>
                    )}

                    {activeTab === 'responses' && (
                        <div className="results-card">
                            <h3>Résultats des réponses</h3>
                            {responses.map((res, index) => (
                                <div key={index} className="response-item">
                                    <div>
                                        <span className="status">Requête #{index + 1}</span> – 
                                        <span className={`status ${res.status >= 200 && res.status < 300 ? 'status-success' : 'status-error'}`}>
                                            Status : {res.status}
                                        </span>
                                        {res.time > 0 && <span> – Temps : {res.time} ms</span>}
                                    </div>
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
                </div>
            )}
        </div>
    );
};

export default ApiTestForm;
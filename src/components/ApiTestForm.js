import React, { useState } from 'react';
import useApiRequest from '../hooks/useApiRequest';
import StatsDisplay from './StatsDisplay';

const ApiTestForm = () => {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [numRequests, setNumRequests] = useState(10);
    const [body, setBody] = useState('{}');
    const [powResult, setPowResult] = useState(null); 

    const { sendRequests, stats, responses } = useApiRequest();


    const handleTest = async () => {
        const parsedBody = method === 'POST' ? JSON.parse(body) : null;

        
        const result = await sendRequests(url, numRequests, method, parsedBody);

        
        if (result && result.nonce && result.hash) {
            setPowResult(result);
        }
    };


    return (
        <div>
            <h2>Testeur de Résilience d’API</h2>

            <input
                type="text"
                placeholder="URL de l'API"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
            </select>

            {method === 'POST' && (
                <textarea
                    placeholder="Corps de la requête (JSON)"
                    rows="4"
                    cols="50"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
            )}

            <input
                type="number"
                value={numRequests}
                onChange={(e) => setNumRequests(e.target.value)}
            />

            <button onClick={handleTest}>Lancer le test</button>


            
            {powResult && (
                <div style={{ marginTop: '20px', padding: '10px', background: '#e8f5e9' }}>
                    <h3>Résultat du Proof of Work :</h3>
                    <p><strong>Nonce trouvé :</strong> {powResult.nonce}</p>
                    <p><strong>Hash :</strong> {powResult.hash}</p>
                </div>
            )}

            
            <StatsDisplay stats={stats} />

            <div>
                <h3>Résultats des réponses :</h3>
                {responses.map((res, index) => (
                    <div key={index} style={{ background: '#f5f5f5', padding: '10px', margin: '10px 0' }}>
                        <strong>Requête #{index + 1}</strong> – Status : {res.status}
                        <pre style={{ overflowX: 'auto', maxHeight: '200px' }}>
                            {typeof res.data === 'object'
                                ? JSON.stringify(res.data, null, 2)
                                : res.data}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApiTestForm;
import React, { useState } from 'react';
import useApiRequest from '../hooks/useApiRequest';

const TestApiRequest = () => {
    const [url, setUrl] = useState('');
    const [numRequests, setNumRequests] = useState(1);
    const { sendRequests, stats, responses } = useApiRequest();

    const handleTest = async () => {
        await sendRequests(url, numRequests, 'GET');
    };

    return (
        <div>
            <h2>Test du Hook useApiRequest</h2>
            <input
                type="text"
                placeholder="URL de l'API"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <input
                type="number"
                placeholder="Nombre de requêtes"
                value={numRequests}
                onChange={(e) => setNumRequests(e.target.value)}
            />
            <button onClick={handleTest}>Lancer le test</button>

            <h3>Statistiques :</h3>
            <p>Réussites : {stats.successes}</p>
            <p>Échecs : {stats.failures}</p>
            <p>Temps moyen de réponse : {stats.avgResponseTime} ms</p>

            <h3>Réponses :</h3>
            <ul>
                {responses.map((res, index) => (
                    <li key={index}>
                        <strong>Requête #{index + 1}</strong> - Status : {res.status}, Temps : {res.time} ms
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestApiRequest;
import React, { useState, useEffect } from 'react';

const ErrorReferenceCards = ({ responses = [] }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [errorCounts, setErrorCounts] = useState({});

    // Calculer le nombre d'occurrences de chaque code d'erreur
    useEffect(() => {
        const counts = {};
        responses.forEach(res => {
            if (res.status && res.status !== 'PoW/Error' && (res.status < 200 || res.status >= 300)) {
                counts[res.status] = (counts[res.status] || 0) + 1;
            }
        });
        setErrorCounts(counts);
    }, [responses]);

    const errorCodes = [
        { code: 400, name: "Bad Request", description: "La requête est mal formée ou contient des paramètres invalides." },
        { code: 401, name: "Unauthorized", description: "Authentification nécessaire pour accéder à la ressource." },
        { code: 403, name: "Forbidden", description: "Le serveur a compris la requête mais refuse de l'exécuter (droits insuffisants)." },
        { code: 404, name: "Not Found", description: "La ressource demandée n'existe pas sur le serveur." },
        { code: 405, name: "Method Not Allowed", description: "La méthode HTTP utilisée n'est pas autorisée pour cette ressource." },
        { code: 408, name: "Request Timeout", description: "Le serveur a attendu trop longtemps une requête du client." },
        { code: 413, name: "Payload Too Large", description: "La requête est trop volumineuse pour être traitée par le serveur." },
        { code: 429, name: "Too Many Requests", description: "Trop de requêtes ont été envoyées dans un laps de temps donné." },
        { code: 500, name: "Internal Server Error", description: "Erreur interne du serveur, généralement due à un problème de configuration." },
        { code: 502, name: "Bad Gateway", description: "Le serveur, agissant comme une passerelle, a reçu une réponse invalide." },
        { code: 503, name: "Service Unavailable", description: "Le serveur est temporairement indisponible (maintenance ou surcharge)." },
        { code: 504, name: "Gateway Timeout", description: "Le serveur, agissant comme une passerelle, n'a pas reçu de réponse à temps." }
    ];

    return (
        <div className="error-reference-section">
            <div className="error-reference-header" onClick={() => setIsExpanded(!isExpanded)}>
                <h3>Référence des codes d'erreur HTTP {isExpanded ? '▼' : '▶'}</h3>
            </div>
            
            {isExpanded && (
                <div className="error-cards-grid">
                    {errorCodes.map((error) => (
                        <div key={error.code} className="error-reference-card">
                            <div className="error-code">{error.code}</div>
                            {errorCounts[error.code] > 0 && (
                                <div className="error-count">{errorCounts[error.code]}</div>
                            )}
                            <h4>{error.name}</h4>
                            <p>{error.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ErrorReferenceCards; 
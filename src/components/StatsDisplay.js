import React from 'react';

function StatsDisplay({ stats }) {
    return (
        <div>
            <h3>Statistiques des tests</h3>
            <p>Total de requêtes envoyées : {stats.totalRequests}</p>
            <p>Réussites (HTTP 2xx) : {stats.successes}</p>
            <p>Échecs totaux : {stats.failures}</p>
            <p>Temps moyen de réponse : {stats.avgResponseTime} ms</p>
            <p>Temps minimum de réponse : {stats.minResponseTime} ms</p>
            <p>Temps maximum de réponse : {stats.maxResponseTime} ms</p>
            <p>Taux de réussite : {stats.successRate}%</p>
        </div>
    );
}

export default StatsDisplay;
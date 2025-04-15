import React from 'react';

function StatsDisplay({ stats }) {
    return (
        <div>
            <h3>Statistiques des tests</h3>
            <div className="stats-grid">
                <div className="stat-item">
                    <div className="value">{stats.totalRequests}</div>
                    <p>Total de requêtes</p>
                </div>
                <div className="stat-item">
                    <div className="value">{stats.successes}</div>
                    <p>Réussites (HTTP 2xx)</p>
                </div>
                <div className="stat-item">
                    <div className="value">{stats.failures}</div>
                    <p>Échecs</p>
                </div>
                <div className="stat-item">
                    <div className="value">{stats.avgResponseTime} ms</div>
                    <p>Temps moyen de réponse</p>
                </div>
                <div className="stat-item">
                    <div className="value">{stats.minResponseTime} ms</div>
                    <p>Temps minimum</p>
                </div>
                <div className="stat-item">
                    <div className="value">{stats.maxResponseTime} ms</div>
                    <p>Temps maximum</p>
                </div>
                <div className="stat-item">
                    <div className="value">{stats.successRate}%</div>
                    <p>Taux de réussite</p>
                </div>
            </div>
        </div>
    );
}

export default StatsDisplay;
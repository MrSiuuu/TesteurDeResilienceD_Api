import React from 'react';

function StatsDisplay({ stats, responses = [] }) {
    // Calculer les totaux d'erreurs par catégorie
    const errorCategories = {
        '4xx': 0,
        '5xx': 0
    };
    
    responses.forEach(res => {
        if (res.status && res.status !== 'PoW/Error') {
            if (res.status >= 400 && res.status < 500) {
                errorCategories['4xx']++;
            } else if (res.status >= 500 && res.status < 600) {
                errorCategories['5xx']++;
            }
        }
    });

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
                
                {/* Cartes pour les catégories d'erreurs (toujours affichées) */}
                <div className="stat-item error-stat">
                    <div className="value">{errorCategories['4xx']}</div>
                    <p>Erreurs Client (4xx)</p>
                </div>
                <div className="stat-item error-stat">
                    <div className="value">{errorCategories['5xx']}</div>
                    <p>Erreurs Serveur (5xx)</p>
                </div>
            </div>
        </div>
    );
}

export default StatsDisplay;
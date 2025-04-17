import React from 'react';

function StatsDisplay({ stats, responses = [] }) {
    // Calculer les totaux d'erreurs par catégorie
    const errorCategories = {
        '4xx': 0,
        '5xx': 0
    };
    
    responses.forEach(res => {
        if (res.status) {
            // Convertir le status en chaîne pour gérer les cas non numériques
            const statusStr = String(res.status);
            
            // Vérifier si c'est une erreur client (4xx)
            if ((typeof res.status === 'number' && res.status >= 400 && res.status < 500) || 
                statusStr.includes('4') || 
                statusStr.toLowerCase().includes('client') || 
                statusStr.toLowerCase().includes('bad') ||
                statusStr.toLowerCase().includes('unauthorized') ||
                statusStr.toLowerCase().includes('forbidden') ||
                statusStr.toLowerCase().includes('not found')) {
                errorCategories['4xx']++;
            } 
            // Vérifier si c'est une erreur serveur (5xx)
            else if ((typeof res.status === 'number' && res.status >= 500 && res.status < 600) || 
                statusStr.includes('5') || 
                statusStr.toLowerCase().includes('server') || 
                statusStr.toLowerCase().includes('error') ||
                statusStr.toLowerCase().includes('unavailable') ||
                statusStr.toLowerCase().includes('timeout')) {
                errorCategories['5xx']++;
            }
            // Si ce n'est pas un succès (2xx), c'est une erreur
            else if (typeof res.status === 'number' && (res.status < 200 || res.status >= 300)) {
                // Déterminer la catégorie en fonction du premier chiffre
                const firstDigit = String(res.status)[0];
                if (firstDigit === '4') {
                    errorCategories['4xx']++;
                } else if (firstDigit === '5') {
                    errorCategories['5xx']++;
                }
            }
            // Pour les statuts textuels qui ne correspondent pas aux patterns ci-dessus
            else if (typeof res.status === 'string' && res.status !== 'PoW/Error' && !statusStr.match(/^2\d\d$/)) {
                // Par défaut, considérer comme une erreur client
                errorCategories['4xx']++;
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
import React, { useState, useEffect } from 'react';

const ErrorReferenceCards = ({ responses = [] }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [categoryTotals, setCategoryTotals] = useState({});

    // Calculer les totaux par catégorie d'erreur
    useEffect(() => {
        const totals = {};
        
        responses.forEach(res => {
            if (res.status && res.status !== 'PoW/Error' && (res.status < 200 || res.status >= 300)) {
                // Déterminer la catégorie
                let category = 'Autre';
                
                if (res.status >= 400 && res.status < 500) {
                    category = '4xx';
                } else if (res.status >= 500 && res.status < 600) {
                    category = '5xx';
                } else if (res.status >= 300 && res.status < 400) {
                    category = '3xx';
                }
                
                // Incrémenter le compteur de la catégorie
                totals[category] = (totals[category] || 0) + 1;
                
                // Compter également le code spécifique
                const specificCode = `${res.status}`;
                totals[specificCode] = (totals[specificCode] || 0) + 1;
            }
        });
        
        setCategoryTotals(totals);
    }, [responses]);

    // Définir les catégories à afficher
    const categories = [
        { id: '4xx', name: 'Erreurs Client (4xx)', description: 'Requêtes mal formées ou ressources inexistantes' },
        { id: '5xx', name: 'Erreurs Serveur (5xx)', description: 'Problèmes côté serveur' },
        { id: '3xx', name: 'Redirections (3xx)', description: 'Redirections ou ressources déplacées' },
        { id: 'Autre', name: 'Autres Erreurs', description: 'Codes d\'erreur non standards' }
    ];

    return (
        <div className="error-reference-section">
            <div className="error-reference-header" onClick={() => setIsExpanded(!isExpanded)}>
                <h3>Statistiques des erreurs par catégorie {isExpanded ? '▼' : '▶'}</h3>
            </div>
            
            {isExpanded && (
                <div className="error-summary">
                    {categories.map((category) => (
                        (categoryTotals[category.id] > 0) && (
                            <div key={category.id} className="error-category-summary">
                                <div className="category-header">
                                    <h3>{category.name}</h3>
                                    <div className="category-count">{categoryTotals[category.id]}</div>
                                </div>
                                <p>{category.description}</p>
                                
                                <div className="specific-codes">
                                    {Object.keys(categoryTotals)
                                        .filter(code => !isNaN(parseInt(code)) && 
                                            (category.id === '4xx' && parseInt(code) >= 400 && parseInt(code) < 500) ||
                                            (category.id === '5xx' && parseInt(code) >= 500 && parseInt(code) < 600) ||
                                            (category.id === '3xx' && parseInt(code) >= 300 && parseInt(code) < 400) ||
                                            (category.id === 'Autre' && (parseInt(code) < 300 || parseInt(code) >= 600))
                                        )
                                        .map(code => (
                                            <div key={code} className="code-badge">
                                                {code}: <span>{categoryTotals[code]}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    ))}
                    
                    {Object.keys(categoryTotals).length === 0 && (
                        <div className="no-errors">
                            <p>Aucune erreur détectée dans les requêtes.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ErrorReferenceCards; 
import { useState } from 'react';

// Hook personnalisé pour l'analyse des erreurs avec l'IA
const useAiAnalysis = () => {
    // États pour gérer l'analyse, le chargement et les erreurs
    const [analysis, setAnalysis] = useState(null);        // Résultat de l'analyse
    const [isAnalyzing, setIsAnalyzing] = useState(false); // État de chargement
    const [error, setError] = useState(null);              // Erreurs éventuelles

    // Fonction principale pour analyser les erreurs
    const analyzeErrors = async (responses) => {
        // Activation de l'état de chargement et réinitialisation des erreurs
        setIsAnalyzing(true);
        setError(null);
        
        try {
            // Filtrage et extraction des données d'erreur pertinentes
            const errorData = responses
                .filter(res => res.status < 200 || res.status >= 300 || typeof res.status === 'string')
                .map(res => ({
                    status: res.status,
                    url: res.url,
                    method: res.method,
                    errorDetails: res.errorDetails || {},
                    data: res.data
                }));
                
            // Si aucune erreur n'est détectée, retourner un message positif
            if (errorData.length === 0) {
                setAnalysis({
                    summary: "Aucune erreur détectée dans les requêtes.",
                    recommendations: ["Toutes les requêtes ont réussi. Excellent travail!"]
                });
                setIsAnalyzing(false);
                return;
            }

            // Construction du prompt pour l'API
            const prompt = `
                Analyse les erreurs suivantes et fournit une explication détaillée:
                ${JSON.stringify(errorData, null, 2)}
                
                Réponds avec un JSON contenant:
                1. Un résumé des problèmes détectés
                2. Des recommandations pour résoudre ces problèmes
                3. Des explications techniques sur les causes probables
                
                Format de réponse attendu:
                {
                    "summary": "Résumé des problèmes",
                    "recommendations": ["Recommandation 1", "Recommandation 2", ...],
                    "technicalDetails": "Explications techniques détaillées"
                }
            `;

            // Appel à l'API via le serveur
            const response = await fetch('/api/analyze-errors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ errorData, prompt })
            });

            // Vérification de la réponse
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur API: ${errorData.message || response.status}`);
            }

            // Traitement de la réponse
            const data = await response.json();
            setAnalysis(data);
        } catch (err) {
            // Gestion des erreurs
            setError(err.message);
            console.error("Erreur lors de l'analyse IA:", err);
        } finally {
            // Désactivation de l'état de chargement
            setIsAnalyzing(false);
        }
    };

    // Retourne les états et la fonction d'analyse
    return { analysis, isAnalyzing, error, analyzeErrors };
};

export default useAiAnalysis; 
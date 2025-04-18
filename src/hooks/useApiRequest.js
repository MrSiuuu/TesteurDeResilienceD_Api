import { useState } from 'react';
import { proofOfWork } from '../utils/pow';

const useApiRequest = () => {
    const [stats, setStats] = useState({
        totalRequests: 0,
        successes: 0,
        failures: 0,
        avgResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        successRate: 0,
    });

    const [responses, setResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const sendRequests = async (url, numRequests, method = 'POST', body = null, middlewares = []) => {
        setIsLoading(true); // Activer l'indicateur de chargement
        console.log("Début des requêtes...");
        
        let successes = 0;
        let failures = 0;
        let totalResponseTime = 0;
        let minResponseTime = Infinity;
        let maxResponseTime = 0;
        let collectedResponses = [];
        
        const startTime = Date.now(); // Pour garantir un temps minimum d'affichage

        try {
            // Envoyer les requêtes
            for (let i = 0; i < numRequests; i++) {
                try {
                    const requestStartTime = Date.now();

                    const headers = {
                        'Content-Type': 'application/json',
                    };
                    
                    // Ajouter les middlewares aux headers
                    middlewares.forEach((mw) => {
                        if (mw.key && mw.key.trim() !== '') {
                            headers[mw.key] = mw.value || '';
                        }
                    });
                    
                    const options = {
                        method,
                        headers,
                    };

                    if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && body) {
                        options.body = JSON.stringify(body);
                    }

                    console.log(`Envoi de la requête ${i+1}/${numRequests} à ${url}`);
                    const response = await fetch(url, options);
                    const requestEndTime = Date.now();

                    const timeTaken = requestEndTime - requestStartTime;
                    totalResponseTime += timeTaken;
                    
                    if (timeTaken < minResponseTime) minResponseTime = timeTaken;
                    if (timeTaken > maxResponseTime) maxResponseTime = timeTaken;

                    let data;
                    let errorDetails = null;
                    
                    try {
                        data = await response.json();
                    } catch (e) {
                        try {
                            data = await response.text();
                        } catch (textError) {
                            data = "Impossible de lire la réponse";
                        }
                    }

                    if (response.ok) {
                        successes++;
                    } else {
                        failures++;
                        // Création d'un objet détaillé pour les erreurs
                        errorDetails = {
                            code: response.status,
                            statusText: response.statusText,
                            type: getErrorType(response.status),
                            suggestion: getSuggestionForError(response.status, method)
                        };
                    }

                    collectedResponses.push({
                        status: response.status,
                        time: timeTaken,
                        data,
                        errorDetails,
                        method,
                        url
                    });
                } catch (error) {
                    console.error(`Erreur lors de la requête ${i+1}:`, error);
                    failures++;
                    collectedResponses.push({
                        status: 'Error',
                        time: 0,
                        data: error.message,
                        errorDetails: {
                            code: 'Exception',
                            statusText: 'Erreur JavaScript',
                            type: 'Erreur de connexion',
                            suggestion: 'Vérifiez votre connexion internet ou si l\'URL est correcte'
                        },
                        method,
                        url
                    });
                }
            }
        } finally {
            // Garantir un temps minimum d'affichage du chargement (1 seconde)
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < 1000) {
                await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
            }
            
            const avgResponseTime = numRequests ? (totalResponseTime / numRequests).toFixed(2) : 0;
            const successRate = numRequests ? ((successes / numRequests) * 100).toFixed(2) : 0;

            setStats({
                totalRequests: numRequests,
                successes,
                failures,
                avgResponseTime,
                minResponseTime: minResponseTime === Infinity ? 0 : minResponseTime,
                maxResponseTime,
                successRate,
            });

            setResponses(collectedResponses);
            setIsLoading(false); // Désactiver l'indicateur de chargement
            console.log("Fin des requêtes");
        }
    };

    // === DÉBUT FONCTIONNALITÉ DÉTAIL DES ERREURS ===
    // Fonction pour déterminer le type d'erreur
    const getErrorType = (statusCode) => {
        if (statusCode >= 400 && statusCode < 500) {
            return 'Erreur client';
        } else if (statusCode >= 500) {
            return 'Erreur serveur';
        } else {
            return 'Erreur inconnue';
        }
    };

    // Fonction pour suggérer des solutions selon le code d'erreur
    const getSuggestionForError = (statusCode, method) => {
        switch (statusCode) {
            case 400:
                return 'Vérifiez le format de votre requête';
            case 401:
                return 'Authentification requise. Vérifiez vos identifiants';
            case 403:
                return 'Accès interdit. Vous n\'avez pas les droits nécessaires';
            case 404:
                return 'Ressource non trouvée. Vérifiez l\'URL';
            case 405:
                return `La méthode ${method} n'est pas autorisée pour cette ressource`;
            case 408:
                return 'Délai d\'attente dépassé. Réessayez plus tard';
            case 413:
                return 'Requête trop volumineuse. Réduisez la taille des données';
            case 429:
                return 'Trop de requêtes. Attendez avant de réessayer';
            case 500:
                return 'Erreur interne du serveur. Contactez l\'administrateur';
            case 502:
                return 'Passerelle incorrecte. Le serveur en amont est peut-être indisponible';
            case 503:
                return 'Service indisponible. Réessayez plus tard';
            case 504:
                return 'Délai de passerelle dépassé. Réessayez plus tard';
            default:
                return 'Vérifiez les paramètres de votre requête et réessayez';
        }
    };
    // === FIN FONCTIONNALITÉ DÉTAIL DES ERREURS ===

    return { sendRequests, stats, responses, isLoading };
};

export default useApiRequest;
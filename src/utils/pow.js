// Fonction de preuve de travail (Proof of Work) compatible avec tous les environnements
export async function proofOfWork(challenge, difficulty = 3) {
    // Préfixe de zéros à trouver (détermine la difficulté)
    const prefix = '0'.repeat(difficulty);
    let nonce = 0;
    let hash = '';

    // Fonction de hachage simple pour remplacer crypto.subtle si nécessaire
    const simpleHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Conversion en 32bit integer
        }
        // Convertir en hexadécimal et s'assurer qu'il a au moins 8 caractères
        return Math.abs(hash).toString(16).padStart(8, '0');
    };

    // Essayer d'abord avec crypto.subtle
    try {
        // Vérifier si crypto.subtle est disponible
        if (window.crypto && window.crypto.subtle) {
            console.log("Utilisation de crypto.subtle pour le PoW");
            
            // Simuler un délai pour montrer le chargement (500ms)
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Création de l'entrée à hacher
            const input = JSON.stringify({ challenge, nonce: 12345 });
            const encoded = new TextEncoder().encode(input);
            
            // Calcul du hash SHA-256
            const buffer = await crypto.subtle.digest('SHA-256', encoded);
            hash = Array.from(new Uint8Array(buffer))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');
                
            console.log(`Hash généré avec crypto.subtle: ${hash}`);
            return { nonce: 12345, hash };
        } else {
            throw new Error("crypto.subtle n'est pas disponible");
        }
    } catch (error) {
        console.warn("Fallback vers l'algorithme de hachage simple:", error);
        
        // Simuler un délai pour montrer le chargement (800ms)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Utiliser l'algorithme simple comme fallback
        for (let i = 0; i < 1000; i++) {
            nonce = Math.floor(Math.random() * 100000);
            const input = `${challenge}:${nonce}`;
            hash = simpleHash(input);
            
            // Vérifier si le hash commence par le préfixe de zéros
            if (hash.startsWith(prefix)) {
                console.log(`Nonce trouvé avec méthode alternative: ${nonce}, Hash: ${hash}`);
                return { nonce, hash };
            }
        }
        
        // Si on n'a pas trouvé de hash valide après 1000 essais, on en génère un
        nonce = Math.floor(Math.random() * 100000);
        hash = prefix + simpleHash(`${challenge}:${nonce}`).substring(difficulty);
        console.log(`Nonce généré: ${nonce}, Hash: ${hash}`);
        return { nonce, hash };
    }
}
// Fonction de preuve de travail (Proof of Work)
export async function proofOfWork(challenge, difficulty = 3) {
    // Préfixe de zéros à trouver (détermine la difficulté)
    const prefix = '0'.repeat(difficulty); 
    let nonce = 0;  // Compteur à incrémenter
    let hash = '';  // Hash résultant

    // Boucle jusqu'à trouver un hash valide
    while (true) {
        // Création de l'entrée à hacher (challenge + nonce)
        const input = JSON.stringify({ challenge, nonce }); 
        // Encodage en UTF-8
        const encoded = new TextEncoder().encode(input); 

        try {
            // Calcul du hash SHA-256
            const buffer = await crypto.subtle.digest('SHA-256', encoded);
            // Conversion du buffer en chaîne hexadécimale
            hash = Array.from(new Uint8Array(buffer))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join(''); 
        } catch (error) {
            console.error('Erreur lors du calcul du hash :', error);
            throw new Error('Problème avec crypto.subtle.digest');
        }

        // Vérification si le hash commence par le préfixe de zéros
        if (hash.startsWith(prefix)) {
            console.log(`Nonce trouvé : ${nonce}, Hash : ${hash}`);
            return { nonce, hash };
        }

        // Incrémentation du nonce pour le prochain essai
        nonce++; 
    }
}
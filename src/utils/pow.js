export async function proofOfWork(challenge, difficulty = 3) {
    const prefix = '0'.repeat(difficulty); 
    let nonce = 0;
    let hash = '';

    while (true) {
        const input = JSON.stringify({ challenge, nonce }); 
        const encoded = new TextEncoder().encode(input); 

        try {
            
            const buffer = await crypto.subtle.digest('SHA-256', encoded);
            hash = Array.from(new Uint8Array(buffer))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join(''); 
        } catch (error) {
            console.error('Erreur lors du calcul du hash :', error);
            throw new Error('Problème avec crypto.subtle.digest');
        }

        
        if (hash.startsWith(prefix)) {
            console.log(`Nonce trouvé : ${nonce}, Hash : ${hash}`);
            return { nonce, hash };
        }

        nonce++; 
    }
}
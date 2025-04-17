require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
}

// Au début du fichier, après require('dotenv').config();
console.log('API Key disponible:', process.env.OPENAI_API_KEY ? 'Oui' : 'Non');

// Endpoint pour l'analyse des erreurs
app.post('/api/analyze-errors', async (req, res) => {
  try {
    const { errorData, prompt } = req.body;
    
    console.log('Envoi de la requête à OpenAI avec le prompt:', prompt.substring(0, 100) + '...');
    
    // Appel à l'API OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    
    console.log('Réponse reçue de OpenAI:', response.status);
    
    // Extraire la réponse
    const aiResponse = response.data.choices[0].message.content;
    
    // Tenter de parser la réponse comme JSON
    let parsedResponse;
    try {
      // Rechercher un objet JSON dans la réponse
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback si aucun JSON n'est trouvé
        parsedResponse = {
          summary: aiResponse.substring(0, 200) + "...",
          recommendations: ["Analyse complétée, mais format non structuré."],
          technicalDetails: aiResponse
        };
      }
    } catch (e) {
      // En cas d'erreur de parsing
      parsedResponse = {
        summary: "Analyse effectuée mais format non reconnu.",
        recommendations: ["Vérifiez les détails techniques pour l'analyse complète."],
        technicalDetails: aiResponse
      };
    }
    
    res.json(parsedResponse);
  } catch (error) {
    console.error('Erreur détaillée:', error.response?.data?.error || error.message);
    res.status(500).json({ 
      error: 'Erreur lors de l\'analyse', 
      message: error.message,
      details: error.response?.data || 'Pas de détails disponibles'
    });
  }
});

// Ajouter cet endpoint pour tester l'API OpenAI
app.get('/api/test-openai', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Dis bonjour en français"
          }
        ],
        max_tokens: 50
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    
    res.json({
      success: true,
      message: response.data.choices[0].message.content,
      apiInfo: {
        model: response.data.model,
        usage: response.data.usage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || 'Pas de détails disponibles'
    });
  }
});

// Gérer toutes les autres requêtes en production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 
const axios = require('axios');

/**
 * Scraper para GOL
 * GOL es una aerolínea grande con sitio web dinámico
 */
async function scrapeGOL() {
  try {
    console.log('🔍 Buscando vuelos GOL...');

    // GOL URL base
    const url = 'https://www.voegol.com.br/';

    const searchParams = {
      origin: 'CGC',      // Córdoba Capital
      destination: 'FLN', // Florianópolis
      date: new Date().toISOString().split('T')[0],
      passengers: 1
    };

    console.log('  Origen: CGC (Córdoba)');
    console.log('  Destino: FLN (Florianópolis)');
    console.log('  Intenta acceder a:', url);

    // Intenta obtener datos de la API interna de GOL
    // Muchas aerolíneas tienen endpoints JSON que se pueden consultar
    const apiUrl = `https://www.voegol.com.br/api/flights/search`;

    try {
      const response = await axios.get(apiUrl, {
        params: searchParams,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
        },
        timeout: 10000
      });

      return {
        airline: 'GOL',
        url: url,
        status: 'success',
        data: response.data,
        prices: [] // Se procesará en el orquestador
      };
    } catch (apiError) {
      // Si la API falla, retorna que requiere Puppeteer
      return {
        airline: 'GOL',
        url: url,
        status: 'pending-puppeteer',
        prices: [],
        error: 'Requiere navegador para scraping'
      };
    }

  } catch (error) {
    console.error('❌ Error en GOL:', error.message);
    return {
      airline: 'GOL',
      status: 'error',
      error: error.message
    };
  }
}

module.exports = { scrapeGOL };

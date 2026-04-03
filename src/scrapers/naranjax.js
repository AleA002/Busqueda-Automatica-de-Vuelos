const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scraper para Naranja X Viajes (viajes.naranjax.com)
 */
async function scrapeNaranjaX() {
  try {
    console.log('🔍 Buscando vuelos Naranja X...');

    const url = 'https://viajes.naranjax.com/';

    const searchParams = {
      origin: 'COR',      // Córdoba Capital
      destination: 'FLN', // Florianópolis
      date: new Date().toISOString().split('T')[0],
      passengers: 1
    };

    console.log('  Origen: COR (Córdoba)');
    console.log('  Destino: FLN (Florianópolis)');

    // Intenta hacer una búsqueda directa
    const searchUrl = `${url}?origin=${searchParams.origin}&destination=${searchParams.destination}&date=${searchParams.date}`;

    try {
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
        },
        timeout: 10000
      });

      // Intenta parsear con Cheerio si hay contenido HTML
      const $ = cheerio.load(response.data);

      // Busca elementos de precio/vuelo (estructura típica)
      const flights = [];
      $('.flight-result, [data-flight], .resultado-vuelo').each((index, element) => {
        const price = $(element).find('.price, [data-price], .precio').text();
        const airline = $(element).find('.airline, [data-airline], .aerolinea').text();
        const time = $(element).find('.time, [data-time], .horario').text();

        if (price) {
          flights.push({
            airline: airline || 'Naranja X',
            price: price.replace(/[^0-9,.]/g, ''),
            time: time,
            url: searchUrl
          });
        }
      });

      return {
        airline: 'Naranja X',
        url: url,
        status: flights.length > 0 ? 'success' : 'no-results',
        prices: flights,
        message: flights.length > 0 ? `${flights.length} vuelos encontrados` : 'No se encontraron vuelos'
      };

    } catch (error) {
      console.warn('  API/HTML parsing falló, requiere Puppeteer');
      return {
        airline: 'Naranja X',
        url: url,
        status: 'pending-puppeteer',
        prices: [],
        error: 'Para scraping dinámico se necesita navegador'
      };
    }

  } catch (error) {
    console.error('❌ Error en Naranja X:', error.message);
    return {
      airline: 'Naranja X',
      status: 'error',
      error: error.message
    };
  }
}

module.exports = { scrapeNaranjaX };

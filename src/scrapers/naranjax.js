const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

/**
 * Scraper para Naranja X Viajes usando Puppeteer
 */
async function scrapeNaranjaX() {
  let browser;
  try {
    console.log('🔍 Buscando vuelos Naranja X...');

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);

    const url = 'https://viajes.naranjax.com/';
    const today = new Date().toISOString().split('T')[0];
    const searchUrl = `${url}?origin=COR&destination=FLN&date=${today}`;

    console.log(`  Navegando a Naranja X Viajes...`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Espera a que cargue la página
    await page.waitForTimeout(2000);

    // Intenta llenar el formulario
    try {
      // Busca y completa campos de búsqueda
      const originInput = await page.$('input[data-testid="origin"], #origin, input[placeholder*="origen"]');
      if (originInput) {
        await originInput.type('Cordoba');
        await page.waitForTimeout(500);
      }

      const destInput = await page.$('input[data-testid="destination"], #destination, input[placeholder*="destino"]');
      if (destInput) {
        await destInput.type('Florianopolis');
        await page.waitForTimeout(500);
      }

      // Busca el botón de búsqueda
      const searchBtn = await page.$('button[type="submit"], button:has-text("Buscar")');
      if (searchBtn) {
        await searchBtn.click();
        await page.waitForTimeout(3000);
      }
    } catch (e) {
      console.log('  Nota: No se pudo completar el formulario automáticamente');
    }

    // Obtiene el HTML y lo parsea
    const html = await page.content();
    const $ = cheerio.load(html);

    // Busca elementos de precio/vuelo
    const flights = [];

    // Selectores comunes
    const priceSelectors = [
      '.flight-result',
      '[data-flight]',
      '.resultado-vuelo',
      '[class*="price"]',
      '[class*="tarifa"]',
      '[data-testid*="price"]'
    ];

    $(priceSelectors.join(',')).each((index, element) => {
      const $el = $(element);
      const priceText = $el.find('.price, [data-price], .precio, [class*="price"]').text();
      const airline = $el.find('.airline, [data-airline], .aerolinea').text();

      if (priceText && /\d/.test(priceText)) {
        flights.push({
          airline: airline || 'Naranja X',
          price: priceText.replace(/[^0-9,.]/g, '').trim(),
          url: searchUrl
        });
      }
    });

    // Si no encontró con selectores complejos, busca números que parecen precios
    if (flights.length === 0) {
      const pageText = $.text();
      // Busca patrones como "5200.50" o "5.200,50"
      const pricePattern = /[\$\s]?(\d{1,5}[.,]\d{2})/g;
      const matches = pageText.match(pricePattern);

      if (matches) {
        const uniquePrices = [...new Set(matches)].slice(0, 1);
        uniquePrices.forEach(price => {
          flights.push({
            airline: 'Naranja X',
            price: price.replace(/[^0-9,.]/g, '').trim(),
            url: searchUrl
          });
        });
      }
    }

    await browser.close();

    if (flights.length > 0) {
      console.log(`  ✓ Encontrados ${flights.length} vuelos`);
      return {
        airline: 'Naranja X',
        url: url,
        status: 'success',
        prices: flights
      };
    } else {
      return {
        airline: 'Naranja X',
        url: url,
        status: 'no-prices-found',
        prices: [],
        message: 'No se encontraron precios'
      };
    }

  } catch (error) {
    console.error(`❌ Error en Naranja X: ${error.message}`);
    if (browser) await browser.close();

    return {
      airline: 'Naranja X',
      status: 'error',
      prices: [],
      error: error.message
    };
  }
}

module.exports = { scrapeNaranjaX };


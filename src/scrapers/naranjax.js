const puppeteer = require('puppeteer-core');
const cheerio = require('cheerio');

const URL = 'https://viajes.naranjax.com/';

function normalizePrice(text) {
  if (!text) return null;

  const cleaned = text
    .replace(/\s/g, '')
    .replace(/[^\d.,]/g, '');

  if (cleaned.includes('.') && cleaned.includes(',')) {
    return Number(cleaned.replace(/\./g, '').replace(',', '.'));
  }

  if (cleaned.includes(',')) {
    return Number(cleaned.replace(',', '.'));
  }

  return Number(cleaned);
}

/**
 * Scraper para Naranja X Viajes usando Puppeteer-Core
 */
async function scrapeNaranjaX() {
  let browser;
  try {
    console.log('✈️ Buscando vuelos Naranja X...');

    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setDefaultTimeout(45000);

    console.log(`📍 Navegando a Naranja X Viajes...`);
    await page.goto(URL, { waitUntil: 'networkidle2' });

    // Espera a que cargue la página
    await page.waitForTimeout(2000);

    // Busca precios con selectores mejorados
    const prices = await page.evaluate(() => {
      const values = [];

      const elements = document.querySelectorAll(
        '[class*="price"], [class*="tarif"], [class*="valor"], [class*="cost"], [class*="fare"], [data-price], [data-amount], [data-valor]'
      );

      elements.forEach(el => {
        const text = el.textContent?.trim();
        if (text && /\d/.test(text)) {
          values.push(text);
        }
      });

      return values;
    });

    console.log(`📊 Encontrados ${prices.length} candidatos de precio`);

    const results = [];

    for (const raw of prices) {
      const price = normalizePrice(raw);

      if (price && price > 100) { // filtro básico para Naranja X
        results.push({
          airline: 'Naranja X',
          price,
          raw,
          url: URL
        });
      }
    }

    if (!results.length) {
      return {
        airline: 'Naranja X',
        status: 'no-prices-found',
        prices: []
      };
    }

    // Ordenar por precio
    results.sort((a, b) => a.price - b.price);

    const cheapest = results[0];

    console.log('💰 Mejor precio encontrado:', cheapest);

    await browser.close();

    return {
      airline: 'Naranja X',
      status: 'success',
      bestPrice: cheapest,
      prices: results.slice(0, 10)
    };

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




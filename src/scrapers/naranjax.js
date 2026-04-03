const puppeteer = require('puppeteer-core');
const cheerio = require('cheerio');

/**
 * Scraper para Naranja X Viajes usando Puppeteer-Core
 */
async function scrapeNaranjaX() {
  let browser;
  try {
    console.log('🔍 Buscando vuelos Naranja X...');

    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);

    const url = 'https://viajes.naranjax.com/';

    console.log(`  Navegando a Naranja X Viajes...`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Espera a que cargue la página
    await page.waitForTimeout(2000);

    // Busca precios directo en JavaScript
    const prices = await page.evaluate(() => {
      const results = [];

      // Estrategia 1: Busca patrones de precio en todo el texto
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const text = el.textContent?.trim();

        // Patrón: $ o números con coma/punto y 2 decimales
        if (text && /\$\s*\d+[.,]\d{2}|\d+[.,]\d{2}\s*(ARS|BRL|USD)|\d{4,6}[.,]\d{2}/.test(text)) {
          results.push({
            price: text,
            type: 'text-pattern'
          });
        }
      });

      // Estrategia 2: Busca en atributos data
      const dataElements = document.querySelectorAll('[data-price], [data-amount], [data-valor], [data-cost]');
      dataElements.forEach(el => {
        const price = el.getAttribute('data-price') ||
                     el.getAttribute('data-amount') ||
                     el.getAttribute('data-valor') ||
                     el.getAttribute('data-cost');
        if (price && /\d{3,}/.test(price)) {
          results.push({
            price: price,
            type: 'data-attr'
          });
        }
      });

      // Estrategia 3: Busca por ID o clases que sugieren precio
      const priceElements = document.querySelectorAll('[id*="price"], [id*="tarif"], [class*="price"], [class*="tarif"], [class*="cost"]');
      priceElements.forEach(el => {
        const text = el.textContent?.trim();
        if (text && /\d{4,}/.test(text)) {
          results.push({
            price: text,
            type: 'price-class'
          });
        }
      });

      return results.slice(0, 5);
    });

    console.log(`  Encontrados ${prices.length} candidatos de precio`);

    await browser.close();

    if (prices.length > 0) {
      const cleanPrice = prices[0].price
        .replace(/[^0-9,.]/g, '')
        .trim()
        .replace(/,/g, '.');

      return {
        airline: 'Naranja X',
        url: url,
        status: 'success',
        prices: [{
          airline: 'Naranja X',
          price: cleanPrice,
          url: url,
          raw: prices[0].price
        }]
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




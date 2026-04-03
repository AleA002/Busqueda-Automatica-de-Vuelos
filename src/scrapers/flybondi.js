const puppeteer = require('puppeteer-core');

/**
 * Scraper para FlyBondi usando Puppeteer-Core
 */
async function scrapeFlyBondi() {
  let browser;
  try {
    console.log('🔍 Buscando vuelos FlyBondi...');

    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);

    // Navega a FlyBondi
    const searchUrl = 'https://www.flybondi.com/es/?origin=COR&destination=FLN&date=' +
                      new Date().toISOString().split('T')[0];

    console.log(`  Navegando a: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Espera a que carguen los resultados
    await page.waitForTimeout(3000);

    // Busca precios con múltiples estrategias
    const prices = await page.evaluate(() => {
      const results = [];

      // Estrategia 1: Busca cualquier elemento con números que parecen precios
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const text = el.textContent?.trim();

        // Busca patrones de precio: números con punto/coma y 2 decimales
        if (text && /\$\s*\d+[.,]\d{2}|\d+[.,]\d{2}\s*(ARS|USD|BRL)/.test(text)) {
          results.push({
            price: text,
            element: el.tagName
          });
        }
      });

      // Estrategia 2: Busca en atributos data
      const dataElements = document.querySelectorAll('[data-price], [data-amount], [data-cost]');
      dataElements.forEach(el => {
        const price = el.getAttribute('data-price') ||
                     el.getAttribute('data-amount') ||
                     el.getAttribute('data-cost');
        if (price) {
          results.push({
            price: price,
            element: 'data-attr'
          });
        }
      });

      // Estrategia 3: Busca en estilos o computed
      const priceClasses = document.querySelectorAll('[class*="price"], [class*="tarif"], [class*="cost"], [class*="fare"]');
      priceClasses.forEach(el => {
        const text = el.textContent?.trim();
        if (text && /\d{4,6}/.test(text)) {
          results.push({
            price: text,
            element: el.className
          });
        }
      });

      return results.slice(0, 5); // Top 5
    });

    console.log(`  Encontrados ${prices.length} candidatos de precio`);

    await browser.close();

    if (prices.length > 0) {
      // Limpia el primer precio encontrado
      const cleanPrice = prices[0].price
        .replace(/[^0-9,.]/g, '')
        .trim()
        .replace(/,/g, '.');

      return {
        airline: 'FlyBondi',
        url: 'https://www.flybondi.com/es/',
        status: 'success',
        prices: [{
          airline: 'FlyBondi',
          price: cleanPrice,
          url: searchUrl,
          raw: prices[0].price
        }]
      };
    } else {
      return {
        airline: 'FlyBondi',
        url: 'https://www.flybondi.com/es/',
        status: 'no-prices-found',
        prices: [],
        message: 'No se encontraron precios en la página'
      };
    }

  } catch (error) {
    console.error(`❌ Error en FlyBondi: ${error.message}`);
    if (browser) await browser.close();

    return {
      airline: 'FlyBondi',
      status: 'error',
      prices: [],
      error: error.message
    };
  }
}

module.exports = { scrapeFlyBondi };




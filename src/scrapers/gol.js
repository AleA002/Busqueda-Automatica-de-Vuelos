const puppeteer = require('puppeteer-core');

/**
 * Scraper para GOL usando Puppeteer-Core
 */
async function scrapeGOL() {
  let browser;
  try {
    console.log('🔍 Buscando vuelos GOL...');

    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);

    console.log(`  Navegando a: GOL.com.br`);
    await page.goto('https://www.voegol.com.br/pt-br/compre/passagens-aereas', {
      waitUntil: 'networkidle2'
    });

    // Espera a que cargue la página
    await page.waitForTimeout(3000);

    // Busca precios con múltiples estrategias
    const prices = await page.evaluate(() => {
      const results = [];

      // Estrategia 1: Busca números que parecen precios
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const text = el.textContent?.trim();

        // Patrón: $ seguido de números con decimales
        if (text && /R\$\s*\d+[.,]\d{2}|\$\s*\d+[.,]\d{2}|\d+[.,]\d{2}\s*R\$/.test(text)) {
          results.push({
            price: text,
            type: 'regex-pattern'
          });
        }
      });

      // Estrategia 2: Busca en atributos data
      const dataElements = document.querySelectorAll('[data-price], [data-amount], [data-tarifa], [data-valor]');
      dataElements.forEach(el => {
        const price = el.getAttribute('data-price') ||
                     el.getAttribute('data-amount') ||
                     el.getAttribute('data-tarifa') ||
                     el.getAttribute('data-valor');
        if (price && /\d+/.test(price)) {
          results.push({
            price: price,
            type: 'data-attr'
          });
        }
      });

      // Estrategia 3: Busca por clases que contengan "price", "tarif", "valor"
      const priceClasses = document.querySelectorAll('[class*="price"], [class*="tarif"], [class*="valor"], [class*="fare"]');
      priceClasses.forEach(el => {
        const text = el.textContent?.trim();
        if (text && /\d{4,}/.test(text)) {
          results.push({
            price: text,
            type: 'class-selector'
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
        airline: 'GOL',
        url: 'https://www.voegol.com.br/',
        status: 'success',
        prices: [{
          airline: 'GOL',
          price: cleanPrice,
          url: 'https://www.voegol.com.br/pt-br/compre/passagens-aereas',
          raw: prices[0].price
        }]
      };
    } else {
      return {
        airline: 'GOL',
        url: 'https://www.voegol.com.br/',
        status: 'no-prices-found',
        prices: [],
        message: 'No se encontraron precios'
      };
    }

  } catch (error) {
    console.error(`❌ Error en GOL: ${error.message}`);
    if (browser) await browser.close();

    return {
      airline: 'GOL',
      status: 'error',
      prices: [],
      error: error.message
    };
  }
}

module.exports = { scrapeGOL };




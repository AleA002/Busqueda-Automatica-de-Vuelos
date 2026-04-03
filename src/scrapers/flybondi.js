const puppeteer = require('puppeteer-core');

/**
 * Scraper para FlyBondi usando Puppeteer-Core
 */
async function scrapeFlyBondi() {
  let browser;
  try {
    console.log('🔍 Buscando vuelos FlyBondi...');

    // Usa Chromium del sistema (pre-instalado en GitHub Actions)
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

    // Busca precios en la página
    const prices = await page.evaluate(() => {
      const results = [];

      // Selectores comunes para precios
      const priceElements = document.querySelectorAll('[data-test*="price"], .price, [class*="price"], .tarifa');

      priceElements.forEach(el => {
        const priceText = el.textContent?.trim();
        if (priceText && /\$|€|R\$|ARS/.test(priceText)) {
          results.push({
            price: priceText,
            element: el.className
          });
        }
      });

      return results;
    });

    await browser.close();

    if (prices.length > 0) {
      console.log(`  ✓ Encontrados ${prices.length} precios`);
      // Extrae el primer precio válido
      const firstPrice = prices[0].price.replace(/[^0-9,.]/g, '').trim();

      return {
        airline: 'FlyBondi',
        url: 'https://www.flybondi.com/es/',
        status: 'success',
        prices: [{
          airline: 'FlyBondi',
          price: firstPrice,
          url: searchUrl
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



const puppeteer = require('puppeteer');

/**
 * Scraper para GOL usando Puppeteer
 */
async function scrapeGOL() {
  let browser;
  try {
    console.log('🔍 Buscando vuelos GOL...');

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);

    // GOL usa CGC para Córdoba, FLN para Florianópolis
    const searchUrl = 'https://www.voegol.com.br/pt-br/compre/passagens-aereas?origin=CGC&destination=FLN&departureDate=' +
                      new Date().toISOString().split('T')[0];

    console.log(`  Navegando a: GOL.com.br`);
    await page.goto('https://www.voegol.com.br/pt-br/compre/passagens-aereas', {
      waitUntil: 'networkidle2'
    });

    // Espera a que cargue la página
    await page.waitForTimeout(3000);

    // Intenta llenar el formulario de búsqueda
    try {
      // Busca campos de origen/destino
      await page.type('[data-testid="origin"], #origin, input[name="origin"]', 'Cordoba');
      await page.waitForTimeout(1000);

      await page.type('[data-testid="destination"], #destination, input[name="destination"]', 'Florianopolis');
      await page.waitForTimeout(1000);

      // Hace clic en buscar
      await page.click('button[type="submit"], [data-testid="search-button"], button:contains("Buscar")');
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log('  Nota: No fue posible hacer clic en búsqueda automáticamente');
    }

    // Busca precios
    const prices = await page.evaluate(() => {
      const results = [];
      const priceElements = document.querySelectorAll('[data-testid*="price"], .price, [class*="preco"], [class*="tarifa"]');

      priceElements.forEach(el => {
        const priceText = el.textContent?.trim();
        if (priceText && /\d/.test(priceText)) {
          results.push(priceText);
        }
      });

      return results.slice(0, 3); // Top 3 precios
    });

    await browser.close();

    if (prices.length > 0) {
      console.log(`  ✓ Encontrados precios en GOL`);
      const cleanPrice = prices[0].replace(/[^0-9,.]/g, '').trim();

      return {
        airline: 'GOL',
        url: 'https://www.voegol.com.br/',
        status: 'success',
        prices: [{
          airline: 'GOL',
          price: cleanPrice,
          url: searchUrl
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


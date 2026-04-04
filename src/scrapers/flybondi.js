const puppeteer = require('puppeteer-core');

const ORIGIN = 'COR';
const DESTINATION = 'FLN';

const YEAR = new Date().getFullYear() + 1; // Ej: 2027 si estás planeando con tiempo
const MONTHS = [0, 1]; // Enero (0) y Febrero (1)

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

async function scrapeFlyBondi() {
  let browser;

  try {
    console.log('✈️ Buscando vuelos FlyBondi COR → FLN...');

    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setDefaultTimeout(45000);

    const results = [];

    for (const month of MONTHS) {
      console.log(`📅 Analizando mes: ${month + 1}/${YEAR}`);

      const daysInMonth = new Date(YEAR, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${YEAR}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        console.log(`🔎 Buscando fecha: ${date}`);

        const url = `https://flybondi.com/ar/search/dates?adults=1&children=0&currency=ARS&fromCityCode=${ORIGIN}&infants=0&toCityCode=${DESTINATION}`;

        await page.goto(url, { waitUntil: 'networkidle2' });

        // Esperar calendario
        await page.waitForSelector('button', { timeout: 15000 });

        // Buscar botón del día usando JavaScript evaluado (más robusto)
        const dayFound = await page.evaluate((day) => {
          const allDayElements = document.querySelectorAll(
            'button, [role="button"], [class*="day"], [data-day], [aria-label*="day"]'
          );
          const dayEl = Array.from(allDayElements).find(el => {
            const text = el.textContent.trim().split(/\n/)[0].trim();
            return text === day.toString();
          });
          return !!dayEl;
        }, day);

        if (!dayFound) {
          console.log(`⚠️ Día ${day} no clickeable`);
          continue;
        }

        // Click y esperar navegación
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
          page.evaluate((day) => {
            const allDayElements = document.querySelectorAll(
              'button, [role="button"], [class*="day"], [data-day], [aria-label*="day"]'
            );
            const dayEl = Array.from(allDayElements).find(el => {
              const text = el.textContent.trim().split(/\n/)[0].trim();
              return text === day.toString();
            });
            if (dayEl) dayEl.click();
          }, day)
        ]);

        // Esperar resultados
        await page.waitForTimeout(3000);

        // Extraer precios reales
        const prices = await page.evaluate(() => {
          const values = [];

          const elements = document.querySelectorAll(
            '[class*="price"], [class*="fare"], [data-price]'
          );

          elements.forEach(el => {
            const text = el.textContent?.trim();
            if (text && /\d/.test(text)) {
              values.push(text);
            }
          });

          return values;
        });

        for (const raw of prices) {
          const price = normalizePrice(raw);

          if (price && price > 1000) { // filtro básico
            results.push({
              airline: 'FlyBondi',
              date,
              price,
              raw,
              url: page.url()
            });
          }
        }

        // Volver atrás para siguiente día
        await page.goBack({ waitUntil: 'networkidle2' });
      }
    }

    if (!results.length) {
      return {
        airline: 'FlyBondi',
        status: 'no-prices-found',
        prices: []
      };
    }

    // Ordenar por precio
    results.sort((a, b) => a.price - b.price);

    const cheapest = results[0];

    console.log('💰 Mejor precio encontrado:', cheapest);

    return {
      airline: 'FlyBondi',
      status: 'success',
      bestPrice: cheapest,
      prices: results.slice(0, 10)
    };

  } catch (error) {
    return {
      airline: 'FlyBondi',
      status: 'error',
      error: error.message,
      prices: []
    };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeFlyBondi };
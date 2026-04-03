const fs = require('fs');
const path = require('path');

const PRICES_FILE = path.join(__dirname, '../data/best-prices.json');

/**
 * Crea el directorio de datos si no existe
 */
function ensureDataDir() {
  const dataDir = path.dirname(PRICES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * Carga el archivo de mejores precios
 */
function loadBestPrices() {
  ensureDataDir();

  if (!fs.existsSync(PRICES_FILE)) {
    return [];
  }

  try {
    const data = fs.readFileSync(PRICES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error al cargar best-prices.json:', error.message);
    return [];
  }
}

/**
 * Guarda los mejores precios
 */
function saveBestPrices(prices) {
  ensureDataDir();

  try {
    fs.writeFileSync(
      PRICES_FILE,
      JSON.stringify(prices, null, 2),
      'utf-8'
    );
    console.log('✅ Mejores precios guardados');
  } catch (error) {
    console.error('❌ Error al guardar best-prices.json:', error.message);
  }
}

/**
 * Normaliza precio a número para comparación
 */
function parsePrice(priceString) {
  // Remueve caracteres especiales y convierte a número
  const cleaned = priceString.replace(/[^0-9,.]/g, '');
  const normalized = cleaned.replace('.', '').replace(',', '.');
  return parseFloat(normalized) || Infinity;
}

/**
 * Actualiza el mejor precio si es necesario
 */
function updateBestPrice(newFlights) {
  const currentBest = loadBestPrices();
  const today = new Date().toISOString().split('T')[0];

  // Filtra solo vuelos con precio válido
  const validFlights = newFlights.filter(f => f.price && !isNaN(parsePrice(f.price)));

  if (validFlights.length === 0) {
    console.log('⚠️  No se encontraron vuelos con precio válido');
    return currentBest;
  }

  // Encuentra el mejor precio
  const bestPrice = validFlights.reduce((best, current) => {
    const currentPrice = parsePrice(current.price);
    const bestPriceNum = parsePrice(best.price || Infinity);
    return currentPrice < bestPriceNum ? current : best;
  });

  bestPrice.date = today;
  bestPrice.timestamp = new Date().toISOString();

  // Busca si ya existe un registro del mismo día
  const existingIndex = currentBest.findIndex(p => p.date === today && p.airline === bestPrice.airline);

  if (existingIndex !== -1) {
    // Actualiza si el nuevo es más barato
    if (parsePrice(bestPrice.price) < parsePrice(currentBest[existingIndex].price)) {
      console.log(`📉 Mejor precio encontrado para ${bestPrice.airline}: ${bestPrice.price}`);
      currentBest[existingIndex] = bestPrice;
    }
  } else {
    // Agrega nuevo registro
    console.log(`✨ Nuevo precio registrado para ${bestPrice.airline}: ${bestPrice.price}`);
    currentBest.push(bestPrice);
  }

  // Mantiene solo los últimos 30 días
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const filtered = currentBest.filter(p => new Date(p.date) >= thirtyDaysAgo);

  saveBestPrices(filtered);
  return filtered;
}

/**
 * Obtiene el mejor precio general
 */
function getBestOverallPrice() {
  const prices = loadBestPrices();

  if (prices.length === 0) {
    return null;
  }

  return prices.reduce((best, current) => {
    const currentPrice = parsePrice(current.price);
    const bestPrice = parsePrice(best.price || Infinity);
    return currentPrice < bestPrice ? current : best;
  });
}

/**
 * Genera reporte de precios
 */
function generateReport(allScraperResults) {
  const report = {
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    scrapers: allScraperResults,
    bestPrices: loadBestPrices(),
    bestOverall: getBestOverallPrice()
  };

  return report;
}

module.exports = {
  loadBestPrices,
  saveBestPrices,
  updateBestPrice,
  getBestOverallPrice,
  generateReport,
  parsePrice
};

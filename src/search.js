const { scrapeFlyBondi } = require('./scrapers/flybondi');
const { scrapeGOL } = require('./scrapers/gol');
const { scrapeNaranjaX } = require('./scrapers/naranjax');
const { updateBestPrice, generateReport } = require('./utils/priceManager');
const fs = require('fs');
const path = require('path');

/**
 * Script principal que orquesta el scraping de todas las aerolíneas
 */
async function runSearch() {
  console.log('🚀 Iniciando búsqueda de vuelos...');
  console.log(`⏰ ${new Date().toISOString()}\n`);

  const results = [];

  try {
    // 1. FlyBondi
    console.log('▶️  Ejecutando scraper FlyBondi...');
    const flyBondiResult = await scrapeFlyBondi();
    results.push(flyBondiResult);
    console.log(`   ${flyBondiResult.status}\n`);

    // 2. GOL
    console.log('▶️  Ejecutando scraper GOL...');
    const golResult = await scrapeGOL();
    results.push(golResult);
    console.log(`   ${golResult.status}\n`);

    // 3. Naranja X
    console.log('▶️  Ejecutando scraper Naranja X...');
    const naranjaXResult = await scrapeNaranjaX();
    results.push(naranjaXResult);
    console.log(`   ${naranjaXResult.status}\n`);

    // Combina todos los vuelos encontrados
    const allFlights = results
      .flatMap(r => r.prices || [])
      .filter(f => f.price);

    // Actualiza mejores precios
    if (allFlights.length > 0) {
      console.log('📊 Procesando resultados...');
      updateBestPrice(allFlights);
    } else {
      console.log('⚠️  No se encontraron vuelos con precio en este ciclo');
    }

    // Genera reporte
    const report = generateReport(results);

    // Guarda reporte en archivo
    const reportsDir = path.join(__dirname, '../data/reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportFile = path.join(
      reportsDir,
      `report-${new Date().toISOString().split('T')[0]}.json`
    );

    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\n✅ Búsqueda completada. Reporte guardado en: data/reports/${path.basename(reportFile)}`);

    // Imprime resumen
    console.log('\n📋 RESUMEN:');
    results.forEach(r => {
      console.log(`  ${r.airline}: ${r.status}`);
    });

    return report;

  } catch (error) {
    console.error('\n❌ Error fatal durante la búsqueda:', error);
    process.exit(1);
  }
}

// Ejecuta la búsqueda si se llama directamente
if (require.main === module) {
  runSearch().catch(error => {
    console.error('Error no capturado:', error);
    process.exit(1);
  });
}

module.exports = { runSearch };

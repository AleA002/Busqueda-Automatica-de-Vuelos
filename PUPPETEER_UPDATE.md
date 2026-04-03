# 🔧 Actualización: Puppeteer + Scrapers Mejorados

## ¿Qué cambió?

He actualizado los scrapers para usar **Puppeteer**, que es un navegador automatizado. Esto permite:

✅ **Cargar JavaScript dinámico** - Las aerolíneas usan JS para renderizar precios
✅ **Hacer búsquedas reales** - Llena formularios automáticamente
✅ **Extraer precios reales** - Obtiene datos de la página renderizada

## 📦 Cambios técnicos

### 1. **package.json**
- Agregué `puppeteer: ^21.6.1` como dependencia

### 2. **Scrapers actualizados** (`src/scrapers/`)
- `flybondi.js` - Usa navegador para ir a FlyBondi y extraer precios
- `gol.js` - Navega a GOL, busca Córdoba-Florianópolis
- `naranjax.js` - Scraping completo con Puppeteer + Cheerio

### 3. **GitHub Actions**
- Timeout aumentado a 15 minutos (descarga de Chromium es pesada)
- Verbose mode en npm install para ver el progreso

## 🚀 Próximos pasos

### Opción 1: Probar localmente

```bash
# 1. Instala dependencias
npm install

# 2. Ejecuta la búsqueda
npm run search

# Debería crear:
# - data/best-prices.json
# - data/reports/report-YYYY-MM-DD.json
```

### Opción 2: Probar en GitHub Actions

```bash
# 1. Commit los cambios
git add .
git commit -m "🔧 Agregar Puppeteer para scrapers reales"
git push

# 2. Ve a GitHub Actions
# 3. Click "Run workflow"
# 4. Espera 5-10 minutos (primera ejecución descarga Chromium)
```

## ⏱️ Tiempos esperados

- **Primera ejecución**: 5-10 minutos (descarga Chromium ~150MB)
- **Ejecuciones siguientes**: 2-3 minutos (reutiliza Chromium)

## 📊 Qué esperar

Después de ejecutar, deberías ver:

```json
// data/best-prices.json
[
  {
    "airline": "FlyBondi",
    "price": "4599.00",
    "date": "2026-04-03",
    "url": "https://..."
  },
  {
    "airline": "GOL",
    "price": "4899.50",
    "date": "2026-04-03",
    "url": "https://..."
  }
]
```

## ⚠️ Limitaciones

1. **Chromium en GitHub**: No tiene X11, necesita `--no-sandbox` (ya configurado)
2. **Tiempos**: Puppeteer es más lento que scrapers básicos, pero más confiable
3. **Ripeters**: Si una aerolínea cambia su estructura HTML, el scraper necesita actualización

## 🆘 Si falla

### Error: "Chromium not found"
- Esperado en primera ejecución
- GitHub Actions lo descargará automáticamente
- Puede tomar 2-3 minutos

### Error: "Timeout"
- Aumenta `timeout-minutes` en `.github/workflows/search-flights.yml`
- O reduce el número de scrapers

### No encuentra precios
- Los selectores CSS pueden cambiar
- Revisa los logs en GitHub Actions
- Actualiza los selectores en `src/scrapers/`

## ✅ Checklist

- [ ] Cambios commitados y pusheados a GitHub
- [ ] GitHub Actions ejecutó correctamente
- [ ] `data/best-prices.json` fue creado
- [ ] Contiene precios reales (no vacío)

---

**Nota**: Si los precios siguen vacíos después de Puppeteer, es posible que:
1. Las aerolíneas requieran más tiempos de espera
2. Los selectores CSS cambien regularmente
3. Haya protecciones anti-bot

En ese caso, podríamos mejorar con:
- Tiempos de espera más largos
- Detectar cambios de selectores automáticamente
- Usar APIs no documentadas si existen

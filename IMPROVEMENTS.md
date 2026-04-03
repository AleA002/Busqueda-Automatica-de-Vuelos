# Mejoras futuras para los scrapers

## 🔧 Si necesitas Puppeteer (JavaScript pesado)

Las aerolíneas como FlyBondi y GOL usan JavaScript para renderizar precios dinámicamente.

### Opción 1: Usar Puppeteer (Recomendado)

```bash
npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
```

Ejemplo para FlyBondi con Puppeteer:

```javascript
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeFlyBondiWithPuppeteer() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://www.flybondi.com/es/', { waitUntil: 'networkidle2' });

  // Ejecutar búsqueda...

  await browser.close();
}
```

### Opción 2: Usar APIs internas

Muchas aerolíneas tienen endpoints API que usan sus propios frontend:

```javascript
// GOL API
fetch('https://api.voegol.com.br/flights/search', {
  method: 'POST',
  body: JSON.stringify({
    origin: 'COR',
    destination: 'FLN',
    departure: '2024-04-10'
  })
})
```

## 🚀 Deployment alternativo (si GitHub Actions falla)

### Railway.app (Recomendado)

```bash
npm install -g railway
railway login
railway init
```

Deploy: `railway up`

### Render.com

- Connect repo
- Deploy automático
- Cron jobs en plan gratuito

### Heroku (ya no es gratis desde Nov 2022)

Alternativa: Usar Railway o Render

## 📧 Notificaciones

### Email vía GitHub

Edita `.github/workflows/search-flights.yml`:

```yaml
- name: 📧 Enviar email si hay error
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL }}
    password: ${{ secrets.EMAIL_PASS }}
    subject: Fallo en búsqueda de vuelos
```

### Slack

```yaml
- name: 💬 Notificar en Slack
  uses: 8398a7/action-slack@v3
  with:
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
    status: ${{ job.status }}
```

## 🔍 Debugging local

```bash
# Prueba el scraper localmente
npm run search

# Ver logs detallados
DEBUG=* npm run search

# Verificar estructura de datos
node -e "console.log(require('./src/utils/priceManager').loadBestPrices())"
```

## ⚡ Performance

- Los timeouts están configurados en 10s por scraper
- Parallel execution de todos los scrapers
- Historial limitado a 30 días para no saturar

## 🛡️ Robustez

- Manejo de errores en cada scraper
- Fallback si un scraper falla
- Guardado de reportes para auditoría
- Re-intentos automáticos del workflow si falla

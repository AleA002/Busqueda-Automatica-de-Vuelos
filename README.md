# ✈️ Buscador de Vuelos Automático

Aplicación que busca automáticamente vuelos de **FlyBondi**, **GOL** y **Naranja X** desde **Córdoba Capital** a **Florianópolis - Santa Catarina**.

Ejecuta búsquedas **2 veces al día** automáticamente usando GitHub Actions y guarda un historial de los mejores precios encontrados.

## 🌟 Características

- ✅ Búsqueda automática 2x diarias (configurable)
- ✅ Scraping de múltiples aerolíneas
- ✅ Historial de mejores precios
- ✅ Almacenamiento en JSON
- ✅ Reportes diarios
- ✅ 100% gratis con GitHub Actions
- ✅ Sin servidor que mantener

## 📋 Requisitos

- GitHub Account (gratuita)
- Node.js 18+ (solo si quieres probar localmente)

## 🚀 Instalación

### 1. Crear repositorio en GitHub

```bash
git clone <este-repo> buscador-vuelos
cd buscador-vuelos
git remote set-url origin <tu-nuevo-repo>
git push -u origin main
```

### 2. Habilitar GitHub Actions

- Ve a tu repositorio en GitHub
- Click en **Settings** → **Actions** → **General**
- Asegúrate de que "Actions permissions" esté en **Allow all actions and reusable workflows**

### 3. Dar permisos al workflow

- Click en **Settings** → **Actions** → **General**
- Bajo "Workflow permissions", selecciona **Read and write permissions**
- Marca **Allow GitHub Actions to create and approve pull requests**

## 📝 Uso

### Ejecución manual

```bash
npm install
npm run search
```

### Ejecución automática

El workflow está configurado para ejecutar:
- **08:00 UTC** (05:00 Argentina)
- **16:00 UTC** (13:00 Argentina)

Ver ejecuciones: **Actions** tab en tu repositorio GitHub

## 📂 Estructura de archivos

```
buscador-vuelos/
├── .github/workflows/
│   └── search-flights.yml          # GitHub Actions workflow
├── src/
│   ├── scrapers/
│   │   ├── flybondi.js             # Scraper FlyBondi
│   │   ├── gol.js                  # Scraper GOL
│   │   └── naranjax.js             # Scraper Naranja X
│   ├── utils/
│   │   └── priceManager.js         # Gestión de precios
│   └── search.js                   # Script principal
├── data/
│   ├── best-prices.json            # Mejores precios encontrados
│   └── reports/                    # Reportes diarios
├── package.json
└── README.md
```

## 💾 Datos almacenados

### `data/best-prices.json`

Array con los mejores precios encontrados:

```json
[
  {
    "airline": "FlyBondi",
    "url": "https://www.flybondi.com/es/",
    "price": "5299.00",
    "date": "2024-04-03",
    "timestamp": "2024-04-03T08:15:32.123Z"
  },
  {
    "airline": "GOL",
    "url": "https://www.voegol.com.br/",
    "price": "4899.50",
    "date": "2024-04-03",
    "timestamp": "2024-04-03T08:20:15.456Z"
  }
]
```

### `data/reports/`

Reportes diarios con detalles completos:

```json
{
  "timestamp": "2024-04-03T08:15:32.123Z",
  "date": "2024-04-03",
  "scrapers": [...],
  "bestPrices": [...],
  "bestOverall": {...}
}
```

## 🔧 Personalización

### Cambiar horarios de búsqueda

Edita `.github/workflows/search-flights.yml`:

```yaml
on:
  schedule:
    - cron: '0 8 * * *'   # Tu hora UTC aquí
    - cron: '0 16 * * *'  # Tu hora UTC aquí
```

Usa [crontab.guru](https://crontab.guru/) para convertir a UTC.

### Cambiar rutas de vuelo

Edita archivo en `src/scrapers/`:

```javascript
// Cambiar COR (Córdoba) y FLN (Florianópolis)
const searchParams = {
  origin: 'TU_CODIGO',      // Código IATA origen
  destination: 'TU_DESTINO', // Código IATA destino
  date: new Date().toISOString().split('T')[0]
};
```

### Agregar nueva aerolínea

1. Crea `src/scrapers/nuevalinea.js`
2. Implementa función `scrapeNuevaLinea()`
3. Importa en `src/search.js`
4. Agrega al array de scrapers

## 🐛 Troubleshooting

### Las búsquedas no se ejecutan

1. Verifica que GitHub Actions esté habilitado
2. Revisa la pestaña **Actions** para ver logs de error
3. Confirma que tienes permisos de escritura en el repo

### No se guardan los resultados

1. Usa `git push` con permisos correctos
2. Revisa que el workflow tenga `read and write permissions`

### Scraping retorna errores

Las aerolíneas pueden bloquear scrapers. Soluciones:

1. **Usar Puppeteer**: Descomenta las líneas en los scrapers (requiere Chrome/Chromium)
2. **Usar APIs**: Si la aerolínea tiene API pública
3. **Cambiar User-Agent**: Simular navegadores reales

## 📊 Monitoreo

Verifica si los datos se están actualizando:

```bash
git log --oneline | head -20  # Ver últimos commits
cat data/best-prices.json      # Ver mejores precios
```

## 🔒 Privacidad

- Los datos se guardan en tu repositorio (privado/público según prefieras)
- No se envían datos a servidores externos
- Los precios se mantienen solo 30 días en el historial

## 📝 Notas técnicas

- **Ruta**: Córdoba Capital (COR) → Florianópolis (FLN)
- **Frecuencia**: 2 búsquedas diarias (configurable)
- **Primer reporte**: Se genera automáticamente después del primer run
- **Almacenamiento**: Archivos JSON + commits Git

## 🤝 Contribuciones

Para mejorar los scrapers:

1. Fork el repositorio
2. Crea una rama
3. Envía un Pull Request

## 📄 Licencia

MIT

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en **Actions**
2. Verifica que los códigos IATA sean correctos
3. Prueba localmente: `npm run search`

---

**Última actualización**: 2024-04-03

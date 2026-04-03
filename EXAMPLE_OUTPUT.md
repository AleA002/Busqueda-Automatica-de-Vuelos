# 📊 Ejemplo de Salida Esperada

## Archivos de Datos Generados

### 1. `data/best-prices.json`

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
  },
  {
    "airline": "Naranja X",
    "url": "https://viajes.naranjax.com/",
    "price": "6150.00",
    "date": "2024-04-03",
    "timestamp": "2024-04-03T08:25:00.789Z"
  }
]
```

### 2. `data/reports/report-2024-04-03.json`

```json
{
  "timestamp": "2024-04-03T08:15:32.123Z",
  "date": "2024-04-03",
  "scrapers": [
    {
      "airline": "FlyBondi",
      "url": "https://www.flybondi.com/es/",
      "status": "success",
      "prices": [
        {
          "airline": "FlyBondi",
          "price": "5299.00",
          "url": "https://www.flybondi.com/search?origin=COR&destination=FLN"
        }
      ]
    },
    {
      "airline": "GOL",
      "url": "https://www.voegol.com.br/",
      "status": "success",
      "prices": [
        {
          "airline": "GOL",
          "price": "4899.50",
          "url": "https://www.voegol.com.br/search?origin=CGC&destination=FLN"
        }
      ]
    },
    {
      "airline": "Naranja X",
      "url": "https://viajes.naranjax.com/",
      "status": "success",
      "prices": [
        {
          "airline": "Naranja X",
          "price": "6150.00",
          "url": "https://viajes.naranjax.com/?origin=COR&destination=FLN"
        }
      ]
    }
  ],
  "bestPrices": [
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
    },
    {
      "airline": "Naranja X",
      "url": "https://viajes.naranjax.com/",
      "price": "6150.00",
      "date": "2024-04-03",
      "timestamp": "2024-04-03T08:25:00.789Z"
    }
  ],
  "bestOverall": {
    "airline": "GOL",
    "url": "https://www.voegol.com.br/",
    "price": "4899.50",
    "date": "2024-04-03",
    "timestamp": "2024-04-03T08:20:15.456Z"
  }
}
```

### 3. GitHub Actions Log

```
🚀 Iniciando búsqueda de vuelos...
⏰ 2024-04-03T08:15:32.123Z

▶️  Ejecutando scraper FlyBondi...
   success

▶️  Ejecutando scraper GOL...
   success

▶️  Ejecutando scraper Naranja X...
   success

📊 Procesando resultados...
📉 Mejor precio encontrado para GOL: 4899.50
✅ Mejores precios guardados

✅ Búsqueda completada. Reporte guardado en: data/reports/report-2024-04-03.json

📋 RESUMEN:
  FlyBondi: success
  GOL: success
  Naranja X: success
```

### 4. Git Commit Automático

```
Author: github-actions[bot]
Date:   Wed Apr 3 08:15:32 2024 +0000

    🛫 Actualizados precios - 2024-04-03 08:15:32 UTC

    data/best-prices.json | 25 +++++++++++++++--------
    data/reports/report-2024-04-03.json | 1 ++++++++++++++++++++++++++++++++++
    2 files changed, 26 insertions(+), 4 deletions(-)
```

## 📈 Evolución de Datos (después de varios días)

```json
// data/best-prices.json después de 3 días
[
  // Día 1 (2024-04-03)
  {
    "airline": "GOL",
    "url": "https://www.voegol.com.br/",
    "price": "4899.50",
    "date": "2024-04-03",
    "timestamp": "2024-04-03T08:20:15.456Z"
  },
  // Día 2 (2024-04-04) - Mejor precio encontrado
  {
    "airline": "FlyBondi",
    "url": "https://www.flybondi.com/es/",
    "price": "4599.00",
    "date": "2024-04-04",
    "timestamp": "2024-04-04T08:10:00.000Z"
  },
  // Día 3 (2024-04-05) - Subió de precio
  {
    "airline": "GOL",
    "url": "https://www.voegol.com.br/",
    "price": "5199.99",
    "date": "2024-04-05",
    "timestamp": "2024-04-05T08:22:10.000Z"
  }
]
```

## 🔄 Historial de Búsquedas Diarias

Después de una semana, tu carpeta de reportes verá así:

```
data/reports/
├── report-2024-04-03.json  (mañana - 08:00)
├── report-2024-04-03_2.json (mañana - 16:00)
├── report-2024-04-04.json  (día 1 - 08:00)
├── report-2024-04-04_2.json (día 1 - 16:00)
├── report-2024-04-05.json
├── report-2024-04-05_2.json
└── ... (continuará indefinidamente)
```

## 💾 Estructura de Datos Final

```
buscador-vuelos/
├── data/
│   ├── best-prices.json      ← Mejores precios (actualizado)
│   └── reports/
│       ├── report-2024-04-03.json
│       ├── report-2024-04-04.json
│       └── ...
├── src/
│   ├── scrapers/
│   ├── utils/
│   └── search.js
└── .github/workflows/
    └── search-flights.yml
```

## 📲 Consultando los Datos

### Desde GitHub

1. Abre tu repositorio
2. Ve a la carpeta `data/`
3. Click en `best-prices.json`
4. GitHub mostrará un JSON formateado

### Desde la terminal

```bash
# Mejores precios actuales
cat data/best-prices.json | jq '.'

# Solo el precio más bajo
cat data/best-prices.json | jq 'min_by(.price | tonumber)'

# Precios por aerolínea
cat data/best-prices.json | jq 'group_by(.airline)'
```

## 🎯 Uso Práctico

**Para encontrar el vuelo más barato:**

1. Abre `data/best-prices.json` en GitHub
2. Busca el que tenga precio más bajo
3. Click en la URL para comprar
4. ¡A viajar! 🛫

# 🚀 Guía Rápida de Setup - GitHub Actions

Sigue estos pasos para que tu buscador de vuelos esté funcionando en GitHub Actions:

## Paso 1️⃣: Preparar el repositorio

```bash
# Si aún no es un repo git:
git init
git add .
git commit -m "Initial commit: Flight search automation"
```

## Paso 2️⃣: Crear repositorio en GitHub

1. Abre https://github.com/new
2. Escribe el nombre: `buscador-vuelos` (o el que prefieras)
3. Click **Create repository**

## Paso 3️⃣: Conectar tu código

```bash
# Reemplaza CON TU USUARIO/REPO
git remote add origin https://github.com/TU_USUARIO/buscador-vuelos.git
git branch -M main
git push -u origin main
```

## Paso 4️⃣: Habilitar GitHub Actions

### Ir a Settings:
- Tu repo → **Settings**
- Sección **Actions** en el menú izquierdo
- Click **General**

### Configurar permisos:

1. **Actions permissions**: Selecciona **Allow all actions and reusable workflows**
2. **Workflow permissions**: Selecciona **Read and write permissions**
3. Marca la opción: **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

## Paso 5️⃣: Verificar que funciona

1. Ve a la pestaña **Actions** en tu repo
2. Deberías ver el workflow `✈️ Buscar Vuelos Diarios`
3. Para probar inmediatamente:
   - Click en el workflow
   - Click botón **Run workflow** (dropdown a la derecha)
   - Selecciona la rama `main`
   - Click **Run workflow**

## Paso 6️⃣: Ver resultados

Después de que ejecute (espera 1-2 minutos):

1. Vuelve a tu repo en GitHub
2. Los archivos se han actualizado automáticamente:
   - `data/best-prices.json` - Mejores precios encontrados
   - `data/reports/report-YYYY-MM-DD.json` - Reporte detallado

3. Ver commit automático: Click en el ícono de commits

## Paso 7️⃣: Personalizar (Opcional)

### Cambiar horarios

Edita `.github/workflows/search-flights.yml`:

```yaml
schedule:
  - cron: '0 8 * * *'   # Cambia a tu hora (UTC)
  - cron: '0 16 * * *'  # Segunda ejecución
```

[Convertidor de horas a UTC](https://crontab.guru/)

### Cambiar rutas de vuelo

Edita archivos en `src/scrapers/`:

```javascript
origin: 'TU_AEROPUERTO',
destination: 'TU_DESTINO'
```

Códigos IATA: COR (Córdoba), FLN (Florianópolis)

## ✅ ¡Listo!

Tu buscador ahora se ejecuta automáticamente:
- ✈️ A las 08:00 UTC (05:00 Argentina)
- ✈️ A las 16:00 UTC (13:00 Argentina)

Los resultados se guardan automáticamente en el repositorio.

---

## 📊 Monitoreo

Para ver si todo funciona correctamente:

```bash
# Ver últimos commits automáticos
git log --oneline | grep "Actualizados precios"

# Ver últimos precios encontrados
cat data/best-prices.json
```

## 🆘 Si algo falla

1. **Actions no ejecuta**:
   - Verifica Settings → Actions → Permisos

2. **No se guardan resultados**:
   - Verifica que el workflow tenga permisos de escritura

3. **Ver log de error**:
   - Actions → Click en el workflow fallido
   - Click en el job rojo
   - Ver el output detallado

## 🎯 Próximos pasos

- Configurar notificaciones (email, Slack, etc)
- Mejorar scrapers si algunas aerolíneas requieren JavaScript
- Agregar más rutas de vuelo

¡Tu buscador de vuelos está listo para funcionar! 🛫

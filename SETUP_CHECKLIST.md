# ✅ Checklist de Configuración - GitHub Actions

Sigue estos pasos en orden para que tu buscador de vuelos esté funcionando:

## 📋 Checklist Pre-Setup

- [ ] Tienes una cuenta de GitHub (gratuita en https://github.com)
- [ ] Git está instalado en tu máquina
- [ ] Este proyecto está clonado o descargado

## 🚀 Paso 1: Preparar el repositorio local

```bash
cd ~/ruta/a/buscador-vuelos

# Si NO es un repo git aún:
git init
git add .
git commit -m "✈️ Initial commit: Flight search automation"
```

- [ ] Los archivos están confirmados en git

## 🌐 Paso 2: Crear repositorio en GitHub

1. Abre https://github.com/new
2. Nombre: `buscador-vuelos` (o tu nombre preferido)
3. Descripción: "Búsqueda automática de vuelos Córdoba-Florianópolis"
4. Privacidad: Elige según prefieras (público/privado - ambos funcionan)
5. Click **Create repository**
6. Copia la URL del repo (ej: `https://github.com/tu-usuario/buscador-vuelos`)

- [ ] Repositorio creado en GitHub

## 📤 Paso 3: Conectar y subir código

```bash
# Reemplaza con TU URL
git remote add origin https://github.com/tu-usuario/buscador-vuelos.git

# O si origin ya existe:
git remote set-url origin https://github.com/tu-usuario/buscador-vuelos.git

# Sube el código
git branch -M main
git push -u origin main
```

- [ ] Código subido a GitHub
- [ ] Puedes ver los archivos en GitHub.com

## 🔧 Paso 4: Habilitar GitHub Actions

En tu repositorio de GitHub:

1. Click en **Settings** (arriba a la derecha)
2. En el menú izquierdo, click **Actions**
3. Click **General** (si no está ya seleccionado)

**Sección: Actions permissions**
- [ ] Selecciona **Allow all actions and reusable workflows**

**Sección: Workflow permissions**
- [ ] Selecciona **Read and write permissions**
- [ ] Marca **Allow GitHub Actions to create and approve pull requests**

4. Click **Save**

## ✅ Paso 5: Probar que funciona

1. En tu repo, click en la pestaña **Actions**
2. Deberías ver el workflow `✈️ Buscar Vuelos Diarios` listado
3. Click en el workflow
4. Click en el botón **Run workflow** (dropdown a la derecha)
5. Selecciona rama **main**
6. Click **Run workflow**

- [ ] Workflow ejecutándose (verás una bola amarilla que gira)

Espera 1-2 minutos...

- [ ] Workflow completado (verás un ✓ verde)

## 📊 Paso 6: Verificar resultados

1. Vuelve a tu repositorio (click en el nombre del repo)
2. Deberías ver una carpeta `data/` que NO existía antes
3. Abre la carpeta `data/`
4. Verifica:
   - [ ] `best-prices.json` existe (tus mejores precios)
   - [ ] `reports/` existe (reportes detallados)
5. Click en `best-prices.json` para ver los resultados

**Puedes ver algo como:**
```json
[
  {
    "airline": "GOL",
    "price": "4899.50",
    "url": "https://..."
  }
]
```

## 🕐 Paso 7: Configurar horarios (Opcional)

Si quieres cambiar cuándo se ejecuta:

1. En tu repo, abre `.github/workflows/search-flights.yml`
2. Click en el lápiz para editar
3. Busca la sección `schedule:`
4. Cambia las horas (en formato UTC):

```yaml
schedule:
  - cron: '0 8 * * *'    # Tu primera hora aquí
  - cron: '0 16 * * *'   # Tu segunda hora aquí
```

- [ ] Horarios configurados (o mantuviste los por defecto)

**Tip**: Usa https://crontab.guru/ para convertir tu horario local a UTC

## 🎁 Paso 8: Disfrutar

- [ ] El workflow se ejecuta automáticamente 2x al día
- [ ] Los resultados se guardan automáticamente en `data/`
- [ ] Puedes ver el historial de cambios en la pestaña **Commits**
- [ ] Comparte el repo si quieres que otros también lo usen

## 🆘 Si algo falla

### "El workflow no se ejecuta a la hora programada"
- Verifica que GitHub Actions esté habilitado
- GitHub Actions puede tener hasta 15 min de retraso
- Para probar: usa manualmente **Run workflow** button

### "No se guardan los resultados"
- Verifica en **Settings** → **Actions** → **Workflow permissions**
- Debe tener **Read and write permissions**

### "El workflow muestra error"
- Click en el workflow fallido en pestaña **Actions**
- Click en el job rojo para ver logs detallados
- Busca líneas de error en rojo

### "No encuentra vuelos"
- Los scrapers aún necesitan Puppeteer (mejora futura)
- Por ahora, los scrapers básicos pueden no funcionar al 100%
- Ver `IMPROVEMENTS.md` para soluciones

## 📞 Soporte rápido

Si encontras issues:

1. **Revisa GitHub Actions logs**:
   - Actions tab → Click en el workflow → Ver output rojo

2. **Prueba localmente**:
   ```bash
   npm install
   npm run search
   ```

3. **Consulta la documentación**:
   - `README.md` - documentación completa
   - `EXAMPLE_OUTPUT.md` - qué esperar
   - `IMPROVEMENTS.md` - mejoras futuras

---

## 🎉 ¡Listo!

Cuando completes hasta **Paso 6**, tu buscador de vuelos estará **100% operativo**.

A partir de entonces:
- ✈️ Se ejecuta automáticamente a las 08:00 UTC y 16:00 UTC
- 💾 Los resultados se guardan en tu repositorio
- 📊 Puedes ver el historial de precios en `data/best-prices.json`

**Siguiente**: Cada vez que necesites el precio actual, simplemente abre `data/best-prices.json` en GitHub. ¡No requiere mantenimiento! 🚀

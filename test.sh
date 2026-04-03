#!/bin/bash
# Test script para ejecutar localmente

echo "🧪 Iniciando test de buscador de vuelos..."
echo "⏰ $(date)"
echo ""

# Instala dependencias si es necesario
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependencias..."
  npm install
fi

echo ""
echo "🔍 Ejecutando búsqueda de vuelos..."
npm run search

echo ""
echo "✅ Test completado"
echo "📊 Ver resultados en: data/reports/"
echo "💰 Mejores precios en: data/best-prices.json"

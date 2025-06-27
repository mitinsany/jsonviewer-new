#!/bin/bash

# Скрипт для локального тестирования GitHub Pages

echo "🚀 Тестирование GitHub Pages локально..."

# Проверяем, что мы в корне проекта
if [ ! -f "Makefile" ]; then
    echo "❌ Запустите скрипт из корня проекта"
    exit 1
fi

# Собираем production версию
echo "📦 Сборка production версии..."
make prod

# Копируем в docs
echo "📁 Копирование в docs..."
rm -rf docs/*
cp -r build/production/JsonViewer/* docs/
touch docs/.nojekyll

# Проверяем основные файлы
echo "✅ Проверка файлов..."
if [ ! -f "docs/index.html" ]; then
    echo "❌ index.html не найден"
    exit 1
fi

if [ ! -f "docs/app.js" ]; then
    echo "❌ app.js не найден"
    exit 1
fi

if [ ! -f "docs/.nojekyll" ]; then
    echo "❌ .nojekyll не найден"
    exit 1
fi

echo "✅ Все файлы на месте"
echo "📊 Размер docs: $(du -sh docs/ | cut -f1)"

# Запускаем локальный сервер
echo "🌐 Запуск локального сервера..."
echo "📱 Откройте http://localhost:8000 в браузере"
echo "⏹️  Нажмите Ctrl+C для остановки"

cd docs && python3 -m http.server 8000 
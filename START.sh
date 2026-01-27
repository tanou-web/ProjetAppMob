#!/bin/bash
# Script pour démarrer l'application Intelligent Tutor

echo "🚀 Démarrage d'Intelligent Tutor..."
echo "=================================="

# Vérifier que les répertoires existent
if [ ! -d "/home/tanou/Bur/projetWeb/intelligent_tutor" ]; then
    echo "❌ Backend directory not found"
    exit 1
fi

if [ ! -d "/home/tanou/Bur/projetWeb/Frontend" ]; then
    echo "❌ Frontend directory not found"
    exit 1
fi

# 1. Démarrer le backend Django
echo ""
echo "📚 Démarrage du backend Django..."
cd /home/tanou/Bur/projetWeb/intelligent_tutor
python manage.py runserver 8000 > /tmp/django.log 2>&1 &
DJANGO_PID=$!
echo "   Backend PID: $DJANGO_PID (http://localhost:8000)"
sleep 3

# 2. Vérifier que Django fonctionne
if ! curl -s http://localhost:8000/api/ > /dev/null; then
    echo "❌ Django server failed to start"
    kill $DJANGO_PID
    exit 1
fi
echo "   ✅ Django running"

# 3. Démarrer le frontend Expo
echo ""
echo "⚛️  Démarrage du frontend Expo..."
cd /home/tanou/Bur/projetWeb/Frontend
npx expo start --web > /tmp/expo.log 2>&1 &
EXPO_PID=$!
echo "   Frontend PID: $EXPO_PID"
sleep 5

# 4. Afficher les informations
echo ""
echo "=================================="
echo "✅ INTELLIGENT TUTOR STARTED"
echo "=================================="
echo ""
echo "📱 Frontend (React Native Web):"
echo "   URL: http://localhost:8083"
echo ""
echo "🔌 Backend API:"
echo "   URL: http://localhost:8000/api/"
echo ""
echo "🎓 Test Accounts:"
echo "   Admin: admin@example.com / admin123"
echo "   Student: student1@example.com / student123"
echo ""
echo "📝 Logs:"
echo "   Django: tail -f /tmp/django.log"
echo "   Expo:   tail -f /tmp/expo.log"
echo ""
echo "🛑 To stop:"
echo "   kill $DJANGO_PID $EXPO_PID"
echo ""
echo "Or press Ctrl+C"
echo ""

# Garder les processus actifs
wait

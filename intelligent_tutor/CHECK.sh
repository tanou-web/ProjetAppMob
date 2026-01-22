#!/bin/bash

# VÉRIFICATION AVANT ENTRAÎNEMENT

echo "🔍 VÉRIFICATION PRÉ-ENTRAÎNEMENT"
echo "================================="
echo ""

# 1. Python
echo "1️⃣  Python:"
python --version
echo ""

# 2. Django
echo "2️⃣  Django:"
python -c "import django; print(f'Django {django.VERSION[0]}.{django.VERSION[1]}')" 2>/dev/null || echo "❌ Django non installé"
echo ""

# 3. Requirements
echo "3️⃣  Dépendances:"
if [ -f "requirements.txt" ]; then
    echo "✅ requirements.txt trouvé"
    wc -l < requirements.txt
    echo "packages"
else
    echo "❌ requirements.txt manquant"
fi
echo ""

# 4. Apps
echo "4️⃣  Dossiers essentiels:"
[ -d "apps" ] && echo "✅ apps/" || echo "❌ apps/ manquant"
[ -d "config" ] && echo "✅ config/" || echo "❌ config/ manquant"
[ -d "scraper" ] && echo "✅ scraper/" || echo "❌ scraper/ manquant"
echo ""

# 5. Guides d'entraînement
echo "5️⃣  Guides disponibles:"
[ -f "START.md" ] && echo "✅ START.md" || echo "❌ START.md manquant"
[ -f "TRAIN_NOW.md" ] && echo "✅ TRAIN_NOW.md" || echo "❌ TRAIN_NOW.md manquant"
[ -f "STEP_BY_STEP_TRAINING.md" ] && echo "✅ STEP_BY_STEP_TRAINING.md" || echo "❌ STEP_BY_STEP_TRAINING.md manquant"
[ -f "ML_TRAINING_TUTORIAL.md" ] && echo "✅ ML_TRAINING_TUTORIAL.md" || echo "❌ ML_TRAINING_TUTORIAL.md manquant"
echo ""

echo "================================="
echo "✅ PRÊT À ENTRAÎNER!"
echo ""
echo "Lancez:"
echo "  python manage.py train_ml_models --all --activate"
echo ""

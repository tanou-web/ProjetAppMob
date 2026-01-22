#!/bin/bash

# 🎓 Script Easy Training - Intelligent Tutor System
# Façon simple d'entraîner les modèles ML pour Burkina Faso

PROJECT_DIR="/home/tanou/Bur/projetWeb/intelligent_tutor"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="$PROJECT_DIR/logs"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════╗"
echo "║  🎓 INTELLIGENT TUTOR - ML TRAINING            ║"
echo "║  Burkina Faso Educational System               ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"

# Créer dossiers
mkdir -p "$LOG_DIR"

echo -e "\n${GREEN}📊 ÉTAPE 1: Vérification de l'environnement${NC}"
cd "$PROJECT_DIR"
python -c "import django; import sklearn; print('✅ Tous les packages disponibles')" || {
    echo "Installation des packages..."
    pip install scikit-learn joblib pandas numpy
}

echo -e "\n${GREEN}💾 ÉTAPE 2: Initialisation base de données${NC}"
python manage.py migrate --no-input

echo -e "\n${GREEN}🤖 ÉTAPE 3: Entraînement des modèles${NC}"
python manage.py train_ml_models --all --activate

echo -e "\n${GREEN}✅ ÉTAPE 4: Affichage des résultats${NC}"
if [ -f "training_results.json" ]; then
    cat training_results.json | python -m json.tool
fi

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Entraînement terminé!${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "📊 Voir les modèles: http://localhost:8000/admin/"
echo -e "📖 Documentation: HOW_TO_TRAIN_MODELS.md"
echo -e "📝 Logs: $LOG_DIR/\n"

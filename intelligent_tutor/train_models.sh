#!/bin/bash

# ╔════════════════════════════════════════════════════════════════╗
# ║   SCRIPT D'ENTRAÎNEMENT DES MODÈLES IA - DÉMARRAGE RAPIDE      ║
# ╚════════════════════════════════════════════════════════════════╝

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   GESTIONNAIRE DE MODÈLES ML - INTELLIGENT TUTORING SYSTEM      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "manage.py" ]; then
    echo -e "${RED}❌ Erreur: manage.py non trouvé${NC}"
    echo "   Exécutez ce script depuis la racine du projet"
    exit 1
fi

# Fonction pour afficher l'aide
show_help() {
    echo -e "${GREEN}Usage:${NC}"
    echo "  ./train_models.sh [COMMAND]"
    echo ""
    echo -e "${GREEN}Commands:${NC}"
    echo "  train              - Entraîner un modèle (défaut: gradient_boosting)"
    echo "  train-all          - Entraîner tous les modèles"
    echo "  compare            - Comparer les modèles existants"
    echo "  evaluate           - Évaluer tous les modèles"
    echo "  status             - Vérifier le statut des modèles"
    echo "  help               - Afficher cette aide"
    echo ""
    echo -e "${GREEN}Exemples:${NC}"
    echo "  ./train_models.sh train                  # Train Gradient Boosting"
    echo "  ./train_models.sh train-all              # Train tous les modèles"
    echo "  ./train_models.sh compare                # Comparer les performances"
    echo ""
}

# Fonction pour entraîner un modèle
train_model() {
    local model_type=${1:-"gradient_boosting"}
    local version=${2:-"2.0.0"}
    
    echo -e "${YELLOW}📚 Entraînement du modèle ${model_type} v${version}...${NC}"
    echo ""
    
    python manage.py train_ml_models \
        --model-type "$model_type" \
        --version "$version"
    
    echo ""
    echo -e "${GREEN}✅ Entraînement terminé!${NC}"
}

# Fonction pour entraîner tous les modèles
train_all() {
    echo -e "${YELLOW}📚 Entraînement de tous les modèles...${NC}"
    echo ""
    
    python manage.py train_ml_models --all
    
    echo ""
    echo -e "${GREEN}✅ Tous les modèles sont entraînés!${NC}"
}

# Fonction pour comparer les modèles
compare_models() {
    echo -e "${YELLOW}📊 Comparaison des modèles...${NC}"
    echo ""
    
    python manage.py train_ml_models --compare
    
    echo ""
}

# Fonction pour évaluer les modèles
evaluate_models() {
    echo -e "${YELLOW}📊 Évaluation de tous les modèles...${NC}"
    echo ""
    
    python manage.py train_ml_models --evaluate-all
    
    echo ""
}

# Fonction pour afficher le statut
show_status() {
    echo -e "${YELLOW}🔍 Statut des modèles...${NC}"
    echo ""
    
    python manage.py train_ml_models --check-retraining
    python manage.py train_ml_models --compare
    
    echo ""
}

# Traiter les arguments
case "${1:-train}" in
    train)
        train_model "gradient_boosting" "2.0.0"
        ;;
    train-gb)
        train_model "gradient_boosting" "${2:-2.0.0}"
        ;;
    train-rf)
        train_model "random_forest" "${2:-2.0.0}"
        ;;
    train-all)
        train_all
        ;;
    compare)
        compare_models
        ;;
    evaluate|eval)
        evaluate_models
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}❌ Commande inconnue: $1${NC}"
        show_help
        exit 1
        ;;
esac

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Opération complétée!${NC}"
echo ""

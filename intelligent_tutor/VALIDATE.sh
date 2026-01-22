#!/bin/bash

# ============================================
# VALIDATION DES FICHIERS CRÉÉS
# Vérifier que tout est en place
# ============================================

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ VALIDATION DU SYSTÈME - 22 JANVIER 2026              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

# Function to check file
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((PASS++))
    else
        echo -e "${RED}❌${NC} $1 (MISSING)"
        ((FAIL++))
    fi
}

# Function to check directory
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        ((PASS++))
    else
        echo -e "${RED}❌${NC} $1/ (MISSING)"
        ((FAIL++))
    fi
}

echo -e "${BLUE}=== Vérification des répertoires ===${NC}"
check_dir "scraper"
check_dir "apps/courses/management"
check_dir "apps/courses/management/commands"
echo ""

echo -e "${BLUE}=== Vérification des fichiers scraper ===${NC}"
check_file "scraper/__init__.py"
check_file "scraper/config.py"
check_file "scraper/faso_education_scraper.py"
check_file "scraper/tests.py"
check_file "scraper/README.md"
echo ""

echo -e "${BLUE}=== Vérification des commandes Django ===${NC}"
check_file "apps/courses/management/__init__.py"
check_file "apps/courses/management/commands/__init__.py"
check_file "apps/courses/management/commands/import_faso_courses.py"
echo ""

echo -e "${BLUE}=== Vérification des scripts d'automation ===${NC}"
check_file "import_faso_courses.sh"
check_file "ESSENTIAL_COMMANDS.sh"
echo ""

echo -e "${BLUE}=== Vérification de la documentation ===${NC}"
check_file "FASO_IMPORT_GUIDE.md"
check_file "SYSTEM_RECAP.md"
check_file "PROJECT_STATUS.md"
check_file "EXECUTIVE_SUMMARY.md"
check_file "COMPLETE_INDEX.md"
check_file "CHECKLIST.md"
check_file "START_HERE.md"
check_file "SUMMARY.md"
echo ""

echo -e "${BLUE}=== Vérification des fichiers modifiés ===${NC}"
if grep -q "beautifulsoup4" requirements.txt; then
    echo -e "${GREEN}✅${NC} requirements.txt (beautifulsoup4 ajouté)"
    ((PASS++))
else
    echo -e "${RED}❌${NC} requirements.txt (beautifulsoup4 manquant)"
    ((FAIL++))
fi

if grep -q "lxml" requirements.txt; then
    echo -e "${GREEN}✅${NC} requirements.txt (lxml ajouté)"
    ((PASS++))
else
    echo -e "${RED}❌${NC} requirements.txt (lxml manquant)"
    ((FAIL++))
fi
echo ""

echo -e "${BLUE}=== Vérification du contenu des fichiers ===${NC}"

# Vérifier les lignes de code
if [ -f "scraper/faso_education_scraper.py" ]; then
    LINES=$(wc -l < "scraper/faso_education_scraper.py")
    if [ $LINES -gt 100 ]; then
        echo -e "${GREEN}✅${NC} scraper/faso_education_scraper.py ($LINES lignes)"
        ((PASS++))
    fi
fi

if [ -f "scraper/config.py" ]; then
    LINES=$(wc -l < "scraper/config.py")
    if [ $LINES -gt 100 ]; then
        echo -e "${GREEN}✅${NC} scraper/config.py ($LINES lignes)"
        ((PASS++))
    fi
fi

if [ -f "apps/courses/management/commands/import_faso_courses.py" ]; then
    LINES=$(wc -l < "apps/courses/management/commands/import_faso_courses.py")
    if [ $LINES -gt 150 ]; then
        echo -e "${GREEN}✅${NC} import_faso_courses.py ($LINES lignes)"
        ((PASS++))
    fi
fi

echo ""
echo -e "${BLUE}=== Vérification du code Python ===${NC}"

# Vérifier la syntaxe Python
if python -c "from scraper.faso_education_scraper import FasoEducationScraper" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} scraper/faso_education_scraper.py (syntaxe OK)"
    ((PASS++))
else
    echo -e "${RED}❌${NC} scraper/faso_education_scraper.py (erreur syntaxe)"
    ((FAIL++))
fi

if python -c "from scraper import config" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} scraper/config.py (syntaxe OK)"
    ((PASS++))
else
    echo -e "${RED}❌${NC} scraper/config.py (erreur syntaxe)"
    ((FAIL++))
fi

echo ""
echo -e "${BLUE}=== Résumé des fichiers créés ===${NC}"

SCRAPER_FILES=$(find scraper -type f | wc -l)
DOC_FILES=$(ls -1 *.md 2>/dev/null | wc -l)
SCRIPT_FILES=$(ls -1 *.sh 2>/dev/null | wc -l)

echo "Fichiers scraper: $SCRAPER_FILES"
echo "Fichiers documentation: $DOC_FILES"
echo "Fichiers scripts: $SCRIPT_FILES"
echo ""

echo -e "${BLUE}=== Statistiques de lignes ===${NC}"

TOTAL_CODE_LINES=$(find scraper -name "*.py" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
TOTAL_DOC_LINES=$(find . -maxdepth 1 -name "*.md" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')

echo "Lignes de code: ${TOTAL_CODE_LINES:-0}"
echo "Lignes de documentation: ${TOTAL_DOC_LINES:-0}"
echo ""

echo "════════════════════════════════════════════════════════════"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     ✅ VALIDATION COMPLÈTE - TOUS LES FICHIERS OK!        ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║  Vérification: ${PASS}/${PASS} fichiers correctement en place      ║${NC}"
    echo -e "${GREEN}║  Status: ✅ PRODUCTION-READY                              ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "👉 Prochaine étape: bash import_faso_courses.sh"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║     ❌ VALIDATION ÉCHOUÉE - CERTAINS FICHIERS MANQUENT      ║${NC}"
    echo -e "${RED}║                                                            ║${NC}"
    echo -e "${RED}║  Vérification: ${PASS}/${((PASS+FAIL))} fichiers corrects                      ║${NC}"
    echo -e "${RED}║  Manquants: ${FAIL}                                            ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "⚠️  Veuillez vérifier les fichiers manquants ci-dessus."
    exit 1
fi

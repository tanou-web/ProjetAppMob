#!/bin/bash

# ============================================
# Script d'importation complète des cours
# Faso Education Integration
# ============================================

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🎓 Intelligent Tutor - Faso Education Integration      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running in Django project
if [ ! -f "manage.py" ]; then
    echo -e "${RED}❌ Error: manage.py not found!${NC}"
    echo "Please run this script from the Django project root directory"
    exit 1
fi

# Step 1: Check dependencies
echo -e "${BLUE}📦 Step 1: Checking dependencies...${NC}"
if ! python -c "import bs4" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Installing beautifulsoup4...${NC}"
    pip install beautifulsoup4 lxml requests
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi
echo ""

# Step 2: Run the scraper
echo -e "${BLUE}🌐 Step 2: Scraping fasoeducation.bf...${NC}"
if python scraper/faso_education_scraper.py; then
    echo -e "${GREEN}✅ Scraping completed successfully${NC}"
    echo ""
    
    # Count courses
    if [ -f "faso_courses.json" ]; then
        COURSE_COUNT=$(python -c "import json; d=json.load(open('faso_courses.json')); print(sum(len(c) for c in d.values()))")
        echo -e "${GREEN}📊 Found $COURSE_COUNT courses${NC}"
    fi
else
    echo -e "${RED}❌ Scraping failed!${NC}"
    exit 1
fi
echo ""

# Step 3: Ask for import confirmation
echo -e "${YELLOW}⚠️  About to import courses into database${NC}"
read -p "Continue with import? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏭️  Import cancelled${NC}"
    exit 0
fi
echo ""

# Step 4: Run migrations (if needed)
echo -e "${BLUE}🔄 Step 3: Checking database migrations...${NC}"
python manage.py makemigrations --dry-run 2>&1 | grep -q "No changes detected" || \
    python manage.py migrate

echo ""

# Step 5: Import courses
echo -e "${BLUE}📚 Step 4: Importing courses into database...${NC}"
if python manage.py import_faso_courses --file faso_courses.json; then
    echo -e "${GREEN}✅ Import completed successfully${NC}"
else
    echo -e "${RED}❌ Import failed!${NC}"
    exit 1
fi
echo ""

# Step 6: Show summary
echo -e "${BLUE}📈 Step 5: Import Summary${NC}"
python manage.py shell << EOF
from apps.courses.models import Course
from django.db.models import Count

total = Course.objects.count()
by_level = Course.objects.values('level').annotate(count=Count('id')).order_by('level')
by_subject = Course.objects.values('subject__name').annotate(count=Count('id')).order_by('-count')

print(f"\n✅ Total courses: {total}\n")
print("📚 Courses by Level:")
for item in by_level:
    level = item['level'].replace('_', ' ').title()
    print(f"  • {level}: {item['count']} courses")

print("\n📖 Courses by Subject:")
for item in by_subject:
    print(f"  • {item['subject__name']}: {item['count']} courses")
EOF

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Import Complete! Ready for API development         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Next steps:"
echo "  1. Create API serializers for Course model"
echo "  2. Create API views (CourseViewSet, CourseDetailView)"
echo "  3. Add URL routing"
echo "  4. Test endpoints with curl/Postman"
echo ""

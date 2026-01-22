# 📖 Guide d'Installation Complet - Application de Tuteur Intelligent

## Table des matières
1. [Configuration système](#configuration-système)
2. [Installation pas à pas](#installation-pas-à-pas)
3. [Configuration de la base de données](#configuration-de-la-base-de-données)
4. [Lancement de l'application](#lancement-de-lapplication)
5. [Tests et validation](#tests-et-validation)
6. [Déploiement](#déploiement)
7. [Dépannage](#dépannage)

## Configuration système

### Prérequis système
```bash
# Système d'exploitation
- Linux (Ubuntu 20.04+) ou Windows avec WSL2 ou macOS

# Logiciels requis
- Python 3.8 ou supérieur
- MySQL 8.0 ou MariaDB 10.4+
- Git
- pip (gestionnaire de paquets Python)
```

### Installation des prérequis

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3.9 python3-pip python3-venv mysql-server git
sudo mysql_secure_installation
```

**macOS (avec Homebrew):**
```bash
brew install python@3.9 mysql git
brew services start mysql
mysql_secure_installation
```

**Windows:**
- Télécharger Python depuis [python.org](https://www.python.org)
- Installer MySQL Community Server
- Installer Git depuis [git-scm.com](https://git-scm.com)

## Installation pas à pas

### Étape 1: Cloner le projet

```bash
# Naviguer vers le répertoire d'accueil
cd ~/Bur/projetWeb

# Le projet est déjà dans: intelligent_tutor/
cd intelligent_tutor
```

### Étape 2: Créer un environnement virtuel

```bash
# Créer l'environnement virtuel
python3 -m venv venv

# Activer l'environnement virtuel
# Sur Linux/macOS:
source venv/bin/activate

# Sur Windows (Command Prompt):
venv\Scripts\activate

# Sur Windows (PowerShell):
venv\Scripts\Activate.ps1

# Vérifier l'activation (le prompt devrait commencer par (venv))
```

### Étape 3: Installer les dépendances

```bash
# Mettre à jour pip
pip install --upgrade pip

# Installer les dépendances du projet
pip install -r requirements.txt

# Vérifier l'installation
pip list
```

### Étape 4: Configurer l'environnement

```bash
# Copier le fichier exemple
cp .env.example .env

# Éditer le fichier .env
# Linux/macOS:
nano .env

# Windows:
notepad .env
```

**Contenu du fichier .env à configurer:**

```ini
# Django Settings
SECRET_KEY=your-unique-secret-key-change-in-production-12345
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,localhost:3000,127.0.0.1:3000

# Database Configuration
DB_NAME=intelligent_tutor_db
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_HOST=127.0.0.1
DB_PORT=3306

# Redis (optionnel)
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# JWT
JWT_SECRET=your-jwt-secret-key-here
```

> **Important:** Générez une SECRET_KEY unique:
> ```bash
> python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
> ```

## Configuration de la base de données

### Option 1: Utiliser le script SQL fourni

```bash
# Créer la base de données et les tables
mysql -u root -p < database/schema.sql

# Vous serez invité à entrer le mot de passe MySQL
```

### Option 2: Configuration manuelle

```bash
# Accéder à MySQL
mysql -u root -p

# Dans la console MySQL:
CREATE DATABASE intelligent_tutor_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

EXIT;

# Puis lancer les migrations Django:
python manage.py migrate
```

### Vérifier la base de données

```bash
# Connexion et vérification
mysql -u root -p intelligent_tutor_db -e "SHOW TABLES;"

# Ou via Django:
python manage.py dbshell
> SHOW TABLES;
> EXIT;
```

## Lancement de l'application

### Étape 1: Créer un superutilisateur (administrateur)

```bash
python manage.py createsuperuser

# Suivre les invites:
# Entrer l'email: admin@example.com
# Entrer le mot de passe: votre_mot_de_passe
# Confirmer le mot de passe
```

### Étape 2: Appliquer les migrations Django

```bash
# Migrer les modèles vers la base de données
python manage.py migrate

# Créer les indices de base de données (optionnel mais recommandé)
python manage.py dbshell <<EOF
CREATE INDEX idx_users_email ON users_user(email);
CREATE INDEX idx_courses_status ON courses_course(status);
CREATE INDEX idx_enrollments_student ON courses_courseenrollment(student_id);
EOF
```

### Étape 3: Charger les données de test (optionnel)

```bash
# Créer des données de test
python manage.py shell

# Dans le shell Python:
from apps.courses.models import Subject
subjects = Subject.objects.all()
print(f"Subjects loaded: {subjects.count()}")
exit()
```

### Étape 4: Lancer le serveur de développement

```bash
# Démarrer le serveur
python manage.py runserver 0.0.0.0:8000

# Accès:
# - Application: http://localhost:8000
# - Admin: http://localhost:8000/admin
# - API: http://localhost:8000/api
```

**Pour lancer en arrière-plan:**
```bash
# Linux/macOS:
nohup python manage.py runserver 0.0.0.0:8000 > server.log 2>&1 &

# Windows (utiliser Task Scheduler ou:)
python manage.py runserver &
```

## Tests et validation

### Tester les endpoints API

```bash
# Installer curl si nécessaire
# Ubuntu: sudo apt install curl
# macOS: brew install curl

# 1. Obtenir un token JWT
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "votre_mot_de_passe"
  }'

# Réponse attendue (remplacer TOKEN par la vraie valeur):
# {
#   "access": "TOKEN_VALEUR",
#   "refresh": "TOKEN_REFRESH"
# }

# 2. Accéder aux sujets (sans authentification)
curl http://localhost:8000/api/courses/subjects/

# 3. Accéder au profil utilisateur (avec token)
curl -H "Authorization: Bearer ACCESS_TOKEN" \
  http://localhost:8000/api/users/profile/

# 4. Lister les cours
curl http://localhost:8000/api/courses/courses/

# 5. Vérifier la progression
curl -H "Authorization: Bearer ACCESS_TOKEN" \
  http://localhost:8000/api/progress/learning-paths/my_path/
```

### Utiliser Postman (recommandé)

1. Télécharger [Postman](https://www.postman.com/downloads/)
2. Importer la collection API:
   - Créer une nouvelle collection
   - Ajouter les endpoints de `config/urls.py`
   - Configurer l'authentification JWT

## Déploiement

### Production (Gunicorn + Nginx)

```bash
# 1. Installer Gunicorn
pip install gunicorn

# 2. Tester Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000

# 3. Configurer Nginx
# Créer /etc/nginx/sites-available/intelligent-tutor:
server {
    listen 80;
    server_name your-domain.com;

    location /static/ {
        alias /home/user/intelligent_tutor/staticfiles/;
    }

    location /media/ {
        alias /home/user/intelligent_tutor/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 4. Activer le site Nginx
sudo ln -s /etc/nginx/sites-available/intelligent-tutor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Avec Docker (optionnel)

```bash
# Créer un Dockerfile
cat > Dockerfile <<EOF
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
EOF

# Construire et lancer
docker build -t intelligent-tutor .
docker run -p 8000:8000 --env-file .env intelligent-tutor
```

## Dépannage

### Problème: Erreur de connexion MySQL

```bash
# Vérifier que MySQL est en cours d'exécution
# Linux:
sudo systemctl status mysql

# macOS:
brew services list

# Windows:
# Vérifier dans Services (services.msc)

# Vérifier les informations de connexion dans .env
# Tester la connexion:
mysql -u root -p -h 127.0.0.1
```

### Problème: ModuleNotFoundError

```bash
# Vérifier l'environnement virtuel est activé
which python
# Doit montrer le chemin dans venv/

# Réinstaller les dépendances
pip install -r requirements.txt --force-reinstall
```

### Problème: Port déjà utilisé (8000)

```bash
# Linux/macOS: Trouver et tuer le processus
lsof -i :8000
kill -9 <PID>

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Ou utiliser un autre port:
python manage.py runserver 0.0.0.0:8001
```

### Problème: Problèmes de permissions

```bash
# Définir les permissions correctes
chmod -R 755 intelligent_tutor/
chmod -R 755 database/
chmod 600 .env

# Pour les fichiers statiques
python manage.py collectstatic --noinput
sudo chown -R www-data:www-data staticfiles/
```

### Vérification complète du système

```bash
# Créer un script de vérification
cat > check_setup.sh <<EOF
#!/bin/bash
echo "=== Vérification de l'installation ==="
echo "Python: $(python --version)"
echo "MySQL: $(mysql --version)"
echo "Git: $(git --version)"
echo "Venv activé: $([ -n "$VIRTUAL_ENV" ] && echo "OUI" || echo "NON")"
echo "Packages installés: $(pip list | wc -l)"
echo "Base de données: $(mysql -u root -p$DB_PASSWORD -e 'SHOW DATABASES;' 2>/dev/null | grep intelligent)"
echo "Django: $(python -c 'import django; print(django.__version__)')"
EOF

chmod +x check_setup.sh
./check_setup.sh
```

## Support et ressources

- 📚 [Documentation Django](https://docs.djangoproject.com/)
- 📚 [Django REST Framework](https://www.django-rest-framework.org/)
- 🐞 [Issues](../issues)
- 💬 [Discussions](../discussions)

---

**Dernière mise à jour**: 21 janvier 2026

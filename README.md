# Smart Tutor Application - Assistant Pédagogique Intelligent

## Description
L'application de tuteur intelligent est une solution éducative numérique conçue pour accompagner les élèves du primaire et du secondaire dans leur apprentissage quotidien. Elle agit comme un assistant pédagogique personnalisé, disponible à tout moment, capable d'expliquer les leçons, proposer des exercices adaptés et suivre la progression de chaque apprenant.

## Fonctionnalités Principales
- **Explication des leçons** : Contenu basé sur le programme officiel burkinabè (Primaire CP1, CP2, CE1, etc.).
- **Catalogue Groupé** : Cours organisés par matière (Mathématiques, Français, etc.) pour une navigation intuitive.
- **Tuteur Vocal** : Synthèse vocale pour faciliter l'apprentissage des plus jeunes.
- **Mode Hors Ligne** : Structure prête pour le fonctionnement sans connexion.
- **Analyse d'Erreurs IA** : Système d'analyse des performances pour proposer des révisions ciblées.

## Technologies Utilisées
- **Backend** : Django (Python) / MySQL.
- **Frontend Web** : React.js.
- **Mobile** : React Native (Expo).
- **Base de données** : MySQL.


## Structure du Projet
- `/intelligent_tutor` : Dossier principal du backend Django.
- `/Frontend` : Code source de l'application mobile React Native.
- `db_dump.sql` : Script d'initialisation de la base de données.

---

## 🧑‍🏫 Guide d'utilisation pour l'enseignant

### 1. Préparer la base de données (MariaDB/MySQL)

1. **Démarrer MariaDB/MySQL**
	 - Sous Linux :
		 ```bash
		 sudo systemctl start mariadb
		 # ou
		 sudo systemctl start mysql
		 ```
	 - Sous Windows :
		 Lancer le service MySQL/MariaDB via XAMPP ou le panneau de services.

2. **Importer la base de données**
	 - Depuis le terminal :
		 ```bash
		 mysql -u root -p < db_dump.sql
		 ```
	 - Ou via phpMyAdmin :
		 - Aller sur [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
		 - Créer une base de données (ex: `intelligent_tutor_db`)
		 - Importer le fichier `db_dump.sql`

### 2. Lancer le backend Django

```bash
cd intelligent_tutor
# (Optionnel) Créer et activer un environnement virtuel :
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate    # Windows
pip install -r requirements.txt

# Appliquer les migrations (si besoin)
python manage.py migrate

# Créer un superutilisateur (admin)
python manage.py createsuperuser

# Lancer le serveur backend
python manage.py runserver 8000
```
Accès admin : [http://localhost:8000/admin](http://localhost:8000/admin)

### 3. Lancer le frontend mobile (Expo)

```bash
cd Frontend
npm install
npx expo start
```
Ouvrir l'application sur un navigateur, un émulateur ou un appareil avec Expo Go.

### 4. (Optionnel) Lancer le frontend web (si présent)

```bash
cd frontendWeb/intelligent-tutor-frontend
npm install
npm run dev
```
Accès : [http://localhost:5173](http://localhost:5173)

---

**Résumé des commandes essentielles**

| Action                              | Commande principale                        |
|-------------------------------------|--------------------------------------------|
| Démarrer MariaDB/MySQL              | sudo systemctl start mariadb/mysql         |
| Importer la base de données         | mysql -u root -p < db_dump.sql             |
| Lancer backend Django               | python manage.py runserver 8000            |
| Créer un superutilisateur Django    | python manage.py createsuperuser           |
| Lancer frontend mobile (Expo)       | npx expo start                             |
| Lancer frontend web (optionnel)     | npm run dev                                |

---

Pour toute question, consultez les README spécifiques dans chaque dossier ou contactez l'administrateur technique du projet.

# Guide d'Installation et d'Exécution - Tuteur Intelligent

## Prérequis
- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Git

## 1. Installation du Backend (Django)

1. **Accéder au dossier du projet :**
   ```bash
   cd intelligent_tutor
   ```

2. **Créer et activer l'environnement virtuel :**
   ```bash
   python3 -m venv myenv
   source myenv/bin/activate  # Linux/Mac
   # myenv\Scripts\activate  # Windows
   ```

3. **Installer les dépendances :**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configuration de la Base de Données :**
   - Assurez-vous que MySQL est lancé.
   - Configurez vos accès dans un fichier `.env` ou `config/settings.py`.
   - Si vous utilisez le script SQL fourni (`db_dump.sql`), importez-le :
     ```bash
     mysql -u username -p database_name < db_dump.sql
     ```
   - Sinon, appliquez les migrations :
     ```bash
     python manage.py migrate
     ```

5. **Lancer le serveur :**
   ```bash
   python manage.py runserver
   ```
   L'API sera accessible sur `http://127.0.0.1:8000`.

## 2. Installation du Frontend (React Native / Expo)

1. **Accéder au dossier Frontend :**
   ```bash
   cd ../Frontend
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer l'application :**
   ```bash
   npx expo start
   ```
   - Appuyez sur `w` pour ouvrir dans le navigateur web.
   - Appuyez sur `a` pour lancer sur Android (émulateur requis).
   - Scannez le QR code avec l'app Expo Go sur votre téléphone physique.

## 3. Entraînement de l'IA

Si vous souhaitez mettre à jour les modèles d'IA avec de nouvelles données :
```bash
cd intelligent_tutor
python train_models.py
```
Cela va :
1. Analyser les cours et exercices en base de données.
2. Générer des données synthétiques d'entraînement.
3. Entraîner les modèles (Correction, Recommandation).
4. Sauvegarder les nouveaux modèles dans `intelligent_tutor/ml_models/`.

## 4. Importation de Contenu

Pour scraper de nouveaux cours depuis Faso Education :
```bash
python apps/scraper/import_complete.py
```
**Note :** Ce script nécessite une connexion internet.

## 5. Script de Démarrage Rapide

Un script global est disponible à la racine pour lancer les deux services :
```bash
./START.sh
```

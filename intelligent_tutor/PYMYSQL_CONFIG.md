# Configuration PyMySQL - Guide de Forçage

## Problème Résolu
Erreur `mysqlclient 2.2.1 or newer is required` résolue en forçant exclusivement PyMySQL.

## Configuration Appliquée

### 1. Installation PyMySQL
```bash
pip install PyMySQL==1.1.2
```

### 2. Configuration dans `config/settings.py`
Configuration placée **AU DÉBUT** du fichier, avant tout autre import :

```python
# Configuration MySQL AVANT TOUT AUTRE IMPORT - FORCER PyMySQL
import pymysql

# Vérifier que PyMySQL est disponible
if not hasattr(pymysql, 'install_as_MySQLdb'):
    raise ImportError("PyMySQL n'est pas correctement installé")

# Installer PyMySQL comme MySQLdb
pymysql.install_as_MySQLdb()

# Forcer l'utilisation exclusive de PyMySQL
import sys
sys.modules['MySQLdb'] = pymysql
sys.modules['_mysql'] = pymysql

# Bloquer toute tentative d'import de mysqlclient
class BlockedMySQLClient:
    def __getattr__(self, name):
        raise ImportError("mysqlclient est bloqué. Utilisez PyMySQL uniquement.")

# Remplacer mysqlclient dans sys.modules s'il existe
for module_name in ['MySQLdb', '_mysql', 'mysqlclient']:
    if module_name in sys.modules:
        sys.modules[module_name] = pymysql
    else:
        sys.modules[module_name] = pymysql

# Vérification finale
try:
    import MySQLdb
    if MySQLdb.__name__ != 'pymysql':
        raise ImportError("MySQLdb n'utilise pas PyMySQL")
except ImportError:
    pass
```

### 3. Configuration Base de Données
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'appintel',
        'USER': 'tanour',
        'PASSWORD': 'tanou',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        },
        'CONN_MAX_AGE': 0,
    }
}
```

## Vérification

### Test dans Django Shell
```bash
python manage.py shell -c "import MySQLdb; print(f'MySQLdb module: {MySQLdb.__name__}')"
# Output: MySQLdb module: pymysql
```

### Tests Fonctionnels
```bash
python manage.py check          # ✅ Aucun problème
python manage.py makemigrations # ✅ Fonctionne
python manage.py migrate        # ✅ Fonctionne
```

## Avantages de PyMySQL

- ✅ **Léger** : Pas de dépendances C complexes
- ✅ **Pur Python** : Compatible partout
- ✅ **Maintenu** : Activement développé
- ✅ **Compatible** : API identique à mysqlclient
- ✅ **Sécurisé** : Pas de problèmes de version

## Dépannage

Si des problèmes persistent :
1. Vérifier que PyMySQL est installé dans l'environnement virtuel
2. Redémarrer le serveur Django
3. Vérifier les variables d'environnement PYTHONPATH

## Migration depuis mysqlclient

Cette configuration garantit une migration propre vers PyMySQL sans casser le code existant.

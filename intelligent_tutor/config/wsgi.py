"""
WSGI config for intelligent_tutor project.
"""

import os

# Import MySQL configuration before Django
try:
    from config.mysql_config import *
except ImportError:
    pass

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()

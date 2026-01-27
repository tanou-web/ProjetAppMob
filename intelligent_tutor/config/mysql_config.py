# MySQL configuration for Django
# This file is imported before Django to ensure PyMySQL is set up correctly

import pymysql

# Install PyMySQL as MySQLdb
pymysql.install_as_MySQLdb()

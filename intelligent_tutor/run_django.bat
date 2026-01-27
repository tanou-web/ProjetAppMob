@echo off
echo ============================================
echo ACTIVATION ENVIRONNEMENT VIRTUEL PROJET
echo ============================================
cd "C:\D.Pratique de Wb av\ProjetAppMob\intelligent_tutor"
.\venv\Scripts\Activate.ps1

echo.
echo ============================================
echo ENVIRONNEMENT VIRTUEL ACTIVE
echo Commandes disponibles :
echo - python manage.py check
echo - python manage.py makemigrations
echo - python manage.py migrate
echo - python manage.py runserver
echo ============================================
echo.

cmd /k

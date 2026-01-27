#!/usr/bin/env python
import os
import django
import sys
import pandas as pd

# Configuration Django
sys.path.append(os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.recommendations.training_pipeline import DatasetPreparer

def analyze_data():
    """Analyser les données d'entraînement actuelles"""
    print("ANALYSE DES DONNÉES D'ENTRAÎNEMENT")
    print("=" * 50)

    preparer = DatasetPreparer()

    # Charger les données
    print("Chargement des données...")
    exercises_df = preparer.load_curriculum_exercises()
    print(f"Exercices chargés: {len(exercises_df)}")

    # Générer les variations d'erreur
    print("\nGénération des variations d'erreur...")
    training_data = preparer.generate_synthetic_errors(exercises_df, num_variations=3)
    print(f"Données d'entraînement: {len(training_data)}")

    # Analyser les types d'erreur
    print("\nANALYSE DES TYPES D'ERREUR:")
    print("-" * 30)

    error_types = training_data['error_type'].value_counts()
    print("Distribution des types d'erreur:")
    for error_type, count in error_types.items():
        print(f"  {error_type}: {count}")

    print(f"\nNombre total de types d'erreur: {len(error_types)}")

    # Analyser la colonne is_correct
    correct_dist = training_data['is_correct'].value_counts()
    print(f"\nDistribution is_correct: {correct_dist.to_dict()}")

    # Afficher quelques exemples
    print("\nEXEMPLES DE DONNÉES:")
    print("-" * 20)
    for i, row in training_data.head(10).iterrows():
        print(f"Q: {row['question'][:50]}...")
        print(f"A: {row['student_answer'][:30]}...")
        print(f"Correct: {row['is_correct']}, Error: {row['error_type']}")
        print("-" * 20)

if __name__ == "__main__":
    analyze_data()

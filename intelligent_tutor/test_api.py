#!/usr/bin/env python
import requests
import json

def test_api():
    """Test the ML API endpoints"""

    base_url = "http://localhost:8000/api"

    print("TEST DE L'API ML")
    print("=" * 50)

    # Test 1: Correction API
    print("\n1. TEST API CORRECTION:")
    try:
        response = requests.post(
            f"{base_url}/recommendations/correction/",
            json={
                "student_answer": "2+2=5",
                "correct_answer": "2+2=4",
                "subject": "math"
            },
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            print("✅ API Correction fonctionne!")
            print(f"   Réponse: {json.dumps(result, indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ Erreur API: {response.status_code}")
            print(f"   Réponse: {response.text}")

    except requests.exceptions.ConnectionError:
        print("❌ Serveur non accessible (démarrer avec: python manage.py runserver)")
    except Exception as e:
        print(f"❌ Erreur: {e}")

    # Test 2: Error Analysis API (if exists)
    print("\n2. TEST API ANALYSE D'ERREUR:")
    try:
        response = requests.post(
            f"{base_url}/recommendations/exercise-analysis/",
            json={
                "student_answer": "Il va",
                "correct_answer": "Il ira",
                "subject": "french"
            },
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            print("✅ API Analyse d'erreur fonctionne!")
            print(f"   Réponse: {json.dumps(result, indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ Erreur API: {response.status_code}")
            print(f"   Réponse: {response.text}")

    except requests.exceptions.ConnectionError:
        print("❌ Serveur non accessible")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_api()

import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.recommendations.training_pipeline import TrainingOrchestrator

def run_training():
    print("Starting Model Training...")
    try:
        orchestrator = TrainingOrchestrator()
        # Train models using the data in the database (including scraped data)
        results = orchestrator.train_all_models(use_synthetic_data=True)
        print("Training completed successfully!")
        return True
    except Exception as e:
        print(f"Training failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    run_training()

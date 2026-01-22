"""
Django Management Command: Train ML Models
Trains all intelligent tutor ML models for Burkina Faso curriculum

Usage:
  python manage.py train_ml_models --all
  python manage.py train_ml_models --correction
  python manage.py train_ml_models --error-analysis
  python manage.py train_ml_models --activate
  python manage.py train_ml_models --curriculum=path/to/curriculum.json
"""

import logging
import json
from pathlib import Path
from datetime import datetime
from pyexpat import model

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.utils import timezone

from apps.recommendations.training_pipeline import (
    TrainingOrchestrator,
    DatasetPreparer,
    ExerciseCorrectionTrainer,
    ErrorAnalysisTrainer,
    ModelPersistenceManager,
)
from apps.recommendations.models_ml import MLModelVersion

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Entraîner et gérer les modèles ML de recommandation'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--model-type',
            type=str,
            default='gradient_boosting',
            choices=['gradient_boosting', 'random_forest'],
            help='Type de modèle à entraîner'
        )
        
        parser.add_argument(
            '--version',
            type=str,
            default='2.0.0',
            help='Numéro de version du modèle'
        )


class Command(BaseCommand):
    help = 'Train ML models for intelligent tutor system'

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Train all model types'
        )
        parser.add_argument(
            '--correction',
            action='store_true',
            help='Train only exercise correction model'
        )
        parser.add_argument(
            '--error-analysis',
            action='store_true',
            help='Train only error analysis model'
        )
        parser.add_argument(
            '--curriculum',
            type=str,
            help='Path to curriculum JSON file'
        )
        parser.add_argument(
            '--synthetic-only',
            action='store_true',
            help='Use only synthetic data'
        )
        parser.add_argument(
            '--activate',
            action='store_true',
            help='Set trained model as active'
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('\n' + '='*70)
        )
        self.stdout.write(
            self.style.SUCCESS('🚀 INTELLIGENT TUTOR - ML MODEL TRAINING')
        )
        self.stdout.write(
            self.style.SUCCESS('='*70 + '\n')
        )

        try:
            train_all = options.get('all', False)
            train_correction = options.get('correction', False) or train_all
            train_error = options.get('error_analysis', False) or train_all

            if not (train_all or train_correction or train_error):
                train_all = True

            orchestrator = TrainingOrchestrator()

            self.stdout.write(
                self.style.HTTP_INFO('\n📊 STEP 1: DATA PREPARATION')
            )
            self.stdout.write('-' * 70)

            preparer = DatasetPreparer(curriculum_path=options.get('curriculum'))

            self.stdout.write('Loading curriculum exercises...')
            exercises_df = preparer.load_curriculum_exercises()
            self.stdout.write(self.style.SUCCESS(f'✅ Loaded {len(exercises_df)} exercises'))

            if not options.get('synthetic_only', False):
                self.stdout.write('Generating synthetic error variations...')
                training_data = preparer.generate_synthetic_errors(exercises_df, num_variations=3)
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Generated {len(training_data)} samples')
                )
            else:
                training_data = exercises_df

            train_df, val_df, test_df = preparer.create_splits(training_data)

            self.stdout.write(
                self.style.SUCCESS(
                    f'\n✅ Data Split: Train={len(train_df)}, Val={len(val_df)}, Test={len(test_df)}'
                )
            )

            results = {
                'timestamp': datetime.now().isoformat(),
                'models_trained': []
            }

            persistence = ModelPersistenceManager()

            # Train correction model
            if train_correction:
                self.stdout.write(
                    self.style.HTTP_INFO('\n🤖 STEP 2: TRAINING CORRECTION MODEL')
                )
                self.stdout.write('-' * 70)

                trainer = ExerciseCorrectionTrainer()
                self.stdout.write('Training...')
                metrics = trainer.train(train_df, val_df)

                self.stdout.write(self.style.SUCCESS(f'✅ Accuracy: {metrics["accuracy"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'✅ Precision: {metrics["precision"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'✅ Recall: {metrics["recall"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'✅ F1-Score: {metrics["f1"]:.2%}'))

                self.stdout.write('\nSaving model version...')
                version = persistence.save_model_version(
                    model=trainer.model,
                    model_type='correction',
                    metrics=metrics,
                    feature_engineer=trainer.feature_engineer,
                    training_config={'train_samples': len(train_df), 'model': 'RandomForest'}
                )

                self.stdout.write(
                    self.style.SUCCESS(f'✅ Model saved: {version.version}')
                )

                if options.get('activate', False):
                    MLModelVersion.objects.filter(model_type='correction').exclude(
                        id=version.id
                    ).update(status='archived')
                    version.status = 'active'
                    version.save()
                    self.stdout.write(self.style.SUCCESS('✅ Set as ACTIVE'))

                results['models_trained'].append({
                    'model_type': 'correction',
                    'version_id': version.id,
                    'metrics': metrics,
                })

            # Train error analysis model
            if train_error:
                self.stdout.write(
                    self.style.HTTP_INFO('\n🔍 STEP 3: TRAINING ERROR ANALYSIS MODEL')
                )
                self.stdout.write('-' * 70)

                trainer = ErrorAnalysisTrainer()
                self.stdout.write('Training...')
                metrics = trainer.train(train_df, val_df)

                self.stdout.write(self.style.SUCCESS(f'✅ Accuracy: {metrics["accuracy"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'✅ Precision: {metrics["precision"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'✅ Recall: {metrics["recall"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'✅ F1-Score: {metrics["f1"]:.2%}'))

                self.stdout.write('\nSaving model version...')
                version = persistence.save_model_version(
                    model=trainer.model,
                    model_type='error_analysis',
                    metrics=metrics,
                    feature_engineer=trainer.feature_engineer,
                    training_config={'train_samples': len(train_df), 'model': 'GradientBoosting'}
                )

                self.stdout.write(
                    self.style.SUCCESS(f'✅ Model saved: {version.version}')
                )

                if options.get('activate', False):
                    MLModelVersion.objects.filter(model_type='error_analysis').exclude(
                        id=version.id
                    ).update(status='archived')
                    version.status = 'active'
                    version.save()
                    self.stdout.write(self.style.SUCCESS('✅ Set as ACTIVE'))

                results['models_trained'].append({
                    'model_type': 'error_analysis',
                    'version_id': version.id,
                    'metrics': metrics,
                })

            # Save results
            self.stdout.write(
                self.style.SUCCESS('\n' + '='*70)
            )
            self.stdout.write(
                self.style.SUCCESS('✅ TRAINING COMPLETED')
            )
            self.stdout.write(
                self.style.SUCCESS('='*70 + '\n')
            )

            results_path = Path(settings.BASE_DIR) / 'training_results.json'
            with open(results_path, 'w') as f:
                json.dump(results, f, indent=2, default=str)

            self.stdout.write(
                self.style.HTTP_INFO(f'Results saved: {results_path}\n')
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'\n❌ ERROR: {str(e)}')
            )
            import traceback
            traceback.print_exc()
            raise CommandError(f'Training failed: {str(e)}')
        
        self.stdout.write(f"    Échantillons: {model.training_samples}")
        self.stdout.write(f"    Features: {model.feature_count}")
        self.stdout.write(f"    Durée: {model.training_duration_seconds}s")
        
        if hasattr(model, 'evaluation') and model.evaluation:
            eval_data = model.evaluation.to_dict()
            if eval_data['cv_mean']:
                self.stdout.write(
                    f"    CV Mean: {eval_data['cv_mean']:.4f} "
                    f"± {eval_data['cv_std']:.4f}"
                )

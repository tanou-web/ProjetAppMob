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


from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

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


from apps.recommendations.training import ModelTrainer

class Command(BaseCommand):
    help = 'Train ML models for intelligent tutor system'

    def add_arguments(self, parser):
        parser.add_argument(
            '--model',
            type=str,
            choices=['correction', 'error_analysis', 'recommendation', 'all'],
            help='Specific model type to train'
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Train all model types (deprecated, use --model all)'
        )
        parser.add_argument(
            '--correction',
            action='store_true',
            help='Train only exercise correction model (deprecated, use --model correction)'
        )
        parser.add_argument(
            '--error-analysis',
            action='store_true',
            help='Train only error analysis model (deprecated, use --model error_analysis)'
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
            self.style.SUCCESS('INTELLIGENT TUTOR - ML MODEL TRAINING')
        )
        self.stdout.write(
            self.style.SUCCESS('='*70 + '\n')
        )

        try:
            model_arg = options.get('model')
            
            # Determine which models to train
            train_all = options.get('all', False) or model_arg == 'all'
            train_correction = options.get('correction', False) or model_arg == 'correction' or train_all
            train_error = options.get('error_analysis', False) or model_arg == 'error_analysis' or train_all
            train_recommendation = model_arg == 'recommendation' or train_all

            # Default to all if nothing specified
            if not (train_correction or train_error or train_recommendation):
                train_correction = True
                train_error = True
                # train_recommendation = True # Optional: decide if default includes recommendation

            orchestrator = TrainingOrchestrator()
            results = {
                'timestamp': datetime.now().isoformat(),
                'models_trained': []
            }
            persistence = ModelPersistenceManager()

            # Shared Data Preparation for Correction/Error Models
            if train_correction or train_error:
                self.stdout.write(
                    self.style.HTTP_INFO('\nSTEP 1: DATA PREPARATION (Correction/Error Models)')
                )
                self.stdout.write('-' * 70)

                preparer = DatasetPreparer(curriculum_path=options.get('curriculum'))

                self.stdout.write('Loading curriculum exercises...')
                exercises_df = preparer.load_curriculum_exercises()
                self.stdout.write(self.style.SUCCESS(f'[OK] Loaded {len(exercises_df)} exercises'))

                if not options.get('synthetic_only', False):
                    self.stdout.write('Generating synthetic error variations...')
                    training_data = preparer.generate_synthetic_errors(exercises_df, num_variations=3)
                    self.stdout.write(
                        self.style.SUCCESS(f'[OK] Generated {len(training_data)} samples')
                    )
                else:
                    training_data = exercises_df

                train_df, val_df, test_df = preparer.create_splits(training_data)

                self.stdout.write(
                    self.style.SUCCESS(
                        f'\n[OK] Data Split: Train={len(train_df)}, Val={len(val_df)}, Test={len(test_df)}'
                    )
                )

            # Train correction model
            if train_correction:
                self.stdout.write(
                    self.style.HTTP_INFO('\nSTEP 2: TRAINING CORRECTION MODEL')
                )
                self.stdout.write('-' * 70)

                trainer = ExerciseCorrectionTrainer()
                self.stdout.write('Training...')
                metrics = trainer.train(train_df, val_df)

                self.stdout.write(self.style.SUCCESS(f'[OK] Accuracy: {metrics["accuracy"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'[OK] Precision: {metrics["precision"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'[OK] Recall: {metrics["recall"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'[OK] F1-Score: {metrics["f1"]:.2%}'))

                self.stdout.write('\nSaving model version...')
                version = persistence.save_model_version(
                    model=trainer.model,
                    model_type='correction',
                    metrics=metrics,
                    feature_engineer=trainer.feature_engineer,
                    training_config={'train_samples': len(train_df), 'model': 'RandomForest'}
                )

                self.stdout.write(
                    self.style.SUCCESS(f'[OK] Model saved: {version.version}')
                )

                if options.get('activate', False):
                    MLModelVersion.objects.filter(model_type='correction').exclude(
                        id=version.id
                    ).update(status='archived')
                    version.status = 'active'
                    version.save()
                    self.stdout.write(self.style.SUCCESS('[OK] Set as ACTIVE'))

                results['models_trained'].append({
                    'model_type': 'correction',
                    'version_id': version.id,
                    'metrics': metrics,
                })

            # Train error analysis model
            if train_error:
                self.stdout.write(
                    self.style.HTTP_INFO('\nSTEP 3: TRAINING ERROR ANALYSIS MODEL')
                )
                self.stdout.write('-' * 70)

                trainer = ErrorAnalysisTrainer()
                self.stdout.write('Training...')
                metrics = trainer.train(train_df, val_df)

                self.stdout.write(self.style.SUCCESS(f'[OK] Accuracy: {metrics["accuracy"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'[OK] Precision: {metrics["precision"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'[OK] Recall: {metrics["recall"]:.2%}'))
                self.stdout.write(self.style.SUCCESS(f'[OK] F1-Score: {metrics["f1"]:.2%}'))

                self.stdout.write('\nSaving model version...')
                version = persistence.save_model_version(
                    model=trainer.model,
                    model_type='error_analysis',
                    metrics=metrics,
                    feature_engineer=trainer.feature_engineer,
                    training_config={'train_samples': len(train_df), 'model': 'GradientBoosting'}
                )

                self.stdout.write(
                    self.style.SUCCESS(f'[OK] Model saved: {version.version}')
                )

                if options.get('activate', False):
                    MLModelVersion.objects.filter(model_type='error_analysis').exclude(
                        id=version.id
                    ).update(status='archived')
                    version.status = 'active'
                    version.save()
                    self.stdout.write(self.style.SUCCESS('[OK] Set as ACTIVE'))

                results['models_trained'].append({
                    'model_type': 'error_analysis',
                    'version_id': version.id,
                    'metrics': metrics,
                })

            # Train recommendation model
            if train_recommendation:
                self.stdout.write(
                    self.style.HTTP_INFO('\nSTEP 4: TRAINING RECOMMENDATION MODEL')
                )
                self.stdout.write('-' * 70)
                
                self.stdout.write('Training Random Forest Regressor...')
                
                # Using the existing ModelTrainer class from training.py
                try:
                    model_version = ModelTrainer.train_recommendation_model(
                        model_type='random_forest',
                        version=f'rec_{datetime.now().strftime("%Y%m%d_%H%M")}'
                    )
                    
                    if model_version.status == 'failed':
                        self.stdout.write(self.style.WARNING('[WARN] Recommendation model training skipped or failed (insufficient data?)'))
                    else:
                        metrics = {
                            'rmse': model_version.rmse,
                            'mae': model_version.mae,
                            'r2': model_version.r2
                        }
                        
                        self.stdout.write(self.style.SUCCESS(f'[OK] RMSE: {metrics["rmse"]:.4f}'))
                        self.stdout.write(self.style.SUCCESS(f'[OK] MAE: {metrics["mae"]:.4f}'))
                        self.stdout.write(self.style.SUCCESS(f'[OK] R2: {metrics["r2"]:.4f}'))
                        
                        if options.get('activate', False):
                            MLModelVersion.objects.filter(model_type='recommendation').exclude(
                                id=model_version.id
                            ).update(status='archived')
                            model_version.status = 'active'
                            model_version.save()
                            self.stdout.write(self.style.SUCCESS('[OK] Set as ACTIVE'))

                        results['models_trained'].append({
                            'model_type': 'recommendation',
                            'version_id': model_version.id,
                            'metrics': metrics,
                        })

                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Failed to train recommendation model: {e}'))


            # Save results
            self.stdout.write(
                self.style.SUCCESS('\n' + '='*70)
            )
            self.stdout.write(
                self.style.SUCCESS('[OK] TRAINING COMPLETED')
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
                self.style.ERROR(f'\nERROR: {str(e)}')
            )
            import traceback
            traceback.print_exc()
            raise CommandError(f'Training failed: {str(e)}')
        


"""
Commande Django pour entraîner les modèles ML

Usage:
  python manage.py train_ml_models [--model-type gradient_boosting] [--version 2.0.0]
  python manage.py train_ml_models --all
  python manage.py train_ml_models --evaluate-all
  python manage.py train_ml_models --compare
"""

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from apps.recommendations.training import ModelTrainer, ModelEnhancer, DataPreparation
from apps.recommendations.predict import ModelComparison
from apps.recommendations.models_ml import MLModelVersion
import logging

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
        
        parser.add_argument(
            '--all',
            action='store_true',
            help='Entraîner tous les types de modèles'
        )
        
        parser.add_argument(
            '--evaluate-all',
            action='store_true',
            help='Évaluer les performances de tous les modèles'
        )
        
        parser.add_argument(
            '--compare',
            action='store_true',
            help='Comparer les modèles existants'
        )
        
        parser.add_argument(
            '--analyze',
            type=int,
            help='Analyser un modèle spécifique (par ID)'
        )
        
        parser.add_argument(
            '--check-retraining',
            action='store_true',
            help='Vérifier si le retraining est nécessaire'
        )
    
    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('╔════════════════════════════════════════════════╗')
        )
        self.stdout.write(
            self.style.SUCCESS('║     GESTIONNAIRE DE MODÈLES ML                  ║')
        )
        self.stdout.write(
            self.style.SUCCESS('╚════════════════════════════════════════════════╝')
        )
        
        try:
            if options['all']:
                self._train_all_models()
            elif options['evaluate_all']:
                self._evaluate_all_models()
            elif options['compare']:
                self._compare_models()
            elif options['analyze']:
                self._analyze_model(options['analyze'])
            elif options['check_retraining']:
                self._check_retraining()
            else:
                self._train_single_model(
                    options['model_type'],
                    options['version']
                )
        except Exception as e:
            raise CommandError(f"Erreur: {e}")
    
    def _train_single_model(self, model_type, version):
        """Entraîner un modèle unique"""
        self.stdout.write(
            f"\n📚 Entraînement du modèle {model_type} v{version}..."
        )
        
        # Vérifier les données
        df = DataPreparation.get_training_data()
        if df is None:
            raise CommandError("Données insuffisantes pour l'entraînement")
        
        self.stdout.write(f"  ✓ {len(df)} échantillons d'entraînement trouvés")
        
        # Entraîner
        model = ModelTrainer.train_recommendation_model(
            model_type=model_type,
            version=version
        )
        
        if model.status == 'active':
            self.stdout.write(
                self.style.SUCCESS(f"\n✅ Modèle entraîné avec succès!")
            )
            self._print_metrics(model)
        else:
            raise CommandError(f"L'entraînement a échoué: {model.status}")
    
    def _train_all_models(self):
        """Entraîner tous les modèles"""
        self.stdout.write("\n📚 Entraînement de tous les modèles...")
        
        models = ModelTrainer.train_all_models()
        
        self.stdout.write(
            self.style.SUCCESS(f"\n✅ {len(models)} modèles entraînés!")
        )
        
        for model in models:
            self._print_metrics(model)
    
    def _evaluate_all_models(self):
        """Évaluer tous les modèles"""
        self.stdout.write("\n📊 Évaluation de tous les modèles...")
        
        models = MLModelVersion.objects.filter(
            model_type='recommendation'
        ).order_by('-trained_at')
        
        if not models.exists():
            raise CommandError("Aucun modèle trouvé")
        
        for model in models:
            self.stdout.write(f"\n📈 {model.version} ({model.status}):")
            if hasattr(model, 'evaluation'):
                eval_data = model.evaluation.to_dict()
                self.stdout.write(f"  CV Mean: {eval_data['cv_mean']:.4f}")
                self.stdout.write(f"  CV Std: {eval_data['cv_std']:.4f}")
    
    def _compare_models(self):
        """Comparer les modèles"""
        self.stdout.write("\n📊 Comparaison des modèles...")
        
        comparison = ModelComparison.compare_models()
        
        if not comparison:
            raise CommandError("Aucun modèle à comparer")
        
        self.stdout.write(
            f"\n{'Version':<20} {'Status':<12} {'R²':<10} {'RMSE':<10}"
        )
        self.stdout.write("-" * 52)
        
        for model_data in comparison:
            r2 = f"{model_data['r2']:.4f}" if model_data['r2'] else "N/A"
            rmse = f"{model_data['rmse']:.4f}" if model_data['rmse'] else "N/A"
            
            self.stdout.write(
                f"{model_data['version']:<20} "
                f"{model_data['status']:<12} "
                f"{r2:<10} "
                f"{rmse:<10}"
            )
        
        best = ModelComparison.select_best_model()
        if best:
            self.stdout.write(
                self.style.SUCCESS(f"\n🏆 Meilleur modèle: {best.version}")
            )
    
    def _analyze_model(self, model_id):
        """Analyser un modèle spécifique"""
        try:
            model = MLModelVersion.objects.get(id=model_id)
        except MLModelVersion.DoesNotExist:
            raise CommandError(f"Modèle {model_id} non trouvé")
        
        self.stdout.write(f"\n📋 Analyse du modèle {model.version}:")
        self._print_metrics(model)
        
        # Domaines d'amélioration
        improvements = ModelEnhancer.identify_improvement_areas(model)
        if improvements:
            self.stdout.write("\n🔧 Domaines d'amélioration:")
            for improvement in improvements:
                self.stdout.write(f"  • {improvement}")
        
        # Suggestions
        suggestions = ModelEnhancer.suggest_next_version(model)
        self.stdout.write("\n💡 Suggestions pour la prochaine version:")
        for category, items in suggestions.items():
            self.stdout.write(f"  {category}:")
            for key, suggestion in items.items():
                self.stdout.write(f"    • {suggestion}")
    
    def _check_retraining(self):
        """Vérifier si le retraining est nécessaire"""
        from apps.recommendations.predict import ModelComparison
        
        self.stdout.write("\n🔄 Vérification du retraining...")
        
        needed, reason = ModelComparison.recommend_retraining()
        
        if needed:
            self.stdout.write(
                self.style.WARNING(f"⚠️  Retraining recommandé: {reason}")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f"✓ {reason}")
            )
    
    def _print_metrics(self, model):
        """Afficher les métriques d'un modèle"""
        self.stdout.write(f"\n  Modèle: {model.version}")
        self.stdout.write(f"  Status: {model.status}")
        
        if model.trained_at:
            self.stdout.write(f"  Entraîné: {model.trained_at.strftime('%Y-%m-%d %H:%M:%S')}")
        
        self.stdout.write(f"\n  📊 Métriques:")
        
        if model.r2 is not None:
            self.stdout.write(f"    R²: {model.r2:.4f}")
        if model.rmse is not None:
            self.stdout.write(f"    RMSE: {model.rmse:.4f}")
        if model.mae is not None:
            self.stdout.write(f"    MAE: {model.mae:.4f}")
        
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

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Course, Lesson

def fix_content():
    # Fix Lycée Terminale Content
    tles_courses = Course.objects.filter(level='lycee_tles')
    
    for course in tles_courses:
        print(f"Cleaning content for course: {course.title}")
        # Delete existing incorrect lessons (CP1 stuff)
        course.lessons.all().delete()
        
        # Add correct lessons based on subject
        if 'Math' in course.title:
            lessons = [
                ("Limites et Continuité", "Étude des limites de fonctions et continuité."),
                ("Dérivation et études de fonctions", "Calculs de dérivées et variations."),
                ("Nombres complexes", "Introduction aux nombres complexes."),
                ("Fonctions logarithmes et exponentielles", "Étude des fonctions ln et exp."),
                ("Intégration", "Calcul intégral et primitives."),
                ("Probabilités", "Lois de probabilité et statistiques."),
            ]
        elif 'Français' in course.title:
            lessons = [
                ("Le Roman et le récit", "Analyse du roman et de ses formes."),
                ("La Poésie", "Étude des textes poétiques du XIXe au XXIe siècle."),
                ("Le Théâtre", "Le texte théâtral et sa représentation."),
                ("La Littérature d'idées", "Presse, débat et argumentation."),
                ("Méthodologie du commentaire", "Techniques du commentaire de texte."),
                ("Méthodologie de la dissertation", "Techniques de la dissertation littéraire."),
            ]
        else:
            lessons = [
                (f"Chapitre 1: Introduction au cours de {course.title}", "Introduction générale."),
                (f"Chapitre 2: Concepts fondamentaux", "Concepts clés à maîtriser."),
                (f"Chapitre 3: Approfondissement", "Analyse détaillée des notions."),
            ]
            
        for i, (title, desc) in enumerate(lessons):
            Lesson.objects.create(
                course=course,
                title=title,
                description=desc,
                content=f"<h1>{title}</h1><p>{desc}</p><p>Contenu du cours pour la classe de Terminale.</p>",
                order=i+1,
                duration_minutes=60
            )
            print(f"  + Added lesson: {title}")

    # Fix Lycée 2nde/1ere Content (Generic for now to ensure they are not empty/wrong)
    other_lycee = Course.objects.filter(level__in=['lycee_2nde', 'lycee_1ere'])
    for course in other_lycee:
        print(f"Cleaning content for course: {course.title}")
        course.lessons.all().delete()
        
        SubjectName = "Mathématiques" if "Math" in course.title else "Français"
        LevelName = "Seconde" if "2nde" in course.level else "Première"
        
        lessons = [
            (f"Chapitre 1: Programme de {LevelName}", f"Introduction au programme de {SubjectName}."),
            (f"Chapitre 2: Notions avancées", "Développement des compétences."),
            (f"Chapitre 3: Exercices pratiques", "Mise en application des connaissances."),
        ]
        
        for i, (title, desc) in enumerate(lessons):
            Lesson.objects.create(
                course=course,
                title=title,
                description=desc,
                content=f"<h1>{title}</h1><p>{desc}</p>",
                order=i+1,
                duration_minutes=55
            )
            print(f"  + Added generic lesson: {title}")

if __name__ == '__main__':
    fix_content()

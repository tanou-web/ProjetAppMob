import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gestionCours from '../services/courses';

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // 'available' ou 'enrolled'

  useEffect(() => {
    recupTout();
  }, []);

  const recupTout = async () => {
    setLoading(true);
    const [resTous, resMesInscriptions] = await Promise.all([
      gestionCours.getToutLesCours(),
      gestionCours.getCoursInscrits(),
    ]);

    if (resTous.success) {
      setCourses(resTous.data);
    }
    if (resMesInscriptions.success) {
      setMyCourses(resMesInscriptions.data);
    }
    setLoading(false);
  };

  const lancerInscription = async (cId) => {
    const response = await gestionCours.inscriptionCours(cId);
    if (response.success) {
      alert('Inscription réussie !');
      recupTout();
    } else {
      alert('Échec inscription');
    }
  };

  const isEnrolled = (courseId) => {
    return myCourses.some(c => c.id === courseId);
  };

  const renderCourseCard = (course, enrolled = false) => (
    <div key={course.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="h-44 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-8 relative">
        <span className="text-7xl drop-shadow-lg">📚</span>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
          {course.subject?.name || 'Général'}
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-black text-slate-800 mb-3 leading-tight">{course.title}</h3>
        <p className="text-slate-500 mb-6 line-clamp-3 text-[15px] leading-relaxed flex-1">{course.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Leçons</span>
            <span className="text-lg font-black text-slate-700">{course.lessons_count || 0}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Durée</span>
            <span className="text-lg font-black text-slate-700">{course.duration || 'N/A'}</span>
          </div>
        </div>

        {enrolled ? (
          <button
            onClick={() => navigate(`/courses/${course.id}`)}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <span>Continuer l'apprentissage</span>
            <span>→</span>
          </button>
        ) : (
          <button
            onClick={() => lancerInscription(course.id)}
            disabled={isEnrolled(course.id)}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${isEnrolled(course.id)
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
              }`}
          >
            {isEnrolled(course.id) ? 'Déjà inscrit' : 'Découvrir ce cours'}
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-6 drop-shadow-sm">Centre d'Apprentissage</h1>

          {/* Tabs UI Moderne */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'enrolled'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              🚀 Mes cours inscrits ({myCourses.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'available'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              📚 Bibliothèque ({courses.length})
            </button>
          </div>
        </div>

        {/* Liste des cours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'enrolled' ? (
            myCourses.length > 0 ? (
              myCourses.map(course => renderCourseCard(course, true))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">Vous n'êtes inscrit à aucun cours pour le moment.</p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Explorer les cours disponibles →
                </button>
              </div>
            )
          ) : (
            courses.length > 0 ? (
              courses.map(course => renderCourseCard(course, false))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">Aucun cours disponible pour le moment.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;
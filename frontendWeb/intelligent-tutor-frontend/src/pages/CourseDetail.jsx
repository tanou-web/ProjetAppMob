import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gestionCours from '../services/courses';

function CourseDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  // États pour les leçons et la barre de progression
  const [listeFiches, setListeFiches] = useState([]);
  const [etatAvancement, setEtatAvancement] = useState(null);
  const [enChargement, setEnChargement] = useState(true);

  useEffect(() => {
    recupData();
  }, [id]);

  // Récupération globale : leçons + progression de l'élève
  const recupData = async () => {
    setEnChargement(true);
    try {
      const [resLecons, resProg] = await Promise.all([
        gestionCours.getListeLecons(id),
        gestionCours.getProgression(id),
      ]);

      if (resLecons.success) setListeFiches(resLecons.data);
      if (resProg.success) setEtatAvancement(resProg.data);
    } catch (e) {
      console.error("Problème API cours detail:", e);
    } finally {
      setEnChargement(false);
    }
  };

  // Action pour lancer une leçon
  const allerLecon = async (lId) => {
    // On notifie le serveur du début
    await gestionCours.startLaLecon(lId);
    nav(`/lessons/${lId}`);
  };

  if (enChargement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header du Cours */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8 border border-slate-100 overflow-hidden relative">
          <button
            onClick={() => nav('/courses')}
            className="text-blue-600 hover:text-blue-700 mb-6 font-bold flex items-center gap-2"
          >
            <span>←</span> Bibliothèque
          </button>

          <h1 className="text-3xl font-black text-slate-900 mb-6">
            {etatAvancement?.course_title || 'Détails du Cours'}
          </h1>

          {/* Widget Progression */}
          {etatAvancement && (
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex justify-between items-center mb-3">
                <span className="font-black text-blue-900 uppercase text-xs tracking-wider">Ton avancement</span>
                <span className="font-black text-blue-600 text-lg">{etatAvancement.completion_percentage || 0}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${etatAvancement.completion_percentage || 0}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Grille des leçons */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 mb-6 px-2 flex items-center gap-2">
            <span>📖</span> Sommaire du cours
          </h2>

          {listeFiches.length > 0 ? (
            listeFiches.map((item, i) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-slate-50 group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tighter">
                        Chapitre {i + 1}
                      </span>
                      {item.is_completed && (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-xs font-black uppercase">Terminé ✓</span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>

                    <div className="flex items-center gap-6 mt-4 text-xs font-bold text-slate-400 uppercase">
                      <span className="flex items-center gap-1">📝 {item.exercises_count || 0} Exos</span>
                      <span className="flex items-center gap-1">❓ {item.quizzes_count || 0} Quiz</span>
                      <span className="flex items-center gap-1">⏱️ {item.duration || 'N/A'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => allerLecon(item.id)}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition-all font-bold whitespace-nowrap shadow-lg shadow-slate-100 flex items-center justify-center gap-2"
                  >
                    <span>{item.is_started ? 'Continuer' : 'Découvrir'}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">Le contenu arrive bientôt pour ce cours !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import exercisesService from '../services/exercises';
import gestionCours from '../services/courses';
import { aiManager } from '../services/ai'; // changement vers manager

function LessonDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  // États de la page
  const [infosLecon, setInfosLecon] = useState(null);
  const [listeExos, setListeExos] = useState([]);
  const [listeQuiz, setListeQuiz] = useState([]);
  const [indexExoActuel, setIndexExoActuel] = useState(0);
  const [maReponse, setMaReponse] = useState('');
  const [retourCorrection, setRetourCorrection] = useState(null);
  const [enChargement, setEnChargement] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  // Gestion Audio
  const [lectureEnCours, setLectureEnCours] = useState(false);
  const [pisteAudio, setPisteAudio] = useState(null);

  useEffect(() => {
    recupDonnees();
  }, [id]);

  // Chargement initial des données de la leçon
  const recupDonnees = async () => {
    setEnChargement(true);
    try {
      const [resLecon, resExos, resQuiz] = await Promise.all([
        gestionCours.getDetailsLecon(id),
        exercisesService.getExercises(id),
        exercisesService.getQuizzes(id),
      ]);

      if (resLecon.success) setInfosLecon(resLecon.data);
      if (resExos.success) setListeExos(resExos.data);
      if (resQuiz.success) setListeQuiz(resQuiz.data);
    } catch (err) {
      console.error("Bug chargement:", err);
    } finally {
      setEnChargement(false);
    }
  };

  // Basculer la lecture audio (TTS)
  const basculerAudio = async () => {
    if (lectureEnCours && pisteAudio) {
      pisteAudio.pause();
      setLectureEnCours(false);
      setPisteAudio(null);
      return;
    }

    if (!infosLecon?.content) return;

    try {
      setLectureEnCours(true);
      // Nettoyage rapide du HTML pour la lecture
      const textePur = `${infosLecon.title}. ${infosLecon.description}. ${infosLecon.content.replace(/<[^>]*>/g, '')}`;
      const dataAudio = await aiManager.getAudioLecon(textePur);

      if (dataAudio.audio_url) {
        const urlComplet = dataAudio.audio_url.startsWith('http') ? dataAudio.audio_url : `http://localhost:8000${dataAudio_url}`;
        const baliseAudio = new Audio(urlComplet);
        baliseAudio.play();
        setPisteAudio(baliseAudio);
        baliseAudio.onended = () => {
          setLectureEnCours(false);
          setPisteAudio(null);
        };
      }
    } catch (e) {
      console.error('Erreur Voix:', e);
      setLectureEnCours(false);
    }
  };

  const soumettreExercice = async () => {
    if (!maReponse.trim()) {
      alert('Tu dois écrire quelque chose !');
      return;
    }

    setEnvoiEnCours(true);
    const exo = listeExos[indexExoActuel];
    const reponseServ = await exercisesService.submitAnswer(exo.id, maReponse);

    if (reponseServ.success) {
      setRetourCorrection(reponseServ.data);
    } else {
      alert('Problème lors de la validation');
    }
    setEnvoiEnCours(false);
  };

  const passageSuivant = () => {
    if (indexExoActuel < listeExos.length - 1) {
      setIndexExoActuel(indexExoActuel + 1);
      setMaReponse('');
      setRetourCorrection(null);
    } else {
      alert('Bravo ! Tu as fini cette série.');
    }
  };

  const goQuiz = async (qId) => {
    const res = await exercisesService.startQuiz(qId);
    if (res.success) {
      nav(`/quiz/${res.data.id}`);
    }
  };

  if (enChargement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const exoCourant = listeExos[indexExoActuel];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => nav(-1)}
          className="text-blue-600 hover:text-blue-700 mb-6 font-semibold flex items-center gap-2"
        >
          <span>←</span> Retour
        </button>

        {/* Détail de la leçon */}
        {infosLecon && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{infosLecon.title}</h1>
                <p className="text-lg text-slate-500 leading-relaxed">{infosLecon.description}</p>
              </div>
              <button
                onClick={basculerAudio}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-all transform active:scale-95 ${lectureEnCours ? 'bg-red-500 text-white shadow-red-200' : 'bg-blue-600 text-white shadow-blue-200'
                  }`}
              >
                {lectureEnCours ? '🛑' : '🔊'}
              </button>
            </div>

            <div
              className="prose prose-slate max-w-none text-slate-700 leading-loose text-lg"
              dangerouslySetInnerHTML={{ __html: infosLecon.content }}
            />
          </div>
        )}

        {/* Partie Exercices pratiques */}
        {listeExos.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📝 Entraînement</h2>
              <span className="text-gray-600 font-medium">Exo {indexExoActuel + 1} / {listeExos.length}</span>
            </div>

            {exoCourant && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{exoCourant.question}</h3>

                {exoCourant.image_url && (
                  <img
                    src={exoCourant.image_url}
                    alt="Image exercice"
                    className="w-full max-h-64 object-contain mb-4 rounded"
                  />
                )}

                <textarea
                  value={maReponse}
                  onChange={(e) => setMaReponse(e.target.value)}
                  placeholder="Écris ta réponse ici..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={retourCorrection !== null}
                />

                {retourCorrection ? (
                  <div className={`p-4 rounded-lg mb-4 ${retourCorrection.is_correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`font-bold ${retourCorrection.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                      {retourCorrection.is_correct ? 'Bien joué !' : 'Essaie encore'}
                    </p>
                    {retourCorrection.feedback && <p className="mt-2 text-slate-600">{retourCorrection.feedback}</p>}
                  </div>
                ) : null}

                <div className="flex gap-4">
                  {!retourCorrection ? (
                    <button
                      onClick={soumettreExercice}
                      disabled={envoiEnCours}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold"
                    >
                      {envoiEnCours ? 'Envoi...' : 'Valider'}
                    </button>
                  ) : (
                    <button
                      onClick={passageSuivant}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold"
                    >
                      {indexExoActuel < listeExos.length - 1 ? 'Suivant →' : 'Fin de session'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bloc Quiz final */}
        {listeQuiz.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">❓ Quiz final</h2>
            <div className="space-y-4">
              {listeQuiz.map((q) => (
                <div key={q.id} className="border border-gray-200 rounded-2xl p-4 flex justify-between items-center bg-slate-50">
                  <div>
                    <h3 className="font-bold text-slate-800">{q.title}</h3>
                    <p className="text-xs text-slate-500 uppercase font-black">{q.questions_count || 0} questions</p>
                  </div>
                  <button
                    onClick={() => goQuiz(q.id)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition font-bold"
                  >
                    Démarrer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonDetail;
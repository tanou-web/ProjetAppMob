import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import exercisesService from '../services/exercises';
import { aiManager } from '../services/ai'; // On utilise le manager humanisé

function Quiz() {
  const { attemptId } = useParams();
  const nav = useNavigate();
  const refInputFile = useRef(null);

  // États locaux du quiz
  const [listeQuestions, setListeQuestions] = useState([]);
  const [reponsesSaisies, setReponsesSaisies] = useState({});
  const [indexQ, setIndexQ] = useState(0);
  const [resultatFinal, setResultatFinal] = useState(null);
  const [chargementDonnees, setChargementDonnees] = useState(true);
  const [scanEnCours, setScanEnCours] = useState(false);

  useEffect(() => {
    // Initialisation du quiz (mock pour l'instant)
    setListeQuestions([
      { id: 1, question: 'Question 1 du quiz ?', type: 'text' },
      { id: 2, question: 'Question 2 du quiz ?', type: 'text' },
    ]);
    setChargementDonnees(false);
  }, [attemptId]);

  // Enregistre la valeur saisie pour une question
  const majReponse = (qId, val) => {
    setReponsesSaisies({
      ...reponsesSaisies,
      [qId]: val,
    });
  };

  // Fonction pour scanner une photo de cahier (OCR)
  const prendrePhoto = async (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setScanEnCours(true);
    try {
      const lect = new FileReader();
      lect.onloadend = async () => {
        const retourIA = await aiManager.scanManuscrit(lect.result, "Quiz OCR");
        if (retourIA.extracted_text) {
          const qCourante = listeQuestions[indexQ];
          majReponse(qCourante.id, retourIA.extracted_text);
        } else {
          alert("Désolé, la photo n'est pas assez nette...");
        }
        setScanEnCours(false);
      };
      lect.readAsDataURL(f);
    } catch (err) {
      console.error("Erreur OCR:", err);
      setScanEnCours(false);
    }
  };

  const envoyerQuiz = async () => {
    if (!window.confirm('Valider tes réponses ?')) return;

    const finalRes = await exercisesService.submitQuiz(attemptId, reponsesSaisies);
    if (finalRes.success) {
      setResultatFinal(finalRes.data);
    } else {
      alert('Erreur au moment d\'envoyer le quiz');
    }
  };

  if (chargementDonnees) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Écran de fin de quiz
  if (resultatFinal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-center text-white">
            <div className="text-7xl mb-6 animate-bounce">
              {resultatFinal.score >= 70 ? '🎉' : '📚'}
            </div>
            <h2 className="text-4xl font-black mb-2">Quiz Terminé !</h2>
            <p className="text-blue-100 font-medium">Tes résultats sont prêts</p>
          </div>
          <div className="p-8 text-center">
            <div className="text-6xl font-black text-slate-900 mb-6 drop-shadow-sm">
              {resultatFinal.score}%
            </div>
            <p className="text-lg text-slate-600 mb-8 max-w-sm mx-auto leading-relaxed">
              {resultatFinal.score >= 70
                ? 'Félicitations ! Tu as brillamment réussi ce quiz. Continue comme ça !'
                : 'C\'est un bon début ! Continue à réviser la leçon pour t\'améliorer encore.'}
            </p>
            <button
              onClick={() => nav(-1)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
            >
              Retour à la leçon
            </button>
          </div>
        </div>
      </div>
    );
  }

  const qPresente = listeQuestions[indexQ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900">Quiz Interactif</h2>
            <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-500 font-bold text-sm">
              Question {indexQ + 1} / {listeQuestions.length}
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2">
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${((indexQ + 1) / (listeQuestions.length || 1)) * 100}%` }}
            ></div>
          </div>

          <div className="p-8">
            <div className="mb-10">
              <div className="flex justify-between items-start mb-6 gap-4">
                <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                  {qPresente?.question}
                </h3>
                <button
                  type="button"
                  onClick={() => refInputFile.current?.click()}
                  disabled={scanEnCours}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm disabled:bg-slate-300"
                >
                  <span>{scanEnCours ? '⏳' : '📸'}</span>
                  <span className="hidden sm:inline">Scanner</span>
                </button>
              </div>

              <input
                type="file"
                ref={refInputFile}
                onChange={prendrePhoto}
                className="hidden"
                accept="image/*"
              />

              <textarea
                value={reponsesSaisies[qPresente?.id] || ''}
                onChange={(e) => majReponse(qPresente.id, e.target.value)}
                placeholder="Rédige ici ou scanne ton travail..."
                rows={6}
                className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-2xl p-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-lg text-slate-700"
              />
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setIndexQ(Math.max(0, indexQ - 1))}
                disabled={indexQ === 0}
                className="flex-1 px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0"
              >
                ← Précédent
              </button>

              {indexQ < listeQuestions.length - 1 ? (
                <button
                  onClick={() => setIndexQ(indexQ + 1)}
                  className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  Suivant →
                </button>
              ) : (
                <button
                  onClick={envoyerQuiz}
                  className="flex-1 px-6 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all"
                >
                  Terminer le quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
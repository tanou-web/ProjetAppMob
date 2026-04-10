import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';

function Dashboard() {
  const router = useNavigate();
  const [infosUser, setInfosUser] = useState(null);

  useEffect(() => {
    // On récupère les données de session stockées localement
    const data = authService.getCurrentUser();
    setInfosUser(data);
  }, []);

  // Déconnexion de la plateforme
  const actionQuitter = () => {
    authService.logout();
    router('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barre de menu Dashboard */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Tuteur Intelligent</h1>
          <button
            onClick={actionQuitter}
            className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition font-bold"
          >
            Quitter
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
          <h2 className="text-3xl font-black text-slate-900 mb-6 drop-shadow-sm">
            Ravi de te revoir, {infosUser?.first_name} ! 👋
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Infos Profil */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-black text-blue-900 mb-4 uppercase tracking-wider">
                Ma Fiche
              </h3>
              <div className="space-y-2 text-blue-800 font-medium">
                <p><strong>Email :</strong> {infosUser?.email}</p>
                <p><strong>Rôle :</strong> {infosUser?.role}</p>
                <p><strong>Niveau :</strong> {infosUser?.level}</p>
              </div>
            </div>

            {/* Accès Rapide Cours */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-black text-green-900 mb-4 uppercase tracking-wider">
                Mes Études
              </h3>
              <p className="text-green-800 opacity-70 mb-6">
                Retrouve ici tes cours et tes chapitres en cours.
              </p>
              <button
                onClick={() => router('/courses')}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100"
              >
                Ouvrir les cours
              </button>
            </div>

            {/* Section Stats */}
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-black text-purple-900 mb-4 uppercase tracking-wider">
                Progression
              </h3>
              <p className="text-purple-800 opacity-70 mb-6">
                Suis tes points et tes badges d'apprentissage.
              </p>
              <button
                onClick={() => router('/progress')}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-100"
              >
                Ma progression
              </button>
            </div>

            {/* Banner IA Chat */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white md:col-span-3 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-20 blur-[100px] transition-all group-hover:bg-orange-600"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-white mb-3">
                    🚀 Coaching IA Interactif
                  </h3>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                    Bloqué sur un exercice ? Prends une photo de ton cahier ou pose ta question directement à ton tuteur personnel.
                  </p>
                </div>
                <button
                  onClick={() => router('/chat')}
                  className="bg-white text-slate-900 font-black px-10 py-5 rounded-2xl shadow-xl hover:bg-slate-100 transform hover:scale-105 transition-all text-lg"
                >
                  Ouvrir le Chat AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
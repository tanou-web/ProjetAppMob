import { useEffect, useState } from 'react';
import progressService from '../services/progress';

function Progress() {
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    const [statsResult, achievementsResult, insightsResult] = await Promise.all([
      progressService.getStatistics(),
      progressService.getAchievements(),
      progressService.getInsights(),
    ]);

    if (statsResult.success) {
      setStats(statsResult.data);
    }
    if (achievementsResult.success) {
      setAchievements(achievementsResult.data);
    }
    if (insightsResult.success) {
      setInsights(insightsResult.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-black text-slate-900 drop-shadow-sm">📈 Ma Progresion</h1>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-lg shadow-blue-100 uppercase tracking-widest">Actif</div>
        </div>

        {/* Statistiques globales */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: '⭐', label: 'Points totaux', value: stats.total_points || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: '✅', label: 'Taux de réussite', value: `${stats.success_rate || 0}%`, color: 'text-green-600', bg: 'bg-green-50' },
              { icon: '🔥', label: 'Sérié actuelle', value: stats.streak || 0, color: 'text-orange-600', bg: 'bg-orange-50' },
              { icon: '⏱️', label: 'Temps d\'étude', value: `${stats.hours_studied || 0}h`, color: 'text-purple-600', bg: 'bg-purple-50' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm`}>
                  {stat.icon}
                </div>
                <div className={`text-4xl font-black ${stat.color} mb-1 drop-shadow-sm`}>
                  {stat.value}
                </div>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Insights IA */}
          {insights && (
            <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-20 blur-[100px] transition-all group-hover:bg-purple-600"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/10">🤖</div>
                  <h2 className="text-3xl font-black">Analyse Personnalisée par l'IA</h2>
                </div>

                <div className="space-y-10">
                  {insights.strengths && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors">
                      <h3 className="text-blue-400 font-black text-sm uppercase tracking-widest mb-3">💪 Vos Points Forts</h3>
                      <p className="text-lg leading-relaxed text-slate-200">{insights.strengths}</p>
                    </div>
                  )}
                  {insights.weaknesses && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors">
                      <h3 className="text-orange-400 font-black text-sm uppercase tracking-widest mb-3">📚 À Retravailler</h3>
                      <p className="text-lg leading-relaxed text-slate-200">{insights.weaknesses}</p>
                    </div>
                  )}
                  {insights.recommendations && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-xl">
                      <h3 className="text-white font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span>💡</span> Conseil Stratégique
                      </h3>
                      <p className="text-xl font-bold text-white leading-relaxed">{insights.recommendations}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Achievements */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 h-fit">
            <h2 className="text-2xl font-black text-slate-900 mb-8 px-2 flex items-center gap-3">
              <span className="text-3xl">🏆</span> Badges & Défis
            </h2>
            <div className="space-y-4">
              {achievements.length > 0 ? achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-100 transition-all cursor-default group"
                >
                  <div className="text-4xl filter group-hover:scale-110 transition-transform">{achievement.icon || '🏅'}</div>
                  <div>
                    <p className="font-black text-slate-800">{achievement.title}</p>
                    <p className="text-xs text-slate-400 font-semibold uppercase">{achievement.description}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <div className="text-5xl opacity-20 mb-4">🏅</div>
                  <p className="text-slate-400 font-bold">Terminez des quiz pour gagner vos premiers badges !</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Progress;
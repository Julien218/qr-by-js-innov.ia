import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MousePointerClick, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-white/8 p-6 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-3xl font-grotesk font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export default function Dashboard() {
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    // Lecture depuis localStorage — 100% local, aucune API externe
    try {
      const stored = JSON.parse(localStorage.getItem('qr_clicks') || '[]');
      setClicks(stored);
    } catch {
      setClicks([]);
    }
  }, []);

  const total = clicks.length;

  const last7Days = clicks.filter(c => {
    const d = new Date(c.created_date);
    return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const today = clicks.filter(c => {
    const d = new Date(c.created_date);
    return d.toDateString() === new Date().toDateString();
  }).length;

  // Historique par jour
  const dailyMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyMap[d.toDateString()] = 0;
  }
  clicks.forEach(c => {
    const key = new Date(c.created_date).toDateString();
    if (key in dailyMap) dailyMap[key]++;
  });
  const dailyData = Object.entries(dailyMap).map(([k, v]) => ({ label: formatDate(k), count: v }));
  const maxDaily = Math.max(...dailyData.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 glass border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/6a0448473bebffcc3578f3b8/c0c2ff82c_logo-phoenix-128.png" alt="JS-Innov.IA" className="w-9 h-9 object-contain" />
            <span className="font-grotesk font-bold text-white text-xl">QR<span className="gradient-text">Studio</span></span>
          </div>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-violet-500/20 text-violet-300 text-xs">
          <BarChart3 className="w-3.5 h-3.5" /> Tableau de bord
        </div>
      </nav>

      <div className="relative z-10 px-6 md:px-12 py-10 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-grotesk font-bold text-white mb-2"
        >
          Statistiques <span className="gradient-text">QR Studio</span>
        </motion.h1>
        <p className="text-muted-foreground text-sm mb-8">Données stockées localement — 100% privé, aucune API externe.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={MousePointerClick} label="Total QR générés" value={total} color="bg-gradient-to-br from-violet-600 to-indigo-600" />
          <StatCard icon={Calendar} label="Aujourd'hui" value={today} color="bg-gradient-to-br from-cyan-500 to-blue-600" />
          <StatCard icon={TrendingUp} label="7 derniers jours" value={last7Days} color="bg-gradient-to-br from-pink-500 to-rose-600" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl border border-white/8 p-6 mb-6"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-5">Activité (7 jours)</h2>
          <div className="flex items-end gap-2 h-32">
            {dailyData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs text-white/70 font-medium">{d.count > 0 ? d.count : ''}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-indigo-400 transition-all duration-500 min-h-[4px]"
                  style={{ height: `${(d.count / maxDaily) * 96}px` }}
                />
                <span className="text-[10px] text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {total === 0 && (
          <div className="glass rounded-2xl border border-white/8 p-8 text-center">
            <p className="text-muted-foreground text-sm">Aucune activité enregistrée pour l'instant.</p>
            <Link to="/create" className="inline-block mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
              Créer mon premier QR code
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

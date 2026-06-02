import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MousePointerClick, TrendingUp, Calendar, BarChart3, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';

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

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'Inconnu';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export default function Dashboard() {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.AdClick.list('-created_date', 500).then(data => {
      setClicks(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const total = clicks.length;

  // Clics des 7 derniers jours
  const last7Days = clicks.filter(c => {
    const d = new Date(c.created_date);
    return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  // Clics aujourd'hui
  const today = clicks.filter(c => {
    const d = new Date(c.created_date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  // Par publicité
  const byAd = groupBy(clicks, 'ad_name');

  // Par page
  const byPage = groupBy(clicks, 'page');

  // Historique par jour (7 derniers jours)
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

  const topAds = Object.entries(byAd).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topPages = Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px]" />
      </div>

      {/* Nav */}
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
          className="text-3xl font-grotesk font-bold text-white mb-8"
        >
          Performances des <span className="gradient-text">publicités</span>
        </motion.h1>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard icon={MousePointerClick} label="Total des clics" value={total} color="bg-gradient-to-br from-violet-600 to-indigo-600" />
              <StatCard icon={Calendar} label="Aujourd'hui" value={today} color="bg-gradient-to-br from-cyan-500 to-blue-600" />
              <StatCard icon={TrendingUp} label="7 derniers jours" value={last7Days} color="bg-gradient-to-br from-pink-500 to-rose-600" />
            </div>

            {/* Daily chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl border border-white/8 p-6 mb-6"
            >
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-5">Clics par jour (7 jours)</h2>
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

            {/* Top ads & top pages */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top publicités */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass rounded-2xl border border-white/8 p-6"
              >
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Top publicités</h2>
                {topAds.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucun clic enregistré.</p>
                ) : (
                  <ul className="space-y-3">
                    {topAds.map(([name, count], i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-white font-medium truncate">{name}</span>
                            <span className="text-sm text-violet-300 font-bold">{count}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                              style={{ width: `${(count / (topAds[0]?.[1] || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>

              {/* Top pages */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl border border-white/8 p-6"
              >
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Clics par page</h2>
                {topPages.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucun clic enregistré.</p>
                ) : (
                  <ul className="space-y-3">
                    {topPages.map(([page, count], i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-white font-medium truncate">{page}</span>
                            <span className="text-sm text-cyan-300 font-bold">{count}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400"
                              style={{ width: `${(count / (topPages[0]?.[1] || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </div>

            {/* Recent clicks */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass rounded-2xl border border-white/8 p-6 mt-6"
            >
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Derniers clics</h2>
              {clicks.length === 0 ? (
                <p className="text-muted-foreground text-sm">Aucun clic enregistré pour le moment.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground text-xs border-b border-white/5">
                        <th className="text-left pb-3 pr-4 font-medium">Publicité</th>
                        <th className="text-left pb-3 pr-4 font-medium">Page</th>
                        <th className="text-left pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clicks.slice(0, 20).map((c, i) => (
                        <tr key={i} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                          <td className="py-2.5 pr-4 text-white font-medium">{c.ad_name}</td>
                          <td className="py-2.5 pr-4 text-muted-foreground">{c.page || '—'}</td>
                          <td className="py-2.5 text-muted-foreground text-xs">
                            {new Date(c.created_date).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
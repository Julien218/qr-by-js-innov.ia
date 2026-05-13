import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Wifi, User, MessageSquare, Mail, ArrowRight, Zap, Palette, Download, Sparkles, QrCode } from 'lucide-react';

const features = [
  { icon: Zap, title: "Génération instantanée", desc: "Votre QR code apparaît en temps réel pendant que vous tapez" },
  { icon: Palette, title: "Personnalisation totale", desc: "Couleurs, dégradés, formes — rendez votre QR unique" },
  { icon: Download, title: "Export haute qualité", desc: "Téléchargez en PNG ou SVG, prêt pour l'impression" },
];

const qrTypes = [
  { icon: Globe, label: "Site web", color: "from-violet-500 to-purple-600", type: "url" },
  { icon: Wifi, label: "Wi-Fi", color: "from-cyan-500 to-blue-600", type: "wifi" },
  { icon: User, label: "vCard", color: "from-pink-500 to-rose-600", type: "vcard" },
  { icon: MessageSquare, label: "WhatsApp", color: "from-green-500 to-emerald-600", type: "whatsapp" },
  { icon: Mail, label: "Email", color: "from-orange-500 to-amber-600", type: "email" },
  { icon: QrCode, label: "Texte libre", color: "from-indigo-500 to-violet-600", type: "text" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background grid-bg overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <span className="font-grotesk font-700 text-white text-xl">QR<span className="gradient-text">Studio</span></span>
        </div>
        <Link
          to="/create"
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg shadow-violet-500/25"
        >
          Créer un QR code <ArrowRight className="w-4 h-4" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/20 text-violet-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" /> Générateur de QR codes nouvelle génération
          </div>
          <h1 className="text-5xl md:text-7xl font-grotesk font-bold text-white leading-tight mb-6">
            Créez des QR codes<br />
            <span className="gradient-text">extraordinaires</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Un générateur de QR codes moderne, rapide et entièrement personnalisable. Partagez n'importe quoi en quelques secondes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/create"
              className="group flex items-center gap-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
            >
              <QrCode className="w-5 h-5" />
              Générer gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Floating QR visual */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-3xl blur-3xl opacity-20 scale-110" />
            <div className="relative glass-strong rounded-3xl p-8 border border-white/10 animate-float">
              <div className="w-48 h-48 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-36 h-36">
                  {/* Simplified decorative QR pattern */}
                  {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
                    const isCorner = (r<3&&c<3)||(r<3&&c>3)||(r>3&&c<3);
                    const fill = Math.random() > 0.4 ? (isCorner ? '#a78bfa' : '#22d3ee') : 'transparent';
                    return fill !== 'transparent' ? (
                      <rect key={`${r}-${c}`} x={c*14+1} y={r*14+1} width={12} height={12} rx={2} fill={fill} opacity={0.8} />
                    ) : null;
                  }))}
                  {/* Corner squares */}
                  <rect x={1} y={1} width={38} height={38} rx={4} fill="none" stroke="#a78bfa" strokeWidth={2.5} />
                  <rect x={61} y={1} width={38} height={38} rx={4} fill="none" stroke="#a78bfa" strokeWidth={2.5} />
                  <rect x={1} y={61} width={38} height={38} rx={4} fill="none" stroke="#22d3ee" strokeWidth={2.5} />
                  <rect x={8} y={8} width={24} height={24} rx={2} fill="#a78bfa" opacity={0.6} />
                  <rect x={68} y={8} width={24} height={24} rx={2} fill="#a78bfa" opacity={0.6} />
                  <rect x={8} y={68} width={24} height={24} rx={2} fill="#22d3ee" opacity={0.6} />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* QR Types */}
      <section className="relative z-10 px-6 md:px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold text-white mb-4">Tous les types de QR codes</h2>
          <p className="text-muted-foreground text-lg">Choisissez le format adapté à votre besoin</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {qrTypes.map((type, i) => (
            <motion.div
              key={type.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <Link
                to={`/create?type=${type.type}`}
                className="flex flex-col items-center gap-3 p-5 glass rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-300 hover:scale-105 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{type.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/5"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-grotesk font-semibold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-muted-foreground text-sm glass">
        <p>© 2026 QRStudio — Générateur de QR codes moderne</p>
      </footer>
    </div>
  );
}
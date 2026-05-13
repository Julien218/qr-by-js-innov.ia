import { motion } from 'framer-motion';

const PRESETS = [
  { fg: '#a78bfa', bg: '#0d0d1a', label: 'Violet' },
  { fg: '#22d3ee', bg: '#030f18', label: 'Cyan' },
  { fg: '#f472b6', bg: '#1a0a12', label: 'Rose' },
  { fg: '#34d399', bg: '#011a0f', label: 'Vert' },
  { fg: '#fb923c', bg: '#1a0a00', label: 'Orange' },
  { fg: '#ffffff', bg: '#000000', label: 'Classic' },
];

const SIZES = [
  { value: 200, label: 'S' },
  { value: 280, label: 'M' },
  { value: 360, label: 'L' },
];

export default function QRCustomizer({ style, onChange }) {
  const set = (key, value) => onChange({ ...style, [key]: value });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl md:text-3xl font-grotesk font-bold text-white mb-2">Personnalisez le style</h2>
      <p className="text-muted-foreground mb-8">Adaptez les couleurs et la taille de votre QR code</p>

      <div className="space-y-8 max-w-lg">
        {/* Presets */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">Thèmes prédéfinis</label>
          <div className="flex flex-wrap gap-3">
            {PRESETS.map(preset => (
              <button
                key={preset.label}
                onClick={() => onChange({ ...style, fg: preset.fg, bg: preset.bg })}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium
                  ${style.fg === preset.fg && style.bg === preset.bg
                    ? 'border-violet-500/50 bg-white/8 text-white'
                    : 'border-white/10 bg-white/3 text-muted-foreground hover:border-white/20 hover:text-white'
                  }`}
              >
                <span className="flex gap-1">
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: preset.fg }} />
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: preset.bg }} />
                </span>
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom colors */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Couleur du QR</label>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white/10 cursor-pointer">
                <input
                  type="color"
                  value={style.fg}
                  onChange={e => set('fg', e.target.value)}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                />
                <div className="w-full h-full" style={{ background: style.fg }} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{style.fg}</p>
                <p className="text-muted-foreground text-xs">Cliquer pour changer</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Fond du QR</label>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white/10 cursor-pointer">
                <input
                  type="color"
                  value={style.bg}
                  onChange={e => set('bg', e.target.value)}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                />
                <div className="w-full h-full" style={{ background: style.bg }} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{style.bg}</p>
                <p className="text-muted-foreground text-xs">Cliquer pour changer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">Taille</label>
          <div className="flex gap-3">
            {SIZES.map(s => (
              <button
                key={s.value}
                onClick={() => set('size', s.value)}
                className={`w-14 h-10 rounded-xl border text-sm font-semibold transition-all duration-200
                  ${style.size === s.value
                    ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                    : 'border-white/10 bg-white/3 text-muted-foreground hover:border-white/20 hover:text-white'
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error correction */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">Niveau de correction d'erreur</label>
          <div className="flex gap-2 flex-wrap">
            {['L', 'M', 'Q', 'H'].map(level => (
              <button
                key={level}
                onClick={() => set('errorLevel', level)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200
                  ${style.errorLevel === level
                    ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300'
                    : 'border-white/10 bg-white/3 text-muted-foreground hover:border-white/20 hover:text-white'
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">H = meilleure résistance aux dommages</p>
        </div>
      </div>
    </motion.div>
  );
}
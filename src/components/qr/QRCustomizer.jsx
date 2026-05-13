import { motion } from 'framer-motion';
import FrameLogoEditor from './FrameLogoEditor';

const PRESETS = [
  { fg: '#a78bfa', bg: '#0d0d1a', label: 'Violet', gradient: { type: 'linear', color1: '#a78bfa', color2: '#22d3ee', angle: 135 } },
  { fg: '#22d3ee', bg: '#030f18', label: 'Cyan', gradient: { type: 'radial', color1: '#22d3ee', color2: '#6366f1' } },
  { fg: '#f472b6', bg: '#1a0a12', label: 'Rose', gradient: { type: 'linear', color1: '#f472b6', color2: '#fb7185', angle: 90 } },
  { fg: '#34d399', bg: '#011a0f', label: 'Vert', gradient: { type: 'linear', color1: '#34d399', color2: '#06b6d4', angle: 135 } },
  { fg: '#fb923c', bg: '#1a0a00', label: 'Feu', gradient: { type: 'linear', color1: '#fb923c', color2: '#f472b6', angle: 45 } },
  { fg: '#ffffff', bg: '#000000', label: 'Classic', gradient: null },
];

const PIXEL_SHAPES = [
  { id: 'square', label: 'Carré', preview: (c) => <rect x="2" y="2" width="16" height="16" fill={c} /> },
  { id: 'rounded', label: 'Arrondi', preview: (c) => <rect x="2" y="2" width="16" height="16" rx="5" fill={c} /> },
  { id: 'circle', label: 'Cercle', preview: (c) => <circle cx="10" cy="10" r="8" fill={c} /> },
  { id: 'diamond', label: 'Diamant', preview: (c) => <polygon points="10,2 18,10 10,18 2,10" fill={c} /> },
  { id: 'vertical', label: 'Vertical', preview: (c) => <rect x="7" y="1" width="6" height="18" rx="3" fill={c} /> },
  { id: 'horizontal', label: 'Horizontal', preview: (c) => <rect x="1" y="7" width="18" height="6" rx="3" fill={c} /> },
  { id: 'star', label: 'Étoile', preview: (c) => <polygon points="10,1 12,7 18,7 13.5,11 15,17 10,13.5 5,17 6.5,11 2,7 8,7" fill={c} /> },
];

const CORNER_SHAPES = [
  { id: 'square', label: 'Carré' },
  { id: 'rounded', label: 'Arrondi' },
  { id: 'circle', label: 'Cercle' },
  { id: 'mixed', label: 'Mixte' },
];

const SIZES = [
  { value: 200, label: 'S' },
  { value: 280, label: 'M' },
  { value: 360, label: 'L' },
];

export default function QRCustomizer({ style, onChange }) {
  const set = (key, value) => onChange({ ...style, [key]: value });
  const fgColor = style.gradient?.color1 || style.fg;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="text-2xl md:text-3xl font-grotesk font-bold text-white mb-2">Personnalisez le style</h2>
      <p className="text-muted-foreground mb-8">Cadre, logo, pixels, couleurs et dégradés</p>

      <div className="space-y-8 max-w-xl">
        {/* Frame & Logo */}
        <FrameLogoEditor style={style} onChange={onChange} />
        <div className="h-px bg-white/8" />

        {/* Pixel shapes */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">Forme des pixels</label>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {PIXEL_SHAPES.map(shape => (
              <button
                key={shape.id}
                onClick={() => set('pixelShape', shape.id)}
                className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border transition-all duration-200
                  ${style.pixelShape === shape.id
                    ? 'border-violet-500/60 bg-violet-500/15 text-violet-300'
                    : 'border-white/8 bg-white/3 text-muted-foreground hover:border-white/20 hover:text-white'
                  }`}
              >
                <svg viewBox="0 0 20 20" className="w-7 h-7">
                  {shape.preview(style.pixelShape === shape.id ? '#a78bfa' : '#6b7280')}
                </svg>
                <span className="text-[10px] font-medium leading-tight text-center">{shape.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Corner shapes */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">Style des coins</label>
          <div className="flex gap-2 flex-wrap">
            {CORNER_SHAPES.map(shape => (
              <button
                key={shape.id}
                onClick={() => set('cornerShape', shape.id)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200
                  ${style.cornerShape === shape.id
                    ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300'
                    : 'border-white/8 bg-white/3 text-muted-foreground hover:border-white/20 hover:text-white'
                  }`}
              >
                {shape.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color presets */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">Thèmes de couleur</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(preset => {
              const isActive = style.fg === preset.fg && style.bg === preset.bg;
              return (
                <button
                  key={preset.label}
                  onClick={() => onChange({ ...style, fg: preset.fg, bg: preset.bg, gradient: preset.gradient })}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200 text-sm font-medium
                    ${isActive ? 'border-violet-500/50 bg-white/8 text-white' : 'border-white/8 bg-white/3 text-muted-foreground hover:border-white/20 hover:text-white'}`}
                >
                  <span className="flex gap-1">
                    <span className="w-4 h-4 rounded-full border border-white/15" style={{ background: preset.gradient ? `linear-gradient(135deg, ${preset.gradient.color1}, ${preset.gradient.color2 || preset.gradient.color1})` : preset.fg }} />
                    <span className="w-4 h-4 rounded-full border border-white/15" style={{ background: preset.bg }} />
                  </span>
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gradient toggle */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-white/80">Dégradé personnalisé</label>
            <button
              onClick={() => {
                if (style.gradient) {
                  onChange({ ...style, gradient: null });
                } else {
                  onChange({ ...style, gradient: { type: 'linear', color1: style.fg, color2: '#22d3ee', angle: 135 } });
                }
              }}
              className={`relative w-10 h-5 rounded-full transition-all ${style.gradient ? 'bg-violet-500' : 'bg-white/15'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${style.gradient ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
          {style.gradient && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pl-1">
              <div className="flex gap-2">
                {['linear', 'radial'].map(t => (
                  <button key={t} onClick={() => onChange({ ...style, gradient: { ...style.gradient, type: t } })}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
                      ${style.gradient.type === t ? 'border-violet-500/50 bg-violet-500/15 text-violet-300' : 'border-white/8 text-muted-foreground hover:text-white'}`}>
                    {t === 'linear' ? 'Linéaire' : 'Radial'}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Couleur 1</p>
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                    <input type="color" value={style.gradient.color1} onChange={e => onChange({ ...style, gradient: { ...style.gradient, color1: e.target.value } })}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10" />
                    <div className="w-full h-full" style={{ background: style.gradient.color1 }} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Couleur 2</p>
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                    <input type="color" value={style.gradient.color2 || '#22d3ee'} onChange={e => onChange({ ...style, gradient: { ...style.gradient, color2: e.target.value } })}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10" />
                    <div className="w-full h-full" style={{ background: style.gradient.color2 || '#22d3ee' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Custom colors (no gradient) */}
        {!style.gradient && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Couleur du QR</label>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                  <input type="color" value={style.fg} onChange={e => set('fg', e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10" />
                  <div className="w-full h-full" style={{ background: style.fg }} />
                </div>
                <span className="text-white text-sm font-mono">{style.fg}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Fond</label>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                  <input type="color" value={style.bg} onChange={e => set('bg', e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10" />
                  <div className="w-full h-full" style={{ background: style.bg }} />
                </div>
                <span className="text-white text-sm font-mono">{style.bg}</span>
              </div>
            </div>
          </div>
        )}

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">Taille</label>
          <div className="flex gap-3">
            {SIZES.map(s => (
              <button key={s.value} onClick={() => set('size', s.value)}
                className={`w-14 h-10 rounded-xl border text-sm font-semibold transition-all
                  ${style.size === s.value ? 'border-violet-500/50 bg-violet-500/20 text-violet-300' : 'border-white/8 bg-white/3 text-muted-foreground hover:border-white/20 hover:text-white'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error correction */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">Correction d'erreur</label>
          <div className="flex gap-2">
            {['L', 'M', 'Q', 'H'].map(level => (
              <button key={level} onClick={() => set('errorLevel', level)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all
                  ${style.errorLevel === level ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300' : 'border-white/8 bg-white/3 text-muted-foreground hover:border-white/20 hover:text-white'}`}>
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
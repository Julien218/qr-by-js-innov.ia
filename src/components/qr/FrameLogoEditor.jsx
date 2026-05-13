import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, QrCode, Image } from 'lucide-react';

const FRAME_STYLES = [
  { id: 'none', label: 'Aucun' },
  { id: 'simple', label: 'Simple' },
  { id: 'rounded', label: 'Arrondi' },
  { id: 'bubble', label: 'Bulle' },
  { id: 'banner', label: 'Bannière' },
  { id: 'scan_me', label: 'Coins' },
];

const CTA_PRESETS = ['Scannez ici', 'Scan me', 'Flashez-moi', 'Voir plus', 'Suivez-nous', 'Rejoignez-nous'];

const LOGO_SHAPES = [
  { id: 'square', label: 'Carré' },
  { id: 'rounded', label: 'Arrondi' },
  { id: 'circle', label: 'Cercle' },
];

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-all";

export default function FrameLogoEditor({ style, onChange }) {
  const fileInputRef = useRef(null);
  const frame = style.frame || { style: 'none', color: 'auto', text: 'Scannez ici', textColor: '#ffffff', fontSize: 14 };
  const logo = style.logo || null;

  const setFrame = (key, value) => onChange({ ...style, frame: { ...frame, [key]: value } });
  const setFrameStyle = (s) => {
    if (s === 'none') {
      onChange({ ...style, frame: { ...frame, style: 'none' } });
    } else {
      onChange({ ...style, frame: { ...frame, style: s } });
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({
        ...style,
        logo: { dataUrl: ev.target.result, sizeRatio: 0.22, shape: 'rounded', bgColor: '#ffffff' },
      });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => onChange({ ...style, logo: null });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-xl">

      {/* FRAME SECTION */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <QrCode className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Cadre décoratif</h3>
        </div>

        {/* Frame style picker */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {FRAME_STYLES.map(fs => (
            <button
              key={fs.id}
              onClick={() => setFrameStyle(fs.id)}
              className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all
                ${frame.style === fs.id
                  ? 'border-violet-500/60 bg-violet-500/15 text-violet-300'
                  : 'border-white/8 bg-white/3 text-muted-foreground hover:border-white/20 hover:text-white'}`}
            >
              {fs.label}
            </button>
          ))}
        </div>

        {frame.style !== 'none' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 p-4 rounded-2xl bg-white/3 border border-white/8">
            {/* CTA Text */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">Texte d'appel à l'action</label>
              <input
                className={inputClass}
                value={frame.text || 'Scannez ici'}
                onChange={e => setFrame('text', e.target.value)}
                placeholder="Scannez ici"
                maxLength={30}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {CTA_PRESETS.map(t => (
                  <button
                    key={t}
                    onClick={() => setFrame('text', t)}
                    className={`px-2.5 py-1 rounded-lg border text-xs transition-all
                      ${frame.text === t ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' : 'border-white/8 text-muted-foreground hover:text-white hover:border-white/20'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">Couleur du cadre</label>
                <div className="flex items-center gap-2">
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/10">
                    <input type="color"
                      value={frame.color === 'auto' ? '#a78bfa' : (frame.color || '#a78bfa')}
                      onChange={e => setFrame('color', e.target.value)}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10" />
                    <div className="w-full h-full" style={{ background: frame.color === 'auto' ? 'linear-gradient(135deg,#a78bfa,#22d3ee)' : (frame.color || '#a78bfa') }} />
                  </div>
                  <button
                    onClick={() => setFrame('color', 'auto')}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all ${frame.color === 'auto' ? 'border-violet-500/50 bg-violet-500/15 text-violet-300' : 'border-white/8 text-muted-foreground hover:text-white'}`}
                  >Auto</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">Couleur du texte</label>
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/10">
                  <input type="color"
                    value={frame.textColor || '#ffffff'}
                    onChange={e => setFrame('textColor', e.target.value)}
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10" />
                  <div className="w-full h-full" style={{ background: frame.textColor || '#ffffff' }} />
                </div>
              </div>
            </div>

            {/* Font size */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">Taille du texte: {frame.fontSize || 14}px</label>
              <input
                type="range" min="10" max="22" step="1"
                value={frame.fontSize || 14}
                onChange={e => setFrame('fontSize', Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* LOGO SECTION */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Image className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Logo central</h3>
        </div>

        {!logo ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-3 py-8 rounded-2xl border-2 border-dashed border-white/15 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-violet-500/30 transition-all">
              <Upload className="w-5 h-5 text-muted-foreground group-hover:text-violet-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Importer un logo</p>
              <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, SVG — recommandé: fond transparent</p>
            </div>
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-white/3 border border-white/8 space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo.dataUrl} alt="Logo" className="w-14 h-14 rounded-xl object-contain border border-white/10 bg-white/5 p-1" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">Logo importé</p>
                <p className="text-xs text-muted-foreground">Activé et centré</p>
              </div>
              <button onClick={removeLogo} className="w-8 h-8 rounded-lg bg-destructive/15 border border-destructive/20 flex items-center justify-center hover:bg-destructive/25 transition-all">
                <X className="w-4 h-4 text-destructive" />
              </button>
            </div>

            {/* Logo size */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">Taille: {Math.round((logo.sizeRatio || 0.22) * 100)}%</label>
              <input
                type="range" min="12" max="35" step="1"
                value={Math.round((logo.sizeRatio || 0.22) * 100)}
                onChange={e => onChange({ ...style, logo: { ...logo, sizeRatio: Number(e.target.value) / 100 } })}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Logo shape */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">Forme du fond</label>
              <div className="flex gap-2">
                {LOGO_SHAPES.map(s => (
                  <button key={s.id} onClick={() => onChange({ ...style, logo: { ...logo, shape: s.id } })}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
                      ${logo.shape === s.id ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300' : 'border-white/8 text-muted-foreground hover:text-white hover:border-white/20'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo bg color */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">Couleur du fond</label>
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/10">
                  <input type="color" value={logo.bgColor || '#ffffff'} onChange={e => onChange({ ...style, logo: { ...logo, bgColor: e.target.value } })}
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10" />
                  <div className="w-full h-full" style={{ background: logo.bgColor || '#ffffff' }} />
                </div>
                {['#ffffff', '#000000', 'transparent'].map(c => (
                  <button key={c} onClick={() => onChange({ ...style, logo: { ...logo, bgColor: c } })}
                    className={`w-7 h-7 rounded-lg border transition-all ${logo.bgColor === c ? 'border-cyan-400 scale-110' : 'border-white/15'}`}
                    style={{ background: c === 'transparent' ? 'repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%) 0% 0% / 10px 10px' : c }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <button onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 rounded-xl border border-white/10 text-xs text-muted-foreground hover:text-white hover:border-white/20 transition-all">
              Changer le logo
            </button>
          </motion.div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />

        {logo && (
          <p className="text-xs text-muted-foreground mt-2">
            💡 Utilisez le niveau de correction H pour les grands logos
          </p>
        )}
      </div>
    </motion.div>
  );
}
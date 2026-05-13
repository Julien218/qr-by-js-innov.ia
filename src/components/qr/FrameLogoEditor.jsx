import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Lock } from 'lucide-react';

const FRAME_STYLES = [
  { id: 'none', label: 'Aucun' },
  { id: 'simple', label: 'Simple' },
  { id: 'rounded', label: 'Arrondi' },
  { id: 'bubble', label: 'Bulle' },
  { id: 'banner', label: 'Bannière' },
  { id: 'scan_me', label: 'Coins' },
];

const CTA_PRESETS = ['Scannez ici', 'Scan me', 'Flashez-moi', 'Voir plus', 'Suivez-nous', 'Rejoignez-nous'];

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-all";

export default function FrameLogoEditor({ style, onChange }) {
  const frame = style.frame || { style: 'none', color: 'auto', text: 'Scannez ici', textColor: '#ffffff', fontSize: 14 };

  const setFrame = (key, value) => onChange({ ...style, frame: { ...frame, [key]: value } });
  const setFrameStyle = (s) => {
    onChange({ ...style, frame: { ...frame, style: s } });
  };

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

      {/* LOGO SECTION - Brand locked */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Logo de marque</h3>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/8 border border-amber-500/20">
          <img
            src="https://media.base44.com/images/public/6a0448473bebffcc3578f3b8/445679379_logo-phoenix-512.png"
            alt="Phoenix Logo"
            className="w-12 h-12 rounded-full object-contain"
          />
          <div>
            <p className="text-sm font-medium text-white">Logo Phoenix</p>
            <p className="text-xs text-amber-400/80">Appliqué automatiquement à tous les QR codes</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, QrCode, RefreshCw } from 'lucide-react';
import StepIndicator from '../components/qr/StepIndicator';
import TypeSelector from '../components/qr/TypeSelector';
import ContentForm from '../components/qr/ContentForm';
import QRCustomizer from '../components/qr/QRCustomizer';
import QRPreview from '../components/qr/QRPreview';
import DownloadStep from '../components/qr/DownloadStep';

const buildQRValue = (type, data) => {
  switch (type) {
    case 'url': return data.url || '';
    case 'wifi': return `WIFI:T:${data.security || 'WPA'};S:${data.ssid || ''};P:${data.password || ''};;`;
    case 'vcard': return `BEGIN:VCARD\nVERSION:3.0\nN:${data.lastname || ''};${data.firstname || ''}\nFN:${data.firstname || ''} ${data.lastname || ''}\nTEL:${data.phone || ''}\nEMAIL:${data.email || ''}\nORG:${data.company || ''}\nURL:${data.website || ''}\nEND:VCARD`;
    case 'whatsapp': return `https://wa.me/${(data.phone || '').replace(/\D/g, '')}${data.message ? `?text=${encodeURIComponent(data.message)}` : ''}`;
    case 'email': return `mailto:${data.email || ''}${data.subject ? `?subject=${encodeURIComponent(data.subject)}` : ''}${data.body ? `&body=${encodeURIComponent(data.body)}` : ''}`;
    case 'sms': return `sms:${data.phone || ''}${data.message ? `?body=${encodeURIComponent(data.message)}` : ''}`;
    case 'phone': return `tel:${data.phone || ''}`;
    case 'text': return data.text || '';
    default: return '';
  }
};

const isStepValid = (step, type, data) => {
  if (step === 1) return !!type;
  if (step === 2) {
    switch (type) {
      case 'url': return !!data.url;
      case 'wifi': return !!data.ssid;
      case 'vcard': return !!(data.firstname || data.lastname);
      case 'whatsapp': return !!data.phone;
      case 'email': return !!data.email;
      case 'sms': return !!data.phone;
      case 'phone': return !!data.phone;
      case 'text': return !!data.text;
      default: return false;
    }
  }
  return true;
};

export default function Create() {
  const params = new URLSearchParams(window.location.search);
  const initialType = params.get('type') || null;

  const [step, setStep] = useState(initialType ? 2 : 1);
  const [type, setType] = useState(initialType);
  const [data, setData] = useState({});
  const [qrStyle, setQrStyle] = useState({
    fg: '#a78bfa',
    bg: '#0d0d1a',
    size: 280,
    errorLevel: 'M',
  });

  const qrValue = useMemo(() => buildQRValue(type, data), [type, data]);

  const canNext = isStepValid(step, type, data);

  const handleTypeSelect = (t) => {
    setType(t);
    setData({});
  };

  const next = () => {
    if (canNext && step < 4) setStep(s => s + 1);
  };

  const prev = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const reset = () => {
    setStep(1);
    setType(null);
    setData({});
    setQrStyle({ fg: '#a78bfa', bg: '#0d0d1a', size: 280, errorLevel: 'M' });
  };

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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-grotesk font-bold text-white text-xl">QR<span className="gradient-text">Studio</span></span>
          </div>
        </Link>
        <button
          onClick={reset}
          className="flex items-center gap-2 text-muted-foreground hover:text-white text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Recommencer
        </button>
      </nav>

      {/* Step indicator */}
      <div className="relative z-10 py-8 px-6">
        <StepIndicator currentStep={step} />
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 md:px-12 pb-12">
        <div className={`max-w-6xl mx-auto ${step === 4 ? '' : 'grid md:grid-cols-[1fr_320px] gap-8 items-start'}`}>
          
          {/* Left: step content */}
          <div className="glass rounded-3xl border border-white/8 p-6 md:p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <TypeSelector selected={type} onSelect={handleTypeSelect} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ContentForm type={type} data={data} onChange={setData} />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <QRCustomizer style={qrStyle} onChange={setQrStyle} />
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <DownloadStep value={qrValue} style={qrStyle} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            {step !== 4 && (
              <div className={`flex mt-10 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
                {step > 1 && (
                  <button
                    onClick={prev}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 transition-all text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" /> Retour
                  </button>
                )}
                <motion.button
                  whileHover={canNext ? { scale: 1.03 } : {}}
                  whileTap={canNext ? { scale: 0.97 } : {}}
                  onClick={next}
                  disabled={!canNext}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all
                    ${canNext
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25'
                      : 'bg-white/5 text-muted-foreground cursor-not-allowed'
                    }`}
                >
                  {step === 3 ? 'Générer le QR code' : 'Continuer'} <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}

            {step === 4 && (
              <div className="mt-8 text-center">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 transition-all text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" /> Créer un nouveau QR code
                </button>
              </div>
            )}
          </div>

          {/* Right: live preview */}
          {step !== 4 && (
            <div className="sticky top-6">
              <div className="glass rounded-3xl border border-white/8 p-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Aperçu en direct</p>
                
                {/* Phone mockup */}
                <div className="flex justify-center">
                  <div className="relative w-[180px]">
                    {/* Phone frame */}
                    <div className="relative bg-[#111] rounded-[2rem] border-2 border-white/10 overflow-hidden shadow-2xl" style={{ paddingTop: '175%' }}>
                      {/* Notch */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#222] rounded-full z-10" />
                      {/* Screen */}
                      <div className="absolute inset-2 top-10 rounded-[1.5rem] overflow-hidden flex flex-col items-center justify-center p-3"
                        style={{ background: qrStyle.bg || '#0d0d1a' }}>
                        {qrValue ? (
                          <QRPreview value={qrValue} style={{ ...qrStyle, size: 130 }} compact />
                        ) : (
                          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-white/15 flex items-center justify-center">
                            <QrCode className="w-8 h-8 text-white/20" />
                          </div>
                        )}
                        <p className="text-[10px] text-white/30 mt-2 text-center leading-tight">
                          {qrValue ? 'Scannez-moi' : 'Votre QR\naparaîtra ici'}
                        </p>
                      </div>
                      {/* Home indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Status info */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Type</span>
                    <span className="text-white font-medium capitalize">{type || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Taille</span>
                    <span className="text-white font-medium">{qrStyle.size}px</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Correction</span>
                    <span className="text-white font-medium">{qrStyle.errorLevel}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-4 h-4 rounded-full border border-white/15" style={{ background: qrStyle.fg }} />
                    <div className="w-4 h-4 rounded-full border border-white/15" style={{ background: qrStyle.bg }} />
                    <span className="text-xs text-muted-foreground">Couleurs</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
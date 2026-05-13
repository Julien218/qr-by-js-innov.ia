import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Check, Copy } from 'lucide-react';
import QRCode from 'qrcode';

export default function DownloadStep({ value, style }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const size = style?.size || 280;

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: { dark: style?.fg || '#a78bfa', light: style?.bg || '#0d0d1a' },
      errorCorrectionLevel: style?.errorLevel || 'M',
    });
  }, [value, style, size]);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const downloadSVG = async () => {
    const svg = await QRCode.toString(value, {
      type: 'svg',
      width: size,
      margin: 2,
      color: { dark: style?.fg || '#a78bfa', light: style?.bg || '#0d0d1a' },
      errorCorrectionLevel: style?.errorLevel || 'M',
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = 'qrcode.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const copyDataURL = () => {
    if (!canvasRef.current) return;
    const dataURL = canvasRef.current.toDataURL();
    navigator.clipboard.writeText(dataURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
        <Check className="w-4 h-4" /> Votre QR code est prêt !
      </div>
      <h2 className="text-2xl md:text-3xl font-grotesk font-bold text-white mb-2">Téléchargez votre QR code</h2>
      <p className="text-muted-foreground mb-8">Choisissez le format selon votre usage</p>

      {/* QR Display */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 scale-110" />
          <div className="relative glass-strong rounded-3xl p-6 border border-white/10">
            <canvas ref={canvasRef} className="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={downloadPNG}
          className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/25"
        >
          <Download className="w-5 h-5" /> Télécharger PNG
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={downloadSVG}
          className="flex items-center justify-center gap-2.5 glass border border-white/10 hover:border-white/20 text-white px-6 py-3.5 rounded-xl font-semibold transition-all"
        >
          <Download className="w-5 h-5" /> Télécharger SVG
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={copyDataURL}
          className="flex items-center justify-center gap-2.5 glass border border-white/10 hover:border-white/20 text-white px-6 py-3.5 rounded-xl font-semibold transition-all"
        >
          {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          {copied ? 'Copié !' : 'Copier URL'}
        </motion.button>
      </div>
    </motion.div>
  );
}
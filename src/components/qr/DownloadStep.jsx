import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Check, Copy, FileImage, FileCode, FileText, Sparkles } from 'lucide-react';
import { getQRMatrix, renderQRSVG } from '../../lib/qrRenderer';

const HD_SIZES = [
  { label: '512px', value: 512 },
  { label: '1024px', value: 1024 },
  { label: '2048px', value: 2048 },
];

function getSVGDimensions(svgString) {
  const match = svgString.match(/width="(\d+)"\s+height="(\d+)"/);
  if (match) return { w: parseInt(match[1]), h: parseInt(match[2]) };
  const vbMatch = svgString.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (vbMatch) return { w: parseInt(vbMatch[1]), h: parseInt(vbMatch[2]) };
  return { w: 300, h: 300 };
}

async function svgToPngBlob(svgString, targetSize) {
  const { w, h } = getSVGDimensions(svgString);
  const scale = targetSize / Math.max(w, h);
  const pw = Math.round(w * scale);
  const ph = Math.round(h * scale);

  const scaledSvg = svgString
    .replace(/width="\d+"/, `width="${pw}"`)
    .replace(/height="\d+"/, `height="${ph}"`);

  const blob = new Blob([scaledSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pw;
      canvas.height = ph;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, pw, ph);
      URL.revokeObjectURL(url);
      canvas.toBlob(resolve, 'image/png');
    };
    img.src = url;
  });
}

async function svgToPdfBlob(svgString, { jsPDF }) {
  const { w, h } = getSVGDimensions(svgString);
  const MM_PER_PX = 0.264583;
  const wMM = w * MM_PER_PX;
  const hMM = h * MM_PER_PX;

  const pngBlob = await svgToPngBlob(svgString, 1024);
  const dataUrl = await new Promise((res) => {
    const r = new FileReader();
    r.onload = (e) => res(e.target.result);
    r.readAsDataURL(pngBlob);
  });

  const doc = new jsPDF({ orientation: wMM > hMM ? 'l' : 'p', unit: 'mm', format: [wMM, hMM] });
  doc.addImage(dataUrl, 'PNG', 0, 0, wMM, hMM);
  return doc.output('blob');
}

export default function DownloadStep({ value, style }) {
  const [svgContent, setSvgContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [hdSize, setHdSize] = useState(1024);
  const [loading, setLoading] = useState({});
  const displaySize = style?.size || 300;

  useEffect(() => {
    if (!value) return;
    getQRMatrix(value, style?.errorLevel || 'H').then(matrix => {
      setSvgContent(renderQRSVG(matrix, displaySize, style || {}));
    });
  }, [value, style, displaySize]);

  const setLoad = (key, val) => setLoading(l => ({ ...l, [key]: val }));

  const downloadSVG = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = 'qrcode-phoenix.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const downloadPNG = async () => {
    setLoad('png', true);
    const blob = await svgToPngBlob(svgContent, hdSize);
    const link = document.createElement('a');
    link.download = `qrcode-phoenix-${hdSize}px.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
    setLoad('png', false);
  };

  const downloadPDF = async () => {
    setLoad('pdf', true);
    try {
      const { jsPDF } = await import('jspdf');
      const blob = await svgToPdfBlob(svgContent, { jsPDF });
      const link = document.createElement('a');
      link.download = 'qrcode-phoenix.pdf';
      link.href = URL.createObjectURL(blob);
      link.click();
    } catch (e) {
      console.error('PDF error', e);
    }
    setLoad('pdf', false);
  };

  const copySVG = () => {
    navigator.clipboard.writeText(svgContent).then(() => {
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
      <p className="text-muted-foreground mb-8">PNG haute résolution, SVG vectoriel ou PDF professionnel</p>

      {/* QR Display */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 scale-110" />
          <div className="relative glass-strong rounded-3xl p-6 border border-white/10">
            <div
              className="rounded-xl overflow-hidden flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>
        </div>
      </div>

      {/* HD size selector for PNG */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-xs text-muted-foreground">Résolution PNG :</span>
        {HD_SIZES.map(s => (
          <button
            key={s.value}
            onClick={() => setHdSize(s.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all
              ${hdSize === s.value
                ? 'border-violet-500/60 bg-violet-500/20 text-violet-300'
                : 'border-white/10 text-muted-foreground hover:text-white hover:border-white/20'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Download buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto mb-4">
        {/* PNG - primary */}
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={downloadPNG}
          disabled={loading.png || !svgContent}
          className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/25">
          {loading.png ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : <FileImage className="w-5 h-5" />}
          Télécharger PNG {hdSize}px
        </motion.button>

        {/* SVG */}
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={downloadSVG}
          disabled={!svgContent}
          className="flex items-center justify-center gap-2.5 glass border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/5 text-white px-5 py-3 rounded-xl font-semibold transition-all text-sm">
          <FileCode className="w-4 h-4 text-cyan-400" /> SVG Vectoriel
        </motion.button>

        {/* PDF */}
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={downloadPDF}
          disabled={loading.pdf || !svgContent}
          className="flex items-center justify-center gap-2.5 glass border border-white/10 hover:border-pink-500/30 hover:bg-pink-500/5 text-white px-5 py-3 rounded-xl font-semibold transition-all text-sm">
          {loading.pdf ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : <FileText className="w-4 h-4 text-pink-400" />}
          PDF Professionnel
        </motion.button>
      </div>

      {/* Copy SVG */}
      <button onClick={copySVG} disabled={!svgContent}
        className="flex items-center justify-center gap-2 mx-auto text-xs text-muted-foreground hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5">
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Code SVG copié !' : 'Copier le code SVG'}
      </button>

      {/* Brand badge */}
      <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400/80 text-xs">
        <Sparkles className="w-3 h-3" />
        Logo Phoenix intégré dans tous les formats
      </div>
    </motion.div>
  );
}
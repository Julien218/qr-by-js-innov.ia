import { useEffect, useState, useRef } from 'react';
import { getQRMatrix, renderQRSVG } from '../../lib/qrRenderer';
import { QrCode } from 'lucide-react';

export default function QRPreview({ value, style, compact = false }) {
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(null);

  const displaySize = compact ? 140 : (style?.size || 260);

  useEffect(() => {
    if (!value) { setSvgContent(''); return; }
    setError(null);
    getQRMatrix(value, style?.errorLevel || 'M')
      .then(matrix => {
        const svg = renderQRSVG(matrix, displaySize, style || {});
        setSvgContent(svg);
      })
      .catch(err => setError(err.message));
  }, [value, style, displaySize]);

  if (!value) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/3"
        style={{ width: displaySize, height: displaySize }}
      >
        <div className="text-center">
          <QrCode className="w-8 h-8 mx-auto mb-2 text-white/20" />
          <p className="text-xs text-muted-foreground">Aperçu</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-xs p-2">Erreur: {error}</div>;
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ width: displaySize, height: displaySize }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
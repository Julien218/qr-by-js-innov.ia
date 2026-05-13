import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRPreview({ value, style, compact = false }) {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    setError(null);
    QRCode.toCanvas(canvasRef.current, value, {
      width: style?.size || 260,
      margin: 2,
      color: {
        dark: style?.fg || '#a78bfa',
        light: style?.bg || '#0d0d1a',
      },
      errorCorrectionLevel: style?.errorLevel || 'M',
    }).catch(err => setError(err.message));
  }, [value, style]);

  if (!value) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/3"
        style={{ width: compact ? 160 : style?.size || 260, height: compact ? 160 : style?.size || 260 }}
      >
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-2 opacity-20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <rect x={3} y={3} width={8} height={8} rx={1} />
              <rect x={13} y={3} width={8} height={8} rx={1} />
              <rect x={3} y={13} width={8} height={8} rx={1} />
              <rect x={13} y={13} width={8} height={8} rx={1} />
            </svg>
          </div>
          <p className="text-xs text-muted-foreground">Aperçu</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-destructive text-sm p-4">
        Erreur: {error}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-xl"
        style={compact ? { width: 160, height: 160 } : {}}
      />
    </div>
  );
}
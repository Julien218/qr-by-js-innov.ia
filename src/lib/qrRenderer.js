/**
 * Custom QR code SVG renderer with pixel shapes and corner styles.
 * Uses qrcode library to get the matrix, then renders it with custom shapes.
 */
import QRCode from 'qrcode';

// Get raw QR matrix (array of arrays, true = dark module)
export async function getQRMatrix(value, errorLevel = 'M') {
  const qr = await QRCode.create(value, { errorCorrectionLevel: errorLevel });
  const size = qr.modules.size;
  const data = qr.modules.data;
  const matrix = [];
  for (let r = 0; r < size; r++) {
    matrix.push([]);
    for (let c = 0; c < size; c++) {
      matrix[r].push(!!data[r * size + c]);
    }
  }
  return matrix;
}

// Check if a cell is one of the 3 corner "finder pattern" regions
function isFinderRegion(r, c, size) {
  const inTopLeft = r < 7 && c < 7;
  const inTopRight = r < 7 && c >= size - 7;
  const inBottomLeft = r >= size - 7 && c < 7;
  return inTopLeft || inTopRight || inBottomLeft;
}

// Draw a single pixel based on pixelShape
function drawPixel(x, y, cellSize, shape, color) {
  const s = cellSize;
  const gap = s * 0.15;
  const ps = s - gap * 2;
  const cx = x + s / 2;
  const cy = y + s / 2;

  switch (shape) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${ps / 2}" fill="${color}"/>`;
    case 'rounded':
      return `<rect x="${x + gap}" y="${y + gap}" width="${ps}" height="${ps}" rx="${ps * 0.3}" fill="${color}"/>`;
    case 'diamond': {
      const half = ps / 2;
      return `<polygon points="${cx},${y + gap} ${x + gap + ps},${cy} ${cx},${y + gap + ps} ${x + gap},${cy}" fill="${color}"/>`;
    }
    case 'vertical':
      return `<rect x="${cx - ps * 0.22}" y="${y + gap}" width="${ps * 0.44}" height="${ps}" rx="${ps * 0.22}" fill="${color}"/>`;
    case 'horizontal':
      return `<rect x="${x + gap}" y="${cy - ps * 0.22}" width="${ps}" height="${ps * 0.44}" rx="${ps * 0.22}" fill="${color}"/>`;
    case 'star': {
      const r1 = ps / 2;
      const r2 = ps / 4;
      const pts = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 - Math.PI / 2;
        const r = i % 2 === 0 ? r1 : r2;
        pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="${color}"/>`;
    }
    default: // square
      return `<rect x="${x + gap}" y="${y + gap}" width="${ps}" height="${ps}" fill="${color}"/>`;
  }
}

// Draw a finder pattern corner with style
function drawFinder(x, y, cellSize, cornerShape, fg, bg) {
  const total = cellSize * 7;
  const strokeW = cellSize;
  const innerSize = cellSize * 3;
  const innerX = x + cellSize * 2;
  const innerY = y + cellSize * 2;

  let outerPath, innerRect;

  if (cornerShape === 'circle') {
    const r = total / 2;
    const ir = innerSize / 2;
    outerPath = `<circle cx="${x + total / 2}" cy="${y + total / 2}" r="${r - strokeW * 0.2}" fill="${fg}"/>
<circle cx="${x + total / 2}" cy="${y + total / 2}" r="${r - strokeW}" fill="${bg}"/>`;
    innerRect = `<circle cx="${innerX + innerSize / 2}" cy="${innerY + innerSize / 2}" r="${ir * 0.85}" fill="${fg}"/>`;
  } else if (cornerShape === 'rounded') {
    const rx = total * 0.3;
    outerPath = `<rect x="${x}" y="${y}" width="${total}" height="${total}" rx="${rx}" fill="${fg}"/>
<rect x="${x + strokeW}" y="${y + strokeW}" width="${total - strokeW * 2}" height="${total - strokeW * 2}" rx="${rx * 0.6}" fill="${bg}"/>`;
    innerRect = `<rect x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" rx="${innerSize * 0.25}" fill="${fg}"/>`;
  } else if (cornerShape === 'mixed') {
    outerPath = `<rect x="${x}" y="${y}" width="${total}" height="${total}" rx="${total * 0.25}" fill="${fg}"/>
<rect x="${x + strokeW}" y="${y + strokeW}" width="${total - strokeW * 2}" height="${total - strokeW * 2}" rx="${total * 0.1}" fill="${bg}"/>`;
    innerRect = `<circle cx="${innerX + innerSize / 2}" cy="${innerY + innerSize / 2}" r="${innerSize * 0.42}" fill="${fg}"/>`;
  } else {
    // square
    outerPath = `<rect x="${x}" y="${y}" width="${total}" height="${total}" fill="${fg}"/>
<rect x="${x + strokeW}" y="${y + strokeW}" width="${total - strokeW * 2}" height="${total - strokeW * 2}" fill="${bg}"/>`;
    innerRect = `<rect x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" fill="${fg}"/>`;
  }

  return outerPath + innerRect;
}

// Resolve gradient or solid color definition
function buildGradientDef(style, id) {
  if (!style.gradient) return { def: '', color: style.fg };

  const { type = 'linear', color1, color2, angle = 135 } = style.gradient;
  const rad = (angle * Math.PI) / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 - Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 + Math.sin(rad) * 50;

  if (type === 'radial') {
    return {
      def: `<radialGradient id="${id}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${color1}"/><stop offset="100%" stop-color="${color2}"/></radialGradient>`,
      color: `url(#${id})`,
    };
  }
  return {
    def: `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%"><stop offset="0%" stop-color="${color1}"/><stop offset="100%" stop-color="${color2}"/></linearGradient>`,
    color: `url(#${id})`,
  };
}

export function renderQRSVG(matrix, size, style) {
  const {
    fg = '#a78bfa',
    bg = '#0d0d1a',
    pixelShape = 'square',
    cornerShape = 'square',
  } = style;

  const n = matrix.length;
  const cellSize = size / n;

  const { def: gradDef, color: gradColor } = buildGradientDef(style, 'qrgrad');

  let pixelsSVG = '';
  let findersSVG = '';

  // Draw finder patterns separately (top-left, top-right, bottom-left)
  const finderPositions = [
    { r: 0, c: 0 },
    { r: 0, c: n - 7 },
    { r: n - 7, c: 0 },
  ];

  for (const { r, c } of finderPositions) {
    findersSVG += drawFinder(c * cellSize, r * cellSize, cellSize, cornerShape, gradColor || fg, bg);
  }

  // Draw data modules (skip finder regions)
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (isFinderRegion(r, c, n)) continue;
      if (matrix[r][c]) {
        pixelsSVG += drawPixel(c * cellSize, r * cellSize, cellSize, pixelShape, gradColor || fg);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>${gradDef}</defs>
  <rect width="${size}" height="${size}" fill="${bg}"/>
  ${pixelsSVG}
  ${findersSVG}
</svg>`;
}
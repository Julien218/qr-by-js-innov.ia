/**
 * Custom QR code SVG renderer with pixel shapes, corner styles, frames and logo.
 */
import QRCode from 'qrcode';

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

function isFinderRegion(r, c, size) {
  const inTopLeft = r < 7 && c < 7;
  const inTopRight = r < 7 && c >= size - 7;
  const inBottomLeft = r >= size - 7 && c < 7;
  return inTopLeft || inTopRight || inBottomLeft;
}

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
    case 'diamond':
      return `<polygon points="${cx},${y + gap} ${x + gap + ps},${cy} ${cx},${y + gap + ps} ${x + gap},${cy}" fill="${color}"/>`;
    case 'vertical':
      return `<rect x="${cx - ps * 0.22}" y="${y + gap}" width="${ps * 0.44}" height="${ps}" rx="${ps * 0.22}" fill="${color}"/>`;
    case 'horizontal':
      return `<rect x="${x + gap}" y="${cy - ps * 0.22}" width="${ps}" height="${ps * 0.44}" rx="${ps * 0.22}" fill="${color}"/>`;
    case 'star': {
      const r1 = ps / 2, r2 = ps / 4;
      const pts = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 - Math.PI / 2;
        const rv = i % 2 === 0 ? r1 : r2;
        pts.push(`${cx + rv * Math.cos(angle)},${cy + rv * Math.sin(angle)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="${color}"/>`;
    }
    case 'cross': {
      const arm = ps * 0.35;
      return `<rect x="${cx - arm / 2}" y="${y + gap}" width="${arm}" height="${ps}" rx="${arm * 0.4}" fill="${color}"/>
<rect x="${x + gap}" y="${cy - arm / 2}" width="${ps}" height="${arm}" rx="${arm * 0.4}" fill="${color}"/>`;
    }
    case 'flower': {
      const pr = ps * 0.28;
      const offsets = [[0, -ps * 0.22], [0, ps * 0.22], [-ps * 0.22, 0], [ps * 0.22, 0]];
      return offsets.map(([ox, oy]) =>
        `<circle cx="${cx + ox}" cy="${cy + oy}" r="${pr}" fill="${color}"/>`
      ).join('') + `<circle cx="${cx}" cy="${cy}" r="${pr * 0.85}" fill="${color}"/>`;
    }
    case 'hexagon': {
      const hr = ps / 2;
      const hpts = [];
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        hpts.push(`${cx + hr * Math.cos(a)},${cy + hr * Math.sin(a)}`);
      }
      return `<polygon points="${hpts.join(' ')}" fill="${color}"/>`;
    }
    case 'random': {
      // Deterministic "random" based on position
      const seed = Math.round(x * 13 + y * 7) % 4;
      if (seed === 0) return `<circle cx="${cx}" cy="${cy}" r="${ps / 2}" fill="${color}"/>`;
      if (seed === 1) return `<rect x="${x + gap}" y="${y + gap}" width="${ps}" height="${ps}" rx="${ps * 0.3}" fill="${color}"/>`;
      if (seed === 2) return `<polygon points="${cx},${y + gap} ${x + gap + ps},${cy} ${cx},${y + gap + ps} ${x + gap},${cy}" fill="${color}"/>`;
      return `<rect x="${x + gap}" y="${y + gap}" width="${ps}" height="${ps}" fill="${color}"/>`;
    }
    default:
      return `<rect x="${x + gap}" y="${y + gap}" width="${ps}" height="${ps}" fill="${color}"/>`;
  }
}

function drawFinder(x, y, cellSize, cornerShape, fg, bg) {
  const total = cellSize * 7;
  const strokeW = cellSize;
  const innerSize = cellSize * 3;
  const innerX = x + cellSize * 2;
  const innerY = y + cellSize * 2;
  let outerPath, innerRect;

  if (cornerShape === 'circle') {
    const r = total / 2;
    outerPath = `<circle cx="${x + total / 2}" cy="${y + total / 2}" r="${r - strokeW * 0.2}" fill="${fg}"/>
<circle cx="${x + total / 2}" cy="${y + total / 2}" r="${r - strokeW}" fill="${bg}"/>`;
    innerRect = `<circle cx="${innerX + innerSize / 2}" cy="${innerY + innerSize / 2}" r="${innerSize / 2 * 0.85}" fill="${fg}"/>`;
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
    outerPath = `<rect x="${x}" y="${y}" width="${total}" height="${total}" fill="${fg}"/>
<rect x="${x + strokeW}" y="${y + strokeW}" width="${total - strokeW * 2}" height="${total - strokeW * 2}" fill="${bg}"/>`;
    innerRect = `<rect x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" fill="${fg}"/>`;
  }
  return outerPath + innerRect;
}

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

// Build frame SVG around the QR
function buildFrame(qrSize, frame, gradColor) {
  if (!frame || frame.style === 'none') return { wrapperOffset: 0, frameSVG: '' };

  const {
    style = 'simple',
    color = '#a78bfa',
    text = 'Scannez ici',
    textColor = '#ffffff',
    fontSize = 14,
    padding = 16,
  } = frame;

  const useColor = color === 'auto' ? (gradColor || color) : color;
  const totalWidth = qrSize + padding * 2;
  const textAreaH = fontSize + 20;
  const fullH = totalWidth + textAreaH;
  const rx = style === 'rounded' ? 16 : style === 'bubble' ? 24 : 6;

  let frameSVG = '';
  let bgShape = '';

  if (style === 'simple' || style === 'rounded') {
    bgShape = `<rect x="0" y="0" width="${totalWidth}" height="${fullH}" rx="${rx}" fill="${useColor}"/>
<rect x="${padding - 4}" y="${padding - 4}" width="${qrSize + 8}" height="${qrSize + 8}" rx="${Math.max(0, rx - 6)}" fill="${useColor}" opacity="0.3"/>`;
  } else if (style === 'bubble') {
    // Speech bubble pointing down
    bgShape = `<rect x="0" y="0" width="${totalWidth}" height="${fullH - 10}" rx="${rx}" fill="${useColor}"/>
<polygon points="${totalWidth / 2 - 10},${fullH - 10} ${totalWidth / 2 + 10},${fullH - 10} ${totalWidth / 2},${fullH}" fill="${useColor}"/>`;
  } else if (style === 'banner') {
    bgShape = `<rect x="0" y="${qrSize + padding * 2 - 4}" width="${totalWidth}" height="${textAreaH + 4}" rx="${rx}" fill="${useColor}"/>
<rect x="0" y="${qrSize + padding * 2 - 4}" width="${totalWidth}" height="8" fill="${useColor}"/>`;
  } else if (style === 'scan_me') {
    // Corner brackets
    const bLen = 24, bW = 4;
    const corners = [
      // top-left
      `<rect x="0" y="0" width="${bLen}" height="${bW}" rx="2" fill="${useColor}"/>
       <rect x="0" y="0" width="${bW}" height="${bLen}" rx="2" fill="${useColor}"/>`,
      // top-right
      `<rect x="${totalWidth - bLen}" y="0" width="${bLen}" height="${bW}" rx="2" fill="${useColor}"/>
       <rect x="${totalWidth - bW}" y="0" width="${bW}" height="${bLen}" rx="2" fill="${useColor}"/>`,
      // bottom-left
      `<rect x="0" y="${qrSize + padding * 2 - bW}" width="${bLen}" height="${bW}" rx="2" fill="${useColor}"/>
       <rect x="0" y="${qrSize + padding * 2 - bLen}" width="${bW}" height="${bLen}" rx="2" fill="${useColor}"/>`,
      // bottom-right
      `<rect x="${totalWidth - bLen}" y="${qrSize + padding * 2 - bW}" width="${bLen}" height="${bW}" rx="2" fill="${useColor}"/>
       <rect x="${totalWidth - bW}" y="${qrSize + padding * 2 - bLen}" width="${bW}" height="${bLen}" rx="2" fill="${useColor}"/>`,
    ];
    bgShape = corners.join('');
  }

  const textY = qrSize + padding * 2 + textAreaH / 2 + fontSize / 3;
  const textEl = style !== 'scan_me'
    ? `<text x="${totalWidth / 2}" y="${textY}" text-anchor="middle" font-family="Inter, sans-serif" font-size="${fontSize}" font-weight="700" fill="${textColor}" letter-spacing="1">${text}</text>`
    : `<text x="${totalWidth / 2}" y="${qrSize + padding * 2 + textAreaH / 2 + fontSize / 3}" text-anchor="middle" font-family="Inter, sans-serif" font-size="${fontSize}" font-weight="700" fill="${useColor}" letter-spacing="1">${text}</text>`;

  frameSVG = bgShape + textEl;
  return { wrapperOffset: padding, frameSVG, frameTextH: textAreaH, frameFullH: fullH, frameW: totalWidth };
}

// Build logo overlay SVG
function buildLogo(qrSize, logo) {
  if (!logo || !logo.dataUrl) return '';
  const logoSize = qrSize * (logo.sizeRatio || 0.22);
  const cx = qrSize / 2 - logoSize / 2;
  const cy = qrSize / 2 - logoSize / 2;
  const pad = logoSize * 0.12;
  const bgSize = logoSize + pad * 2;
  const bgX = cx - pad;
  const bgY = cy - pad;
  const rx = logo.shape === 'circle' ? bgSize / 2 : logo.shape === 'rounded' ? bgSize * 0.22 : 4;

  return `<rect x="${bgX}" y="${bgY}" width="${bgSize}" height="${bgSize}" rx="${rx}" fill="${logo.bgColor || '#ffffff'}"/>
<image href="${logo.dataUrl}" x="${cx}" y="${cy}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" clip-path="url(#logoClip)"/>
<defs><clipPath id="logoClip"><rect x="${cx}" y="${cy}" width="${logoSize}" height="${logoSize}" rx="${rx * 0.7}"/></clipPath></defs>`;
}

export function renderQRSVG(matrix, size, style) {
  const {
    fg = '#a78bfa',
    bg = '#0d0d1a',
    pixelShape = 'square',
    cornerShape = 'square',
    frame = null,
    logo = null,
  } = style;

  const n = matrix.length;
  const cellSize = size / n;

  const { def: gradDef, color: gradColor } = buildGradientDef(style, 'qrgrad');
  const fgColor = gradColor || fg;

  let pixelsSVG = '';
  let findersSVG = '';

  const finderPositions = [{ r: 0, c: 0 }, { r: 0, c: n - 7 }, { r: n - 7, c: 0 }];
  for (const { r, c } of finderPositions) {
    findersSVG += drawFinder(c * cellSize, r * cellSize, cellSize, cornerShape, fgColor, bg);
  }

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (isFinderRegion(r, c, n)) continue;
      if (matrix[r][c]) {
        pixelsSVG += drawPixel(c * cellSize, r * cellSize, cellSize, pixelShape, fgColor);
      }
    }
  }

  const logoSVG = buildLogo(size, logo);
  const { wrapperOffset, frameSVG, frameTextH = 0, frameFullH, frameW } = buildFrame(size, frame, fgColor);

  const hasFrame = frame && frame.style !== 'none' && frame.style !== 'scan_me';
  const hasScanMe = frame && frame.style === 'scan_me';
  const totalW = hasFrame ? (frameW || size + wrapperOffset * 2) : size;
  const totalH = hasFrame ? (frameFullH || size + wrapperOffset * 2 + frameTextH) : size;
  const offsetX = wrapperOffset;
  const offsetY = wrapperOffset;

  if (hasScanMe) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size + 40} ${size + 60}" width="${size + 40}" height="${size + 60}">
  <defs>${gradDef}</defs>
  <rect width="${size + 40}" height="${size + 60}" fill="${bg}"/>
  <g transform="translate(20,10)">${frameSVG}</g>
  <g transform="translate(20,10)">
    <rect width="${size}" height="${size}" fill="${bg}"/>
    ${pixelsSVG}${findersSVG}${logoSVG}
  </g>
</svg>`;
  }

  if (!hasFrame) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>${gradDef}</defs>
  <rect width="${size}" height="${size}" fill="${bg}"/>
  ${pixelsSVG}${findersSVG}${logoSVG}
</svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <defs>${gradDef}</defs>
  <rect width="${totalW}" height="${totalH}" fill="${bg}"/>
  ${frameSVG}
  <g transform="translate(${offsetX},${offsetY})">
    <rect width="${size}" height="${size}" fill="${bg}"/>
    ${pixelsSVG}${findersSVG}${logoSVG}
  </g>
</svg>`;
}
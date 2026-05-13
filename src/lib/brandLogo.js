// Brand logo applied permanently to all QR codes - cannot be removed
const LOGO_URL = 'https://media.base44.com/images/public/6a0448473bebffcc3578f3b8/202e09753_logo-phoenix-512.png';

let cachedDataUrl = null;

export async function getBrandLogoDataUrl() {
  if (cachedDataUrl) return cachedDataUrl;
  try {
    const res = await fetch(LOGO_URL);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        cachedDataUrl = e.target.result;
        resolve(cachedDataUrl);
      };
      reader.readAsDataURL(blob);
    });
  } catch {
    // fallback to direct URL if fetch fails
    return LOGO_URL;
  }
}

export const BRAND_LOGO_CONFIG = {
  sizeRatio: 0.22,
  shape: 'circle',
  bgColor: 'transparent',
  locked: true,
};
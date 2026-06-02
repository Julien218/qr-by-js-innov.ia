import { base44 } from '@/api/base44Client';

function trackClick(adName, adUrl) {
  base44.entities.AdClick.create({
    ad_name: adName,
    ad_url: adUrl,
    page: window.location.pathname,
    referrer: document.referrer || '',
    user_agent: navigator.userAgent.substring(0, 200),
  }).catch(() => {});
}

export default function PromotionBanner() {
  return (
    <div className="relative z-10 px-6 pb-12 text-center">
      <a
        href="https://www.jsinnovia.com"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick('Bannière JS-Innov.IA', 'https://www.jsinnovia.com')}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-violet-500/20 text-violet-300 text-sm font-medium hover:border-violet-500/40 transition-all"
      >
        🔥 Propulsé par <span className="gradient-text font-bold">JS-Innov.IA</span> — www.jsinnovia.com
      </a>
    </div>
  );
}
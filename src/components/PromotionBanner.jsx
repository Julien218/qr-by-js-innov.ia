import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, ExternalLink, Sparkles } from 'lucide-react';

export default function PromotionBanner() {
  const [promo, setPromo] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    base44.entities.AppPromotion.list()
      .then(items => {
        const active = items.find(p => p.isActive);
        if (active) setPromo(active);
      });
  }, []);

  if (!promo || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="max-w-2xl mx-auto glass-strong border border-violet-500/30 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl shadow-violet-500/10">
        <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
        <p className="text-sm text-white/90 flex-1 leading-tight">{promo.bannerText}</p>
        <a
          href={promo.promoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 text-violet-300 text-xs font-semibold transition-all shrink-0"
        >
          Découvrir <ExternalLink className="w-3 h-3" />
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-white transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
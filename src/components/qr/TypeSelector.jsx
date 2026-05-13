import { motion } from 'framer-motion';
import { Globe, Wifi, User, MessageSquare, Mail, QrCode, Phone, FileText } from 'lucide-react';

const types = [
  { id: 'url', icon: Globe, label: 'Site web', desc: 'URL de n\'importe quel site', color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/25' },
  { id: 'wifi', icon: Wifi, label: 'Wi-Fi', desc: 'Partager un réseau Wi-Fi', color: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/25' },
  { id: 'vcard', icon: User, label: 'vCard', desc: 'Carte de visite digitale', color: 'from-pink-500 to-rose-600', glow: 'shadow-pink-500/25' },
  { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp', desc: 'Messagerie directe', color: 'from-green-500 to-emerald-600', glow: 'shadow-green-500/25' },
  { id: 'email', icon: Mail, label: 'Email', desc: 'Ouvrir un email pré-rempli', color: 'from-orange-500 to-amber-600', glow: 'shadow-orange-500/25' },
  { id: 'sms', icon: Phone, label: 'SMS', desc: 'Envoyer un message SMS', color: 'from-teal-500 to-cyan-600', glow: 'shadow-teal-500/25' },
  { id: 'text', icon: FileText, label: 'Texte libre', desc: 'N\'importe quel texte', color: 'from-indigo-500 to-violet-600', glow: 'shadow-indigo-500/25' },
  { id: 'phone', icon: Phone, label: 'Téléphone', desc: 'Appel téléphonique direct', color: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/25' },
];

export default function TypeSelector({ selected, onSelect }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-grotesk font-bold text-white mb-2">Quel type de QR code ?</h2>
      <p className="text-muted-foreground mb-8">Choisissez le contenu que vous souhaitez partager</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {types.map((type, i) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            onClick={() => onSelect(type.id)}
            className={`
              relative p-5 rounded-2xl text-left transition-all duration-300 border group
              ${selected === type.id
                ? 'bg-white/8 border-violet-500/50 shadow-xl shadow-violet-500/20'
                : 'glass border-white/5 hover:border-white/15 hover:bg-white/6'
              }
            `}
          >
            {selected === type.id && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/5" />
            )}
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3 shadow-lg ${type.glow} group-hover:scale-105 transition-transform`}>
              <type.icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-semibold text-white text-sm mb-1">{type.label}</p>
            <p className="text-muted-foreground text-xs leading-relaxed">{type.desc}</p>
            {selected === type.id && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
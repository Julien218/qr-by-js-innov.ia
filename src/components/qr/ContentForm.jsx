import { motion } from 'framer-motion';

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all";
const labelClass = "block text-sm font-medium text-white/80 mb-2";

function Field({ label, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function ContentForm({ type, data, onChange }) {
  const set = (key, value) => onChange({ ...data, [key]: value });

  const forms = {
    url: (
      <Field label="URL du site web">
        <input className={inputClass} type="url" placeholder="https://example.com" value={data.url || ''} onChange={e => set('url', e.target.value)} />
      </Field>
    ),
    wifi: (
      <div className="space-y-4">
        <Field label="Nom du réseau (SSID)">
          <input className={inputClass} placeholder="Mon Wi-Fi" value={data.ssid || ''} onChange={e => set('ssid', e.target.value)} />
        </Field>
        <Field label="Mot de passe">
          <input className={inputClass} type="password" placeholder="••••••••" value={data.password || ''} onChange={e => set('password', e.target.value)} />
        </Field>
        <Field label="Type de sécurité">
          <select className={inputClass + " cursor-pointer"} value={data.security || 'WPA'} onChange={e => set('security', e.target.value)}>
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">Aucun</option>
          </select>
        </Field>
      </div>
    ),
    vcard: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom"><input className={inputClass} placeholder="Jean" value={data.firstname || ''} onChange={e => set('firstname', e.target.value)} /></Field>
          <Field label="Nom"><input className={inputClass} placeholder="Dupont" value={data.lastname || ''} onChange={e => set('lastname', e.target.value)} /></Field>
        </div>
        <Field label="Téléphone"><input className={inputClass} placeholder="+33 6 12 34 56 78" value={data.phone || ''} onChange={e => set('phone', e.target.value)} /></Field>
        <Field label="Email"><input className={inputClass} type="email" placeholder="jean@exemple.com" value={data.email || ''} onChange={e => set('email', e.target.value)} /></Field>
        <Field label="Entreprise"><input className={inputClass} placeholder="Ma Société" value={data.company || ''} onChange={e => set('company', e.target.value)} /></Field>
        <Field label="Site web"><input className={inputClass} placeholder="https://example.com" value={data.website || ''} onChange={e => set('website', e.target.value)} /></Field>
      </div>
    ),
    whatsapp: (
      <div className="space-y-4">
        <Field label="Numéro de téléphone (avec indicatif)">
          <input className={inputClass} placeholder="+33612345678" value={data.phone || ''} onChange={e => set('phone', e.target.value)} />
        </Field>
        <Field label="Message pré-rempli (optionnel)">
          <textarea className={inputClass + " h-24 resize-none"} placeholder="Bonjour, je vous contacte pour..." value={data.message || ''} onChange={e => set('message', e.target.value)} />
        </Field>
      </div>
    ),
    email: (
      <div className="space-y-4">
        <Field label="Adresse email"><input className={inputClass} type="email" placeholder="contact@exemple.com" value={data.email || ''} onChange={e => set('email', e.target.value)} /></Field>
        <Field label="Sujet (optionnel)"><input className={inputClass} placeholder="Sujet de l'email" value={data.subject || ''} onChange={e => set('subject', e.target.value)} /></Field>
        <Field label="Corps du message (optionnel)"><textarea className={inputClass + " h-24 resize-none"} placeholder="Votre message..." value={data.body || ''} onChange={e => set('body', e.target.value)} /></Field>
      </div>
    ),
    sms: (
      <div className="space-y-4">
        <Field label="Numéro de téléphone"><input className={inputClass} placeholder="+33612345678" value={data.phone || ''} onChange={e => set('phone', e.target.value)} /></Field>
        <Field label="Message (optionnel)"><textarea className={inputClass + " h-24 resize-none"} placeholder="Votre message SMS..." value={data.message || ''} onChange={e => set('message', e.target.value)} /></Field>
      </div>
    ),
    text: (
      <Field label="Texte libre">
        <textarea className={inputClass + " h-40 resize-none"} placeholder="Entrez votre texte ici..." value={data.text || ''} onChange={e => set('text', e.target.value)} />
      </Field>
    ),
    phone: (
      <Field label="Numéro de téléphone">
        <input className={inputClass} placeholder="+33612345678" value={data.phone || ''} onChange={e => set('phone', e.target.value)} />
      </Field>
    ),
  };

  return (
    <motion.div
      key={type}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl md:text-3xl font-grotesk font-bold text-white mb-2">Ajoutez votre contenu</h2>
      <p className="text-muted-foreground mb-8">Remplissez les informations pour générer votre QR code</p>
      <div className="max-w-lg">
        {forms[type] || forms.text}
      </div>
    </motion.div>
  );
}
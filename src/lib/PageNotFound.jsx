import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
      <div className="text-8xl font-bold gradient-text mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-2">Page introuvable</h1>
      <p className="text-muted-foreground mb-8">La page que vous cherchez n'existe pas.</p>
      <Link to="/" className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
        Retour à l'accueil
      </Link>
    </div>
  );
}

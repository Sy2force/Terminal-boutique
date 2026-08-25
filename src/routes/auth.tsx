import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createBrowserSupabase } from "@/shared/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const supabase = createBrowserSupabase();
  const [isLogin, setIsLogin] = useState(true);

  if (!supabase) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="card-luxe p-8 md:p-12 rounded-[2px] max-w-xl w-full text-center space-y-6">
          <p className="eyebrow">Authentification</p>
          <h1 className="font-display text-3xl md:text-4xl text-cream">Supabase n'est pas encore configuré</h1>
          <p className="text-muted-foreground font-light leading-relaxed">
            Pour activer les comptes clients et l'admin, renseignez les variables d'environnement Supabase dans un fichier <code className="text-gold">.env</code> à la racine du projet.
          </p>
          <ol className="text-left text-sm text-muted-foreground space-y-3 list-decimal list-inside">
            <li>Créez un projet sur <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a>.</li>
            <li>Copiez <code className="text-gold">.env.example</code> vers <code className="text-gold">.env</code>.</li>
            <li>Remplissez <code className="text-gold">SUPABASE_URL</code>, <code className="text-gold">SUPABASE_ANON_KEY</code> et <code className="text-gold">SUPABASE_SERVICE_ROLE_KEY</code> depuis Settings → API.</li>
            <li>Redémarrez le serveur.</li>
          </ol>
          <Link to="/" className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 text-[11px] uppercase tracking-[0.3em]">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else window.location.href = "/compte";
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) toast.error(error.message);
      else toast.success("Compte créé. Vérifiez votre e-mail si demandé.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl w-full items-center">
        <div className="hidden lg:block">
          <p className="eyebrow mb-6">Terminal 3</p>
          <h1 className="font-display text-5xl xl:text-6xl text-cream leading-[1.1] mb-8">
            L'art du bon goût
          </h1>
          <p className="text-muted-foreground font-light max-w-md">
            Connectez-vous pour enregistrer vos favoris, suivre vos commandes et recevoir nos offres privilèges.
          </p>
        </div>
        <form onSubmit={submit} className="card-luxe p-8 md:p-12 rounded-[2px] space-y-6 max-w-md mx-auto w-full">
          <h2 className="font-display text-3xl text-cream text-center">{isLogin ? "Connexion" : "Créer un compte"}</h2>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-input text-cream px-4 py-4 rounded-[2px] focus:outline-none focus:border-primary"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-input text-cream px-4 py-4 rounded-[2px] focus:outline-none focus:border-primary"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
          >
            {isLogin ? "Se connecter" : "Créer un compte"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary underline underline-offset-4 hover:text-cream transition-colors"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-primary transition-colors">
            Retour à l'accueil
          </Link>
        </form>
      </div>
    </main>
  );
}

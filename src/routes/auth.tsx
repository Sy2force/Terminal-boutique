import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createBrowserSupabase } from "@/shared/lib/supabase";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const supabase = createBrowserSupabase();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 6) {
      setError("Veuillez entrer un e-mail valide et un mot de passe d'au moins 6 caractères.");
      return;
    }
    setLoading(true);
    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken: undefined },
      });
      setLoading(false);
      if (signInError) setError(signInError.message);
      else window.location.href = "/compte";
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setLoading(false);
      if (signUpError) setError(signUpError.message);
      else toast.success("Compte créé. Vérifiez votre e-mail si demandé.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24 bg-noise">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="hidden lg:block space-y-6">
          <p className="eyebrow">Terminal 3</p>
          <h1 className="font-display text-5xl xl:text-6xl text-cream leading-[1.1]">
            L'art du bon goût
          </h1>
          <p className="text-muted-foreground font-light max-w-md text-lg">
            Connectez-vous pour enregistrer vos favoris, suivre vos commandes et recevoir nos offres privilèges.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="w-1 h-16 bg-primary" />
            <p className="text-sm text-muted-foreground font-light max-w-xs">
              Une cave et épicerie fine de luxe à Jérusalem. Vins, spiritueux, saumon fumé et charcuterie française.
            </p>
          </div>
        </div>
        <form onSubmit={submit} className="card-luxe p-6 sm:p-8 md:p-12 rounded-[2px] space-y-6 w-full max-w-md mx-auto glow-gold">
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl text-cream text-neon-gold">{isLogin ? "Connexion" : "Créer un compte"}</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
              {isLogin ? "Accédez à votre espace privilège" : "Rejoignez le cercle Terminal 3"}
            </p>
          </div>

          {error && (
            <div className="p-3 border border-destructive/40 bg-destructive/10 text-destructive-foreground text-sm rounded-[2px]">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full input-luxe pl-11 pr-4 py-4 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full input-luxe pl-11 pr-11 py-4 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <label className="flex items-center gap-3 text-muted-foreground text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              Rester connecté sur cet appareil
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-4 text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Chargement..."
            ) : (
              <>
                {isLogin ? "Se connecter" : "Créer un compte"} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
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

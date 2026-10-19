import { useState } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth';
import { Logo } from '../components/Logo';
import { toast } from '../components/Toast';
import { ArrowRight, Mail, Lock, User as UserIcon, Loader2, CheckCircle2 } from 'lucide-react';

type Mode = 'login' | 'signup';

export function AuthPage({ mode }: { mode: Mode }) {
  const { login, signup } = useAuth();
  const { navigate } = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const params = new URLSearchParams(window.location.search);
  const promptPrefill = params.get('prompt');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup(name, username, password);
        toast('success', 'Account created. Welcome to CodifyAI!');
      } else {
        await login(username, password);
        toast('success', 'Welcome back!');
      }
      navigate(promptPrefill ? `/dashboard?prompt=${encodeURIComponent(promptPrefill)}` : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-ink-950">
      {/* Left brand panel */}
      <div className="relative lg:w-1/2 overflow-hidden hidden lg:flex flex-col justify-between p-12">
        <div className="absolute inset-0 bg-radial-brand" />
        <div className="absolute inset-0 bg-grid-faint [background-size:44px_44px] opacity-30" />
        <div className="absolute -top-20 -right-10 w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-[120px]" />

        <Link to="/" className="relative">
          <Logo size={34} withText />
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-bold text-ink-100 leading-tight">
            {mode === 'signup' ? 'Start building apps with AI' : 'Welcome back to CodifyAI'}
          </h2>
          <p className="mt-4 text-ink-300 max-w-md leading-relaxed">
            Describe what you want. Watch it build in real time. Ship to production — all from your browser.
          </p>
          <ul className="mt-8 space-y-3">
            {['AI builds full-stack apps from prompts', 'Live preview as code is generated', 'Invite your team and build together'].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-ink-200">
                <CheckCircle2 size={18} className="text-brand-400 shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-ink-500">© 2026 CodifyAI</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-radial-glow lg:hidden" />
        <div className="relative w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size={36} withText />
          </div>
          <h1 className="text-2xl font-bold text-ink-100">
            {mode === 'signup' ? 'Create your account' : 'Log in to CodifyAI'}
          </h1>
          <p className="mt-2 text-sm text-ink-400">
            {mode === 'signup' ? 'Free to start. No credit card required.' : 'Welcome back. Pick up where you left off.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="label">Name</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input pl-10"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={30}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="you@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-danger-500/10 border border-danger-500/30 px-3.5 py-2.5 text-sm text-danger-400">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Please wait…</>
              ) : (
                <>{mode === 'signup' ? 'Create account' : 'Log in'} <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-400">
            {mode === 'signup' ? (
              <>Already have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Log in</Link></>
            ) : (
              <>Don't have an account? <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">Sign up</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth';
import { Logo } from './Logo';
import { Avatar, AvatarGroup } from './Avatar';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';

export function SiteHeader() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = (
    <>
      <a href="#features" className="text-sm text-ink-300 hover:text-ink-100 transition">Features</a>
      <a href="#showcase" className="text-sm text-ink-300 hover:text-ink-100 transition">Showcase</a>
      <a href="#pricing" className="text-sm text-ink-300 hover:text-ink-100 transition">Pricing</a>
      <a href="#faq" className="text-sm text-ink-300 hover:text-ink-100 transition">FAQ</a>
    </>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass border-b border-ink-700/60' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={30} withText />
        </Link>

        <nav className="hidden md:flex items-center gap-7">{navLinks}</nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-secondary px-3.5 py-2 text-sm">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Avatar user={user} onLogout={() => { logout(); navigate('/'); }} />
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost px-3.5 py-2 text-sm">Log in</Link>
              <Link to="/signup" className="btn-primary px-4 py-2 text-sm">Get started</Link>
            </>
          )}
        </div>

        <button
          className="md:hidden btn-ghost rounded-lg p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-ink-700/60 animate-fade-in">
          <div className="px-5 py-5 flex flex-col gap-4">
            {navLinks}
            <div className="h-px bg-ink-700/60" />
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn-secondary py-2 text-sm">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}
                  className="btn-ghost py-2 text-sm justify-start"
                >
                  <LogOut size={16} /> Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline py-2 text-sm">Log in</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary py-2 text-sm">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-800/80 bg-ink-950">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo size={30} withText />
            <p className="mt-4 max-w-sm text-sm text-ink-400 leading-relaxed">
              CodifyAI turns plain-English prompts into full-stack web apps. Build, preview, and ship — all in one place.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink-200 mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-ink-400">
              <li><a href="#features" className="hover:text-ink-100 transition">Features</a></li>
              <li><a href="#pricing" className="hover:text-ink-100 transition">Pricing</a></li>
              <li><a href="#showcase" className="hover:text-ink-100 transition">Showcase</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink-200 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-ink-400">
              <li><a href="#faq" className="hover:text-ink-100 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-ink-100 transition">Privacy</a></li>
              <li><a href="#" className="hover:text-ink-100 transition">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-ink-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-500">© 2026 CodifyAI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-400 animate-pulse-glow" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}


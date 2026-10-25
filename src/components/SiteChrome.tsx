import { useEffect, useState } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth';
import { Logo } from './Logo';
import { Avatar } from './Avatar';
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
      <a href="#features" className="text-sm text-charcoal-700 hover:text-charcoal-400 transition-colors">Features</a>
      <a href="#showcase" className="text-sm text-charcoal-700 hover:text-charcoal-400 transition-colors">Showcase</a>
      <a href="#pricing" className="text-sm text-charcoal-700 hover:text-charcoal-400 transition-colors">Pricing</a>
      <a href="#faq" className="text-sm text-charcoal-700 hover:text-charcoal-400 transition-colors">FAQ</a>
    </>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-cream-100/80 backdrop-blur-md border-b border-cream-200' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={30} withText />
        </Link>

        <nav className="hidden md:flex items-center gap-7">{navLinks}</nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-ghost px-3.5 py-2 text-sm">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Avatar user={user} onLogout={() => { logout(); navigate('/'); }} />
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline px-3.5 py-2 text-sm">Log in</Link>
              <Link to="/signup" className="btn-dark px-4 py-2 text-sm">Get started</Link>
            </>
          )}
        </div>

        <button
          className="md:hidden btn-ghost rounded-md p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-cream-100/95 backdrop-blur-md border-t border-cream-200 animate-fade-in">
          <div className="px-5 py-5 flex flex-col gap-4">
            {navLinks}
            <div className="h-px bg-cream-200" />
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn-ghost py-2 text-sm">
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
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-dark py-2 text-sm">Get started</Link>
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
    <footer className="border-t border-cream-200 bg-cream-100">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo size={30} withText />
            <p className="mt-4 max-w-sm text-sm text-charcoal-400 leading-relaxed">
              CodifyAI turns plain-English prompts into full-stack web apps. Build, preview, and ship, all in one place.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-charcoal-700 mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-charcoal-400">
              <li><a href="#features" className="link-underline">Features</a></li>
              <li><a href="#pricing" className="link-underline">Pricing</a></li>
              <li><a href="#showcase" className="link-underline">Showcase</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-charcoal-700 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-charcoal-400">
              <li><a href="#faq" className="link-underline">FAQ</a></li>
              <li><a href="#" className="link-underline">Privacy</a></li>
              <li><a href="#" className="link-underline">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-charcoal-400">© 2026 CodifyAI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-charcoal-400">
            <span className="inline-block w-2 h-2 rounded-full bg-charcoal-400 animate-pulse-soft" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

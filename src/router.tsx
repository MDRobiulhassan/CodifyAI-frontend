import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface RouterContextValue {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

export function getSafeReturnTo(value: string | null): string | null {
  if (!value || value.length > 2048 || !value.startsWith('/') || value.startsWith('//')) return null;
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    if (/^\/projects\/\d+$/.test(url.pathname) || url.pathname === '/account') return url.pathname;
    if (url.pathname === '/dashboard') {
      const prompt = url.searchParams.get('prompt')?.slice(0, 1000);
      return prompt ? `/dashboard?prompt=${encodeURIComponent(prompt)}` : '/dashboard';
    }
  } catch {
    return null;
  }
  return null;
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname + window.location.search);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname + window.location.search);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

export function Link({ to, children, className, onClick }: { to: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

/** Parse a path like "/projects/12" into segments. */
export function useRoute(): { path: string; segments: string[]; query: URLSearchParams } {
  const { path } = useRouter();
  const [pathname, search] = path.split('?');
  const segments = pathname.split('/').filter(Boolean);
  return { path, segments, query: new URLSearchParams(search ?? '') };
}

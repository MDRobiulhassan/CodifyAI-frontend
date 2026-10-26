import { useEffect } from 'react';
import { AuthProvider, useAuth } from './auth';
import { RouterProvider, useRouter, useRoute, getSafeReturnTo } from './router';
import { ToastProvider } from './components/Toast';
import { LoadingScreen } from './components/Spinner';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { PricingPage } from './pages/PricingPage';
import { AccountPage } from './pages/AccountPage';

function Routes() {
  const { user, loading } = useAuth();
  const { segments, path } = useRoute();
  const { navigate } = useRouter();

  // Redirect away from auth pages when already logged in
  useEffect(() => {
    if (user && (path === '/login' || path === '/signup')) {
      const returnTo = getSafeReturnTo(new URLSearchParams(window.location.search).get('returnTo'));
      navigate(returnTo || '/dashboard');
    }
  }, [user, path, navigate]);

  useEffect(() => {
    if (!loading && !user && path !== '/' && path !== '/login' && path !== '/signup' && path !== '/pricing') {
      const returnTo = getSafeReturnTo(window.location.pathname + window.location.search) || '/dashboard';
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    }
  }, [loading, user, path, navigate]);

  if (loading) return <LoadingScreen label="Loading CodifyAI…" />;

  // Public routes
  if (path === '/' || path === '') return <LandingPage />;
  if (path === '/login') return <AuthPage mode="login" />;
  if (path === '/signup') return <AuthPage mode="signup" />;
  if (path === '/pricing') return <PricingPage />;

  // Protected routes
  if (!user) {
    return <AuthPage mode="login" />;
  }

  if (path === '/dashboard') return <DashboardPage />;
  if (path === '/account') return <AccountPage />;
  if (segments[0] === 'projects' && segments[1]) {
    const id = Number(segments[1]);
    if (!Number.isNaN(id)) return <EditorPage projectId={id} />;
  }

  // Fallback
  return <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <ToastProvider>
          <Routes />
        </ToastProvider>
      </RouterProvider>
    </AuthProvider>
  );
}

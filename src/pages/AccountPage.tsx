import { useEffect, useState } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth';
import { api } from '../api';
import type { Subscription, Usage } from '../types';
import { Logo } from '../components/Logo';
import { Avatar } from '../components/Avatar';
import { CenterSpinner } from '../components/Spinner';
import { toast } from '../components/Toast';
import { ArrowLeft, CreditCard, Zap, TrendingUp, Mail, User as UserIcon, Loader2 } from 'lucide-react';

export function AccountPage() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getSubscription().catch(() => null),
      api.getTodayUsage().catch(() => null),
    ]).then(([s, u]) => { setSubscription(s); setUsage(u); setLoading(false); });
  }, []);

  const usagePct = usage ? Math.min(100, (usage.messagesUsed / Math.max(1, usage.messageLimit)) * 100) : 0;

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="sticky top-0 z-30 bg-cream-100/80 backdrop-blur-md border-b border-cream-200">
        <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><Logo size={30} withText /></Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-ghost px-3 py-2 text-sm">Dashboard</Link>
            {user && <Avatar user={user} onLogout={() => { logout(); navigate('/'); }} />}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-charcoal-700 mb-6">
          <ArrowLeft size={15} /> Back to dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-charcoal-700 tracking-tight">Account</h1>
        <p className="text-charcoal-400 text-sm mt-1">Manage your profile, usage, and billing.</p>

        {loading ? (
          <CenterSpinner />
        ) : (
          <div className="mt-8 space-y-5">
            <Section title="Profile" icon={UserIcon}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name" value={user?.name} />
                <Field label="Email" value={user?.username} icon={Mail} />
              </div>
            </Section>

            {usage && (
              <Section title="Today's usage" icon={TrendingUp}>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-charcoal-600">Messages</span>
                      <span className="text-charcoal-400">{usage.messagesUsed} / {usage.messageLimit}</span>
                    </div>
                    <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
                      <div className="h-full bg-charcoal-700 transition-all" style={{ width: `${usagePct}%` }} />
                    </div>
                  </div>
                  {usage.projectLimit != null && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-charcoal-600">Projects</span>
                      <span className="text-charcoal-400">{usage.projectsUsed ?? 0} / {usage.projectLimit}</span>
                    </div>
                  )}
                </div>
              </Section>
            )}

            <Section title="Billing" icon={CreditCard}>
              {subscription ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-charcoal-700">Current plan: {subscription.planName}</p>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      Status: <span className="capitalize">{subscription.status}</span>
                      {subscription.currentPeriodEnd && ` · renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      setPortalLoading(true);
                      try { const res = await api.openPortal(); if (res.url) window.location.href = res.url; }
                      catch { toast('error', 'Could not open billing portal.'); }
                      finally { setPortalLoading(false); }
                    }}
                    className="btn-outline px-4 py-2 text-sm"
                  >
                    {portalLoading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />} Manage billing
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-sm text-charcoal-400">You're on the free plan. Upgrade for more power.</p>
                  <Link to="/pricing" className="btn-dark px-4 py-2 text-sm">View plans</Link>
                </div>
              )}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof UserIcon; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold text-charcoal-700 flex items-center gap-2 mb-4">
        <Icon size={16} className="text-charcoal-500" /> {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, value, icon: Icon }: { label: string; value?: string; icon?: typeof Mail }) {
  return (
    <div>
      <p className="text-xs text-charcoal-400 mb-1">{label}</p>
      <div className="flex items-center gap-2 text-sm text-charcoal-700">
        {Icon && <Icon size={14} className="text-charcoal-400" />}
        {value || '—'}
      </div>
    </div>
  );
}

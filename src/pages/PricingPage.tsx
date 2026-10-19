import { useEffect, useState } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth';
import { api } from '../api';
import type { Plan, Subscription } from '../types';
import { Logo } from '../components/Logo';
import { Avatar } from '../components/Avatar';
import { toast } from '../components/Toast';
import { CenterSpinner } from '../components/Spinner';
import { CheckCircle2, ArrowLeft, Sparkles, Loader2, CreditCard, Zap } from 'lucide-react';

export function PricingPage() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutId, setCheckoutId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      api.getPlans().catch(() => []),
      user ? api.getSubscription().catch(() => null) : Promise.resolve(null),
    ]).then(([p, s]) => {
      setPlans(Array.isArray(p) ? p : []);
      setSubscription(s);
      setLoading(false);
    });
  }, [user]);

  const handleCheckout = async (planId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCheckoutId(planId);
    try {
      const res = await api.createCheckout({ planId });
      if (res.url) {
        window.location.href = res.url;
      } else {
        toast('success', 'Subscription updated.');
        navigate('/dashboard');
      }
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Checkout failed.');
    } finally {
      setCheckoutId(null);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="sticky top-0 z-30 glass border-b border-ink-700/60">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><Logo size={30} withText /></Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-ghost px-3 py-2 text-sm hidden sm:flex">Dashboard</Link>
            {user ? (
              <Avatar user={user} onLogout={() => { logout(); navigate('/'); }} />
            ) : (
              <>
                <Link to="/login" className="btn-ghost px-3 py-2 text-sm">Log in</Link>
                <Link to="/signup" className="btn-primary px-4 py-2 text-sm">Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-brand pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-5 py-16">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-200 mb-8">
            <ArrowLeft size={15} /> Back home
          </Link>
          <div className="text-center max-w-2xl mx-auto">
            <span className="chip bg-brand-400/10 text-brand-300 border border-brand-400/20 mb-4">
              <Sparkles size={13} /> Pricing
            </span>
            <h1 className="text-4xl font-bold text-ink-100 tracking-tight">Plans for every builder</h1>
            <p className="mt-4 text-ink-400">Start free. Upgrade when you need more power. Cancel anytime.</p>
          </div>

          {loading ? (
            <CenterSpinner label="Loading plans…" />
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {plans.length > 0 ? (
                plans.map((plan) => {
                  const isCurrent = subscription?.planId === plan.id;
                  const popular = plan.popular;
                  return (
                    <div
                      key={plan.id}
                      className={`card p-6 relative flex flex-col ${popular ? 'border-brand-400/40 shadow-glow' : ''}`}
                    >
                      {popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip bg-brand-400 text-ink-950 font-semibold">
                          Most popular
                        </span>
                      )}
                      <h3 className="text-lg font-semibold text-ink-100">{plan.name}</h3>
                      <div className="mt-3 flex items-end gap-1">
                        <span className="text-4xl font-extrabold text-ink-100">
                          ${plan.price}
                        </span>
                        <span className="text-sm text-ink-400 mb-1">/{plan.interval || 'mo'}</span>
                      </div>
                      <ul className="mt-6 space-y-3 flex-1">
                        {(plan.features || []).map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-ink-300">
                            <CheckCircle2 size={16} className="text-brand-400 shrink-0 mt-0.5" /> {f}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleCheckout(plan.id)}
                        disabled={isCurrent || checkoutId === plan.id}
                        className={`mt-7 w-full py-2.5 text-sm ${isCurrent ? 'btn-secondary' : popular ? 'btn-primary' : 'btn-outline'}`}
                      >
                        {isCurrent ? (
                          <><CheckCircle2 size={15} /> Current plan</>
                        ) : checkoutId === plan.id ? (
                          <><Loader2 size={15} className="animate-spin" /> Redirecting…</>
                        ) : (
                          <>Choose {plan.name}</>
                        )}
                      </button>
                    </div>
                  );
                })
              ) : (
                /* Fallback if API not reachable */
                <>
                  {[
                    { id: 1, name: 'Free', price: 0, interval: 'mo', features: ['5 projects', '50 messages / day', 'Live preview'], popular: false },
                    { id: 2, name: 'Pro', price: 20, interval: 'mo', features: ['Unlimited projects', '500 messages / day', 'Team collaboration', 'Priority support'], popular: true },
                    { id: 3, name: 'Team', price: 50, interval: 'mo', features: ['Everything in Pro', '2,000 messages / day', 'Unlimited members', 'SSO & audit logs'], popular: false },
                  ].map((plan) => (
                    <div key={plan.id} className={`card p-6 relative flex flex-col ${plan.popular ? 'border-brand-400/40 shadow-glow' : ''}`}>
                      {plan.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip bg-brand-400 text-ink-950 font-semibold">Most popular</span>
                      )}
                      <h3 className="text-lg font-semibold text-ink-100">{plan.name}</h3>
                      <div className="mt-3 flex items-end gap-1">
                        <span className="text-4xl font-extrabold text-ink-100">${plan.price}</span>
                        <span className="text-sm text-ink-400 mb-1">/{plan.interval}</span>
                      </div>
                      <ul className="mt-6 space-y-3 flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-ink-300">
                            <CheckCircle2 size={16} className="text-brand-400 shrink-0 mt-0.5" /> {f}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleCheckout(plan.id)}
                        className={`mt-7 w-full py-2.5 text-sm ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                      >
                        Choose {plan.name}
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Manage subscription */}
          {user && subscription && (
            <div className="mt-10 max-w-2xl mx-auto card p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-400/10 text-brand-400 grid place-items-center">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-100">Current plan: {subscription.planName}</p>
                  <p className="text-xs text-ink-400">Status: {subscription.status}</p>
                </div>
              </div>
              <ManagePortalButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ManagePortalButton() {
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={async () => {
        setLoading(true);
        try {
          const res = await api.openPortal();
          if (res.url) window.location.href = res.url;
        } catch {
          toast('error', 'Could not open billing portal.');
        } finally {
          setLoading(false);
        }
      }}
      className="btn-outline px-4 py-2 text-sm"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />} Manage billing
    </button>
  );
}

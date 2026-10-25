import { useEffect, useState } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth';
import { api } from '../api';
import type { Plan, Subscription } from '../types';
import { Logo } from '../components/Logo';
import { Avatar } from '../components/Avatar';
import { toast } from '../components/Toast';
import { CenterSpinner } from '../components/Spinner';
import { Check, Loader2, ArrowRight } from 'lucide-react';

const fallbackPlans: Plan[] = [
  { id: 1, name: 'Free', price: 0, interval: 'month', features: ['5 projects', '50 messages per day', 'Live preview'] },
  { id: 2, name: 'Pro', price: 20, interval: 'month', features: ['Unlimited projects', '500 messages per day', 'Team collaboration', 'Priority support'], popular: true },
  { id: 3, name: 'Team', price: 50, interval: 'month', features: ['Everything in Pro', '2,000 messages per day', 'Unlimited members', 'Team support'] },
];

export function PricingPage() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutId, setCheckoutId] = useState<number | null>(null);
  useEffect(() => { Promise.all([api.getPlans().catch(() => []), user ? api.getSubscription().catch(() => null) : Promise.resolve(null)]).then(([remotePlans, current]) => { setPlans(remotePlans.length ? remotePlans : fallbackPlans); setSubscription(current); setLoading(false); }); }, [user]);
  const checkout = async (planId: number) => { if (!user) { navigate('/login'); return; } setCheckoutId(planId); try { const response = await api.createCheckout({ planId }); if (response.url) window.location.href = response.url; } catch (error) { toast('error', error instanceof Error ? error.message : 'Checkout failed.'); } finally { setCheckoutId(null); } };
  return <div className="min-h-screen bg-[#171717] text-white"><header className="border-b border-white/10 bg-[#171717]/90"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8"><Link to="/"><Logo size={30} withText variant="light" /></Link><div className="flex items-center gap-3">{user ? <><Link to="/dashboard" className="rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white">Workspace</Link><Avatar user={user} onLogout={() => { logout(); navigate('/'); }} /></> : <><Link to="/login" className="rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white">Log in</Link><Link to="/signup" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#171717]">Get started</Link></>}</div></div></header><main className="mx-auto max-w-6xl px-5 py-20 lg:px-8"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-medium text-blue-300">Pricing</p><h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Choose your build speed.</h1><p className="mt-5 text-lg text-white/50">Start with the tools you need today. Upgrade as your projects grow.</p></div>{loading ? <CenterSpinner label="Loading plans..." /> : <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">{plans.map((plan) => <div key={plan.id} className={`relative flex flex-col rounded-2xl border p-6 ${plan.popular ? 'border-blue-400/70 bg-[#242424] shadow-[0_0_45px_rgba(59,130,246,0.14)]' : 'border-white/10 bg-[#202020]'}`}>{plan.popular && <span className="absolute -top-3 left-6 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium">Most popular</span>}<h2 className="text-xl font-medium">{plan.name}</h2><div className="mt-5"><span className="text-5xl font-semibold">${plan.price}</span><span className="text-sm text-white/45"> / {plan.interval || 'month'}</span></div><ul className="mt-8 flex-1 space-y-4">{plan.features.map((feature) => <li key={feature} className="flex gap-3 text-sm text-white/65"><Check size={16} className="mt-0.5 shrink-0 text-blue-300" />{feature}</li>)}</ul><button onClick={() => checkout(plan.id)} disabled={checkoutId === plan.id} className={`mt-8 flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium ${plan.popular ? 'bg-white text-[#171717]' : 'border border-white/20 text-white hover:bg-white/10'}`}>{checkoutId === plan.id ? <Loader2 size={16} className="animate-spin" /> : user && subscription?.planId === plan.id ? 'Current plan' : `Choose ${plan.name}`}<ArrowRight size={15} className="ml-2" /></button></div>)}</div>}</main></div>;
}

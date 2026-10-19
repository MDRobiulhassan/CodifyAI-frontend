import { useEffect, useState } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';
import { toast } from '../components/Toast';
import {
  ArrowRight, Sparkles, Zap, Code2, Eye, GitBranch, Users, Rocket,
  CheckCircle2, ChevronDown, MessageSquare, Layers, Globe, Shield,
} from 'lucide-react';

const STARTER_PROMPTS = [
  'A SaaS dashboard for tracking subscriptions',
  'A portfolio site for a photographer',
  'An AI-powered recipe finder',
  'A habit tracker with streaks',
  'A landing page for a coffee shop',
  'A Kanban board with drag and drop',
];

const SHOWCASE = [
  { title: 'SaaS Analytics', tag: 'Dashboard', gradient: 'from-brand-500/30 to-ink-800' },
  { title: 'Nimbus Store', tag: 'E-commerce', gradient: 'from-accent-400/25 to-ink-800' },
  { title: 'Folio', tag: 'Portfolio', gradient: 'from-warn-400/20 to-ink-800' },
  { title: 'TaskFlow', tag: 'Productivity', gradient: 'from-brand-400/25 to-ink-800' },
  { title: 'Brewly', tag: 'Landing', gradient: 'from-danger-400/20 to-ink-800' },
  { title: 'InsightAI', tag: 'AI App', gradient: 'from-brand-300/20 to-ink-800' },
];

const FAQ = [
  { q: 'What is CodifyAI?', a: 'CodifyAI is an AI-powered platform that builds full-stack web applications from natural-language descriptions. You describe what you want, and the AI generates the code, previews it live, and lets you iterate through chat.' },
  { q: 'Do I need to know how to code?', a: 'No. You describe your app in plain English and CodifyAI handles the rest. The code is yours to export or deploy whenever you like.' },
  { q: 'Can I collaborate with my team?', a: 'Yes. Every project supports members with OWNER, EDITOR, or VIEWER roles, so you can invite collaborators and build together.' },
  { q: 'What plans are available?', a: 'We offer a free tier to get started plus paid plans with higher message and project limits. See the pricing section for details.' },
  { q: 'Can I deploy my app?', a: 'Yes — apps built with CodifyAI can be previewed live in the editor and deployed when ready.' },
];

export function LandingPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [prompt, setPrompt] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPlaceholderIdx((i) => (i + 1) % STARTER_PROMPTS.length), 3500);
    return () => clearInterval(id);
  }, []);

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handlePromptSubmit = () => {
    if (!prompt.trim()) {
      toast('info', 'Describe your app idea to get started.');
      return;
    }
    if (user) {
      navigate(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
    } else {
      navigate(`/signup?prompt=${encodeURIComponent(prompt)}`);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-radial-brand pointer-events-none" />
        <div className="absolute inset-0 bg-grid-faint [background-size:44px_44px] opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 chip bg-brand-400/10 text-brand-300 border border-brand-400/20 mb-6 animate-fade-up">
            <Sparkles size={13} /> Now with live preview & team collaboration
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ink-100 leading-[1.05] animate-fade-up" style={{ animationDelay: '60ms' }}>
            Build full-stack apps
            <br />
            with a single <span className="gradient-text">prompt</span>
          </h1>
          <p className="mt-6 text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '120ms' }}>
            CodifyAI turns plain English into production-ready web apps. Describe your idea, watch it build in real time, and ship — no code required.
          </p>

          {/* Prompt box */}
          <div className="mt-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '180ms' }}>
            <div className="card shadow-panel p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-brand-400/40 transition">
              <div className="pl-3 text-brand-400">
                <Sparkles size={20} />
              </div>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePromptSubmit()}
                placeholder={STARTER_PROMPTS[placeholderIdx]}
                className="flex-1 bg-transparent border-0 outline-none text-ink-100 placeholder:text-ink-400 py-3 text-sm sm:text-base"
              />
              <button onClick={handlePromptSubmit} className="btn-primary px-4 py-2.5 text-sm shrink-0">
                Build <ArrowRight size={16} />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {STARTER_PROMPTS.slice(0, 3).map((p) => (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  className="chip bg-ink-800/70 text-ink-300 border border-ink-700/60 hover:border-brand-400/40 hover:text-ink-100 transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-5 text-xs text-ink-400 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-brand-400" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-brand-400" /> Free to start</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-brand-400" /> Export your code</span>
          </div>
        </div>

        {/* Mock editor preview */}
        <div className="relative mx-auto max-w-6xl px-5 mt-16 animate-fade-up" style={{ animationDelay: '360ms' }}>
          <EditorMock />
        </div>
      </section>

      {/* Logos / social proof */}
      <section className="border-y border-ink-800/70 bg-ink-900/40 py-10">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs uppercase tracking-widest text-ink-400 mb-6">
            Trusted by builders at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {['Northwind', 'Acme', 'Vertex', 'Lumen', 'Quanta', 'Hyperloop'].map((n) => (
              <span key={n} className="text-lg font-semibold text-ink-200 tracking-tight">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to build"
            subtitle="A complete AI development environment in your browser — from first prompt to deployed app."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <FeatureCard icon={MessageSquare} title="Chat to build" desc="Describe changes in plain English. The AI edits your project and shows the result instantly." />
            <FeatureCard icon={Eye} title="Live preview" desc="See your app update in real time as the AI writes code. No refresh, no waiting." />
            <FeatureCard icon={Code2} title="Full source access" desc="Browse every file the AI creates. Clean, readable code you own and can export." />
            <FeatureCard icon={Users} title="Team collaboration" desc="Invite teammates with role-based access. Build together, review together." />
            <FeatureCard icon={Layers} title="Full-stack by default" desc="Frontend, backend, database — all generated and wired up automatically." />
            <FeatureCard icon={Rocket} title="One-click deploy" desc="Go from preview to production in a click. Your app, live on the internet." />
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section id="showcase" className="py-24 bg-ink-900/40 border-y border-ink-800/70">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="Showcase"
            title="Built with CodifyAI"
            subtitle="Real apps generated from a single prompt by our community."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE.map((s) => (
              <div key={s.title} className="group card overflow-hidden hover:border-brand-400/30 transition cursor-pointer">
                <div className={`h-44 bg-gradient-to-br ${s.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid-faint [background-size:24px_24px] opacity-50" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="chip bg-ink-950/60 text-ink-200 backdrop-blur-sm">{s.tag}</span>
                    <ArrowRight size={18} className="text-ink-300 group-hover:text-brand-400 group-hover:translate-x-1 transition" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-ink-100">{s.title}</h3>
                  <p className="text-xs text-ink-400 mt-1">Generated in one prompt</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="How it works"
            title="From idea to app in three steps"
            subtitle="No setup, no boilerplate. Just describe and build."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { n: '01', icon: Sparkles, title: 'Describe your app', desc: 'Type what you want to build in plain English. Be as detailed or as vague as you like.' },
              { n: '02', icon: Zap, title: 'AI builds it live', desc: 'CodifyAI generates the code, sets up the project, and shows a live preview as it works.' },
              { n: '03', icon: Rocket, title: 'Iterate & ship', desc: 'Refine through chat, invite your team, and deploy when your app is ready.' },
            ].map((step) => (
              <div key={step.n} className="card p-6 relative overflow-hidden group hover:border-brand-400/30 transition">
                <div className="absolute -top-4 -right-2 text-7xl font-extrabold text-ink-800/70 select-none">{step.n}</div>
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-brand-400/10 text-brand-400 grid place-items-center mb-4">
                    <step.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-ink-100 text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section id="pricing" className="py-24 bg-ink-900/40 border-y border-ink-800/70">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="Pricing"
            title="Start free. Scale when you grow."
            subtitle="Simple, transparent plans. No hidden fees."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { name: 'Free', price: '$0', features: ['5 projects', '50 messages / day', 'Live preview', 'Community support'], cta: 'Get started', highlight: false },
              { name: 'Pro', price: '$20', features: ['Unlimited projects', '500 messages / day', 'Team collaboration', 'Priority support', 'Custom domains'], cta: 'Start Pro', highlight: true },
              { name: 'Team', price: '$50', features: ['Everything in Pro', '2,000 messages / day', 'Unlimited members', 'SSO & audit logs', 'Dedicated support'], cta: 'Start Team', highlight: false },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`card p-6 relative ${plan.highlight ? 'border-brand-400/40 shadow-glow' : ''}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip bg-brand-400 text-ink-950 font-semibold">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-ink-100">{plan.name}</h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-ink-100">{plan.price}</span>
                  <span className="text-sm text-ink-400 mb-1">/mo</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-ink-300">
                      <CheckCircle2 size={16} className="text-brand-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleStart}
                  className={`mt-7 w-full ${plan.highlight ? 'btn-primary' : 'btn-outline'} py-2.5 text-sm`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-5">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
          <div className="mt-12 space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-ink-100">{item.q}</span>
                  <ChevronDown size={18} className={`text-ink-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-ink-400 leading-relaxed animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-5">
          <div className="relative card overflow-hidden p-12 text-center">
            <div className="absolute inset-0 bg-radial-brand opacity-60" />
            <div className="relative">
              <Shield className="mx-auto text-brand-400 mb-4" size={32} />
              <h2 className="text-3xl font-bold text-ink-100">Ready to build something?</h2>
              <p className="mt-3 text-ink-300 max-w-md mx-auto">
                Join thousands of builders using CodifyAI to turn ideas into apps.
              </p>
              <button onClick={handleStart} className="mt-8 btn-primary px-6 py-3 text-base">
                Start building free <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <span className="chip bg-brand-400/10 text-brand-300 border border-brand-400/20 mb-4">{eyebrow}</span>
      <h2 className="text-3xl sm:text-4xl font-bold text-ink-100 tracking-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-ink-400 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: typeof Zap; title: string; desc: string }) {
  return (
    <div className="card p-6 hover:border-brand-400/30 transition group">
      <div className="w-11 h-11 rounded-xl bg-brand-400/10 text-brand-400 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
        <Icon size={22} />
      </div>
      <h3 className="font-semibold text-ink-100 text-lg">{title}</h3>
      <p className="mt-2 text-sm text-ink-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function EditorMock() {
  return (
    <div className="card shadow-panel overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-11 border-b border-ink-700/60 bg-ink-900/60">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-danger-500/70" />
          <span className="w-3 h-3 rounded-full bg-warn-500/70" />
          <span className="w-3 h-3 rounded-full bg-brand-500/70" />
        </div>
        <div className="ml-3 flex items-center gap-2 text-xs text-ink-400">
          <Globe size={12} /> codifyai.app/preview
        </div>
      </div>
      <div className="grid grid-cols-12 h-[420px]">
        {/* Chat */}
        <div className="col-span-5 border-r border-ink-700/60 flex flex-col">
          <div className="px-4 py-2.5 border-b border-ink-700/60 text-xs font-medium text-ink-300 flex items-center gap-2">
            <MessageSquare size={13} className="text-brand-400" /> Chat
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-hidden scrollbar-thin">
            <div className="flex justify-end">
              <div className="bg-brand-400/15 text-ink-100 rounded-2xl rounded-tr-sm px-3.5 py-2 text-xs max-w-[85%]">
                Build a habit tracker with streaks
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-ink-800 text-ink-200 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs max-w-[85%]">
                On it! I'll create a habit tracker with daily streaks, a calendar view, and local storage persistence.
                <span className="inline-block w-1.5 h-3.5 bg-brand-400 ml-1 align-middle animate-blink" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-400 pl-1">
              <GitBranch size={12} className="text-brand-400" /> Generating files…
            </div>
          </div>
          <div className="p-3 border-t border-ink-700/60">
            <div className="bg-ink-800 rounded-lg px-3 py-2 text-xs text-ink-400 flex items-center justify-between">
              Ask for a change… <span className="text-brand-400 font-semibold">Send</span>
            </div>
          </div>
        </div>
        {/* Preview */}
        <div className="col-span-7 flex flex-col">
          <div className="flex items-center gap-1 px-3 h-9 border-b border-ink-700/60 text-xs">
            <button className="px-2.5 py-1 rounded-md bg-ink-800 text-ink-100 flex items-center gap-1.5"><Eye size={12} /> Preview</button>
            <button className="px-2.5 py-1 rounded-md text-ink-400 hover:text-ink-200 flex items-center gap-1.5"><Code2 size={12} /> Code</button>
          </div>
          <div className="flex-1 bg-ink-950 p-5 overflow-hidden">
            <div className="rounded-xl bg-ink-900/70 border border-ink-700/60 p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-ink-100 text-sm">Today's Habits</h4>
                <span className="chip bg-brand-400/10 text-brand-300 text-[10px]">7 day streak</span>
              </div>
              <div className="space-y-2.5">
                {['Read 20 min', 'Workout', 'Drink water', 'Meditate'].map((h, i) => (
                  <div key={h} className="flex items-center gap-3 rounded-lg bg-ink-800/70 px-3 py-2.5">
                    <span className={`w-4 h-4 rounded-md border-2 ${i < 3 ? 'bg-brand-400 border-brand-400' : 'border-ink-600'}`} />
                    <span className="text-xs text-ink-200 flex-1">{h}</span>
                    {i < 3 && <CheckCircle2 size={14} className="text-brand-400" />}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-1.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className={`flex-1 h-8 rounded-md ${i < 5 ? 'bg-brand-400/70' : 'bg-ink-700'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

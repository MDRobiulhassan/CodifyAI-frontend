import { useState } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth';
import { Logo } from '../components/Logo';
import { useTypewriterPlaceholder } from '../hooks/useTypewriterPlaceholder';
import { ArrowRight, Check, Code2, Eye, MessageSquare, Users, Sparkles, Menu, X } from 'lucide-react';

const examples = [
  { name: 'DineFlow Pro', image: '/assets/showcase/dineflow-pro.png', label: 'Restaurant platform' },
  { name: 'Shopfront Builder', image: '/assets/showcase/shopfront.png', label: 'Commerce experience' },
  { name: 'HR Hub', image: '/assets/showcase/hr-hub.png', label: 'Operations dashboard' },
];

export function LandingPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [prompt, setPrompt] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const animatedPlaceholder = useTypewriterPlaceholder();

  const start = () => navigate(user ? '/dashboard' : '/signup');
  const submit = () => navigate(user ? `/dashboard?prompt=${encodeURIComponent(prompt)}` : `/signup?prompt=${encodeURIComponent(prompt)}`);

  return (
    <div className="min-h-screen bg-[#171717] text-white selection:bg-blue-400/30">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#171717]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/"><Logo size={30} withText variant="light" /></Link>
          <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex"><a href="#how-it-works" className="hover:text-white">How it works</a><a href="#showcase" className="hover:text-white">Showcase</a><Link to="/pricing" className="hover:text-white">Pricing</Link></nav>
          <div className="hidden items-center gap-3 md:flex">{user ? <Link to="/dashboard" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#171717]">Open workspace</Link> : <><Link to="/login" className="rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">Log in</Link><button onClick={start} className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#171717] hover:bg-white/90">Get started</button></>}</div>
          <button onClick={() => setMenuOpen((value) => !value)} className="rounded-lg border border-white/10 p-2 md:hidden" aria-label="Open menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {menuOpen && <div className="border-t border-white/10 bg-[#202020] px-5 py-4 md:hidden"><div className="flex flex-col gap-3 text-sm text-white/70"><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href="#showcase" onClick={() => setMenuOpen(false)}>Showcase</a><Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link><button onClick={start} className="mt-2 rounded-lg bg-white px-4 py-2 text-center font-medium text-[#171717]">Get started</button></div></div>}
      </header>

      <main>
        <section className="relative overflow-hidden px-5 pb-24 pt-36 lg:px-8 lg:pt-48">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#3559b8_0%,transparent_42%),radial-gradient(circle_at_50%_90%,#ff1870_0%,#171717_58%)] opacity-90" />
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/75 backdrop-blur"><Sparkles size={14} className="text-blue-300" /> Build with natural language</div>
            <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-7xl">Create apps by talking to AI.</h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/60">Describe your idea, watch CodifyAI build the project, then refine it through chat with a live preview beside you.</p>
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/20 bg-[#202020]/95 p-3 text-left shadow-2xl"><textarea aria-label="Describe an app to build" value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); } }} rows={2} placeholder={animatedPlaceholder} className="w-full resize-none bg-transparent px-3 py-2 text-base text-white outline-none placeholder:text-white/40" /><div className="flex items-center justify-between px-2 pt-2"><span className="text-xs text-white/35">Enter to start building</span><button onClick={submit} className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#171717] hover:bg-white/90">Build <ArrowRight size={14} className="ml-1 inline" /></button></div></div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/50"><span><Check size={14} className="mr-1 inline text-blue-300" />No credit card</span><span><Check size={14} className="mr-1 inline text-blue-300" />Live preview</span><span><Check size={14} className="mr-1 inline text-blue-300" />Your source code</span></div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-white/10 bg-[#1d1d1d] px-5 py-24 lg:px-8"><div className="mx-auto max-w-6xl"><div className="max-w-xl"><p className="text-sm font-medium text-blue-300">A faster way to build</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">From thought to working software.</h2></div><div className="mt-14 grid gap-5 md:grid-cols-3"><Feature icon={MessageSquare} title="Describe" text="Start with a plain-English idea. No setup or boilerplate required." /><Feature icon={Code2} title="Generate" text="The AI creates the project files and keeps the code readable." /><Feature icon={Eye} title="Refine" text="See a live preview and ask for changes until it feels right." /></div></div></section>

        <section id="showcase" className="px-5 py-24 lg:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-blue-300">Project showcase</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">A workspace for real products.</h2></div><Link to="/signup" className="text-sm text-white/60 hover:text-white">Start a project <ArrowRight size={14} className="ml-1 inline" /></Link></div><div className="mt-12 grid gap-5 md:grid-cols-3">{examples.map((example) => <div key={example.name} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#202020]"><img src={example.image} alt={example.name} className="aspect-[1.5] w-full object-cover transition duration-500 group-hover:scale-[1.03]" /><div className="p-4"><h3 className="font-medium">{example.name}</h3><p className="mt-1 text-sm text-white/45">{example.label}</p></div></div>)}</div></div></section>

        <section className="border-t border-white/10 bg-[#202020] px-5 py-20 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center"><div><h2 className="text-3xl font-semibold tracking-[-0.04em]">Build your next idea today.</h2><p className="mt-2 text-white/50">Free to start. Upgrade only when you need more.</p></div><button onClick={start} className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#171717]">Open CodifyAI <ArrowRight size={15} className="ml-1 inline" /></button></div></section>
      </main>
      <footer className="border-t border-white/10 bg-[#171717] px-5 py-8 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 sm:flex-row sm:items-center"><Logo size={26} withText variant="light" /><div className="flex items-center gap-5 text-sm text-white/45"><Link to="/pricing">Pricing</Link><Link to="/login">Log in</Link><span>© 2026 CodifyAI</span></div></div></footer>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof MessageSquare; title: string; text: string }) { return <div className="rounded-2xl border border-white/10 bg-[#242424] p-6"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><Icon size={19} /></div><h3 className="mt-6 text-lg font-medium">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/50">{text}</p></div>; }

import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth';
import { api } from '../api';
import type { Project, Usage } from '../types';
import { Logo } from '../components/Logo';
import { Avatar } from '../components/Avatar';
import { Modal } from '../components/Modal';
import { toast } from '../components/Toast';
import { CenterSpinner } from '../components/Spinner';
import { useTypewriterPlaceholder } from '../hooks/useTypewriterPlaceholder';
import {
  Plus, Search, MoreVertical, Trash2, Pencil, FolderPlus,
  Sparkles, MessageSquare, TrendingUp, Clock, ArrowRight,
  LayoutGrid, FolderOpen, ChevronDown, Settings, LogOut,
} from 'lucide-react';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [projectView, setProjectView] = useState<'mine' | 'recent' | 'shared'>('mine');
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const animatedPlaceholder = useTypewriterPlaceholder();

  const promptPrefill = new URLSearchParams(window.location.search).get('prompt');

  useEffect(() => {
    load();
    api.getTodayUsage().then(setUsage).catch(() => {});
    if (promptPrefill) { setNewName(promptPrefill.slice(0, 40)); setCreateOpen(true); }
  }, []);

  const load = async () => {
    try {
      const data = await api.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch { toast('error', 'Could not load projects.'); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const project = await api.createProject(newName.trim());
      toast('success', 'Project created.');
      navigate(`/projects/${project.id}`);
    } catch (err) { toast('error', err instanceof Error ? err.message : 'Could not create project.'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: number) => {
    setMenuFor(null);
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try { await api.deleteProject(id); setProjects((arr) => arr.filter((p) => p.id !== id)); toast('success', 'Project deleted.'); }
    catch { toast('error', 'Could not delete project.'); }
  };

  const handleRename = async (id: number) => {
    if (!renameValue.trim()) return;
    try { await api.updateProject(id, renameValue.trim()); setProjects((arr) => arr.map((p) => (p.id === id ? { ...p, name: renameValue.trim() } : p))); toast('success', 'Project renamed.'); }
    catch { toast('error', 'Could not rename project.'); }
    finally { setRenamingId(null); }
  };

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const visibleProjects = projectView === 'recent'
    ? [...filtered].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
    : filtered;
  const usagePct = usage ? Math.min(100, (usage.messagesUsed / Math.max(1, usage.messageLimit)) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#171717] text-white flex">
      <WorkspaceSidebar projects={projects} user={user} onLogout={() => { logout(); navigate('/'); }} onNew={() => setCreateOpen(true)} onProjects={() => { setProjectView('mine'); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} />
      <main className="h-screen min-w-0 flex-1 overflow-y-auto bg-[#171717]">
        <div className="mx-auto max-w-[1440px] px-5 py-5 lg:px-8">
          <div className="rounded-[26px] overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_0%,#263d78_0%,#171717_46%,#ff1870_110%)] min-h-[calc(100vh-40px)]">
            <div className="px-5 pt-8 pb-10 sm:px-10 sm:pt-12">
              <div className="flex justify-center">
                <div className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm text-white/80 backdrop-blur">Describe an app and start building <ArrowRight size={14} className="inline ml-2" /></div>
              </div>
              <h1 className="mt-16 text-center text-3xl sm:text-5xl font-semibold tracking-tight">What will you build today, {user?.name?.split(' ')[0] || 'builder'}?</h1>
              <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/20 bg-[#202020]/95 p-3 shadow-2xl">
                <textarea
                  className="w-full resize-none bg-transparent px-3 py-2 text-base text-white placeholder:text-white/45 outline-none"
                  rows={2}
                  aria-label="Describe an app to build"
                  placeholder={animatedPlaceholder}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setCreateOpen(true); } }}
                />
                <div className="flex items-center justify-between px-2 pt-2 text-white/50">
                  <button className="rounded-full border border-white/15 p-2 hover:bg-white/10" aria-label="Add context"><Plus size={16} /></button>
                  <button onClick={() => setCreateOpen(true)} className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#171717] hover:bg-white/90">Build <ArrowRight size={14} className="inline ml-1" /></button>
                </div>
              </div>
              <div className="mt-5 flex justify-center gap-2 text-xs text-white/60">
                {([['mine', 'My projects'], ['recent', 'Recently viewed'], ['shared', 'Shared with me']] as const).map(([view, label]) => <button key={view} onClick={() => setProjectView(view)} className={`rounded-full border px-3 py-1.5 transition ${projectView === view ? 'border-white/20 bg-black/20 text-white' : 'border-transparent text-white/60 hover:text-white'}`}>{label}</button>)}
              </div>
            </div>

            <section id="projects" className="rounded-t-[26px] bg-[#202020] px-5 py-6 sm:px-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-md flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
                  <input className="w-full rounded-full border border-white/15 bg-[#181818] px-10 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/35" placeholder="Search projects" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  {usage && <span>{usage.messagesUsed} / {usage.messageLimit} messages today</span>}
                  <button onClick={() => setCreateOpen(true)} className="rounded-full bg-white px-4 py-2 font-medium text-[#171717] hover:bg-white/90"><Plus size={15} className="inline mr-1" /> New</button>
                </div>
              </div>

              {loading ? <CenterSpinner label="Loading projects..." /> : projectView === 'shared' ? <EmptyState onCreate={() => setCreateOpen(true)} hasSearch={false} message="Shared projects will appear here when someone invites you." /> : visibleProjects.length === 0 ? <EmptyState onCreate={() => setCreateOpen(true)} hasSearch={Boolean(search)} /> : (
                <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} menuOpen={menuFor === project.id} isRenaming={renamingId === project.id} renameValue={renameValue} onOpen={() => navigate(`/projects/${project.id}`)} onMenu={(event) => { event.stopPropagation(); setMenuFor(menuFor === project.id ? null : project.id); }} onRename={() => { setMenuFor(null); setRenamingId(project.id); setRenameValue(project.name); }} onDelete={() => handleDelete(project.id)} onRenameChange={setRenameValue} onRenameSave={() => handleRename(project.id)} onRenameCancel={() => setRenamingId(null)} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New project">
        <div className="space-y-4">
          <div><label className="label">Project name</label><input autoFocus className="input" placeholder="e.g. Habit Tracker, SaaS Dashboard" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} /><p className="mt-2 text-xs text-charcoal-400">Your project will open in the builder.</p></div>
          <div className="flex justify-end gap-2"><button onClick={() => setCreateOpen(false)} className="btn-ghost px-4 py-2 text-sm">Cancel</button><button onClick={handleCreate} disabled={creating || !newName.trim()} className="btn-dark px-4 py-2 text-sm">{creating ? 'Creating...' : 'Create project'}</button></div>
        </div>
      </Modal>
    </div>
  );
}

function WorkspaceSidebar({ projects, user, onLogout, onNew, onProjects }: { projects: Project[]; user: ReturnType<typeof useAuth>['user']; onLogout: () => void; onNew: () => void; onProjects: () => void }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[252px] shrink-0 overflow-hidden border-r border-white/10 bg-[#171717] p-3 lg:flex lg:flex-col">
      <Link to="/" className="mb-4 px-2"><Logo size={28} withText variant="light" /></Link>
      <button className="mb-2 flex items-center justify-between rounded-lg border border-white/15 px-3 py-2 text-left text-sm text-white"><span className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-md bg-orange-500 text-xs font-bold">C</span> CodifyAI workspace</span><ChevronDown size={14} className="text-white/50" /></button>
      <nav className="space-y-1 text-sm text-white/70"><SidebarItem icon={Plus} label="New" active onClick={onNew} /><SidebarItem icon={LayoutGrid} label="Projects" onClick={onProjects} /></nav>
      <p className="mb-2 mt-7 px-2 text-xs text-white/40">Recents</p>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">{projects.slice(0, 7).map((project) => <Link key={project.id} to={`/projects/${project.id}`} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-white/65 hover:bg-white/10 hover:text-white"><FolderOpen size={15} /> <span className="truncate">{project.name}</span></Link>)}</div>
      <div className="mt-auto rounded-xl border border-white/15 bg-[#222] p-3"><p className="text-sm font-medium">{user?.name || 'Your workspace'}</p><p className="mt-1 text-xs text-white/45">Free plan</p><Link to="/pricing" className="mt-3 block rounded-lg bg-white px-3 py-2 text-center text-xs font-medium text-[#171717]">Upgrade plan</Link></div>
      <button onClick={onLogout} className="mt-3 flex items-center gap-2 px-2 py-2 text-sm text-white/50 hover:text-white"><LogOut size={15} /> Log out</button>
    </aside>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: { icon: typeof Plus; label: string; active?: boolean; onClick?: () => void }) {
  return <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${active ? 'bg-white/10 text-white' : 'hover:bg-white/10'}`}><Icon size={16} /> {label}</button>;
}

function ProjectCard({ project, menuOpen, isRenaming, renameValue, onOpen, onMenu, onRename, onDelete, onRenameChange, onRenameSave, onRenameCancel }: { project: Project; menuOpen: boolean; isRenaming: boolean; renameValue: string; onOpen: () => void; onMenu: (event: MouseEvent<HTMLButtonElement>) => void; onRename: () => void; onDelete: () => void; onRenameChange: (value: string) => void; onRenameSave: () => void; onRenameCancel: () => void }) {
  return (
    <article className="group relative cursor-pointer" onClick={onOpen}>
      <div className="relative aspect-[1.65] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#263b69] via-[#202943] to-[#422747] p-5 transition group-hover:border-white/30">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-blue-400/10 blur-2xl" />
        <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-fuchsia-400/10 blur-2xl" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-black/20 text-white/90"><FolderOpen size={20} /></span>
            <button onClick={onMenu} aria-label={`Actions for ${project.name}`} className="rounded-full bg-black/45 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 focus:opacity-100"><MoreVertical size={15} /></button>
          </div>
          <div className="max-w-[80%]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Project workspace</p>
            <p className="mt-1 truncate text-xl font-semibold tracking-tight text-white">{project.name}</p>
          </div>
        </div>
        {menuOpen && <div className="absolute right-2 top-12 z-10 w-36 rounded-lg border border-white/15 bg-[#272727] p-1 shadow-2xl" onClick={(event) => event.stopPropagation()}><button onClick={onRename} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"><Pencil size={14} /> Rename</button><button onClick={onDelete} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-300 hover:bg-white/10"><Trash2 size={14} /> Delete</button></div>}
      </div>
      {isRenaming ? <div className="mt-2" onClick={(event) => event.stopPropagation()}><input autoFocus className="w-full rounded-md border border-white/20 bg-[#272727] px-3 py-2 text-sm text-white outline-none" value={renameValue} onChange={(event) => onRenameChange(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') onRenameSave(); if (event.key === 'Escape') onRenameCancel(); }} /><div className="mt-2 flex gap-2"><button onClick={onRenameSave} className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-[#171717]">Save</button><button onClick={onRenameCancel} className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/70">Cancel</button></div></div> : <div className="mt-3"><h3 className="font-medium text-white">{project.name}</h3><p className="mt-1 flex items-center gap-1 text-xs text-white/45"><Clock size={12} /> {formatDate(project.updatedAt || project.createdAt)}</p></div>}
    </article>
  );
}

function EmptyState({ onCreate, hasSearch, message }: { onCreate: () => void; hasSearch: boolean; message?: string }) {
  return <div className="rounded-xl border border-white/10 bg-[#181818] p-12 text-center"><Sparkles size={28} className="mx-auto text-white/50" /><h3 className="mt-4 text-lg font-medium">{message ? 'No shared projects yet' : hasSearch ? 'No projects match your search' : 'No projects yet'}</h3><p className="mt-2 text-sm text-white/50">{message || (hasSearch ? 'Try another search term.' : 'Create your first project and start building.')}</p>{!hasSearch && !message && <button onClick={onCreate} className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#171717]"><Plus size={15} className="inline mr-1" /> Create project</button>}</div>;
}

function formatDate(iso?: string): string {
  if (!iso) return 'No recent activity';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'No recent activity';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

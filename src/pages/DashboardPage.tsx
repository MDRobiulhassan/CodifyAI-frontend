import { useEffect, useState } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth';
import { api } from '../api';
import type { Project, Usage } from '../types';
import { Logo } from '../components/Logo';
import { Avatar } from '../components/Avatar';
import { Modal } from '../components/Modal';
import { toast } from '../components/Toast';
import { CenterSpinner } from '../components/Spinner';
import {
  Plus, Search, MoreVertical, Trash2, Pencil, FolderPlus,
  Sparkles, MessageSquare, TrendingUp, Clock, ArrowRight,
} from 'lucide-react';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');

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
      const p = await api.createProject(newName.trim());
      toast('success', 'Project created.');
      navigate(`/projects/${p.id}`);
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
  const usagePct = usage ? Math.min(100, (usage.messagesUsed / Math.max(1, usage.messageLimit)) * 100) : 0;

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="sticky top-0 z-30 bg-cream-100/80 backdrop-blur-md border-b border-cream-200">
        <div className="mx-auto max-w-6xl px-5 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><Logo size={30} withText /></Link>
          <div className="flex items-center gap-3">
            <Link to="/pricing" className="btn-ghost px-3 py-2 text-sm hidden sm:flex">Plans</Link>
            <button onClick={() => setCreateOpen(true)} className="btn-dark px-3.5 py-2 text-sm">
              <Plus size={16} /> New project
            </button>
            {user && <Avatar user={user} onLogout={() => { logout(); navigate('/'); }} />}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-charcoal-700 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'builder'}
            </h1>
            <p className="text-charcoal-400 text-sm mt-1">Pick up a project or start something new.</p>
          </div>
          {usage && (
            <div className="card px-4 py-3 w-full sm:w-72">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-charcoal-500 flex items-center gap-1.5"><TrendingUp size={13} className="text-charcoal-500" /> Today's messages</span>
                <span className="text-charcoal-400">{usage.messagesUsed} / {usage.messageLimit}</span>
              </div>
              <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
                <div className="h-full bg-charcoal-700 transition-all" style={{ width: `${usagePct}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input className="input pl-10 py-2.5" placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <CenterSpinner label="Loading your projects…" />
        ) : filtered.length === 0 ? (
          <EmptyState onCreate={() => setCreateOpen(true)} hasSearch={!!search} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NewProjectCard onClick={() => setCreateOpen(true)} />
            {filtered.map((p) => (
              <div key={p.id} className="group card p-5 hover:shadow-card-hover transition cursor-pointer relative" onClick={() => navigate(`/projects/${p.id}`)}>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-full bg-cream-200 grid place-items-center text-charcoal-500">
                    <Sparkles size={18} />
                  </div>
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === p.id ? null : p.id); }} className="btn-ghost rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition">
                      <MoreVertical size={16} />
                    </button>
                    {menuFor === p.id && (
                      <div className="absolute right-0 mt-1 w-40 card shadow-card-hover p-1 z-20" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => { setMenuFor(null); setRenamingId(p.id); setRenameValue(p.name); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal-600 hover:bg-cream-200 rounded-md">
                          <Pencil size={14} /> Rename
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-cream-200 rounded-md">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {renamingId === p.id ? (
                  <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                    <input autoFocus className="input py-1.5 text-sm" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleRename(p.id); if (e.key === 'Escape') setRenamingId(null); }} />
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => handleRename(p.id)} className="btn-dark py-1 px-3 text-xs">Save</button>
                      <button onClick={() => setRenamingId(null)} className="btn-ghost py-1 px-3 text-xs">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="mt-4 font-semibold text-charcoal-700 truncate">{p.name}</h3>
                    <div className="mt-3 flex items-center gap-3 text-xs text-charcoal-400">
                      <span className="flex items-center gap-1"><Clock size={12} /> {formatDate(p.updatedAt || p.createdAt)}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={12} /> Chat</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-charcoal-400">Open project</span>
                      <ArrowRight size={15} className="text-charcoal-400 group-hover:text-charcoal-700 group-hover:translate-x-1 transition" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New project">
        <div className="space-y-4">
          <div>
            <label className="label">Project name</label>
            <input autoFocus className="input" placeholder="e.g. Habit Tracker, SaaS Dashboard…" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
            <p className="mt-2 text-xs text-charcoal-400">You can rename it later anytime.</p>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setCreateOpen(false)} className="btn-ghost px-4 py-2 text-sm">Cancel</button>
            <button onClick={handleCreate} disabled={creating || !newName.trim()} className="btn-dark px-4 py-2 text-sm">
              {creating ? 'Creating…' : 'Create project'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function NewProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="card p-5 border-cream-200 hover:border-charcoal-700/40 hover:bg-cream-50 transition group text-left">
      <div className="w-10 h-10 rounded-full bg-cream-200 grid place-items-center text-charcoal-400 group-hover:text-charcoal-700 transition">
        <FolderPlus size={18} />
      </div>
      <h3 className="mt-4 font-semibold text-charcoal-500 group-hover:text-charcoal-700 transition">New project</h3>
      <p className="mt-1 text-xs text-charcoal-400">Start building from scratch</p>
    </button>
  );
}

function EmptyState({ onCreate, hasSearch }: { onCreate: () => void; hasSearch: boolean }) {
  return (
    <div className="card p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-cream-200 text-charcoal-500 grid place-items-center mx-auto mb-5">
        <Sparkles size={28} />
      </div>
      <h3 className="text-lg font-semibold text-charcoal-700">
        {hasSearch ? 'No projects match your search' : 'No projects yet'}
      </h3>
      <p className="mt-2 text-sm text-charcoal-400 max-w-sm mx-auto">
        {hasSearch ? 'Try a different keyword.' : 'Create your first project and start building with AI.'}
      </p>
      {!hasSearch && (
        <button onClick={onCreate} className="mt-6 btn-dark px-5 py-2.5 text-sm">
          <Plus size={16} /> Create your first project
        </button>
      )}
    </div>
  );
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch { return '—'; }
}

import { useEffect, useState } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth';
import { api } from '../api';
import type { ChatMessage, Project } from '../types';
import { Logo } from '../components/Logo';
import { Avatar } from '../components/Avatar';
import { ChatPanel } from '../components/ChatPanel';
import { CodePanel } from '../components/CodePanel';
import { MembersPanel } from '../components/MembersPanel';
import { toast } from '../components/Toast';
import { CenterSpinner } from '../components/Spinner';
import {
  Eye, Code2, Users, ExternalLink, ArrowLeft,
  MoreVertical, Trash2, RefreshCw, Smartphone, Monitor, Tablet,
} from 'lucide-react';

type View = 'preview' | 'code';
type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

export function EditorPage({ projectId }: { projectId: number }) {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('preview');
  const [device, setDevice] = useState<Device>('desktop');
  const [membersOpen, setMembersOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    load();
  }, [projectId]);

  const load = async () => {
    try {
      const [p, history] = await Promise.all([
        api.getProject(projectId),
        api.getChatHistory(projectId).catch(() => ({ messages: [] })),
      ]);
      setProject(p);
      const msgs: ChatMessage[] = (history.messages ?? []).map((m) => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content,
        timestamp: m.timestamp,
      }));
      setMessages(msgs);
    } catch {
      toast('error', 'Could not load project.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try {
      await api.deleteProject(projectId);
      toast('success', 'Project deleted.');
      navigate('/dashboard');
    } catch {
      toast('error', 'Could not delete project.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950">
        <CenterSpinner label="Loading project…" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-ink-950 overflow-hidden">
      {/* Top bar */}
      <header className="shrink-0 h-14 glass border-b border-ink-700/60 flex items-center justify-between px-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/dashboard" className="btn-ghost rounded-lg p-2 shrink-0">
            <ArrowLeft size={18} />
          </Link>
          <Link to="/" className="hidden sm:block shrink-0">
            <Logo size={28} withText />
          </Link>
          <div className="hidden md:block h-5 w-px bg-ink-700" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-100 truncate">{project?.name || 'Untitled'}</p>
            <p className="text-[11px] text-ink-500 truncate">Project #{projectId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="hidden sm:flex items-center gap-0.5 rounded-lg bg-ink-800/70 p-0.5">
            <button
              onClick={() => setView('preview')}
              className={`px-2.5 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition ${
                view === 'preview' ? 'bg-ink-600 text-ink-100' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              <Eye size={13} /> Preview
            </button>
            <button
              onClick={() => setView('code')}
              className={`px-2.5 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition ${
                view === 'code' ? 'bg-ink-600 text-ink-100' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              <Code2 size={13} /> Code
            </button>
          </div>

          {view === 'preview' && (
            <div className="hidden md:flex items-center gap-0.5 rounded-lg bg-ink-800/70 p-0.5">
              {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([d, Icon]) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={`p-1.5 rounded-md transition ${device === d ? 'bg-ink-600 text-ink-100' : 'text-ink-400 hover:text-ink-200'}`}
                  title={d}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setMembersOpen(true)}
            className="btn-ghost rounded-lg p-2"
            title="Members"
          >
            <Users size={17} />
          </button>

          <button
            onClick={() => setPreviewKey((k) => k + 1)}
            className="btn-ghost rounded-lg p-2"
            title="Refresh preview"
          >
            <RefreshCw size={16} />
          </button>

          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="btn-ghost rounded-lg p-2">
              <MoreVertical size={17} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 card shadow-panel p-1 z-50" onMouseLeave={() => setMenuOpen(false)}>
                <button onClick={handleDelete} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-400 hover:bg-ink-800 rounded-lg">
                  <Trash2 size={14} /> Delete project
                </button>
              </div>
            )}
          </div>

          {user && <Avatar user={user} onLogout={() => { logout(); navigate('/'); }} />}
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex min-h-0">
        {/* Chat (left) */}
        <div className="w-full md:w-[400px] shrink-0 border-r border-ink-700/60 flex flex-col min-h-0">
          <ChatPanel projectId={projectId} messages={messages} setMessages={setMessages} />
        </div>

        {/* Main pane (right) */}
        <div className="flex-1 min-w-0 flex flex-col">
          {view === 'preview' ? (
            <PreviewPane projectId={projectId} device={device} refreshKey={previewKey} />
          ) : (
            <CodePanel projectId={projectId} />
          )}
        </div>
      </div>

      <MembersPanel projectId={projectId} open={membersOpen} onClose={() => setMembersOpen(false)} />
    </div>
  );
}

function PreviewPane({ projectId, device, refreshKey }: { projectId: number; device: Device; refreshKey: number }) {
  // In a real deployment the backend serves a live preview URL per project.
  // We point to the backend preview endpoint; the key refresh forces a reload.
  const src = `http://localhost:8080/preview/${projectId}?t=${refreshKey}`;

  return (
    <div className="flex-1 flex flex-col bg-ink-950 min-h-0">
      <div className="shrink-0 flex items-center gap-2 px-3 h-9 border-b border-ink-700/60 bg-ink-900/40">
        <div className="flex items-center gap-1.5 text-xs text-ink-400">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-glow" />
          Live preview
        </div>
        <div className="flex-1 mx-2 hidden sm:flex items-center gap-1.5 text-xs text-ink-400 font-mono truncate">
          <ExternalLink size={11} /> {src}
        </div>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-ink-400 hover:text-ink-100 flex items-center gap-1"
        >
          Open <ExternalLink size={12} />
        </a>
      </div>
      <div className="flex-1 grid place-items-center p-4 overflow-auto bg-[#0d1117]">
        <div
          className="bg-white rounded-lg shadow-panel overflow-hidden transition-all duration-300 h-full"
          style={{ width: DEVICE_WIDTH[device], maxWidth: '100%' }}
        >
          <iframe
            key={refreshKey + device}
            src={src}
            title="Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
}


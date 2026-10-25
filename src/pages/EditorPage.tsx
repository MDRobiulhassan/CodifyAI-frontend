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

const DEVICE_WIDTH: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '390px' };

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

  useEffect(() => { load(); }, [projectId]);

  const load = async () => {
    try {
      const [p, history] = await Promise.all([
        api.getProject(projectId),
        api.getChatHistory(projectId).catch(() => ({ messages: [] })),
      ]);
      setProject(p);
      const msgs: ChatMessage[] = (history.messages ?? []).map((m) => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content, timestamp: m.timestamp,
      }));
      setMessages(msgs);
    } catch { toast('error', 'Could not load project.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try { await api.deleteProject(projectId); toast('success', 'Project deleted.'); navigate('/dashboard'); }
    catch { toast('error', 'Could not delete project.'); }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#171717]"><CenterSpinner label="Loading project..." /></div>;
  }

  return (
    <div className="h-screen flex flex-col bg-[#171717] text-white overflow-hidden">
      <header className="shrink-0 h-14 bg-[#202020] border-b border-white/10 flex items-center justify-between px-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/dashboard" className="rounded-md border border-white/10 p-2 text-white/70 hover:bg-white/10 shrink-0"><ArrowLeft size={18} /></Link>
          <Link to="/" className="hidden sm:block shrink-0"><Logo size={28} withText /></Link>
          <div className="hidden md:block h-5 w-px bg-white/10" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{project?.name || 'Untitled'}</p>
            <p className="text-[11px] text-white/40 truncate">Project #{projectId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-0.5 rounded-md bg-[#171717] border border-white/10 p-0.5">
            <button onClick={() => setView('preview')} className={`px-2.5 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition ${view === 'preview' ? 'bg-blue-500 text-white' : 'text-white/50 hover:text-white'}`}>
              <Eye size={13} /> Preview
            </button>
            <button onClick={() => setView('code')} className={`px-2.5 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition ${view === 'code' ? 'bg-blue-500 text-white' : 'text-white/50 hover:text-white'}`}>
              <Code2 size={13} /> Code
            </button>
          </div>

          {view === 'preview' && (
            <div className="hidden md:flex items-center gap-0.5 rounded-md bg-[#171717] border border-white/10 p-0.5">
              {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([d, Icon]) => (
                <button key={d} onClick={() => setDevice(d)} className={`p-1.5 rounded-md transition ${device === d ? 'bg-blue-500 text-white' : 'text-white/50 hover:text-white'}`} title={d}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
          )}

          <button onClick={() => setMembersOpen(true)} className="rounded-md border border-white/10 p-2 text-white/70 hover:bg-white/10" title="Members"><Users size={17} /></button>
          <button onClick={() => setPreviewKey((k) => k + 1)} className="rounded-md border border-white/10 p-2 text-white/70 hover:bg-white/10" title="Refresh preview"><RefreshCw size={16} /></button>

          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="rounded-md border border-white/10 p-2 text-white/70 hover:bg-white/10"><MoreVertical size={17} /></button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 card shadow-card-hover p-1 z-50" onMouseLeave={() => setMenuOpen(false)}>
                <button onClick={handleDelete} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-cream-200 rounded-md">
                  <Trash2 size={14} /> Delete project
                </button>
              </div>
            )}
          </div>

          {user && <Avatar user={user} onLogout={() => { logout(); navigate('/'); }} />}
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <div className="w-full md:w-[400px] shrink-0 border-r border-white/10 flex flex-col min-h-0">
          <ChatPanel projectId={projectId} messages={messages} setMessages={setMessages} />
        </div>
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
  const src = `http://localhost:8080/preview/${projectId}?t=${refreshKey}`;

  return (
    <div className="flex-1 flex flex-col bg-[#171717] min-h-0">
      <div className="shrink-0 flex items-center gap-2 px-3 h-9 border-b border-white/10 bg-[#202020]">
        <div className="flex items-center gap-1.5 text-xs text-white/45">
          <span className="w-2 h-2 rounded-full bg-charcoal-400 animate-pulse-soft" />
          Live preview
        </div>
        <div className="flex-1 mx-2 hidden sm:flex items-center gap-1.5 text-xs text-white/45 font-mono truncate">
          <ExternalLink size={11} /> {src}
        </div>
        <a href={src} target="_blank" rel="noreferrer" className="text-xs text-white/45 hover:text-white flex items-center gap-1">
          Open <ExternalLink size={12} />
        </a>
      </div>
      <div className="flex-1 grid place-items-center p-4 overflow-auto bg-[#111111]">
        <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 h-full border border-white/10" style={{ width: DEVICE_WIDTH[device], maxWidth: '100%' }}>
          <iframe key={refreshKey + device} src={src} title="Preview" className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
        </div>
      </div>
    </div>
  );
}

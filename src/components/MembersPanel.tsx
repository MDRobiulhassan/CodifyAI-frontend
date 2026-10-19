import { useEffect, useState } from 'react';
import { api } from '../api';
import type { ProjectMember, MemberRole } from '../types';
import { useAuth } from '../auth';
import { Modal } from './Modal';
import { toast } from './Toast';
import { CenterSpinner } from './Spinner';
import {
  UserPlus, Trash2, Crown, Pencil, Eye, MoreVertical, X, Mail,
} from 'lucide-react';

interface MembersPanelProps {
  projectId: number;
  open: boolean;
  onClose: () => void;
}

const ROLE_META: Record<MemberRole, { label: string; icon: typeof Crown; color: string }> = {
  OWNER: { label: 'Owner', icon: Crown, color: 'text-warn-400' },
  EDITOR: { label: 'Editor', icon: Pencil, color: 'text-brand-400' },
  VIEWER: { label: 'Viewer', icon: Eye, color: 'text-ink-300' },
};

export function MembersPanel({ projectId, open, onClose }: MembersPanelProps) {
  const { user } = useAuth();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('EDITOR');
  const [inviting, setInviting] = useState(false);
  const [menuFor, setMenuFor] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getMembers(projectId);
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      toast('error', 'Could not load members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open, projectId]);

  const invite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const m = await api.inviteMember(projectId, { username: inviteEmail.trim(), role: inviteRole });
      setMembers((arr) => [...arr, m]);
      setInviteEmail('');
      toast('success', 'Member invited.');
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Could not invite member.');
    } finally {
      setInviting(false);
    }
  };

  const changeRole = async (memberId: number, role: MemberRole) => {
    setMenuFor(null);
    try {
      await api.updateMemberRole(projectId, memberId, { role });
      setMembers((arr) => arr.map((m) => (m.id === memberId ? { ...m, role } : m)));
      toast('success', 'Role updated.');
    } catch {
      toast('error', 'Could not update role.');
    }
  };

  const remove = async (memberId: number) => {
    setMenuFor(null);
    if (!confirm('Remove this member from the project?')) return;
    try {
      await api.removeMember(projectId, memberId);
      setMembers((arr) => arr.filter((m) => m.id !== memberId));
      toast('success', 'Member removed.');
    } catch {
      toast('error', 'Could not remove member.');
    }
  };

  const currentUserRole = members.find((m) => m.username === user?.username)?.role;
  const canManage = currentUserRole === 'OWNER' || currentUserRole === 'EDITOR';

  return (
    <Modal open={open} onClose={onClose} title="Members" className="max-w-lg">
      <div className="space-y-5">
        {/* Invite form */}
        {canManage && (
          <div className="rounded-xl bg-ink-800/60 border border-ink-700/60 p-4">
            <p className="text-sm font-medium text-ink-100 mb-3 flex items-center gap-2">
              <UserPlus size={15} className="text-brand-400" /> Invite a teammate
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  className="input pl-9 py-2 text-sm"
                  placeholder="teammate@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <select
                className="input py-2 text-sm w-full sm:w-32"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as MemberRole)}
              >
                <option value="EDITOR">Editor</option>
                <option value="VIEWER">Viewer</option>
                <option value="OWNER">Owner</option>
              </select>
              <button onClick={invite} disabled={inviting || !inviteEmail.trim()} className="btn-primary py-2 px-4 text-sm">
                {inviting ? '…' : 'Invite'}
              </button>
            </div>
          </div>
        )}

        {/* Members list */}
        {loading ? (
          <CenterSpinner />
        ) : (
          <div className="space-y-1.5">
            {members.map((m) => {
              const meta = ROLE_META[m.role];
              const RoleIcon = meta.icon;
              const initials = (m.name || m.username).split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('');
              return (
                <div key={m.id} className="flex items-center gap-3 rounded-xl bg-ink-800/40 px-3 py-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ink-500 to-ink-700 grid place-items-center text-ink-100 text-xs font-semibold shrink-0">
                    {initials || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-100 truncate">
                      {m.name || m.username}
                      {m.username === user?.username && <span className="ml-2 text-xs text-ink-500">(you)</span>}
                    </p>
                    <p className="text-xs text-ink-400 truncate">{m.username}</p>
                  </div>
                  <span className={`chip bg-ink-800 ${meta.color} border border-ink-700/60`}>
                    <RoleIcon size={12} /> {meta.label}
                  </span>
                  {canManage && m.username !== user?.username && (
                    <div className="relative">
                      <button
                        onClick={() => setMenuFor(menuFor === m.id ? null : m.id)}
                        className="btn-ghost rounded-lg p-1.5"
                      >
                        <MoreVertical size={15} />
                      </button>
                      {menuFor === m.id && (
                        <div className="absolute right-0 mt-1 w-44 card shadow-panel p-1 z-20">
                          {(Object.keys(ROLE_META) as MemberRole[]).filter((r) => r !== m.role).map((r) => (
                            <button
                              key={r}
                              onClick={() => changeRole(m.id, r)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-200 hover:bg-ink-800 rounded-lg"
                            >
                              {(() => { const I = ROLE_META[r].icon; return <I size={14} className={ROLE_META[r].color} /> })()}
                              Make {ROLE_META[r].label.toLowerCase()}
                            </button>
                          ))}
                          <div className="h-px bg-ink-700/60 my-1" />
                          <button
                            onClick={() => remove(m.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-400 hover:bg-ink-800 rounded-lg"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {members.length === 0 && (
              <p className="text-sm text-ink-400 text-center py-6">No members yet.</p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={onClose} className="btn-ghost px-4 py-2 text-sm">
            <X size={15} /> Close
          </button>
        </div>
      </div>
    </Modal>
  );
}


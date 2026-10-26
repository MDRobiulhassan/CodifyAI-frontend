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
  OWNER: { label: 'Owner', icon: Crown, color: 'text-charcoal-700' },
  EDITOR: { label: 'Editor', icon: Pencil, color: 'text-blue-400' },
  VIEWER: { label: 'Viewer', icon: Eye, color: 'text-white/45' },
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
      const data = await api.getMembers(projectId) as ProjectMember[] | { members?: ProjectMember[] };
      const list = Array.isArray(data) ? data : Array.isArray(data?.members) ? data.members : [];
      setMembers(list.filter((member) => member && typeof member === 'object'));
    } catch {
      toast('error', 'Could not load members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (open) load(); }, [open, projectId]);

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

  const currentUserRole = members.find((m) => m.username?.toLowerCase() === user?.username?.toLowerCase())?.role;
  const canManage = currentUserRole !== 'VIEWER';

  return (
    <Modal open={open} onClose={onClose} title="Share project" dark className="max-w-lg">
      <div className="space-y-5">
        {canManage && (
          <div className="rounded-xl bg-[#2c2c2c] border border-white/10 p-4">
            <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <UserPlus size={15} className="text-blue-400" /> Invite a teammate
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
                <input
                  type="email"
                  className="w-full rounded-md border border-white/10 bg-[#1b1b1b] px-9 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-blue-400/60"
                  placeholder="teammate@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <select
                className="rounded-md border border-white/10 bg-[#1b1b1b] px-3 py-2 text-sm text-white outline-none w-full sm:w-32"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as MemberRole)}
              >
                <option value="EDITOR">Editor</option>
                <option value="VIEWER">Viewer</option>
                <option value="OWNER">Owner</option>
              </select>
              <button onClick={invite} disabled={inviting || !inviteEmail.trim()} className="btn-dark py-2 px-4 text-sm">
                {inviting ? '…' : 'Invite'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <CenterSpinner />
        ) : (
          <div className="space-y-1.5">
            {members.map((m) => {
              const meta = ROLE_META[m.role] ?? ROLE_META.VIEWER;
              const RoleIcon = meta.icon;
              const memberName = m.name || m.username || 'Workspace member';
              const initials = memberName.split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('');
              return (
                <div key={m.id ?? m.username ?? initials} className="flex items-center gap-3 rounded-lg bg-[#2c2c2c] border border-white/10 px-3 py-2.5">
                  <div className="w-9 h-9 rounded-full bg-charcoal-600 grid place-items-center text-cream-50 text-xs font-semibold shrink-0">
                    {initials || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {memberName}
                      {m.username?.toLowerCase() === user?.username?.toLowerCase() && <span className="ml-2 text-xs text-white/45">(you)</span>}
                    </p>
                    <p className="text-xs text-white/45 truncate">{m.username || 'Email unavailable'}</p>
                  </div>
                  <span className={`chip bg-white/10 ${meta.color} border border-white/10`}>
                    <RoleIcon size={12} /> {meta.label}
                  </span>
                  {canManage && m.username?.toLowerCase() !== user?.username?.toLowerCase() && (
                    <div className="relative">
                      <button
                        onClick={() => setMenuFor(menuFor === m.id ? null : m.id)}
                        className="rounded-md p-1.5 text-white/50 hover:bg-white/10"
                      >
                        <MoreVertical size={15} />
                      </button>
                      {menuFor === m.id && (
                        <div className="absolute right-0 mt-1 w-44 rounded-lg border border-white/10 bg-[#2c2c2c] shadow-2xl p-1 z-20">
                          {(Object.keys(ROLE_META) as MemberRole[]).filter((r) => r !== m.role).map((r) => (
                            <button
                              key={r}
                              onClick={() => changeRole(m.id, r)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/75 hover:bg-white/10 rounded-md"
                            >
                              {(() => { const I = ROLE_META[r].icon; return <I size={14} className={ROLE_META[r].color} /> })()}
                              Make {ROLE_META[r].label.toLowerCase()}
                            </button>
                          ))}
                          <div className="h-px bg-white/10 my-1" />
                          <button
                            onClick={() => remove(m.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:bg-white/10 rounded-md"
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
              <p className="text-sm text-white/45 text-center py-6">No members yet.</p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={onClose} className="rounded-md border border-white/10 px-4 py-2 text-sm text-white/75 hover:bg-white/10">
            <X size={15} /> Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

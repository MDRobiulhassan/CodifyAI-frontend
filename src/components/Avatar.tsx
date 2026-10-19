import { useState } from 'react';
import type { User } from '../types';
import { useRouter } from '../router';
import { ChevronDown, LogOut, CreditCard, User as UserIcon } from 'lucide-react';

export function Avatar({ user, size = 34, onLogout }: { user: User; size?: number; onLogout?: () => void }) {
  const { navigate } = useRouter();
  const [open, setOpen] = useState(false);
  const initials = (user.name || user.username)
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1.5 rounded-full hover:ring-2 hover:ring-ink-600 transition"
      >
        <div
          className="grid place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-ink-950 font-semibold"
          style={{ width: size, height: size, fontSize: size * 0.38 }}
        >
          {initials || 'U'}
        </div>
        <ChevronDown size={14} className="text-ink-400" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 card shadow-panel p-1.5 animate-scale-in z-50">
          <div className="px-3 py-2.5 border-b border-ink-700/60">
            <p className="text-sm font-medium text-ink-100 truncate">{user.name}</p>
            <p className="text-xs text-ink-400 truncate">{user.username}</p>
          </div>
          <button
            onClick={() => { setOpen(false); navigate('/account'); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink-200 hover:bg-ink-800 rounded-lg transition"
          >
            <UserIcon size={15} /> Account
          </button>
          <button
            onClick={() => { setOpen(false); navigate('/pricing'); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink-200 hover:bg-ink-800 rounded-lg transition"
          >
            <CreditCard size={15} /> Billing
          </button>
          <div className="h-px bg-ink-700/60 my-1" />
          <button
            onClick={() => { setOpen(false); onLogout?.(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-danger-400 hover:bg-ink-800 rounded-lg transition"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export function AvatarGroup({ users, size = 28 }: { users: User[]; size?: number }) {
  return (
    <div className="flex -space-x-2">
      {users.slice(0, 5).map((u, i) => {
        const initials = (u.name || u.username)
          .split(/\s+/)
          .slice(0, 2)
          .map((s) => s[0]?.toUpperCase())
          .join('');
        return (
          <div
            key={i}
            className="grid place-items-center rounded-full bg-gradient-to-br from-ink-600 to-ink-800 border-2 border-ink-900 text-ink-100 font-semibold"
            style={{ width: size, height: size, fontSize: size * 0.36, zIndex: 10 - i }}
            title={u.name}
          >
            {initials || 'U'}
          </div>
        );
      })}
      {users.length > 5 && (
        <div
          className="grid place-items-center rounded-full bg-ink-700 border-2 border-ink-900 text-ink-300 text-xs font-medium"
          style={{ width: size, height: size }}
        >
          +{users.length - 5}
        </div>
      )}
    </div>
  );
}


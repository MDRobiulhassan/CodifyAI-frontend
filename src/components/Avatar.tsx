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
        className="flex items-center gap-1.5 rounded-full hover:ring-2 hover:ring-charcoal-200 transition"
      >
        <div
          className="grid place-items-center rounded-full bg-charcoal-700 text-cream-50 font-semibold shadow-btn-dark"
          style={{ width: size, height: size, fontSize: size * 0.38 }}
        >
          {initials || 'U'}
        </div>
        <ChevronDown size={14} className="text-charcoal-400" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 card shadow-card-hover p-1.5 animate-scale-in z-50">
          <div className="px-3 py-2.5 border-b border-cream-200">
            <p className="text-sm font-medium text-charcoal-700 truncate">{user.name}</p>
            <p className="text-xs text-charcoal-400 truncate">{user.username}</p>
          </div>
          <button
            onClick={() => { setOpen(false); navigate('/account'); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-charcoal-600 hover:bg-cream-200 rounded-md transition"
          >
            <UserIcon size={15} /> Account
          </button>
          <button
            onClick={() => { setOpen(false); navigate('/pricing'); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-charcoal-600 hover:bg-cream-200 rounded-md transition"
          >
            <CreditCard size={15} /> Billing
          </button>
          <div className="h-px bg-cream-200 my-1" />
          <button
            onClick={() => { setOpen(false); onLogout?.(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-cream-200 rounded-md transition"
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
            className="grid place-items-center rounded-full bg-charcoal-600 border-2 border-cream-100 text-cream-50 font-semibold"
            style={{ width: size, height: size, fontSize: size * 0.36, zIndex: 10 - i }}
            title={u.name}
          >
            {initials || 'U'}
          </div>
        );
      })}
      {users.length > 5 && (
        <div
          className="grid place-items-center rounded-full bg-cream-300 border-2 border-cream-100 text-charcoal-500 text-xs font-medium"
          style={{ width: size, height: size }}
        >
          +{users.length - 5}
        </div>
      )}
    </div>
  );
}

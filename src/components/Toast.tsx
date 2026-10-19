import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

let pushToast: ((type: ToastType, message: string) => void) | null = null;

export function toast(type: ToastType, message: string) {
  pushToast?.(type, message);
}

const config: Record<ToastType, { icon: typeof CheckCircle2; color: string }> = {
  success: { icon: CheckCircle2, color: 'text-brand-400' },
  error: { icon: XCircle, color: 'text-danger-400' },
  info: { icon: Info, color: 'text-ink-300' },
};

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    pushToast = (type, message) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, type, message }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
    };
    return () => {
      pushToast = null;
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
      {toasts.map((t) => {
        const { icon: Icon, color } = config[t.type];
        return (
          <div
            key={t.id}
            className="glass flex items-start gap-3 rounded-xl px-4 py-3 shadow-panel animate-fade-up min-w-[260px] max-w-sm"
          >
            <Icon size={18} className={`${color} mt-0.5 shrink-0`} />
            <p className="text-sm text-ink-100 flex-1">{t.message}</p>
            <button
              onClick={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))}
              className="text-ink-400 hover:text-ink-200"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastHost />
    </>
  );
}

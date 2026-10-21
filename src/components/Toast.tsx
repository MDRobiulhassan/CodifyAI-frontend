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
  success: { icon: CheckCircle2, color: 'text-charcoal-700' },
  error: { icon: XCircle, color: 'text-red-600' },
  info: { icon: Info, color: 'text-charcoal-400' },
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
            className="card flex items-start gap-3 rounded-lg px-4 py-3 shadow-card-hover animate-fade-up min-w-[260px] max-w-sm"
          >
            <Icon size={18} className={`${color} mt-0.5 shrink-0`} />
            <p className="text-sm text-charcoal-700 flex-1">{t.message}</p>
            <button
              onClick={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))}
              className="text-charcoal-400 hover:text-charcoal-700"
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

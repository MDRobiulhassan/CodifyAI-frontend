import { Terminal } from 'lucide-react';

export function Logo({ size = 32, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative grid place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-ink-950 shadow-glow-sm"
        style={{ width: size, height: size }}
      >
        <Terminal size={size * 0.55} strokeWidth={2.5} />
      </div>
      {withText && (
        <span className="text-lg font-bold tracking-tight text-ink-100">
          Codify<span className="text-brand-400">AI</span>
        </span>
      )}
    </div>
  );
}

import { Terminal } from 'lucide-react';

export function Logo({ size = 32, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative grid place-items-center rounded-lg bg-charcoal-700 text-cream-50 shadow-btn-dark"
        style={{ width: size, height: size }}
      >
        <Terminal size={size * 0.5} strokeWidth={2.5} />
      </div>
      {withText && (
        <span className="text-lg font-semibold tracking-tight text-charcoal-700">
          Codify<span className="text-charcoal-400">AI</span>
        </span>
      )}
    </div>
  );
}

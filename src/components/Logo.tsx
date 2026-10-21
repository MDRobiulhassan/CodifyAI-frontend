import { Terminal } from 'lucide-react';

export function Logo({ size = 32, withText = false, variant = 'dark' }: { size?: number; withText?: boolean; variant?: 'dark' | 'light' }) {
  const textColor = variant === 'light' ? 'text-cream-50' : 'text-charcoal-700';
  const accentColor = variant === 'light' ? 'text-cream-200' : 'text-charcoal-400';
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative grid place-items-center rounded-lg bg-charcoal-700 text-cream-50 shadow-btn-dark"
        style={{ width: size, height: size }}
      >
        <Terminal size={size * 0.5} strokeWidth={2.5} />
      </div>
      {withText && (
        <span className={`text-lg font-semibold tracking-tight ${textColor}`}>
          Codify<span className={accentColor}>AI</span>
        </span>
      )}
    </div>
  );
}

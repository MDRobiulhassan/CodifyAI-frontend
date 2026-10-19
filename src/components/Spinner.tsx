export function Spinner({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-ink-600 border-t-brand-400 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function LoadingScreen({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="min-h-screen grid place-items-center bg-ink-950">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={32} />
        <p className="text-sm text-ink-400">{label}</p>
      </div>
    </div>
  );
}

export function CenterSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Spinner size={28} />
      {label && <p className="text-sm text-ink-400">{label}</p>}
    </div>
  );
}

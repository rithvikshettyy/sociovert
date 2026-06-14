interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'sm' | 'md';
}

const variantStyles = {
  default: 'bg-surface-hover text-text-secondary border-surface-border',
  success: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50',
  warning: 'bg-amber-900/30 text-amber-400 border-amber-800/50',
  error: 'bg-red-900/30 text-red-400 border-red-800/50',
  accent: 'bg-accent/10 text-accent border-accent/30',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-md border font-medium uppercase tracking-wider
        ${variantStyles[variant]} ${sizeStyles[size]}
      `}
    >
      {children}
    </span>
  );
}

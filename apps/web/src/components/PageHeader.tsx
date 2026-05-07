import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="font-display text-3xl text-gradient-gold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        <div className="brand-divider mt-3 max-w-[140px]" />
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

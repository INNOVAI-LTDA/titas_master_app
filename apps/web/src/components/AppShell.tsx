import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, UserCog, Wallet, History, BarChart3, Flame, AlertTriangle, FileSpreadsheet } from "lucide-react";
import { ReactNode } from "react";
import logoImg from "@/assets/innovai-logo.png";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/grupos", label: "Grupos", icon: Users },
  { to: "/membros", label: "Membros", icon: UserCog },
  { to: "/faturamento", label: "Faturamento", icon: Wallet },
  { to: "/historico", label: "Histórico", icon: History },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/hotseat", label: "Hotseat", icon: Flame },
  { to: "/gargalos", label: "Gargalos", icon: AlertTriangle },
  { to: "/exportar", label: "Exportar", icon: FileSpreadsheet },
];

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex w-full">
      <aside className="w-60 shrink-0 border-r border-border bg-sidebar hidden md:flex md:flex-col">
        <div className="px-5 py-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="Innovai" className="h-9 w-9 rounded-lg border border-gold/25 bg-background/70 object-contain p-1" />
            <div>
              <div className="font-display text-lg text-gradient-gold leading-none">TITAN DATA</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">by INNOVAI</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${active ? "bg-secondary text-gold border border-gold/30" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-3 text-[10px] text-muted-foreground border-t border-border">
          INNOVAI · DADOS · RESULTADOS
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="md:hidden border-b border-border px-4 py-3 flex items-center gap-2 bg-sidebar">
          <img src={logoImg} alt="Innovai" className="h-7 w-7 rounded-md border border-gold/25 bg-background/70 object-contain p-1" />
          <span className="font-display text-gradient-gold">TITÃS MASTER</span>
        </div>
        {children}
      </main>
    </div>
  );
}

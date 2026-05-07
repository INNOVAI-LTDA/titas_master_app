import { createFileRoute, Link } from "@tanstack/react-router";
import { useGrupoAtivo, useMembros, useFaturamentos, useCompetencias, mesRefAlvo } from "@/lib/data";
import { formatarBRL, formatarMesRefLongo } from "@/lib/competencia";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCog, Wallet, History, BarChart3, Flame, AlertTriangle, FileSpreadsheet, Shield } from "lucide-react";
import logoImg from "@/assets/innovai-logo.png";
import heroImg from "@/assets/spartanos-hero.jpeg";
export const Route = createFileRoute("/")({ component: Index });

const cards = [
  { to: "/grupos", title: "Grupos", desc: "Cadastrar e gerenciar grupos", icon: Users },
  { to: "/membros", title: "Membros", desc: "Cadastro de guerreiros", icon: UserCog },
  { to: "/faturamento", title: "Faturamento", desc: "Lançar faturamento do mês aberto", icon: Wallet },
  { to: "/historico", title: "Histórico", desc: "Consultar meses anteriores", icon: History },
  { to: "/dashboard", title: "Dashboard", desc: "Evolução e ranking", icon: BarChart3 },
  { to: "/hotseat", title: "Hotseat", desc: "Encontros do grupo", icon: Flame },
  { to: "/gargalos", title: "Gargalos", desc: "Registro por hotseat", icon: AlertTriangle },
  { to: "/exportar", title: "Exportar Relatório", desc: "Baixar planilha mensal", icon: FileSpreadsheet },
];

function Index() {
  const { grupo } = useGrupoAtivo();
  const { data: membros = [] } = useMembros(grupo?.id);
  const { data: comps = [] } = useCompetencias(grupo?.id);
  const ultimaComp = comps[0];
  const { data: fats = [] } = useFaturamentos(grupo?.id, ultimaComp?.mes_referencia);
  const totalUltimo = fats.reduce((s, f) => s + Number(f.valor_bruto), 0);
  const alvo = mesRefAlvo();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={heroImg}
          alt="Fundo da home"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="relative px-8 py-20 md:py-28 max-w-5xl">
          <div className="flex items-center gap-3 mb-5">
            <img src={logoImg} alt="Innovai" className="h-14 w-14 rounded-xl border border-gold/30 bg-background/70 object-contain p-1.5 shadow-lg" />
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold-soft">Innovai Solutions</div>
              <div className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Desafio de Titãs</div>
            </div>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-gradient-gold leading-none">SPARTANOS</h1>
          <div className="brand-divider my-5 max-w-md" />
          <p className="text-sm md:text-base text-muted-foreground tracking-[0.25em] uppercase">
            Disciplina · Estratégia · Resultados
          </p>
          <p className="mt-2 text-xs text-muted-foreground tracking-[0.2em] uppercase">
            Mentes fortes · Médicos imparáveis · Legado eterno
          </p>

          {/* Resumo */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            <ResumoBox label="Mês de referência" value={ultimaComp ? formatarMesRefLongo(ultimaComp.mes_referencia) : formatarMesRefLongo(alvo)}
              extra={ultimaComp && (
                <Badge variant="outline" className={ultimaComp.status === "aberta" ? "border-gold text-gold" : "border-muted-foreground text-muted-foreground"}>
                  {ultimaComp.status === "aberta" ? "Competência aberta" : "Competência fechada"}
                </Badge>
              )} />
            <ResumoBox label="Faturamento bruto do grupo" value={formatarBRL(totalUltimo)} />
            <ResumoBox label="Membros" value={String(membros.length)} />
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="px-8 py-10">
        <h2 className="font-display text-2xl text-gold mb-6">Acesso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.to} to={c.to}>
                <Card className="card-innovai p-5 h-full">
                  <Icon className="h-7 w-7 text-gold mb-3" />
                  <div className="font-display text-lg text-foreground">{c.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{c.desc}</div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ResumoBox({ label, value, extra }: { label: string; value: string; extra?: React.ReactNode }) {
  return (
    <div className="card-innovai p-4 rounded-md">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="font-display text-xl text-gold mt-2">{value}</div>
      {extra && <div className="mt-2">{extra}</div>}
    </div>
  );
}

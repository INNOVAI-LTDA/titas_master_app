import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useGrupoAtivo, useMembros, useTodosFaturamentos, useCompetencias } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { formatarBRL, formatarMesRef, formatarMesRefLongo } from "@/lib/competencia";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const { grupo } = useGrupoAtivo();
  const { data: membros = [] } = useMembros(grupo?.id);
  const { data: comps = [] } = useCompetencias(grupo?.id);
  const { data: fats = [] } = useTodosFaturamentos(grupo?.id);

  const porMes = useMemo(() => {
    const map = new Map<string, number>();
    fats.forEach((f) => map.set(f.mes_referencia, (map.get(f.mes_referencia) || 0) + Number(f.valor_bruto)));
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([mes, total]) => ({ mes, mesLabel: formatarMesRef(mes), total }));
  }, [fats]);

  const ultimo = porMes[porMes.length - 1];
  const penultimo = porMes[porMes.length - 2];
  const variacao = ultimo && penultimo && penultimo.total > 0 ? ((ultimo.total - penultimo.total) / penultimo.total) * 100 : null;

  const [mesRanking, setMesRanking] = useState<string>("");
  useEffect(() => { if (!mesRanking && comps[0]) setMesRanking(comps[0].mes_referencia); }, [comps, mesRanking]);

  const ranking = useMemo(() => {
    return fats.filter((f) => f.mes_referencia === mesRanking)
      .map((f) => ({ nome: membros.find((m) => m.id === f.membro_id)?.nome ?? "—", valor: Number(f.valor_bruto) }))
      .sort((a, b) => b.valor - a.valor);
  }, [fats, membros, mesRanking]);

  if (!grupo) return <div className="px-8 py-8"><PageHeader title="Dashboard" /></div>;

  return (
    <div className="px-8 py-8 max-w-7xl">
      <PageHeader title="Dashboard" subtitle={`Evolução do grupo ${grupo.nome}`} />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="card-innovai p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Último mês</div>
          <div className="font-display text-2xl text-gold mt-2">{ultimo ? formatarMesRefLongo(ultimo.mes) : "—"}</div>
        </Card>
        <Card className="card-innovai p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Faturamento bruto</div>
          <div className="font-display text-2xl text-gold mt-2">{ultimo ? formatarBRL(ultimo.total) : formatarBRL(0)}</div>
        </Card>
        <Card className="card-innovai p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Variação vs mês anterior</div>
          <div className="font-display text-2xl mt-2 flex items-center gap-2">
            {variacao == null ? <span className="text-muted-foreground">—</span> : (
              <>
                {variacao >= 0 ? <TrendingUp className="h-5 w-5 text-gold" /> : <TrendingDown className="h-5 w-5 text-destructive" />}
                <span className={variacao >= 0 ? "text-gold" : "text-destructive"}>{variacao.toFixed(1)}%</span>
              </>
            )}
          </div>
        </Card>
      </div>

      <Card className="card-innovai p-5 mb-6">
        <h3 className="font-display text-gold mb-4">Faturamento total por mês</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={porMes}>
              <CartesianGrid stroke="oklch(0.3 0.02 70 / 0.3)" vertical={false} />
              <XAxis dataKey="mesLabel" stroke="oklch(0.7 0.02 80)" fontSize={12} />
              <YAxis stroke="oklch(0.7 0.02 80)" fontSize={12} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "oklch(0.16 0.008 60)", border: "1px solid oklch(0.78 0.14 80 / 0.4)", borderRadius: 6 }}
                labelStyle={{ color: "oklch(0.78 0.14 80)" }}
                formatter={(v: number) => formatarBRL(v)}
              />
              <Bar dataKey="total" fill="oklch(0.78 0.14 80)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="card-innovai p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-gold">Ranking de membros</h3>
          <Select value={mesRanking} onValueChange={setMesRanking}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Mês" /></SelectTrigger>
            <SelectContent>
              {comps.map((c) => <SelectItem key={c.id} value={c.mes_referencia}>{formatarMesRefLongo(c.mes_referencia)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <ol className="space-y-2">
          {ranking.map((r, i) => (
            <li key={i} className="flex items-center justify-between border-b border-border/40 py-2">
              <span className="flex items-center gap-3">
                <span className="font-display text-gold w-8">{i + 1}º</span>
                <span>{r.nome}</span>
              </span>
              <span className="text-gold font-display">{formatarBRL(r.valor)}</span>
            </li>
          ))}
          {ranking.length === 0 && <li className="text-sm text-muted-foreground">Sem dados para este mês</li>}
        </ol>
      </Card>
    </div>
  );
}

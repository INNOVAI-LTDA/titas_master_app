import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useGrupoAtivo, useMembros, useFaturamentos, useCompetencias } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { formatarBRL, formatarMesRefLongo } from "@/lib/competencia";
import { exportarRelatorioXlsx } from "@/lib/excel";
import { Download, Lock } from "lucide-react";

export const Route = createFileRoute("/historico")({ component: HistoricoPage });

function HistoricoPage() {
  const { grupo } = useGrupoAtivo();
  const { data: membros = [] } = useMembros(grupo?.id);
  const { data: comps = [] } = useCompetencias(grupo?.id);
  const [mes, setMes] = useState<string>("");
  useEffect(() => { if (!mes && comps[0]) setMes(comps[0].mes_referencia); }, [comps, mes]);
  const { data: fats = [] } = useFaturamentos(grupo?.id, mes);

  const total = fats.reduce((s, f) => s + Number(f.valor_bruto), 0);
  const ranking = useMemo(() => {
    return [...fats]
      .map((f) => ({ membro: membros.find((m) => m.id === f.membro_id)?.nome ?? "—", valor: Number(f.valor_bruto) }))
      .sort((a, b) => b.valor - a.valor);
  }, [fats, membros]);

  if (!grupo) return <div className="px-8 py-8"><PageHeader title="Histórico" /></div>;

  const compAtual = comps.find((c) => c.mes_referencia === mes);
  const exportar = () => compAtual && exportarRelatorioXlsx({ grupo, mesRef: mes, membros, faturamentos: fats });

  return (
    <div className="px-8 py-8 max-w-6xl">
      <PageHeader
        title="Histórico"
        subtitle="Consulte meses anteriores · somente leitura"
        actions={<Button variant="outline" onClick={exportar} disabled={!mes}><Download className="h-4 w-4 mr-2" />Reexportar</Button>}
      />

      <div className="flex items-end gap-3 mb-6">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Mês de referência</div>
          <Select value={mes} onValueChange={setMes}>
            <SelectTrigger className="w-[240px]"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {comps.map((c) => (
                <SelectItem key={c.id} value={c.mes_referencia}>
                  {formatarMesRefLongo(c.mes_referencia)} {c.status === "fechada" ? "· fechada" : "· aberta"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {compAtual && (
          <Badge variant="outline" className={compAtual.status === "aberta" ? "border-gold text-gold" : "border-muted-foreground text-muted-foreground"}>
            {compAtual.status === "fechada" && <Lock className="h-3 w-3 mr-1" />}
            {compAtual.status === "aberta" ? "Competência aberta" : "Competência fechada"}
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="card-innovai p-0 overflow-hidden lg:col-span-2">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Lançamentos</span>
            <span className="font-display text-gold">Total: {formatarBRL(total)}</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead className="text-right">Faturamento bruto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membros.map((m) => {
                const f = fats.find((x) => x.membro_id === m.id);
                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{m.especialidade || "—"}</TableCell>
                    <TableCell className="text-right">
                      {f ? <span className="text-gold font-display">{formatarBRL(Number(f.valor_bruto))}</span>
                         : <span className="text-muted-foreground italic">Não informado</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
              {membros.length === 0 && <TableRow><TableCell colSpan={3} className="py-6 text-center text-muted-foreground">Sem dados</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Card>

        <Card className="card-innovai p-4">
          <h3 className="font-display text-gold mb-3">Ranking do mês</h3>
          <ol className="space-y-2">
            {ranking.map((r, i) => (
              <li key={i} className="flex items-center justify-between text-sm border-b border-border/50 pb-1">
                <span><span className="text-gold font-display mr-2">{i + 1}º</span>{r.membro}</span>
                <span className="text-gold">{formatarBRL(r.valor)}</span>
              </li>
            ))}
            {ranking.length === 0 && <li className="text-sm text-muted-foreground">Sem lançamentos</li>}
          </ol>
        </Card>
      </div>
    </div>
  );
}

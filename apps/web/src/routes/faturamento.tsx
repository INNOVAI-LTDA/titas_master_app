import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useGrupoAtivo, useMembros, useFaturamentos, useCompetencias, garantirCompetencia, mesRefAlvo } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { formatarBRL, formatarMesRefLongo } from "@/lib/competencia";
import { exportarRelatorioXlsx } from "@/lib/excel";
import { Download, Lock, Trash2 } from "lucide-react";

export const Route = createFileRoute("/faturamento")({ component: FaturamentoPage });

function FaturamentoPage() {
  const { grupo } = useGrupoAtivo();
  const { data: membros = [] } = useMembros(grupo?.id);
  const { data: comps = [] } = useCompetencias(grupo?.id);
  const qc = useQueryClient();

  const competenciaAberta = comps.find((c) => c.status === "aberta");
  const mesRef = competenciaAberta?.mes_referencia ?? mesRefAlvo();
  const { data: fats = [] } = useFaturamentos(grupo?.id, mesRef);

  const [membroId, setMembroId] = useState("");
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Garante competência do mês alvo se ainda não houver nenhuma aberta
  useEffect(() => {
    if (!grupo) return;
    if (comps.length === 0 || !comps.some((c) => c.status === "aberta")) {
      garantirCompetencia(grupo.id, mesRefAlvo()).then(() => qc.invalidateQueries({ queryKey: ["competencias", grupo.id] }));
    }
  }, [grupo, comps.length]);

  if (!grupo) return <div className="px-8 py-8"><PageHeader title="Faturamento" /><p className="text-sm text-muted-foreground">Cadastre um grupo primeiro.</p></div>;

  const total = fats.reduce((s, f) => s + Number(f.valor_bruto), 0);
  const fechada = !competenciaAberta;

  const lancar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competenciaAberta) return toast.error("Nenhuma competência aberta");
    if (!membroId) return toast.error("Selecione um membro");
    const v = Number(valor.replace(",", "."));
    if (isNaN(v) || v < 0) return toast.error("Valor inválido");
    setSalvando(true);
    const { error } = await supabase.from("faturamentos_mensais").insert({
      grupo_id: grupo.id, membro_id: membroId, mes_referencia: mesRef, valor_bruto: v,
    });
    setSalvando(false);
    if (error) return toast.error(error.message.includes("duplicate") ? "Este membro já tem faturamento neste mês" : error.message);
    toast.success("Faturamento lançado");
    setMembroId(""); setValor("");
    qc.invalidateQueries({ queryKey: ["faturamentos", grupo.id, mesRef] });
  };

  const remover = async (id: string) => {
    if (!confirm("Remover este lançamento?")) return;
    const { error } = await supabase.from("faturamentos_mensais").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["faturamentos", grupo.id, mesRef] });
  };

  const fechar = async () => {
    if (!competenciaAberta) return;
    if (!confirm(`Fechar competência ${formatarMesRefLongo(mesRef)}? Após o fechamento, nenhum lançamento poderá ser editado, removido ou criado neste mês. "Mês fechado vira pedra".`)) return;
    const { error } = await supabase.from("competencias_mensais")
      .update({ status: "fechada", bloqueada: true, data_fechamento: new Date().toISOString() })
      .eq("id", competenciaAberta.id);
    if (error) return toast.error(error.message);
    toast.success("Competência fechada");
    qc.invalidateQueries({ queryKey: ["competencias", grupo.id] });
  };

  const exportar = () => exportarRelatorioXlsx({ grupo, mesRef, membros, faturamentos: fats });

  const lancados = new Set(fats.map((f) => f.membro_id));
  const membrosDisponiveis = membros.filter((m) => !lancados.has(m.id));

  return (
    <div className="px-8 py-8 max-w-6xl">
      <PageHeader
        title="Faturamento"
        subtitle={`Lançamento mensal · ${formatarMesRefLongo(mesRef)}`}
        actions={
          <>
            <Badge variant="outline" className={fechada ? "border-muted-foreground text-muted-foreground" : "border-gold text-gold"}>
              {fechada ? <><Lock className="h-3 w-3 mr-1" /> Competência fechada</> : "Competência aberta"}
            </Badge>
            <Button variant="outline" onClick={exportar}><Download className="h-4 w-4 mr-2" />Excel</Button>
            {!fechada && <Button onClick={fechar} className="bg-blood text-foreground hover:opacity-90">Fechar competência</Button>}
          </>
        }
      />

      {!fechada && (
        <Card className="card-innovai p-6 mb-6">
          <h2 className="font-display text-lg text-gold mb-4">Novo lançamento</h2>
          <form onSubmit={lancar} className="grid sm:grid-cols-[1fr_220px_auto] gap-3 items-end">
            <div>
              <Label>Membro</Label>
              <Select value={membroId} onValueChange={setMembroId}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {membrosDisponiveis.map((m) => <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>)}
                  {membrosDisponiveis.length === 0 && <div className="px-2 py-1 text-xs text-muted-foreground">Todos os membros já foram lançados</div>}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Faturamento bruto (R$)</Label>
              <Input value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" inputMode="decimal" />
            </div>
            <Button type="submit" disabled={salvando} className="bg-gold text-primary-foreground hover:opacity-90">Lançar</Button>
          </form>
        </Card>
      )}

      <Card className="card-innovai p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Lançamentos do mês</span>
          <span className="font-display text-gold">Total: {formatarBRL(total)}</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead className="text-right">Faturamento bruto</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fats.map((f) => {
              const m = membros.find((x) => x.id === f.membro_id);
              return (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{m?.nome ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{m?.especialidade ?? "—"}</TableCell>
                  <TableCell className="text-right text-gold font-display">{formatarBRL(Number(f.valor_bruto))}</TableCell>
                  <TableCell>
                    {!fechada && <Button variant="ghost" size="icon" onClick={() => remover(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                  </TableCell>
                </TableRow>
              );
            })}
            {fats.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">Nenhum lançamento ainda</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

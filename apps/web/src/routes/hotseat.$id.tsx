import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useGrupoAtivo, useMembros } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/hotseat/$id")({ component: HotseatDetalhe });

function HotseatDetalhe() {
  const { id } = Route.useParams();
  const { grupo } = useGrupoAtivo();
  const { data: membros = [] } = useMembros(grupo?.id);
  const qc = useQueryClient();

  const { data: hotseat } = useQuery({
    queryKey: ["hotseat", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("hotseats").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: gargalos = [] } = useQuery({
    queryKey: ["gargalos", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("gargalos").select("*").eq("hotseat_id", id).order("data_criacao");
      if (error) throw error;
      return data;
    },
  });

  const [membroId, setMembroId] = useState("");
  const [descricao, setDescricao] = useState("");

  const criar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!membroId || !descricao.trim()) return toast.error("Preencha membro e descrição");
    const { error } = await supabase.from("gargalos").insert({ hotseat_id: id, membro_id: membroId, descricao });
    if (error) return toast.error(error.message);
    toast.success("Gargalo registrado");
    setMembroId(""); setDescricao("");
    qc.invalidateQueries({ queryKey: ["gargalos", id] });
  };

  const lider = membros.find((m) => m.id === hotseat?.lider_id);

  return (
    <div className="px-8 py-8 max-w-4xl">
      <Link to="/hotseat" className="text-sm text-muted-foreground hover:text-gold inline-flex items-center gap-1 mb-3"><ArrowLeft className="h-3 w-3" />Voltar</Link>
      <PageHeader
        title={hotseat ? new Date(hotseat.data_hotseat).toLocaleDateString("pt-BR") : "Hotseat"}
        subtitle={lider ? `Líder: ${lider.nome}` : ""}
      />

      <Card className="card-innovai p-6 mb-6">
        <h2 className="font-display text-lg text-gold mb-4">Registrar gargalo</h2>
        <form onSubmit={criar} className="space-y-3">
          <div>
            <Label>Membro</Label>
            <Select value={membroId} onValueChange={setMembroId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {membros.map((m) => <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} placeholder="Descreva o gargalo..." />
          </div>
          <Button type="submit" className="bg-gold text-primary-foreground hover:opacity-90">Registrar</Button>
        </form>
      </Card>

      <h3 className="font-display text-gold mb-3">Gargalos registrados</h3>
      <div className="space-y-3">
        {gargalos.map((g: any) => {
          const m = membros.find((x) => x.id === g.membro_id);
          return (
            <Card key={g.id} className="card-innovai p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-gold mt-0.5" />
                <div>
                  <div className="font-display text-foreground">{m?.nome ?? "—"}</div>
                  <p className="text-sm text-muted-foreground mt-1">{g.descricao}</p>
                </div>
              </div>
            </Card>
          );
        })}
        {gargalos.length === 0 && <p className="text-sm text-muted-foreground">Nenhum gargalo registrado.</p>}
      </div>
    </div>
  );
}

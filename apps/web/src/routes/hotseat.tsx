import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useGrupoAtivo, useMembros } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/hotseat")({ component: HotseatPage });

function HotseatPage() {
  const { grupo } = useGrupoAtivo();
  const { data: membros = [] } = useMembros(grupo?.id);
  const qc = useQueryClient();
  const { data: hotseats = [] } = useQuery({
    queryKey: ["hotseats", grupo?.id],
    enabled: !!grupo,
    queryFn: async () => {
      const { data, error } = await supabase.from("hotseats").select("*").eq("grupo_id", grupo!.id).order("data_hotseat", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [liderId, setLiderId] = useState("");

  if (!grupo) return <div className="px-8 py-8"><PageHeader title="Hotseat" /></div>;

  const criar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liderId) return toast.error("Selecione o líder");
    const { error } = await supabase.from("hotseats").insert({ grupo_id: grupo.id, data_hotseat: data, lider_id: liderId });
    if (error) return toast.error(error.message);
    toast.success("Hotseat criado");
    setLiderId("");
    qc.invalidateQueries({ queryKey: ["hotseats", grupo.id] });
  };

  return (
    <div className="px-8 py-8 max-w-5xl">
      <PageHeader title="Hotseat" subtitle="Encontros do grupo · cada hotseat pode ter vários gargalos" />

      <Card className="card-innovai p-6 mb-8">
        <h2 className="font-display text-lg text-gold mb-4">Novo hotseat</h2>
        <form onSubmit={criar} className="grid sm:grid-cols-[180px_1fr_auto] gap-3 items-end">
          <div><Label>Data</Label><Input type="date" value={data} onChange={(e) => setData(e.target.value)} /></div>
          <div>
            <Label>Líder</Label>
            <Select value={liderId} onValueChange={setLiderId}>
              <SelectTrigger><SelectValue placeholder="Selecione um membro" /></SelectTrigger>
              <SelectContent>
                {membros.map((m) => <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-gold text-primary-foreground hover:opacity-90">Criar</Button>
        </form>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3">
        {hotseats.map((h: any) => {
          const lider = membros.find((m) => m.id === h.lider_id);
          return (
            <Link key={h.id} to="/hotseat/$id" params={{ id: h.id }}>
              <Card className="card-innovai p-4">
                <div className="flex items-center gap-3">
                  <Flame className="h-7 w-7 text-gold" />
                  <div>
                    <div className="font-display text-foreground">{new Date(h.data_hotseat).toLocaleDateString("pt-BR")}</div>
                    <div className="text-xs text-muted-foreground">Líder: {lider?.nome ?? "—"}</div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
        {hotseats.length === 0 && <p className="text-sm text-muted-foreground">Nenhum hotseat ainda.</p>}
      </div>
    </div>
  );
}

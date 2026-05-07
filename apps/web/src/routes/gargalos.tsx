import { createFileRoute, Link } from "@tanstack/react-router";
import { useGrupoAtivo, useMembros } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { AlertTriangle, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/gargalos")({ component: GargalosPage });

function GargalosPage() {
  const { grupo } = useGrupoAtivo();
  const { data: membros = [] } = useMembros(grupo?.id);

  const { data: hotseats = [] } = useQuery({
    queryKey: ["hotseats", grupo?.id],
    enabled: !!grupo,
    queryFn: async () => {
      const { data, error } = await supabase.from("hotseats").select("*").eq("grupo_id", grupo!.id).order("data_hotseat", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: todos = [] } = useQuery({
    queryKey: ["gargalos-todos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gargalos").select("*").order("data_criacao", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="px-8 py-8 max-w-5xl">
      <PageHeader title="Gargalos" subtitle="Selecione um hotseat para visualizar e registrar gargalos" />

      <div className="grid sm:grid-cols-2 gap-3">
        {hotseats.map((h: any) => {
          const qtd = todos.filter((g: any) => g.hotseat_id === h.id).length;
          const lider = membros.find((m) => m.id === h.lider_id);
          return (
            <Link key={h.id} to="/hotseat/$id" params={{ id: h.id }}>
              <Card className="card-innovai p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-gold" />
                  <div>
                    <div className="font-display text-foreground">{new Date(h.data_hotseat).toLocaleDateString("pt-BR")}</div>
                    <div className="text-xs text-muted-foreground">Líder: {lider?.nome ?? "—"} · {qtd} gargalo(s)</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Card>
            </Link>
          );
        })}
        {hotseats.length === 0 && <p className="text-sm text-muted-foreground">Nenhum hotseat cadastrado ainda.</p>}
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGrupos } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/grupos")({ component: GruposPage });

function GruposPage() {
  const { data: grupos = [], isLoading } = useGrupos();
  const qc = useQueryClient();
  const [nome, setNome] = useState("");
  const [icone, setIcone] = useState("🛡️");
  const [salvando, setSalvando] = useState(false);

  const criar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    setSalvando(true);
    const { error } = await supabase.from("grupos").insert({ nome, icone });
    setSalvando(false);
    if (error) return toast.error(error.message);
    toast.success("Grupo criado");
    setNome("");
    setIcone("🛡️");
    qc.invalidateQueries({ queryKey: ["grupos"] });
  };

  return (
    <div className="px-8 py-8 max-w-4xl">
      <PageHeader title="Grupos" subtitle="Cadastre e gerencie os grupos do desafio" />

      <Card className="card-innovai p-6 mb-8">
        <h2 className="font-display text-lg text-gold mb-4">Novo grupo</h2>
        <form onSubmit={criar} className="grid sm:grid-cols-[1fr_120px_auto] gap-3 items-end">
          <div>
            <Label>Nome do grupo</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Grupo Titãs Master"
            />
          </div>
          <div>
            <Label>Ícone</Label>
            <Input value={icone} onChange={(e) => setIcone(e.target.value)} placeholder="🛡️" />
          </div>
          <Button
            type="submit"
            disabled={salvando}
            className="bg-gold text-primary-foreground hover:opacity-90"
          >
            Cadastrar
          </Button>
        </form>
      </Card>

      <h2 className="font-display text-lg text-gold mb-3">Grupos cadastrados</h2>
      {isLoading && <div className="text-muted-foreground text-sm">Carregando...</div>}
      <div className="grid sm:grid-cols-2 gap-3">
        {grupos.map((g) => (
          <Card key={g.id} className="card-innovai p-4 flex items-center gap-3">
            <div className="text-3xl">{g.icone || "🛡️"}</div>
            <div>
              <div className="font-display text-foreground">{g.nome}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3 text-gold" /> Ativo
              </div>
            </div>
          </Card>
        ))}
        {!isLoading && grupos.length === 0 && (
          <div className="text-sm text-muted-foreground">Nenhum grupo cadastrado ainda.</div>
        )}
      </div>
    </div>
  );
}

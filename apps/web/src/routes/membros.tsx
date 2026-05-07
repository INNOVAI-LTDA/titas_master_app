import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGrupoAtivo, useMembros } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/membros")({ component: MembrosPage });

function MembrosPage() {
  const { grupo } = useGrupoAtivo();
  const { data: membros = [] } = useMembros(grupo?.id);
  const qc = useQueryClient();
  const [form, setForm] = useState({ nome: "", especialidade: "", telefone: "" });
  const [salvando, setSalvando] = useState(false);

  if (!grupo) {
    return (
      <div className="px-8 py-8">
        <PageHeader title="Membros" />
        <p className="text-muted-foreground text-sm">
          Cadastre um grupo primeiro em{" "}
          <a href="/grupos" className="text-gold underline">
            Grupos
          </a>
          .
        </p>
      </div>
    );
  }

  const criar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) return;
    setSalvando(true);
    const { error } = await supabase.from("membros").insert({ ...form, grupo_id: grupo.id });
    setSalvando(false);
    if (error) return toast.error(error.message);
    toast.success("Membro cadastrado");
    setForm({ nome: "", especialidade: "", telefone: "" });
    qc.invalidateQueries({ queryKey: ["membros", grupo.id] });
  };

  const remover = async (id: string) => {
    if (!confirm("Remover este membro? Faturamentos vinculados também serão removidos.")) return;
    const { error } = await supabase.from("membros").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removido");
    qc.invalidateQueries({ queryKey: ["membros", grupo.id] });
  };

  return (
    <div className="px-8 py-8 max-w-5xl">
      <PageHeader title="Membros" subtitle={`Guerreiros do grupo ${grupo.nome}`} />

      <Card className="card-innovai p-6 mb-8">
        <h2 className="font-display text-lg text-gold mb-4">Novo membro</h2>
        <form onSubmit={criar} className="grid sm:grid-cols-[1fr_1fr_180px_auto] gap-3 items-end">
          <div>
            <Label>Nome</Label>
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div>
            <Label>Especialidade</Label>
            <Input
              value={form.especialidade}
              onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
            />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
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

      <Card className="card-innovai p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {membros.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.nome}</TableCell>
                <TableCell className="text-muted-foreground">{m.especialidade || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{m.telefone || "—"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => remover(m.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {membros.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  Nenhum membro cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

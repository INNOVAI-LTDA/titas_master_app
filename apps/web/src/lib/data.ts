import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mesAnterior } from "@/lib/competencia";

export type Grupo = { id: string; nome: string; icone: string | null; data_criacao: string };
export type Membro = { id: string; grupo_id: string; nome: string; especialidade: string | null; telefone: string | null };
export type Competencia = { id: string; grupo_id: string; mes_referencia: string; status: "aberta" | "fechada"; data_abertura: string; data_fechamento: string | null };
export type Faturamento = { id: string; grupo_id: string; membro_id: string; mes_referencia: string; valor_bruto: number; data_registro: string };
export type Hotseat = { id: string; grupo_id: string; data_hotseat: string; lider_id: string };
export type Gargalo = { id: string; hotseat_id: string; membro_id: string; descricao: string; data_criacao: string };

export function useGrupos() {
  return useQuery({
    queryKey: ["grupos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("grupos").select("*").order("data_criacao");
      if (error) throw error;
      return data as Grupo[];
    },
  });
}

export function useGrupoAtivo() {
  const q = useGrupos();
  return { ...q, grupo: q.data?.[0] };
}

export function useMembros(grupoId?: string) {
  return useQuery({
    queryKey: ["membros", grupoId],
    enabled: !!grupoId,
    queryFn: async () => {
      const { data, error } = await supabase.from("membros").select("*").eq("grupo_id", grupoId!).order("nome");
      if (error) throw error;
      return data as Membro[];
    },
  });
}

export function useCompetencias(grupoId?: string) {
  return useQuery({
    queryKey: ["competencias", grupoId],
    enabled: !!grupoId,
    queryFn: async () => {
      const { data, error } = await supabase.from("competencias_mensais").select("*").eq("grupo_id", grupoId!).order("mes_referencia", { ascending: false });
      if (error) throw error;
      return data as Competencia[];
    },
  });
}

export function useFaturamentos(grupoId?: string, mesRef?: string) {
  return useQuery({
    queryKey: ["faturamentos", grupoId, mesRef],
    enabled: !!grupoId,
    queryFn: async () => {
      let q = supabase.from("faturamentos_mensais").select("*").eq("grupo_id", grupoId!);
      if (mesRef) q = q.eq("mes_referencia", mesRef);
      const { data, error } = await q.order("data_registro");
      if (error) throw error;
      return data as Faturamento[];
    },
  });
}

export function useTodosFaturamentos(grupoId?: string) {
  return useFaturamentos(grupoId);
}

export function useInvalidate() {
  const qc = useQueryClient();
  return (keys: string[]) => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}

/** Garante que existe a competência do mês alvo. Retorna a competência. */
export async function garantirCompetencia(grupoId: string, mesRef: string) {
  const { data: existente } = await supabase
    .from("competencias_mensais").select("*")
    .eq("grupo_id", grupoId).eq("mes_referencia", mesRef).maybeSingle();
  if (existente) return existente as Competencia;
  const { data, error } = await supabase
    .from("competencias_mensais")
    .insert({ grupo_id: grupoId, mes_referencia: mesRef, status: "aberta" })
    .select().single();
  if (error) throw error;
  return data as Competencia;
}

export function mesRefAlvo(): string {
  // Conforme spec: a primeira carga é 10/05/2026 referente a abril/2026.
  // A regra geral é "mês anterior ao corrente".
  return mesAnterior(new Date());
}

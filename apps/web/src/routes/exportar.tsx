import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useGrupoAtivo, useMembros, useFaturamentos, useCompetencias } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { exportarRelatorioXlsx } from "@/lib/excel";
import { formatarMesRefLongo, arquivoNomeRelatorio } from "@/lib/competencia";
import { Download, FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/exportar")({ component: ExportarPage });

function ExportarPage() {
  const { grupo } = useGrupoAtivo();
  const { data: comps = [] } = useCompetencias(grupo?.id);
  const { data: membros = [] } = useMembros(grupo?.id);
  const [mes, setMes] = useState("");
  useEffect(() => { if (!mes && comps[0]) setMes(comps[0].mes_referencia); }, [comps, mes]);
  const { data: fats = [] } = useFaturamentos(grupo?.id, mes);

  if (!grupo) return <div className="px-8 py-8"><PageHeader title="Exportar Relatório" /></div>;

  const exportar = () => exportarRelatorioXlsx({ grupo, mesRef: mes, membros, faturamentos: fats });

  return (
    <div className="px-8 py-8 max-w-3xl">
      <PageHeader title="Exportar Relatório" subtitle="Gere a planilha Excel do mês selecionado" />

      <Card className="card-innovai p-6">
        <div className="flex items-start gap-3 mb-5">
          <FileSpreadsheet className="h-8 w-8 text-gold" />
          <div>
            <div className="font-display text-lg text-gradient-gold">Relatório Mensal</div>
            <div className="text-sm text-muted-foreground">Inclui membros, especialidades, telefones, faturamento bruto e totalizadores. Membros sem lançamento aparecem como "Não informado".</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Mês de referência</div>
            <Select value={mes} onValueChange={setMes}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {comps.map((c) => <SelectItem key={c.id} value={c.mes_referencia}>{formatarMesRefLongo(c.mes_referencia)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={exportar} disabled={!mes} className="bg-gold text-primary-foreground hover:opacity-90"><Download className="h-4 w-4 mr-2" />Baixar Excel</Button>
        </div>

        {mes && (
          <div className="mt-5 text-xs text-muted-foreground">
            Arquivo: <code className="text-gold">{arquivoNomeRelatorio(mes)}</code>
          </div>
        )}
      </Card>
    </div>
  );
}

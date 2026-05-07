import * as XLSX from "xlsx";
import { arquivoNomeRelatorio, formatarMesRefLongo } from "./competencia";
import type { Membro, Faturamento, Grupo } from "./data";

export function exportarRelatorioXlsx(opts: {
  grupo: Grupo;
  mesRef: string;
  membros: Membro[];
  faturamentos: Faturamento[];
}) {
  const { grupo, mesRef, membros, faturamentos } = opts;
  const map = new Map(faturamentos.map((f) => [f.membro_id, Number(f.valor_bruto)]));
  const dataEmissao = new Date().toLocaleDateString("pt-BR");

  const header = [
    [`Titãs Master | Innovai`],
    [`Grupo: ${grupo.nome}`],
    [`Mês de referência: ${formatarMesRefLongo(mesRef)}`],
    [`Data de emissão: ${dataEmissao}`],
    [],
    [
      "Grupo",
      "Mês de referência",
      "Data de emissão",
      "Nome do membro",
      "Especialidade",
      "Telefone",
      "Faturamento bruto",
    ],
  ];

  const linhas = membros.map((m) => {
    const v = map.get(m.id);
    return [
      grupo.nome,
      formatarMesRefLongo(mesRef),
      dataEmissao,
      m.nome,
      m.especialidade ?? "",
      m.telefone ?? "",
      v != null ? v : "Não informado",
    ];
  });

  const total = faturamentos.reduce((s, f) => s + Number(f.valor_bruto), 0);
  const comFat = faturamentos.length;
  const semFat = membros.length - comFat;

  const rodape = [
    [],
    ["", "", "", "", "", "TOTAL BRUTO", total],
    ["", "", "", "", "", "Membros cadastrados", membros.length],
    ["", "", "", "", "", "Com faturamento", comFat],
    ["", "", "", "", "", "Sem faturamento", semFat],
  ];

  const aoa = [...header, ...linhas, ...rodape];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  ws["!cols"] = [
    { wch: 22 },
    { wch: 22 },
    { wch: 14 },
    { wch: 26 },
    { wch: 22 },
    { wch: 18 },
    { wch: 18 },
  ];

  // Formato moeda na coluna G dos dados + total
  const startRow = 6; // 0-indexed: header tem 6 linhas (índices 0..5)
  for (let i = 0; i < linhas.length; i++) {
    const cellRef = XLSX.utils.encode_cell({ r: startRow + i, c: 6 });
    if (typeof linhas[i][6] === "number" && ws[cellRef]) {
      (ws[cellRef] as XLSX.CellObject).z = '"R$" #,##0.00';
    }
  }
  const totalRow = startRow + linhas.length + 1;
  const totalCell = XLSX.utils.encode_cell({ r: totalRow, c: 6 });
  if (ws[totalCell]) (ws[totalCell] as XLSX.CellObject).z = '"R$" #,##0.00';

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Faturamento Mensal");
  XLSX.writeFile(wb, arquivoNomeRelatorio(mesRef));
}
